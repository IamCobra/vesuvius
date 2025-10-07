import { prisma } from "@/app/lib/prisma";

// Rate limit configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

/**
 * Check if an IP address is within rate limits for login attempts
 * @param ipAddress - The IP address to check
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimit(ipAddress: string): Promise<boolean> {
  const now = new Date();

  try {
    const existing = await prisma.loginAttempt.findUnique({
      where: { ipAddress },
    });

    if (!existing) {
      await prisma.loginAttempt.create({
        data: {
          ipAddress,
          attempts: 1,
          lastAttempt: now,
          resetTime: new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000),
        },
      });
      return true;
    }

    if (now > existing.resetTime) {
      await prisma.loginAttempt.update({
        where: { ipAddress },
        data: {
          attempts: 1,
          lastAttempt: now,
          resetTime: new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000),
        },
      });
      return true;
    }

    if (existing.attempts >= MAX_ATTEMPTS) {
      return false;
    }

    await prisma.loginAttempt.update({
      where: { ipAddress },
      data: {
        attempts: existing.attempts + 1,
        lastAttempt: now,
      },
    });

    return true;
  } catch (error) {
    console.error("Rate limit error:", error);
    return true;
  }
}

/**
 * Extract IP address from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}
