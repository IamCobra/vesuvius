import { PrismaClient } from "@prisma/client";
import ReservationService from "../src/app/lib/reservation-service";

const prisma = new PrismaClient();

// Legacy utility functions - now using ReservationService for new reservations

export class RestaurantQueries {
  /**
   * Find available time slots for a given party size and date
   * Uses the new ReservationService for accurate availability
   */
  static async findAvailableTimeSlots(
    partySize: number,
    reservationDate: Date
  ) {
    const availableSlots: Array<{
      startTime: string;
      endTime: string;
      availableTables: number;
      totalSeats: number;
    }> = [];

    // Check availability for common time slots
    const timeSlots = [
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
      "20:15",
      "20:30",
      "20:45",
      "21:00",
      "21:15",
      "21:30",
    ];

    for (const time of timeSlots) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotDate = new Date(reservationDate);
      slotDate.setHours(hours, minutes, 0, 0);
      const slotStartUtc = new Date(
        slotDate.getTime() - slotDate.getTimezoneOffset() * 60 * 1000
      );

      const availableTables = await ReservationService.findAvailableTables(
        partySize,
        slotStartUtc
      );

      if (availableTables.length > 0) {
        availableSlots.push({
          startTime: time,
          endTime: `${String(hours + 2).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}`, // 2 hour window
          availableTables: availableTables.length,
          totalSeats: availableTables.reduce(
            (sum, table) => sum + table.seats,
            0
          ),
        });
      }
    }

    return availableSlots;
  }

  /**
   * Get reservations by date range (updated for new schema)
   */
  static async getReservationsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.reservation.findMany({
      where: {
        slotStartUtc: {
          gte: startDate,
          lte: endDate,
        },
        status: "CONFIRMED",
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

  /**
   * Get restaurant statistics
   */
  static async getRestaurantStats() {
    const totalTables = await prisma.diningTable.count();
    const totalSeats = await prisma.diningTable.aggregate({
      _sum: {
        seats: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayReservations = await prisma.reservation.count({
      where: {
        slotStartUtc: {
          gte: today,
          lt: tomorrow,
        },
        status: "CONFIRMED",
      },
    });

    return {
      totalTables,
      totalSeats: totalSeats._sum.seats || 0,
      todayReservations,
    };
  }

  /**
   * Get reservation overview for today
   */
  static async getReservationOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await ReservationService.getReservationsForDate(today);
  }

  /**
   * Legacy method - use ReservationService.createReservation instead
   * @deprecated Use ReservationService.createReservation instead
   */
  static async createReservationWithTables(data: {
    partySize: number;
    slotStartUtc: Date;
    customerId: string;
    tableIds: string[];
  }) {
    console.warn(
      "RestaurantQueries.createReservationWithTables is deprecated. Use ReservationService.createReservation instead."
    );

    return await ReservationService.createReservation({
      partySize: data.partySize,
      slotStart: data.slotStartUtc,
      customerId: data.customerId,
    });
  }
}

export default RestaurantQueries;
