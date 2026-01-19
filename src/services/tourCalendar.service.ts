import { createClient } from "@/lib/supabase/client";
import type { TourRequestWithDetails } from "@/types/entities";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    type: "tour";
    status: string;
    propertyAddress?: string;
    clientName?: string;
    requestId: string;
  };
}

/**
 * Get tour events for calendar
 * Fetches approved tour requests and converts them to calendar events
 */
export async function getTourEventsForAgent(
  agentUserId: string
): Promise<CalendarEvent[]> {
  const supabase = createClient();

  const { data: requests, error } = await supabase
    .from("tour_requests")
    .select(
      `
      *,
      property:properties(*),
      user:profiles!tour_requests_user_id_fkey(*)
    `
    )
    .eq("agent_id", agentUserId)
    .in("status", ["approved", "completed"])
    .order("requested_date", { ascending: true });

  if (error) {
    console.error("Error fetching tour events:", error);
    throw error;
  }

  return (requests as TourRequestWithDetails[]).map((request) =>
    convertTourToEvent(request)
  );
}

/**
 * Convert tour request to calendar event
 */
function convertTourToEvent(request: TourRequestWithDetails): CalendarEvent {
  const propertyAddress =
    request.property?.address || "Unknown Property";
  const clientName = request.user?.full_name || "Unknown Client";

  // Create event date
  let startDate: Date;
  let endDate: Date;

  if (request.requested_date) {
    startDate = new Date(request.requested_date);

    // Set time based on time slot if available
    if (request.requested_time_slot) {
      switch (request.requested_time_slot) {
        case "morning":
          startDate.setHours(9, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(10, 0, 0);
          break;
        case "afternoon":
          startDate.setHours(14, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(15, 0, 0);
          break;
        case "evening":
          startDate.setHours(17, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(18, 0, 0);
          break;
        default:
          startDate.setHours(10, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(11, 0, 0);
      }
    } else {
      // Default 1-hour duration
      startDate.setHours(10, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(11, 0, 0);
    }
  } else {
    // Fallback to current date
    startDate = new Date();
    endDate = new Date();
    endDate.setHours(endDate.getHours() + 1);
  }

  // Color code by status
  let backgroundColor = "#10b981"; // green for approved
  let borderColor = "#059669";
  let textColor = "#ffffff";

  if (request.status === "completed") {
    backgroundColor = "#3b82f6"; // blue for completed
    borderColor = "#2563eb";
  }

  return {
    id: request.id,
    title: `Tour: ${propertyAddress}`,
    start: startDate,
    end: endDate,
    backgroundColor,
    borderColor,
    textColor,
    extendedProps: {
      type: "tour",
      status: request.status || "approved",
      propertyAddress,
      clientName,
      requestId: request.id,
    },
  };
}

/**
 * Subscribe to tour event changes
 */
export function subscribeToTourEvents(
  agentUserId: string,
  onUpdate: () => void
): () => void {
  const supabase = createClient();

  const channel = supabase
    .channel(`tour-events:${agentUserId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tour_requests",
        filter: `agent_id=eq.${agentUserId}`,
      },
      onUpdate
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
