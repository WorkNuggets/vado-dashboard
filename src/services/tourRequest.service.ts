import { createClient } from "@/lib/supabase/client";
import type {
  TourRequest,
  TourRequestWithDetails,
  TourRequestUpdate,
} from "@/types/entities";

/**
 * Tour Request Service
 * Handles all tour request operations for agents
 */

/**
 * Get all tour requests for a specific agent's properties
 */
export async function getRequestsForAgent(
  agentUserId: string
): Promise<TourRequestWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tour_requests")
    .select(
      `
      *,
      property:properties(*),
      user:profiles(*)
    `
    )
    .eq("agent_id", agentUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tour requests:", error);
    throw error;
  }

  return data as TourRequestWithDetails[];
}

/**
 * Get pending tour requests count for an agent
 */
export async function getPendingCount(agentUserId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("tour_requests")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", agentUserId)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching pending count:", error);
    throw error;
  }

  return count || 0;
}

/**
 * Get a single tour request by ID
 */
export async function getTourRequest(
  requestId: string
): Promise<TourRequestWithDetails | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tour_requests")
    .select(
      `
      *,
      property:properties(*),
      user:profiles(*)
    `
    )
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error fetching tour request:", error);
    throw error;
  }

  return data as TourRequestWithDetails;
}

/**
 * Approve a tour request
 */
export async function approveTourRequest(
  requestId: string,
  message?: string
): Promise<TourRequest> {
  const supabase = createClient();

  const updateData: TourRequestUpdate = {
    status: "approved",
    updated_at: new Date().toISOString(),
  };

  if (message) {
    updateData.agent_response_message = message;
  }

  const { data, error } = await supabase
    .from("tour_requests")
    .update(updateData)
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    console.error("Error approving tour request:", error);
    throw error;
  }

  return data;
}

/**
 * Deny a tour request
 */
export async function denyTourRequest(
  requestId: string,
  reason: string
): Promise<TourRequest> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tour_requests")
    .update({
      status: "denied",
      agent_response_message: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    console.error("Error denying tour request:", error);
    throw error;
  }

  return data;
}

/**
 * Subscribe to real-time tour request updates for an agent
 */
export function subscribeToTourRequests(
  agentUserId: string,
  callback: (payload: TourRequest) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`agent_tour_requests:${agentUserId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tour_requests",
        filter: `agent_id=eq.${agentUserId}`,
      },
      (payload) => {
        callback(payload.new as TourRequest);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Get tour requests by status for an agent
 */
export async function getTourRequestsByStatus(
  agentUserId: string,
  status: "pending" | "approved" | "denied" | "cancelled"
): Promise<TourRequestWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tour_requests")
    .select(
      `
      *,
      property:properties(*),
      user:profiles(*)
    `
    )
    .eq("agent_id", agentUserId)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tour requests by status:", error);
    throw error;
  }

  return data as TourRequestWithDetails[];
}
