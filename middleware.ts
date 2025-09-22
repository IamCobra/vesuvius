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

        // Check hvis ruten kræver waiter access - KUN WAITER
        if (req.nextUrl.pathname.startsWith("/waiter")) {
          return token?.role === "WAITER";
        }

        // Check hvis ruten kræver kitchen access - KUN KITCHEN
        if (req.nextUrl.pathname.startsWith("/kitchen")) {
          return token?.role === "KITCHEN";
        }

        // For andre beskyttede ruter, kræv bare at bruger er logget ind
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/waiter/:path*", "/kitchen/:path*"],
};
