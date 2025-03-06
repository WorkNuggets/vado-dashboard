import { withAuth } from "next-auth/middleware";

/**
 * Checks for a valid session token.
 * If not found, redirects to /signin
 */
export default withAuth(
  function middleware(req) {
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If there's a token, the user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  /**
   * Protect these routes:
   * e.g. everything under /dashboard or /some-other-protected-route
   */
  matcher: ["/dashboard/:path*", "/some-other-protected-route"],
};
