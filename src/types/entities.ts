/**
 * Entity type aliases for convenience
 * These types are derived from the Supabase database schema
 */

import type { Database } from "./database.types";

// Table row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type TourRequest = Database["public"]["Tables"]["tour_requests"]["Row"];
export type Tour = Database["public"]["Tables"]["tours"]["Row"];
export type AgentProfile = Database["public"]["Tables"]["agent_profiles"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

// Insert types (for creating new records)
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
export type TourRequestInsert = Database["public"]["Tables"]["tour_requests"]["Insert"];
export type TourInsert = Database["public"]["Tables"]["tours"]["Insert"];
export type AgentProfileInsert = Database["public"]["Tables"]["agent_profiles"]["Insert"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

// Update types (for updating existing records)
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];
export type TourRequestUpdate = Database["public"]["Tables"]["tour_requests"]["Update"];
export type TourUpdate = Database["public"]["Tables"]["tours"]["Update"];
export type AgentProfileUpdate = Database["public"]["Tables"]["agent_profiles"]["Update"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

// Extended types with joins (for display purposes)
export interface TourRequestWithDetails extends TourRequest {
  property?: Property | null;
  user?: Profile | null;
}

export interface TourWithDetails extends Tour {
  property?: Property | null;
  user?: Profile | null;
  agent?: Profile | null;
}

export interface PropertyWithAgent extends Property {
  agent?: Profile | null;
  agent_profile?: AgentProfile | null;
}
