import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    let orders;

    if (status === "active") {
      // For waiter app - get orders that are not completed
      orders = await prisma.order.findMany({
        where: {
          status: {
            not: "COMPLETED",
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
          createdAt: "asc",
        },
      });
    } else {
      // Get all orders except completed ones (for general listing)
      orders = await prisma.order.findMany({
        where: {
          status: {
            not: "COMPLETED",
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
          createdAt: "desc",
        },
      });
    }

    // Transform data for mobile apps (matching old format)
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      tableNumber: order.tableNumber || order.reservation?.reserved[0]?.table.tableNumber || 0,
      tableName: order.tableNumber?.toString() || order.reservation?.reserved[0]?.table.tableNumber?.toString() || "Unknown",
      customer: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Walk-in",
      status: order.status,
      total: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      placedAt: order.createdAt.toISOString(), // For mobile app compatibility
      items: order.items.map((item) => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        qty: item.quantity, // For mobile app compatibility
        price: Number(item.unitPrice),
        notes: item.customizations ? JSON.stringify(item.customizations) : undefined,
        menuItem: {
          name: item.menuItem.name,
        },
      })),
    }));

    return NextResponse.json({ success: true, orders: transformedOrders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableNumber, items, notes, customerId, reservationId } = body;

    // Validate required fields
    if (!tableNumber && !customerId) {
      return NextResponse.json(
        { error: "Either tableNumber or customerId is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    // Calculate total price
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItemId} not found` },
          { status: 400 }
        );
      }

      const quantity = item.quantity || 1;
      const unitPrice = Number(menuItem.price);
      totalPrice += unitPrice * quantity;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: quantity,
        unitPrice: unitPrice,
        customizations: item.notes ? { notes: item.notes } : undefined,
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        tableNumber: tableNumber ? parseInt(tableNumber.toString()) : undefined,
        customerId: customerId || undefined,
        reservationId: reservationId || undefined,
        status: "ORDERED",
        totalPrice: totalPrice,
        notes: notes,
        items: {
          create: orderItems,
        },
      },
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
      id: order.id,
      tableNumber: order.tableNumber,
      tableName: order.tableNumber?.toString() || "Unknown",
      customer: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Walk-in",
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
        notes: item.customizations ? JSON.stringify(item.customizations) : undefined,
        menuItem: {
          name: item.menuItem.name,
        },
      })),
    };

    return NextResponse.json({ success: true, order: transformedOrder });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}