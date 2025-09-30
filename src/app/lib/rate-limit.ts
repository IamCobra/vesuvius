/**
 *RATE LIMITING SYSTEM - Beskytter mod for mange login forsøg
 *
 * Hvad gør denne fil?
 * - Holder styr på hvor mange gange hver IP adresse prøver at logge ind
 * - Blokerer IP adresser der prøver for mange gange (5 forsøg per 15 minutter)
 * - Automatisk reset efter 15 minutter
 *
 * Hvorfor har vi brug for det?
 * - Beskytter mod "brute force" angreb (folk der prøver at gætte passwords)
 * - Forhindrer spam og automatiserede angreb
 * - Holder serveren kørende stabilt
 */

import { prisma } from "@/app/lib/prisma";

// 🔧 INDSTILLINGER - kAn ændres til hvad du ønsker
const MAX_ATTEMPTS = 5; // Hvor mange forsøg er tilladt?
const WINDOW_MINUTES = 15; // Hvor lang tid skal de vente efter max forsøg?

/**
 * 🔍 HOVEDFUNKTION: Tjekker om en IP adresse må prøve at logge ind
 *
 * @param ipAddress - IP adressen vi skal tjekke (fx "192.168.1.1")
 * @returns true = OK at prøve, false = blokeret (for mange forsøg)
 */
export async function checkRateLimit(ipAddress: string): Promise<boolean> {
  // 📅 Få den nuværende tid
  const now = new Date();

  try {
    // 🔎 Kig i databasen: Har denne IP adresse prøvet før?
    const existing = await prisma.loginAttempt.findUnique({
      where: { ipAddress }, // Find record for denne specifikke IP
    });

    // FØRSTE GANG: Hvis IP'en aldrig har prøvet før
    if (!existing) {
      // Opret en ny record i databasen
      await prisma.loginAttempt.create({
        data: {
          ipAddress: ipAddress, // Gem IP adressen
          attempts: 1, // Det er første forsøg
          lastAttempt: now, // Tidspunkt for forsøget
          resetTime: new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000), // Hvornår skal det resettes?
        },
      });
      return true; // Tillad login forsøg
    }

    // Tjek om tiden er udløbet: Er 15 minutter gået?
    if (now > existing.resetTime) {
      // Reset tallet - IP'en får en frisk start
      await prisma.loginAttempt.update({
        where: { ipAddress },
        data: {
          attempts: 1, // Start forfra med 1 forsøg
          lastAttempt: now, // Opdater tidspunkt
          resetTime: new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000), // Ny reset tid
        },
      });
      return true; // Tillad login forsøg
    }

    // FOR MANGE FORSØG: Har IP'en brugt alle sine chances?
    if (existing.attempts >= MAX_ATTEMPTS) {
      return false; // Blokerer login forsøg
    }

    // Tæller op. IP'en har stadig forsøg tilbage, men tæl et op
    await prisma.loginAttempt.update({
      where: { ipAddress },
      data: {
        attempts: existing.attempts + 1, // Tilføj 1 til forsøgs-tælleren
        lastAttempt: now, // Opdater sidst forsøgs-tid
      },
    });

    return true; // Tillad login forsøg (de har stadig forsøg tilbage)
  } catch (error) {
    // FEJL I SYSTEMET: Hvis noget går galt med databasen..
    console.error("Rate limit error:", error);
    return true; // Tillad login alligevel siden det er bedre end at blokere alle brugere
  }
}

/**
 * Hjælpefunktion - Finder brugerens IP adresse
 *
 * Hvorfor er det svært?
 * - Når folk bruger hjemmesiden gennem proxy servere eller load balancers,
 *   bliver deres rigtige IP adresse gemt i specielle HTTP headers
 *
 * @param request - HTTP forespørgslen fra browseren
 * @returns IP adressen som en string (fx "192.168.1.1")
 */
export function getClientIP(request: Request): string {
  // 🔍 Kig efter IP adresse i forskellige HTTP headers

  // Første mulighed: "x-forwarded-for" header (mest almindelig)
  const forwarded = request.headers.get("x-forwarded-for");

  // Anden mulighed: "x-real-ip" header (bruges af nogle proxies)
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    // "x-forwarded-for" kan indeholde flere IP'er separeret med komma
    // Vi tager den første (den rigtige bruger IP)
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Hvis vi ikke kan finde IP'en, brug "unknown"
  // Det sker sjældent, men bedre end at crashe systemet
  return "unknown";
}
