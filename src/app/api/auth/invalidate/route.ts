import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
    }

    // Force logout ved at returnere en response der sletter session cookies
    const response = NextResponse.json({ message: "Session invalideret" });
    
    // Slet NextAuth cookies
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    response.cookies.delete("next-auth.callback-url");
    response.cookies.delete("__Secure-next-auth.callback-url");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("__Host-next-auth.csrf-token");

    return response;
  } catch (error) {
    console.error("Fejl ved session invalidering:", error);
    return NextResponse.json({ error: "Server fejl" }, { status: 500 });
  }
}