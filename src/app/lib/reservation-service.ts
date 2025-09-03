import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TableAssignment {
  tableId: string;
  seats: number;
  tableNumber: number;
}

interface ReservationRequest {
  partySize: number;
  slotStartUtc: Date;
  customerId?: string;
  customerData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export class ReservationService {
  /**
   * Find available tables using 2-top combination strategy
   * Prioritizes 2-person tables and combines them for larger parties
   */
  static async findAvailableTables(
    partySize: number,
    slotStart: Date,
    diningMinutes: number = 120
  ): Promise<TableAssignment[]> {
    const slotEnd = new Date(slotStart.getTime() + diningMinutes * 60 * 1000);

    // Find tables NOT reserved during the requested time window
    const availableTables = await prisma.diningTable.findMany({
      where: {
        NOT: {
          reserved: {
            some: {
              AND: [
                { startUtc: { lt: slotEnd } },
                { endUtc: { gt: slotStart } },
              ],
            },
          },
        },
      },
      orderBy: [{ seats: "asc" }, { tableNumber: "asc" }],
    });

    // 2-top combination strategy:
    // Prefer combining 2-person tables for optimal restaurant operations

    if (partySize <= 2) {
      // Use single 2-top
      const twoTop = availableTables.find((t) => t.seats === 2);
      if (twoTop) {
        return [
          {
            tableId: twoTop.id,
            seats: twoTop.seats,
            tableNumber: twoTop.tableNumber,
          },
        ];
      }
      // Fallback to larger table if no 2-top available
      const fallback = availableTables.find((t) => t.seats >= 2);
      if (fallback) {
        return [
          {
            tableId: fallback.id,
            seats: fallback.seats,
            tableNumber: fallback.tableNumber,
          },
        ];
      }
    } else if (partySize <= 4) {
      // Prefer 2 x 2-tops, fallback to single 4-top or larger
      const twoTops = availableTables.filter((t) => t.seats === 2);
      if (twoTops.length >= 2) {
        return twoTops.slice(0, 2).map((table) => ({
          tableId: table.id,
          seats: table.seats,
          tableNumber: table.tableNumber,
        }));
      }
      // Fallback to single larger table
      const fallback = availableTables.find((t) => t.seats >= partySize);
      if (fallback) {
        return [
          {
            tableId: fallback.id,
            seats: fallback.seats,
            tableNumber: fallback.tableNumber,
          },
        ];
      }
    } else if (partySize <= 6) {
      // Prefer 3 x 2-tops, fallback to 6-top or larger
      const twoTops = availableTables.filter((t) => t.seats === 2);
      if (twoTops.length >= 3) {
        return twoTops.slice(0, 3).map((table) => ({
          tableId: table.id,
          seats: table.seats,
          tableNumber: table.tableNumber,
        }));
      }
      // Fallback to single larger table
      const fallback = availableTables.find((t) => t.seats >= partySize);
      if (fallback) {
        return [
          {
            tableId: fallback.id,
            seats: fallback.seats,
            tableNumber: fallback.tableNumber,
          },
        ];
      }
    } else if (partySize <= 8) {
      // Prefer 4 x 2-tops, fallback to 8-top or combinations
      const twoTops = availableTables.filter((t) => t.seats === 2);
      if (twoTops.length >= 4) {
        return twoTops.slice(0, 4).map((table) => ({
          tableId: table.id,
          seats: table.seats,
          tableNumber: table.tableNumber,
        }));
      }
      // Fallback to 8-top
      const eightTop = availableTables.find((t) => t.seats === 8);
      if (eightTop) {
        return [
          {
            tableId: eightTop.id,
            seats: eightTop.seats,
            tableNumber: eightTop.tableNumber,
          },
        ];
      }
      // Try other combinations (4-top + 2 x 2-tops, etc.)
      const combinations = this.findOptimalTableCombination(
        availableTables,
        partySize
      );
      if (combinations.length > 0) {
        return combinations;
      }
    } else {
      // For very large parties, find best combination
      const combinations = this.findOptimalTableCombination(
        availableTables,
        partySize
      );
      if (combinations.length > 0) {
        return combinations;
      }
    }

    return []; // No availability
  }

  /**
   * Find optimal table combinations prioritizing 2-person tables
   * Uses intelligent combination strategy for restaurant efficiency
   */
  private static findOptimalTableCombination(
    availableTables: { id: string; seats: number; tableNumber: number }[],
    partySize: number
  ): TableAssignment[] {
    // Strategy: Prioritize 2-person tables, then fill with larger tables
    const twoTops = availableTables.filter((t) => t.seats === 2);
    const otherTables = availableTables
      .filter((t) => t.seats !== 2)
      .sort((a, b) => a.seats - b.seats);

    const combination: TableAssignment[] = [];
    let remainingSeats = partySize;

    // First, use as many 2-tops as possible
    const maxTwoTops = Math.floor(remainingSeats / 2);
    const availableTwoTops = Math.min(maxTwoTops, twoTops.length);

    for (let i = 0; i < availableTwoTops; i++) {
      combination.push({
        tableId: twoTops[i].id,
        seats: twoTops[i].seats,
        tableNumber: twoTops[i].tableNumber,
      });
      remainingSeats -= 2;
    }

    // If we still need seats, add the smallest suitable table
    if (remainingSeats > 0) {
      const suitableTable = otherTables.find((t) => t.seats >= remainingSeats);
      if (suitableTable) {
        combination.push({
          tableId: suitableTable.id,
          seats: suitableTable.seats,
          tableNumber: suitableTable.tableNumber,
        });
        remainingSeats = 0;
      }
    }

    // Restaurant policy: don't combine more than 4 tables
    // and ensure we can actually seat everyone
    if (combination.length <= 4 && remainingSeats <= 0) {
      return combination;
    }

    return []; // Cannot accommodate with our combination strategy
  }

  /**
   * Create a reservation with proper table assignments using serializable transaction
   */
  static async createReservation(request: ReservationRequest): Promise<{
    success: boolean;
    reservationId?: string;
    message: string;
    tables?: TableAssignment[];
  }> {
    const diningMinutes = 120;
    const slotEnd = new Date(
      request.slotStartUtc.getTime() + diningMinutes * 60 * 1000
    );

    try {
      return await prisma.$transaction(
        async (tx) => {
          // Find available tables
          const availableTables = await this.findAvailableTables(
            request.partySize,
            request.slotStartUtc,
            diningMinutes
          );

          if (availableTables.length === 0) {
            return {
              success: false,
              message: "No tables available for the requested time slot",
            };
          }

          // Create or get customer
          let customerId = request.customerId;
          if (!customerId && request.customerData) {
            // Try to find existing customer first
            const existingCustomer = await tx.customer.findUnique({
              where: { email: request.customerData.email },
            });

            if (existingCustomer) {
              customerId = existingCustomer.id;
            } else {
              const customer = await tx.customer.create({
                data: request.customerData,
              });
              customerId = customer.id;
            }
          }

          if (!customerId) {
            return {
              success: false,
              message: "Customer information is required",
            };
          }

          // Create reservation
          const reservation = await tx.reservation.create({
            data: {
              partySize: request.partySize,
              slotStartUtc: request.slotStartUtc,
              slotEndUtc: slotEnd,
              customerId: customerId,
              status: "CONFIRMED",
            },
          });

          // Create reserved table entries with time overlap protection
          await Promise.all(
            availableTables.map((table) =>
              tx.reservedTable.create({
                data: {
                  reservationId: reservation.id,
                  tableId: table.tableId,
                  startUtc: request.slotStartUtc,
                  endUtc: slotEnd,
                },
              })
            )
          );

          return {
            success: true,
            reservationId: reservation.id,
            message: `Reservation confirmed for ${request.partySize} guests`,
            tables: availableTables,
          };
        },
        {
          isolationLevel: "Serializable", // Highest isolation level for consistency
        }
      );
    } catch (error: unknown) {
      console.error("Reservation creation failed:", error);

      // Handle PostgreSQL exclusion constraint violation
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23P01"
      ) {
        return {
          success: false,
          message: "Table booking conflict - please try another time slot",
        };
      }

      return {
        success: false,
        message: "Failed to create reservation. Please try again.",
      };
    }
  }

