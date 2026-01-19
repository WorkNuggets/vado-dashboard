import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback handler for OAuth flows (Google, Apple, etc.)
 *
 * Flow:
 * 1. Receive authorization code from OAuth provider
 * 2. Exchange code for session
 * 3. Verify user is an agent (profiles.is_agent = true)
 * 4. Redirect to dashboard or signin with error
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Auth callback error:", exchangeError);
      return NextResponse.redirect(
        `${origin}/signin?error=auth_callback_error&message=${encodeURIComponent(exchangeError.message)}`
      );
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return NextResponse.redirect(
        `${origin}/signin?error=user_fetch_error`
      );
    }

    // Verify agent status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_agent")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Failed to fetch profile:", profileError);
      return NextResponse.redirect(
        `${origin}/signin?error=profile_fetch_error`
      );
    }

    // Check if user is an agent
    if (!profile?.is_agent) {
      // Sign out non-agent users
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/signin?error=not_agent&message=${encodeURIComponent("Only real estate agents can access this dashboard. Please contact support if you believe this is an error.")}`
      );
    }

    // Success - redirect to dashboard
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (forwardedHost && !isLocalEnv) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // No code provided - redirect to signin
  return NextResponse.redirect(`${origin}/signin?error=no_code`);
}
