import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Tilføj ekstra logik her hvis nødvendigt
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check hvis ruten kræver admin access - KUN ADMIN
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // For andre beskyttede ruter, kræv bare at bruger er logget ind
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
