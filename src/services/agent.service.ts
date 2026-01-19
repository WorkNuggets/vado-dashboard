import { createClient } from "@/lib/supabase/client";
import type {
  AgentProfile,
  AgentProfileInsert,
  AgentProfileUpdate,
  Profile,
} from "@/types/entities";

/**
 * Agent Service
 * Handles agent profile and verification operations
 */

/**
 * Get agent profile by user ID
 */
export async function getAgentProfile(
  userId: string
): Promise<AgentProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("agent_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching agent profile:", error);
    throw error;
  }

  return data;
}

/**
 * Get agent's profile (from profiles table)
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

/**
 * Update agent profile
 */
export async function updateAgentProfile(
  userId: string,
  profileData: AgentProfileUpdate
): Promise<AgentProfile> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("agent_profiles")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating agent profile:", error);
    throw error;
  }

  return data;
}

/**
 * Create agent profile
 */
export async function createAgentProfile(
  profileData: AgentProfileInsert
): Promise<AgentProfile> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("agent_profiles")
    .insert(profileData)
    .select()
    .single();

  if (error) {
    console.error("Error creating agent profile:", error);
    throw error;
  }

  return data;
}

/**
 * Verify if user is an agent
 */
export async function verifyAgentStatus(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("is_agent")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error verifying agent status:", error);
    return false;
  }

  return data?.is_agent || false;
}

/**
 * Get agent statistics
 */
export async function getAgentStats(userId: string): Promise<{
  totalProperties: number;
  pendingTourRequests: number;
  approvedTourRequests: number;
  scheduledTours: number;
}> {
  const supabase = createClient();

  // Get properties count
  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("listing_agent_id", userId);

  // Get pending tour requests count
  const { count: pendingCount } = await supabase
    .from("tour_requests")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", userId)
    .eq("status", "pending");

  // Get approved tour requests count
  const { count: approvedCount } = await supabase
    .from("tour_requests")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", userId)
    .eq("status", "approved");

  // Get scheduled tours count
  const { count: toursCount } = await supabase
    .from("tours")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", userId)
    .eq("status", "scheduled");

  return {
    totalProperties: propertiesCount || 0,
    pendingTourRequests: pendingCount || 0,
    approvedTourRequests: approvedCount || 0,
    scheduledTours: toursCount || 0,
  };
}

/**
 * Search for agents from Realtor API
 */
export async function searchAgentsFromRealtorAPI(
  name: string,
  location?: string
): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      name,
      ...(location && { location }),
    });

    const response = await fetch(`/api/realtor/agents/search?${params}`);

    if (!response.ok) {
      throw new Error("Failed to search agents from Realtor API");
    }

    const data = await response.json();
    return data.agents || [];
  } catch (error) {
    console.error("Error searching agents from Realtor API:", error);
    throw error;
  }
}
