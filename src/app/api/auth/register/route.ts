/**
 * 📝 BRUGEROPRETTELSE API - Håndterer nye konti
 *
 * Hvad sker når nogen opretter en konto?
 * 1. Rate limiting check (for mange forsøg?)
 * 2. Validering af input data (navn, email, password)
 * 3. Tjek om email allerede eksisterer
 * 4. Kryptér password før gem i database
 * 5. Opret bruger i database
 * 6. Returner success besked
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Library til password kryptering
import { prisma } from "@/app/lib/prisma"; // Database adgang
import { checkRateLimit, getClientIP } from "@/app/lib/rate-limit"; // Rate limiting

/**
 * 🎯 POST FUNKTION - Håndterer brugeroprettelse
 *
 * Denne funktion bliver kaldt når nogen sender data fra signup formen.
 * Den modtager navn, email og password og prøver at oprette en ny bruger.
 */
export async function POST(request: NextRequest) {
  try {
    // 📥 HÆR DATA FRA FORMEN: Få navn, email og password fra forespørgslen
    const { name, email, password } = await request.json();

    // 🛡️ RATE LIMITING: Tjek om IP adressen prøver for ofte
    const ipAddress = getClientIP(request);
    const rateLimitOk = await checkRateLimit(ipAddress);
    if (!rateLimitOk) {
      // IP adressen er blokeret - send fejl besked
      return NextResponse.json(
        { error: "For mange forsøg. Prøv igen om 15 minutter." },
        { status: 429 } // HTTP status 429 = "Too Many Requests"
      );
    }

    // ✅ GRUNDLÆGGENDE VALIDERING: Er alle felter udfyldt?
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Alle felter er påkrævet" },
        { status: 400 } // HTTP status 400 = "Bad Request"
      );
    }

    // 📧 EMAIL VALIDERING: Er email formatet korrekt?
    // Regex pattern tjekker for: noget@noget.noget
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig email format" },
        { status: 400 }
      );
    }

    // 🔐 PASSWORD VALIDERING: Opfylder password sikkerhedskravene?

    // Tjek 1: Er password mindst 8 tegn?
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password skal være mindst 8 tegn" },
        { status: 400 }
      );
    }

    // Tjek 2: Indeholder password alle påkrævede tegn typer?
    // (?=.*[a-z]) = mindst ét lille bogstav
    // (?=.*[A-Z]) = mindst ét stort bogstav
    // (?=.*[0-9]) = mindst ét tal
    // (?=.*[!@#$%^&*(),.?":{}|<>]) = mindst ét specialtegn
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

    // 🔍 TJEK OM EMAIL ALLEREDE EKSISTERER
    // Vi kan ikke have to brugere med samme email adresse
    const existingUser = await prisma.user.findUnique({
      where: { email }, // Søg efter bruger med denne email
    });

    if (existingUser) {
      // Email er allerede taget - send fejl besked
      return NextResponse.json(
        { error: "Bruger med denne email eksisterer allerede" },
        { status: 400 }
      );
    }

    // 🔐 KRYPTÉR PASSWORD
    // Vi gemmer ALDRIG passwords i klartekst i databasen!
    // bcrypt.hash() krypterer password med en "salt" (tilfældig data)
    // Tallet 12 er "salt rounds" - hvor mange gange krypteringen køres
    const hashedPassword = await bcrypt.hash(password, 12);

    // Find or create USER role
    let userRole = await prisma.roles.findFirst({
      where: { roleName: "USER" }
    });

    if (!userRole) {
      userRole = await prisma.roles.create({
        data: { roleName: "USER" }
      });
    }

    // 💾 OPRET BRUGER I DATABASE
    const user = await prisma.user.create({
      data: {
        name: name, // Brugerens fulde navn
        email: email, // Email adresse (unique)
        password: hashedPassword, // Krypteret password
        roleID: userRole.id, // Standard rolle for nye brugere
      },
    });

    // 🎉 SUCCESS! Bruger er oprettet
    // Vi returnerer bruger info UDEN password (sikkerhed!)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Konto oprettet succesfuldt! Du kan nu logge ind.",
      user: userWithoutPassword, // Bruger info uden password
    });
  } catch (error) {
    // 🚨 FEJLHÅNDTERING: Hvis noget går galt
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, // Generisk fejl besked
      { status: 500 } // HTTP status 500 = "Internal Server Error"
    );
  }
}
