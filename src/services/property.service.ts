import { createClient } from "@/lib/supabase/client";
import type {
  Property,
  PropertyInsert,
  PropertyUpdate,
  PropertyWithAgent,
} from "@/types/entities";

/**
 * Property Service
 * Handles all property operations for agents
 */

/**
 * Get all properties for a specific agent
 */
export async function getAgentProperties(
  agentUserId: string
): Promise<PropertyWithAgent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      agent:profiles!properties_listing_agent_id_fkey(*),
      agent_profile:agent_profiles(*)
    `
    )
    .eq("listing_agent_id", agentUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching agent properties:", error);
    throw error;
  }

  return data as PropertyWithAgent[];
}

/**
 * Get a single property by ID
 */
export async function getProperty(
  propertyId: string
): Promise<PropertyWithAgent | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      agent:profiles!properties_listing_agent_id_fkey(*),
      agent_profile:agent_profiles(*)
    `
    )
    .eq("id", propertyId)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data as PropertyWithAgent;
}

/**
 * Create a new property
 */
export async function createProperty(
  propertyData: PropertyInsert
): Promise<Property> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .insert(propertyData)
    .select()
    .single();

  if (error) {
    console.error("Error creating property:", error);
    throw error;
  }

  return data;
}

/**
 * Update an existing property
 */
export async function updateProperty(
  propertyId: string,
  propertyData: PropertyUpdate
): Promise<Property> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .update({
      ...propertyData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .select()
    .single();

  if (error) {
    console.error("Error updating property:", error);
    throw error;
  }

  return data;
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
}

/**
 * Search properties from Realtor API (RapidAPI)
 * This will be used to import properties into the system
 */
export async function searchFromRealtorAPI(
  query: string,
  location?: string
): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      query,
      ...(location && { location }),
    });

    const response = await fetch(`/api/realtor/search?${params}`);

    if (!response.ok) {
      throw new Error("Failed to search Realtor API");
    }

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error searching Realtor API:", error);
    throw error;
  }
}

/**
 * Import property from Realtor API data
 */
export async function importPropertyFromRealtorAPI(
  realtorData: any,
  agentUserId: string
): Promise<Property> {
  const propertyData: PropertyInsert = {
    listing_agent_id: agentUserId,
    address: realtorData.address?.line || "",
    city: realtorData.address?.city || "",
    state: realtorData.address?.state_code || "",
    zip_code: realtorData.address?.postal_code || "",
    price: realtorData.list_price || 0,
    bedrooms: realtorData.description?.beds || 0,
    bathrooms: realtorData.description?.baths || 0,
    square_feet: realtorData.description?.sqft || 0,
    property_type: realtorData.description?.type || "single_family",
    description: realtorData.description?.text || "",
    latitude: realtorData.location?.address?.coordinate?.lat || 0,
    longitude: realtorData.location?.address?.coordinate?.lon || 0,
    year_built: realtorData.description?.year_built || null,
    lot_size: realtorData.description?.lot_sqft || null,
  };

  return createProperty(propertyData);
}

/**
 * Get properties count for an agent
 */
export async function getAgentPropertiesCount(
  agentUserId: string
): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("listing_agent_id", agentUserId);

  if (error) {
    console.error("Error fetching properties count:", error);
    throw error;
  }

  return count || 0;
}
