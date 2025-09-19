import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { status } = await request.json();
    const updated = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
    });
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 });
  }
}
