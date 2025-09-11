import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = [
      "ORDERED",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "SERVED",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        total: Number(updatedOrder.totalPrice),
        items: updatedOrder.items.map((item) => ({
          id: item.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: Number(item.unitPrice),
        })),
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
