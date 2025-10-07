import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      include: { variants: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch menu items" }, { status: 500 });
  }
}
