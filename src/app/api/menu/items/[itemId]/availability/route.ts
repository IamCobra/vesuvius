import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const params = await context.params;
    const { available } = await request.json();
    
    // Validate input
    if (typeof available !== 'boolean') {
      return NextResponse.json(
        { success: false, error: "Available must be a boolean value" },
        { status: 400 }
      );
    }

    const updated = await prisma.menuItem.update({
      where: { id: params.itemId },
      data: { available },
    });
    
    return NextResponse.json({ 
      success: true, 
      item: {
        ...updated,
        price: Number(updated.price)
      },
      message: `Item ${available ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error("Error updating menu item availability:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update item availability" },
      { status: 500 }
    );
  }
}
