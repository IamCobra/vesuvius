import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validering
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Alle felter er påkrævet" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password skal være mindst 6 tegn" },
        { status: 400 }
      );
    }

    // Check om bruger allerede eksisterer
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bruger med denne email eksisterer allerede" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Opret bruger
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Returner bruger uden password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Bruger oprettet succesfuldt",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
