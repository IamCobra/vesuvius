import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit, getClientIP } from "@/app/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    const ipAddress = getClientIP(request);
    const rateLimitOk = await checkRateLimit(ipAddress);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "For mange forsøg. Prøv igen om 15 minutter." },
        { status: 429 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Alle felter er påkrævet" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password skal være mindst 8 tegn" },
        { status: 400 }
      );
    }

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Password skal indeholde mindst ét lille bogstav, ét stort bogstav, ét tal og ét specialtegn (!@#$%^&*(),.?":{}|<>)',
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bruger med denne email eksisterer allerede" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Find or create default USER role
    let userRole = await prisma.roles.findUnique({
      where: { roleName: "USER" },
    });

    if (!userRole) {
      userRole = await prisma.roles.create({
        data: { roleName: "USER" },
      });
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Konto oprettet succesfuldt! Du kan nu logge ind.",
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
