import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware for Supabase authentication
 *
 * Flow:
 * 1. Refresh session if needed (via updateSession)
 * 2. Check if user is authenticated
 * 3. For protected routes, verify user has is_agent = true
 * 4. Redirect unauthenticated users to /signin
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  // Public routes that don't require auth
  const publicRoutes = ["/signin", "/signup", "/reset-password", "/auth/callback"];
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Protected routes require authentication
  if (!user) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // User is authenticated, continue
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};