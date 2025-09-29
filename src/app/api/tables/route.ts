import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: List all tables with status
export async function GET() {
  const tables = await prisma.diningTable.findMany();
  // Map to Flutter DTO: id, name (tableNumber), occupied (false for now)
  const mapped = tables.map((t) => ({
    id: t.id,
    name: t.tableNumber.toString(),
    occupied: false, // TODO: derive from reservation if needed
  }));
  return NextResponse.json(mapped);
}

// PATCH: Update table status
export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  // No status field in DiningTable; only allow updating reserved tables or return error
  // You may implement logic here to update reservation or reserved tables if needed
  return NextResponse.json({ error: "Table status update not supported. No status field in schema." }, { status: 400 });
}
