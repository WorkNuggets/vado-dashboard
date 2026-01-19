import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  ProfileUpdate,
  AgentProfile,
  AgentProfileUpdate,
} from "@/types/entities";

/**
 * Profile Service
 * Handles user profile and agent profile operations
 */

/**
 * Get full profile including agent_profile data
 */
export async function getFullProfile(userId: string): Promise<{
  profile: Profile | null;
  agentProfile: AgentProfile | null;
}> {
  const supabase = createClient();

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return { profile: null, agentProfile: null };
  }

  // Fetch agent profile if user is an agent
  if (profile?.is_agent) {
    const { data: agentProfile, error: agentError } = await supabase
      .from("agent_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (agentError) {
      if (agentError.code === "PGRST116") {
        // No agent profile found, that's okay
        return { profile, agentProfile: null };
      }
      console.error("Error fetching agent profile:", agentError);
    }

    return { profile, agentProfile };
  }

  return { profile, agentProfile: null };
}

/**
 * Update basic profile information
 */
export async function updateProfile(
  userId: string,
  data: ProfileUpdate
): Promise<Profile> {
  const supabase = createClient();

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return updatedProfile;
}

/**
 * Update agent profile information
 */
export async function updateAgentProfile(
  userId: string,
  data: AgentProfileUpdate
): Promise<AgentProfile> {
  const supabase = createClient();

  const { data: updatedAgentProfile, error } = await supabase
    .from("agent_profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating agent profile:", error);
    throw error;
  }

  return updatedAgentProfile;
}

/**
 * Upload avatar to Supabase Storage and update profile
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const supabase = createClient();

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    throw uploadError;
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // Update profile with new avatar URL
  await updateProfile(userId, { avatar_url: publicUrl });

  return publicUrl;
}

/**
 * Get properties count for an agent
 */
export async function getPropertiesCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("listing_agent_id", userId);

  if (error) {
    console.error("Error getting properties count:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Get completed tours count for an agent
 */
export async function getCompletedToursCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("tours")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", userId)
    .eq("status", "completed");

  if (error) {
    console.error("Error getting completed tours count:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Get tour requests count for current month
 */
export async function getTourRequestsThisMonth(
  userId: string
): Promise<number> {
  const supabase = createClient();

  // Get first day of current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabase
    .from("tour_requests")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", userId)
    .gte("created_at", firstDayOfMonth.toISOString());

  if (error) {
    console.error("Error getting tour requests this month:", error);
    return 0;
  }

  return count || 0;
}