  /**
   * Check capacity for a given time slot (for UI availability display)
   */
  static async checkSlotCapacity(
    date: Date,
    timeString: string // "18:00"
  ): Promise<{
    availableSeats: number;
    totalSeats: number;
    availabilityPercentage: number;
  }> {
    const [hours, minutes] = timeString.split(":").map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hours, minutes, 0, 0);

    const slotEnd = new Date(slotStart.getTime() + 120 * 60 * 1000); // 120 minutes

    // Get total restaurant capacity
    const totalCapacityResult = await prisma.diningTable.aggregate({
      _sum: { seats: true },
    });
    const totalSeats = totalCapacityResult._sum.seats || 0;

    // Get occupied seats during this time window
    const occupiedSeats = await prisma.reservedTable.findMany({
      where: {
        AND: [{ startUtc: { lt: slotEnd } }, { endUtc: { gt: slotStart } }],
      },
      include: {
        table: true,
      },
    });

    const occupiedSeatsCount = occupiedSeats.reduce(
      (sum, rt) => sum + rt.table.seats,
      0
    );

    const availableSeats = totalSeats - occupiedSeatsCount;
    const availabilityPercentage = (availableSeats / totalSeats) * 100;

    return {
      availableSeats,
      totalSeats,
      availabilityPercentage,
    };
  }

  /**
   * Get all reservations for a specific date with table information
   */
  static async getReservationsForDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.reservation.findMany({
      where: {
        slotStartUtc: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        customer: true,
        reserved: {
          include: {
            table: true,
          },
        },
      },
      orderBy: {
        slotStartUtc: "asc",
      },
    });
  }
}

export default ReservationService;
