import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const orderId = id;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }


    const validStatuses = [
      "ORDERED",
      "IN_PREPARATION",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
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

    // Transform response to match mobile app expectations
    const transformedOrder = {
      id: updatedOrder.id,
      tableNumber: updatedOrder.tableNumber,
      tableName: updatedOrder.tableNumber?.toString() || "Unknown",
      customer: updatedOrder.customer
        ? `${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName}`
        : "Walk-in",
      status: updatedOrder.status,
      total: Number(updatedOrder.totalPrice),
      createdAt: updatedOrder.createdAt.toISOString(),
      placedAt: updatedOrder.createdAt.toISOString(),
      items: updatedOrder.items.map((item) => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        qty: item.quantity,
        price: Number(item.unitPrice),
        notes: item.customizations
          ? JSON.stringify(item.customizations)
          : undefined,
        menuItem: {
          name: item.menuItem.name,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
