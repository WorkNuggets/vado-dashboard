"use client";

import { useAuth } from "@/context/AuthContext";
import {
  approveTourRequest,
  denyTourRequest,
  getRequestsForAgent,
  subscribeToTourRequests,
} from "@/services/tourRequest.service";
import type { TourRequestWithDetails } from "@/types/entities";
import ApprovalModal from "@/components/tour-requests/ApprovalModal";
import DenialModal from "@/components/tour-requests/DenialModal";
import { useEffect, useState } from "react";

type StatusFilter = "all" | "pending" | "approved" | "denied" | "cancelled";

export default function TourRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TourRequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [denialModalOpen, setDenialModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TourRequestWithDetails | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadRequests();

      // Subscribe to real-time updates
      const unsubscribe = subscribeToTourRequests(user.id, () => {
        loadRequests();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user?.id]);

  async function loadRequests() {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await getRequestsForAgent(user.id);
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tour requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openApprovalModal(request: TourRequestWithDetails) {
    setSelectedRequest(request);
    setApprovalModalOpen(true);
  }

  function openDenialModal(request: TourRequestWithDetails) {
    setSelectedRequest(request);
    setDenialModalOpen(true);
  }

  async function handleApproveSubmit(message: string, scheduledDate?: string) {
    if (!selectedRequest) return;

    setActionLoading(selectedRequest.id);
    try {
      await approveTourRequest(selectedRequest.id, message, scheduledDate);
      await loadRequests();
    } catch (err) {
      console.error(err);
      throw err; // Let modal handle error display
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDenySubmit(reason: string) {
    if (!selectedRequest) return;

    setActionLoading(selectedRequest.id);
    try {
      await denyTourRequest(selectedRequest.id, reason);
      await loadRequests();
    } catch (err) {
      console.error(err);
      throw err; // Let modal handle error display
    } finally {
      setActionLoading(null);
    }
  }

  const filteredRequests = requests.filter((req) => {
    if (statusFilter === "all") return true;
    return req.status === statusFilter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "denied":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "expired":
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeSlot = (slot: string | null) => {
    if (!slot) return "";
    const slots: Record<string, string> = {
      morning: "Morning (8AM-12PM)",
      afternoon: "Afternoon (12PM-5PM)",
      evening: "Evening (5PM-8PM)",
    };
    return slots[slot] || slot;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <p>{error}</p>
        <button
          onClick={loadRequests}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tour Requests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage tour requests for your properties
          </p>
        </div>
        <button
          onClick={loadRequests}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          ["all", "pending", "approved", "denied", "cancelled"] as StatusFilter[]
        ).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {requests.filter((r) => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No tour requests
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {statusFilter === "all"
              ? "You don't have any tour requests yet."
              : `No ${statusFilter} tour requests.`}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {/* Property */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {request.property?.featured_image_url && (
                        <img
                          src={request.property.featured_image_url}
                          alt={request.property.address || "Property"}
                          className="mr-3 h-10 w-14 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.property?.address || "Unknown property"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.property?.city}, {request.property?.state}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Requester */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.user?.full_name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.user?.phone || request.user?.email || "No contact"}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(request.requested_date)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeSlot(request.requested_time_slot)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        request.status || "pending"
                      )}`}
                    >
                      {(request.status || "pending").charAt(0).toUpperCase() +
                        (request.status || "pending").slice(1)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4">
                    {request.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openApprovalModal(request)}
                          disabled={actionLoading === request.id}
                          className="rounded bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          {actionLoading === request.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => openDenialModal(request)}
                          disabled={actionLoading === request.id}
                          className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                        >
                          Deny
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {request.status === "approved" && "Approved"}
                        {request.status === "denied" && "Denied"}
                        {request.status === "cancelled" && "Cancelled by user"}
                        {request.status === "expired" && "Expired"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {requests.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {requests.filter((r) => r.status === "approved").length}
          </p>
        </div>
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">Denied</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {requests.filter((r) => r.status === "denied").length}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {requests.length}
          </p>
        </div>
      </div>

      {/* Modals */}
      {selectedRequest && (
        <>
          <ApprovalModal
            isOpen={approvalModalOpen}
            onClose={() => {
              setApprovalModalOpen(false);
              setSelectedRequest(null);
            }}
            onApprove={handleApproveSubmit}
            propertyAddress={
              selectedRequest.property?.address || "Unknown property"
            }
            clientName={selectedRequest.user?.full_name || "Unknown"}
          />
          <DenialModal
            isOpen={denialModalOpen}
            onClose={() => {
              setDenialModalOpen(false);
              setSelectedRequest(null);
            }}
            onDeny={handleDenySubmit}
            propertyAddress={
              selectedRequest.property?.address || "Unknown property"
            }
            clientName={selectedRequest.user?.full_name || "Unknown"}
          />
        </>
      )}
    </div>
  );
}
