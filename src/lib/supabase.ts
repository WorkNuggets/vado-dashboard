import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Tour Request Types
 */
export type TourRequestStatus =
  | "pending"
  | "approved"
  | "denied"
  | "cancelled"
  | "expired"

export interface TourRequest {
  id: string
  user_id: string
  property_id: string
  agent_id: string | null
  requested_date: string | null
  requested_time_slot: string | null
  message: string | null
  status: TourRequestStatus
  agent_response_message: string | null
  responded_at: string | null
  created_at: string
  updated_at: string
  expires_at: string
  property?: Property
  user?: Profile
}

export interface Property {
  id: string
  address: string
  city: string
  state: string
  listing_agent_id: string
  featured_image_url: string | null
  bedrooms: number
  bathrooms: number
  price: number
}

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  email: string | null
  avatar_url: string | null
}

/**
 * Fetch tour requests for properties managed by the agent
 */
export async function getAgentTourRequests(agentUserId: string) {
  const { data, error } = await supabase
    .from("tour_requests")
    .select(
      `
      *,
      property:properties!tour_requests_property_id_fkey (
        id,
        address,
        city,
        state,
        listing_agent_id,
        featured_image_url,
        bedrooms,
        bathrooms,
        price
      ),
      user:profiles!tour_requests_user_id_fkey (
        id,
        first_name,
        last_name,
        phone,
        email,
        avatar_url
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tour requests:", error)
    return { data: null, error }
  }

  // Filter to only show requests for this agent's properties
  const filteredData = data?.filter(
    (req) => req.property?.listing_agent_id === agentUserId
  )

  return { data: filteredData as TourRequest[], error: null }
}

/**
 * Approve a tour request
 */
export async function approveTourRequest(requestId: string) {
  const { data, error } = await supabase
    .from("tour_requests")
    .update({
      status: "approved",
      responded_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single()

  return { data, error }
}

/**
 * Deny a tour request
 */
export async function denyTourRequest(requestId: string, reason?: string) {
  const { data, error } = await supabase
    .from("tour_requests")
    .update({
      status: "denied",
      agent_response_message: reason || null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single()

  return { data, error }
}

/**
 * Get count of pending requests for an agent
 */
export async function getPendingRequestsCount(agentUserId: string) {
  const { data, error } = await getAgentTourRequests(agentUserId)
  if (error || !data) return 0
  return data.filter((req) => req.status === "pending").length
}
