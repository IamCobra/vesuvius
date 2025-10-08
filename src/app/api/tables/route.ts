import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";


export async function GET() {
  const tables = await prisma.diningTable.findMany();
  
  const mapped = tables.map((t) => ({
    id: t.id,
    name: t.tableNumber.toString(),
    occupied: false, 
  }));
  return NextResponse.json(mapped);
}


export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  
  
  return NextResponse.json({ error: "Table status update not supported. No status field in schema." }, { status: 400 });
}
