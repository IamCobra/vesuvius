import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
