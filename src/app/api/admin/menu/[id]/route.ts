import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// opdater menu item´
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const item = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        description: body.description,
        available: body.available,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await prisma.menuItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
