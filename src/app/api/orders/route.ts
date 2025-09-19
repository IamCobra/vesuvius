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
      // Get all orders
      orders = await prisma.order.findMany({
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

    // Transform data for frontend
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      tableNumber:
        order.tableNumber ||
        order.reservation?.reserved[0]?.table.tableNumber ||
        0,
      customer: order.customer
        ? `${order.customer.firstName} ${order.customer.lastName}`
        : "Walk-in",
      status: order.status,
      total: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        notes: item.customizations
          ? JSON.stringify(item.customizations)
          : undefined,
      })),
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, reservationId, items, notes } = body;

    // Validate required fields
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: items.map((item: any) => item.menuItemId),
        },
      },
    });

    const orderItemsData = items.map((item: any) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.menuItemId}`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice: itemTotal,
        notes: item.notes,
      };
    });

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId,
          reservationId,
          totalPrice: totalAmount,
          status: "ORDERED",
          notes,
          items: {
            create: orderItemsData,
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

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerId: order.customerId,
        status: order.status,
        total: Number(order.totalPrice),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: Number(item.unitPrice),
          notes: item.customizations
            ? JSON.stringify(item.customizations)
            : undefined,
        })),
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
