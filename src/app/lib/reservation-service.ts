import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TableAssignment {
  tableId: string;
  seats: number;
  tableNumber: number;
}

interface ReservationRequest {
  partySize: number;
  slotStart: Date;
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

    // Simplified 2-top combination strategy:
    // All tables are 2-person, so we just combine as many as needed

    // Calculate how many tables we need (round up for odd numbers)
    const tablesNeeded = Math.ceil(partySize / 2);
    
    // Check if we have enough available tables
    if (availableTables.length >= tablesNeeded) {
      return availableTables.slice(0, tablesNeeded).map((table) => ({
        tableId: table.id,
        seats: table.seats,
        tableNumber: table.tableNumber,
      }));
    }

    return []; // No availability
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

    try {
      return await prisma.$transaction(
        async (tx) => {
          // Find available tables
          // Find available tables within the transaction
          const slotEnd = new Date(
            request.slotStart.getTime() + diningMinutes * 60 * 1000
          );

          const availableTables = await tx.diningTable.findMany({
            where: {
              NOT: {
                reserved: {
                  some: {
                    AND: [
                      { startUtc: { lt: slotEnd } },
                      { endUtc: { gt: request.slotStart } },
                    ],
                  },
                },
              },
            },
            orderBy: [{ seats: "asc" }, { tableNumber: "asc" }],
          });

          // Apply table selection logic - calculate how many tables we need
          const tablesNeeded = Math.ceil(request.partySize / 2);
          
          if (availableTables.length < tablesNeeded) {
            return {
              success: false,
              message: "Not enough tables available for the requested party size",
            };
          }

          // Select the required number of tables
          const selectedTables = availableTables.slice(0, tablesNeeded);

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
              slotStartUtc: request.slotStart,
              slotEndUtc: slotEnd,
              customerId: customerId,
              status: "CONFIRMED",
            },
          });

          // Create reserved table entries with time overlap protection
          await Promise.all(
            selectedTables.map((table) =>
              tx.reservedTable.create({
                data: {
                  reservationId: reservation.id,
                  tableId: table.id,
                  startUtc: request.slotStart,
                  endUtc: slotEnd,
                },
              })
            )
          );

          return {
            success: true,
            reservationId: reservation.id,
            message: `Reservation confirmed for ${request.partySize} guests`,
            tables: selectedTables.map((table) => ({
              tableId: table.id,
              seats: table.seats,
              tableNumber: table.tableNumber,
            })),
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
