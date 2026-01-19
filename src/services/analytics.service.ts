import { createClient } from "@/lib/supabase/client";

/**
 * Analytics Service
 * Handles analytics and metrics for agent dashboards
 */

export interface TourRequestTrend {
  date: string;
  count: number;
  displayDate: string; // For chart display (e.g., "Jan 15")
}

export interface PropertyPerformance {
  propertyId: string;
  propertyAddress: string;
  tourRequests: number;
  views: number; // Can be added later if tracking is implemented
}

export interface ConversionMetrics {
  totalViews: number;
  totalTourRequests: number;
  completedTours: number;
  conversionRate: number; // Tour requests / Views
  completionRate: number; // Completed / Tour requests
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string; // For chart display
}

/**
 * Get tour requests trend over time
 * Groups tour requests by date for the specified number of days
 */
export async function getTourRequestsTrend(
  agentId: string,
  days: number = 30
): Promise<TourRequestTrend[]> {
  const supabase = createClient();

  // Calculate start date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch tour requests for the period
  const { data, error } = await supabase
    .from("tour_requests")
    .select("created_at")
    .eq("agent_id", agentId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching tour requests trend:", error);
    throw error;
  }

  // Group by date
  const dateMap = new Map<string, number>();

  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split("T")[0];
    dateMap.set(dateStr, 0);
  }

  // Count tour requests per date
  data?.forEach((request) => {
    const dateStr = request.created_at.split("T")[0];
    const currentCount = dateMap.get(dateStr) || 0;
    dateMap.set(dateStr, currentCount + 1);
  });

  // Convert to array format for charts
  return Array.from(dateMap.entries()).map(([date, count]) => {
    const dateObj = new Date(date);
    const displayDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      date,
      count,
      displayDate,
    };
  });
}

/**
 * Get property performance metrics
 * Shows tour requests per property
 */
export async function getPropertyPerformance(
  agentId: string
): Promise<PropertyPerformance[]> {
  const supabase = createClient();

  // Get all properties for the agent with tour request counts
  const { data: properties, error: propError } = await supabase
    .from("properties")
    .select("id, address, city, state, zip_code")
    .eq("listing_agent_id", agentId);

  if (propError) {
    console.error("Error fetching properties:", propError);
    throw propError;
  }

  if (!properties || properties.length === 0) {
    return [];
  }

  // Get tour request counts for each property
  const performanceData: PropertyPerformance[] = await Promise.all(
    properties.map(async (property) => {
      const { count, error: countError } = await supabase
        .from("tour_requests")
        .select("*", { count: "exact", head: true })
        .eq("property_id", property.id);

      if (countError) {
        console.error(
          `Error counting tour requests for property ${property.id}:`,
          countError
        );
      }

      const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;

      return {
        propertyId: property.id,
        propertyAddress: fullAddress,
        tourRequests: count || 0,
        views: 0, // Can be implemented later with view tracking
      };
    })
  );

  // Sort by tour requests (most popular first) and take top 10
  return performanceData
    .sort((a, b) => b.tourRequests - a.tourRequests)
    .slice(0, 10);
}

/**
 * Get conversion metrics
 * Calculates conversion funnel data
 */
export async function getConversionMetrics(
  agentId: string
): Promise<ConversionMetrics> {
  const supabase = createClient();

  // Get total tour requests
  const { count: totalTourRequests, error: requestError } = await supabase
    .from("tour_requests")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", agentId);

  if (requestError) {
    console.error("Error fetching tour requests count:", requestError);
    throw requestError;
  }

  // Get completed tours count
  const { count: completedTours, error: toursError } = await supabase
    .from("tours")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", agentId)
    .eq("status", "completed");

  if (toursError) {
    console.error("Error fetching completed tours count:", toursError);
    throw toursError;
  }

  // Calculate rates
  const totalViews = 0; // Can be implemented later with view tracking
  const conversionRate =
    totalViews > 0 ? ((totalTourRequests || 0) / totalViews) * 100 : 0;
  const completionRate =
    (totalTourRequests || 0) > 0
      ? ((completedTours || 0) / (totalTourRequests || 0)) * 100
      : 0;

  return {
    totalViews,
    totalTourRequests: totalTourRequests || 0,
    completedTours: completedTours || 0,
    conversionRate,
    completionRate,
  };
}

/**
 * Get status distribution
 * Shows breakdown of tour request statuses
 */
export async function getStatusDistribution(
  agentId: string
): Promise<StatusDistribution[]> {
  const supabase = createClient();

  // Get all tour requests for the agent
  const { data, error } = await supabase
    .from("tour_requests")
    .select("status")
    .eq("agent_id", agentId);

  if (error) {
    console.error("Error fetching tour request statuses:", error);
    throw error;
  }

  // Count by status
  const statusCounts = new Map<string, number>();
  let total = 0;

  data?.forEach((request) => {
    const status = request.status || "unknown";
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
    total++;
  });

  // Define colors for each status
  const statusColors: Record<string, string> = {
    pending: "#f59e0b", // amber-500
    approved: "#10b981", // green-500
    declined: "#ef4444", // red-500
    cancelled: "#6b7280", // gray-500
    completed: "#3b82f6", // blue-500
    unknown: "#9ca3af", // gray-400
  };

  // Convert to array format for charts
  return Array.from(statusCounts.entries())
    .map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: statusColors[status] || statusColors.unknown,
    }))
    .sort((a, b) => b.count - a.count);
}
