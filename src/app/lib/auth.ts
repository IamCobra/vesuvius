/**
 * NEXTAUTH KONFIGURATION - Håndterer login/logout på hjemmesiden
 *
 * Hvad er NextAuth?
 * - Et library der gør det nemt at lave login systemer i Next.js
 * - Håndterer sessions, JWT tokens, og sikkerhed automatisk
 * - Vi bruger "credentials" metoden (email + password)
 *
 * Hvordan fungerer det:
 * 1. Bruger indtaster email/password på login siden
 * 2. NextAuth kalder "authorize" funktionen nedenfor
 * 3. Vi tjekker om email/password er korrekt i databasen
 * 4. Hvis korrekt: Opretter en sikker session
 * 5. Hvis forkert: Returnerer fejl
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit, getClientIP } from "@/app/lib/rate-limit";
import bcrypt from "bcryptjs"; // Library til at sammenligne krypterede passwords

// 🎛️ NEXTAUTH HOVEDKONFIGURATION
export const authOptions: NextAuthOptions = {
  // 🔑 PROVIDERS: Hvordan kan folk logge ind?
  providers: [
    // Vi bruger kun "credentials" (email + password)
    // Man kunne også tilføje Google, Facebook login etc.
    CredentialsProvider({
      name: "credentials",

      // 📝 Definér hvilke felter login formen skal have
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * AUTHORIZE FUNKTION - Det vigtigste!
       *
       * Denne funktion bliver kaldt hver gang nogen prøver at logge ind.
       * Den skal afgøre: Er denne person legitim?
       *
       * @param credentials - Email og password fra login formen
       * @param req - HTTP forespørgslen (indeholder IP adresse etc.)
       * @returns Bruger objekt hvis login OK, null hvis login fejler
       */
      async authorize(credentials, req) {
        // 🚨 FØRSTE TJEK: Er email og password udfyldt?
        if (!credentials?.email || !credentials?.password) {
          return null; // Afvis login - manglende info
        }

        // 🌐 RATE LIMITING: Tjek om IP adressen prøver for ofte
        const ipAddress = getClientIP(req as any);
        const rateLimitOk = await checkRateLimit(ipAddress);
        if (!rateLimitOk) {
          // IP adressen er blokeret pga. for mange forsøg
          return null; // Afvis login
        }

        // 🔍 FIND BRUGEREN: Eksisterer denne email i databasen?
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            role: true, // Include role information
          },
        });

        if (!user) {
          // Email findes ikke i databasen
          return null; // Afvis login
        }

        // TJEK PASSWORD: Er det indtastede password korrekt?
        // Vi bruger bcrypt.compare fordi passwords er krypteret i databasen
        const isPasswordValid = await bcrypt.compare(
          credentials.password, // Det password brugeren indtastede
          user.password // Det krypterede password fra databasen
        );

        if (!isPasswordValid) {
          // Password matcher ikke
          return null; // Afvis login
        }

        // 🎉 SUCCESS! Login er godkendt
        // Returner bruger info (uden password af sikkerhedsgrunde)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.roleName, // Return role name as string
        };
      },
    }),
  ],

  // SESSION INDSTILLINGER
  session: {
    strategy: "jwt", // Brug JWT tokens (sikre, serverless-venlige)
    maxAge: 60 * 60, // 1 time = 3600 sekunder
  },

  // 🔐 JWT TOKEN INDSTILLINGER
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Hemmelig nøgle fra .env filen
    maxAge: 60 * 60, // Token udløber efter 1 time
  },

  // 🔄 CALLBACKS - Avancerede funktioner der kører under login processen
  callbacks: {
    /**
     * 🎫 JWT CALLBACK - Kører når JWT token oprettes/opdateres
     *
     * Hvad sker her?
     * - Tilføjer brugerens rolle til JWT token
     * - JWT token indeholder session data der sendes til browseren
     *
     * @param token - JWT token objekt
     * @param user - Bruger objekt (kun ved første login)
     */
    async jwt({ token, user }) {
      if (user) {
        // Ved første login: Tilføj rolle til token
        token.role = user.role;
      }
      return token;
    },

    /**
     * 👤 SESSION CALLBACK - Kører hver gang session data hentes
     *
     * Hvad sker her?
     * - Konverterer JWT token data til session objekt
     * - Tjekker om brugeren stadig eksisterer (sikkerhed!)
     * - Opdaterer roller i real-time
     *
     * @param session - Session objekt der sendes til frontend
     * @param token - JWT token med bruger data
     */
    async session({ session, token }) {
      if (token) {
        // 🔍 SIKKERHEDSTJEK: Eksisterer brugeren stadig?
        // Det her beskytter mod slettede konti der stadig har gyldige tokens
        const existingUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            role: true, // Include role information
          },
        });

        // Hvis brugeren er slettet, log dem ud automatisk
        if (!existingUser) {
          return null; // Dette trigger automatisk logout
        }

        // Bruger eksisterer - opdater session med frisk data
        session.user.id = token.sub;
        session.user.role = existingUser.role.roleName; // Rolle fra database (ikke token)
      }
      return session;
    },
  },

  // 📄 CUSTOM PAGES - Hvor skal NextAuth sende brugere?
  pages: {
    signIn: "/auth/signin", // Vores custom login side (ikke NextAuth's default)
  },
};
