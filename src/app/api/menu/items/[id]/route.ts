import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// PUT: update a menu item
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: body.name,
      updatedAt: new Date()
    };

    // Only update fields that are provided
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.available !== undefined) updateData.available = body.available;

    const item = await prisma.menuItem.update({
      where: { id: params.id },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      item: {
        ...item,
        price: Number(item.price)
      },
      message: "Menu item updated successfully"
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE: delete a menu item
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    await prisma.menuItem.delete({ 
      where: { id: params.id } 
    });
    
    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}