import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: List all tables with reservation status
export async function GET() {
  try {
    const tables = await prisma.diningTable.findMany({
      include: {
        reserved: {
          where: {
            startUtc: { lte: new Date() },
            endUtc: { gte: new Date() }
          }
        }
      },
      orderBy: { tableNumber: 'asc' }
    });

    // Map with actual reservation status
    const tablesWithStatus = tables.map((table) => ({
      id: table.id,
      name: table.tableNumber.toString(),
      tableNumber: table.tableNumber,
      seats: table.seats,
      occupied: table.reserved.length > 0, // True if currently reserved
    }));

    return NextResponse.json({
      success: true,
      tables: tablesWithStatus,
      count: tablesWithStatus.length
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}
