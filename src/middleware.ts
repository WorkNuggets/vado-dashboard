import { withAuth } from "next-auth/middleware";

/**
 * Checks for a valid session token.
 * If not found, redirects to /signin
 */

export default withAuth(
  function middleware(req) {
    // Custom logic if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // If there's a token, user is authenticated
    },
  }
);

// This pattern means: match all routes except:
// - Anything in the /api (like /api/auth for NextAuth itself)
// - The /_next (internal Next.js files)
// - The /signin or /signup (or your entire /(auth) segment)
export const config = {
  matcher: [
    // "/((?!api|_next|.*\\.(svg|jpg|png|css|js)$|signin|signup|register|.*auth).*)",
    "/",
    "/dashboard/:path*",
    "/some-other-protected-route",
  ],
};