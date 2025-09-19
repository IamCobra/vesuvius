import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: fetch all menu items
export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: create a new menu item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.menuItem.create({
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        description: body.description,
        available: true,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
