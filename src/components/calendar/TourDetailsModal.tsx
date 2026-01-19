"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { createClient } from "@/lib/supabase/client";
import type { TourRequestWithDetails } from "@/types/entities";
import Image from "next/image";

interface TourDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onUpdate?: () => void;
}

export default function TourDetailsModal({
  isOpen,
  onClose,
  requestId,
  onUpdate,
}: TourDetailsModalProps) {
  const [tourRequest, setTourRequest] = useState<TourRequestWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && requestId) {
      fetchTourDetails();
    }
  }, [isOpen, requestId]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("tour_requests")
        .select(
          `
          *,
          property:properties(*),
          user:profiles!tour_requests_user_id_fkey(*)
        `
        )
        .eq("id", requestId)
        .single();

      if (fetchError) throw fetchError;

      setTourRequest(data as TourRequestWithDetails);
    } catch (err) {
      console.error("Error fetching tour details:", err);
      setError("Failed to load tour details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!tourRequest) return;

    try {
      setUpdating(true);
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("tour_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // Refresh tour details
      await fetchTourDetails();

      // Notify parent to refresh
      if (onUpdate) onUpdate();

      // Show success message (you could use a toast here)
      alert(`Tour ${newStatus} successfully`);
    } catch (err) {
      console.error("Error updating tour status:", err);
      alert("Failed to update tour status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlot = (timeSlot: string | null) => {
    if (!timeSlot) return "Not specified";
    return timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Tour Details
        </h2>
        {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={fetchTourDetails}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      ) : tourRequest ? (
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                tourRequest.status || "pending"
              )}`}
            >
              {(tourRequest.status || "pending").charAt(0).toUpperCase() +
                (tourRequest.status || "pending").slice(1)}
            </span>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Property
            </h3>
            <div className="flex gap-4">
              {tourRequest.property?.image_url && (
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={tourRequest.property.image_url}
                    alt="Property"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {tourRequest.property?.address || "Unknown Address"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tourRequest.property?.city}, {tourRequest.property?.state}{" "}
                  {tourRequest.property?.zip_code}
                </p>
                {tourRequest.property?.price && (
                  <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                    ${tourRequest.property.price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Client Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {tourRequest.user?.full_name || "Unknown Client"}
                </span>
              </div>
              {tourRequest.user?.email && (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${tourRequest.user.email}`}
                    className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    {tourRequest.user.email}
                  </a>
                </div>
              )}
              {tourRequest.user?.phone && (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href={`tel:${tourRequest.user.phone}`}
                    className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    {tourRequest.user.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tour Date & Time */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Scheduled Date & Time
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(tourRequest.requested_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatTimeSlot(tourRequest.requested_time_slot)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests / Message */}
          {tourRequest.message && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Client Message
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tourRequest.message}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              {tourRequest.status === "approved" && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={updating}
                >
                  Mark as Complete
                </Button>
              )}
              {(tourRequest.status === "approved" ||
                tourRequest.status === "pending") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("cancelled")}
                  disabled={updating}
                >
                  Cancel Tour
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tour details available
        </p>
      )}
      </div>
    </Modal>
  );
}
