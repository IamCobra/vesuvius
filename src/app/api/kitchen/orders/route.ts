import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: fetch all kitchen orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["ORDERED", "IN_PREPARATION", "READY"], // Only show active orders in kitchen
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        customer: true,
        reservation: {
          include: {
            reserved: {
              include: {
                table: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest orders first for kitchen
      },
    });

    // Transform for kitchen app compatibility
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      tableNumber:
        order.tableNumber ||
        order.reservation?.reserved[0]?.table.tableNumber ||
        0,
      tableName:
        order.tableNumber?.toString() ||
        order.reservation?.reserved[0]?.table.tableNumber?.toString() ||
        "Unknown",
      table: `Bord ${
        order.tableNumber ||
        order.reservation?.reserved[0]?.table.tableNumber ||
        "Ukendt"
      }`,
      status: order.status,
      total: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      placedAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
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
    }));

    return NextResponse.json({ success: true, orders: transformedOrders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
