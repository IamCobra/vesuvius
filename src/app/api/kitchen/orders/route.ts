import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: fetch all kitchen orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching kitchen orders:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
