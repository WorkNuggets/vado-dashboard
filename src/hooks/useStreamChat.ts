"use client";

import { useAuth } from "@/context/AuthContext";
import { getStreamToken } from "@/services/streamChat/tokenService";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export function useStreamChat() {
  const { user } = useAuth();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let chatClient: StreamChat | null = null;

    async function initChat() {
      try {
        setLoading(true);
        setError(null);

        // Get token from Supabase edge function
        const { token, userId, apiKey } = await getStreamToken();

        // Initialize Stream Chat client
        chatClient = StreamChat.getInstance(apiKey);

        // Connect user
        await chatClient.connectUser(
          {
            id: userId,
            name: user?.user_metadata?.full_name || user?.email || "User",
            image: user?.user_metadata?.avatar_url,
          },
          token
        );

        setClient(chatClient);
      } catch (err) {
        console.error("Error initializing Stream Chat:", err);
        setError(err instanceof Error ? err : new Error("Failed to initialize chat"));
      } finally {
        setLoading(false);
      }
    }

    initChat();

    // Cleanup on unmount
    return () => {
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [user]);

  return { client, loading, error };
}
