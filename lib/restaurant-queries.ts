import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Utility functions based on your original SQL stored procedures, converted to TypeScript

export class RestaurantQueries {
  
  /**
   * Find available time slots for a given party size and date
   * (Based on your FindReservationTimes procedure)
   */
  static async findAvailableTimeSlots(partySize: number, reservationDate: Date) {
    // Calculate needed tables (2 people per table, rounded up)
    const neededTables = Math.ceil(partySize / 2);
    
    const availableSlots = await prisma.timeSlot.findMany({
      where: {
        maxTables: {
          gte: neededTables
        }
      },
      include: {
        reservations: {
          where: {
            reservationDate: {
              equals: reservationDate
            },
            status: 'CONFIRMED'
          },
          include: {
            reservedTables: true
          }
        }
      }
    });

    // Filter slots based on actual table availability
    return availableSlots.filter(slot => {
      const reservedTablesCount = slot.reservations.reduce((total, reservation) => {
        return total + reservation.reservedTables.length;
      }, 0);
      
      const availableTables = slot.maxTables - reservedTablesCount;
      return availableTables >= neededTables;
    });
  }

  /**
   * Get reservations by date range
   * (Based on your ReservationsByDate procedure)
   */
  static async getReservationsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        customer: true,
        timeSlot: true,
        reservedTables: {
          include: {
            table: true
          }
        },
        orders: {
          include: {
            items: {
              include: {
                menuItem: true
              }
            }
          }
        }
      },
      orderBy: {
        reservationDate: 'asc'
      }
    });
  }

  /**
   * Get detailed reservation overview
   * (Based on your ReservationsTablesOverview view)
   */
  static async getReservationOverview() {
    return await prisma.reservation.findMany({
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        timeSlot: {
          select: {
            startTime: true,
            endTime: true
          }
        },
        reservedTables: {
          include: {
            table: {
              select: {
                tableNumber: true,
                seats: true
              }
            }
          }
        },
        orders: {
          include: {
            items: {
              include: {
                menuItem: {
                  select: {
                    name: true,
                    price: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get available tables for a specific time slot and date
   */
  static async getAvailableTables(timeSlotId: string, reservationDate: Date) {
    const reservedTables = await prisma.reservedTable.findMany({
      where: {
        reservation: {
          timeSlotId,
          reservationDate,
          status: 'CONFIRMED'
        }
      },
      include: {
        table: true
      }
    });

    const reservedTableIds = reservedTables.map(rt => rt.table.id);

    return await prisma.diningTable.findMany({
      where: {
        id: {
          notIn: reservedTableIds
        }
      },
      orderBy: {
        tableNumber: 'asc'
      }
    });
  }

  /**
   * Create a complete reservation with table assignment
   */
  static async createReservationWithTables(data: {
    customerId: string;
    partySize: number;
    reservationDate: Date;
    timeSlotId: string;
  }) {
    // Find available tables
    const availableTables = await this.getAvailableTables(data.timeSlotId, data.reservationDate);
    const neededTables = Math.ceil(data.partySize / 2);

    if (availableTables.length < neededTables) {
      throw new Error('Not enough tables available for this time slot');
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        customerId: data.customerId,
        partySize: data.partySize,
        reservationDate: data.reservationDate,
        timeSlotId: data.timeSlotId,
        status: 'CONFIRMED'
      }
    });

    // Assign tables
    const tablesToAssign = availableTables.slice(0, neededTables);
    const reservedTables = await Promise.all(
      tablesToAssign.map(table => 
        prisma.reservedTable.create({
          data: {
            reservationId: reservation.id,
            tableId: table.id
          }
        })
      )
    );

    return {
      reservation,
      assignedTables: tablesToAssign,
      reservedTables
    };
  }

  /**
   * Get restaurant statistics
   */
  static async getRestaurantStats() {
    const [
      totalReservations,
      totalCustomers,
      totalOrders,
      totalRevenue,
      todayReservations,
    ] = await Promise.all([
      prisma.reservation.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalPrice: true
        }
      }),
      prisma.reservation.count({
        where: {
          reservationDate: {
            equals: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    return {
      totalReservations,
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      todayReservations
    };
  }
}

// Example usage functions
async function main() {
  try {
    console.log("🔍 Restaurant Query Examples\n");

    // Example 1: Find available time slots
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const availableSlots = await RestaurantQueries.findAvailableTimeSlots(4, tomorrow);
    console.log("Available slots for 4 people tomorrow:", availableSlots.length);

    // Example 2: Get today's reservations
    const today = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayReservations = await RestaurantQueries.getReservationsByDateRange(today, endOfDay);
    console.log("Today's reservations:", todayReservations.length);

    // Example 3: Get restaurant stats
    const stats = await RestaurantQueries.getRestaurantStats();
    console.log("Restaurant Statistics:", stats);

    // Example 4: Get detailed overview
    const overview = await RestaurantQueries.getReservationOverview();
    console.log("Total reservations in overview:", overview.length);

  } catch (error) {
    console.error("Error running queries:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uncomment to run examples
// main();

export default RestaurantQueries;
