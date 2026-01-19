"use client";

import { useAuth } from "@/context/AuthContext";
import {
  getTourEventsForAgent,
  subscribeToTourEvents,
  type CalendarEvent,
} from "@/services/tourCalendar.service";
import { useEffect, useState } from "react";
import Calendar from "@/components/calendar/Calendar";

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadEvents();

      // Subscribe to real-time updates
      const unsubscribe = subscribeToTourEvents(user.id, () => {
        loadEvents();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user?.id]);

  async function loadEvents() {
    if (!user?.id) return;

    try {
      setLoading(true);
      const tourEvents = await getTourEventsForAgent(user.id);
      setEvents(tourEvents);
      setError(null);
    } catch (err) {
      console.error("Error loading calendar events:", err);
      setError("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={loadEvents}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View and manage your scheduled property tours
        </p>
      </div>

      {/* Event Legend */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Approved Tours
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Completed Tours
          </span>
        </div>
      </div>

      <Calendar events={events} onEventsUpdate={loadEvents} />
    </div>
  );
}
