import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit, getClientIP } from "@/app/lib/rate-limit";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const ipAddress = getClientIP(req as Request);
        const rateLimitOk = await checkRateLimit(ipAddress);
        if (!rateLimitOk) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            role: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role?.roleName || "USER",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        const existingUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            role: true,
          },
        });

        if (!existingUser) {
          return null;
        }

        session.user.id = token.sub;
        session.user.role = existingUser.role?.roleName || "USER";
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
