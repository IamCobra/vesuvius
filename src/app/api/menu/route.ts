import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        menuItems: {
          include: {
            variants: true,
          },
          where: {
            available: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Convert Decimal to number for JSON serialization
    const serializedCategories = categories.map((category) => ({
      ...category,
      menuItems: category.menuItems.map((item) => ({
        ...item,
        price: Number(item.price),
        variants: item.variants.map((variant) => ({
          ...variant,
          priceChange: Number(variant.priceChange),
        })),
      })),
    }));

    return NextResponse.json(serializedCategories);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
