import { prisma } from "@/app/lib/prisma";

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

class ReservationService {
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


    const tablesNeeded = Math.ceil(partySize / 2);


    if (availableTables.length >= tablesNeeded) {
      return availableTables.slice(0, tablesNeeded).map((table) => ({
        tableId: table.id,
        seats: table.seats,
        tableNumber: table.tableNumber,
      }));
    }

    return []; 
  }


  static async createReservation(request: ReservationRequest): Promise<{
    success: boolean;
    reservationId?: string;
    message: string;
    tables?: TableAssignment[];
  }> {
    const diningMinutes = 120;

    try {
      return await prisma.$transaction(async (tx) => {

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


        const tablesNeeded = Math.ceil(request.partySize / 2);

        if (availableTables.length < tablesNeeded) {
          return {
            success: false,
            message: "Not enough tables available for the requested party size",
          };
        }


        const selectedTables = availableTables.slice(0, tablesNeeded);


        let customerId = request.customerId;
        if (!customerId && request.customerData) {

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

        const reservation = await tx.reservation.create({
          data: {
            partySize: request.partySize,
            slotStartUtc: request.slotStart,
            slotEndUtc: slotEnd,
            customerId: customerId,
            status: "CONFIRMED",
          },
        });

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
      });
    } catch (error: unknown) {
      return {
        success: false,
        message: "Failed to create reservation. Please try again.",
      };
    }
  }


  static async checkSlotCapacity(
    date: Date,
    timeString: string 
  ): Promise<{
    availableSeats: number;
    totalSeats: number;
    availabilityPercentage: number;
  }> {
    const [hours, minutes] = timeString.split(":").map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hours, minutes, 0, 0);

    const slotEnd = new Date(slotStart.getTime() + 120 * 60 * 1000); // 120 minutes


    const totalCapacityResult = await prisma.diningTable.aggregate({
      _sum: { seats: true },
    });
    const totalSeats = totalCapacityResult._sum.seats || 0;


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
