import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(request, { params }) {
	try {
		const { available } = await request.json();
		const updated = await prisma.menuItem.update({
			where: { id: params.itemId },
			data: { available },
		});
		return NextResponse.json({ success: true, item: updated });
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
