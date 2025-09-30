import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: fetch all menu items (admin or public based on query params)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnavailable = searchParams.get('admin') === 'true';
    const format = searchParams.get('format') || 'detailed';

    let whereClause = {};
    if (!includeUnavailable) {
      whereClause = { available: true };
    }

    const items = await prisma.menuItem.findMany({
      where: whereClause,
      include: { 
        variants: format === 'detailed',
        category: format === 'detailed'
      },
      orderBy: { name: "asc" },
    });

    // Convert Decimal to number for JSON serialization
    const serializedItems = items.map((item) => ({
      ...item,
      price: Number(item.price),
      variants: item.variants?.map((variant) => ({
        ...variant,
        priceChange: Number(variant.priceChange),
      })) || undefined,
    }));

    return NextResponse.json({ 
      success: true, 
      items: serializedItems,
      count: serializedItems.length
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items" }, 
      { status: 500 }
    );
  }
}

// POST: create a new menu item (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: "Name, price, and categoryId are required" },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name: body.name,
        description: body.description || "",
        price: Number(body.price),
        categoryId: body.categoryId,
        available: body.available !== undefined ? body.available : true,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      item: {
        ...item,
        price: Number(item.price)
      },
      message: "Menu item created successfully"
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create menu item" }, 
      { status: 500 }
    );
  }
}
