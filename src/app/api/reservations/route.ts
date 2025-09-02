import { NextRequest, NextResponse } from "next/server";
import ReservationService from "@/app/lib/reservation-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { date, time, partySize, customerData } = body;

    // Validate required fields
    if (!date || !time || !partySize || !customerData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create local datetime from date and time (no UTC conversion)
    const [hours, minutes] = time.split(":").map(Number);
    const slotStartLocal = new Date(date);
    slotStartLocal.setHours(hours, minutes, 0, 0);

    // Validate party size
    if (partySize < 1 || partySize > 16) {
      return NextResponse.json(
        {
          success: false,
          message: "Party size must be between 1 and 16 guests",
        },
        { status: 400 }
      );
    }

    // Validate reservation is in the future
    if (slotStartLocal <= new Date()) {
      return NextResponse.json(
        { success: false, message: "Reservation must be in the future" },
        { status: 400 }
      );
    }

    // Create the reservation
    const result = await ReservationService.createReservation({
      partySize,
      slotStartUtc: slotStartLocal,
      customerData: {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
      },
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        reservationId: result.reservationId,
        message: result.message,
        tables: result.tables,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 409 } // Conflict
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const partySize = searchParams.get("partySize");

    if (!date || !time || !partySize) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Create local datetime from date and time (no UTC conversion)
    const [hours, minutes] = time.split(":").map(Number);
    const slotStartLocal = new Date(date);
    slotStartLocal.setHours(hours, minutes, 0, 0);

    const availableTables = await ReservationService.findAvailableTables(
      parseInt(partySize),
      slotStartLocal
    );

    const capacity = await ReservationService.checkSlotCapacity(
      slotStartLocal,
      time
    );

    return NextResponse.json({
      success: true,
      available: availableTables.length > 0,
      availableTables,
      capacity,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
