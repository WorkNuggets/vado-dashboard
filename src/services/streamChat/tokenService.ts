import { createClient } from "@/lib/supabase/client";

/**
 * Get Stream Chat token from Supabase Edge Function
 * This function calls the stream-chat-token edge function to generate
 * a token for the authenticated user
 */
export async function getStreamToken(): Promise<{
  token: string;
  userId: string;
  apiKey: string;
}> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No active session");
  }

  const { data, error } = await supabase.functions.invoke("stream-chat-token", {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) {
    console.error("Error getting Stream Chat token:", error);
    throw error;
  }

  return data;
}
