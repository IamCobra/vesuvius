import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Map mobile app status to database status
    let dbStatus = status;
    switch (status) {
      case "queued":
        dbStatus = "ORDERED";
        break;
      case "inProgress":
        dbStatus = "IN_PREPARATION";
        break;
      case "ready":
        dbStatus = "READY";
        break;
      case "complications":
        dbStatus = "CANCELLED";
        break;
      default:

        if (
          ![
            "ORDERED",
            "IN_PREPARATION",
            "READY",
            "COMPLETED",
            "CANCELLED",
          ].includes(status)
        ) {
          return NextResponse.json(
            { error: "Invalid status value" },
            { status: 400 }
          );
        }
        dbStatus = status;
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: dbStatus },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        customer: true,
      },
    });

    // Transform response for kitchen app
    const transformedOrder = {
      id: updatedOrder.id,
      tableNumber: updatedOrder.tableNumber,
      tableName: updatedOrder.tableNumber?.toString() || "Unknown",
      table: `Bord ${updatedOrder.tableNumber || "Ukendt"}`,
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
    console.error("Error updating kitchen order status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
