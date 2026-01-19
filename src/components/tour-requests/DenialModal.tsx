"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

interface DenialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeny: (reason: string) => Promise<void>;
  propertyAddress: string;
  clientName: string;
}

const PREDEFINED_REASONS = [
  "Property is no longer available",
  "Scheduling conflict",
  "Property is under contract",
  "Client does not meet requirements",
  "Other (specify below)",
];

export default function DenialModal({
  isOpen,
  onClose,
  onDeny,
  propertyAddress,
  clientName,
}: DenialModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalReason =
      selectedReason === "Other (specify below)" ? customReason : selectedReason;

    if (!finalReason.trim()) {
      setError("Please select or enter a reason for denial");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onDeny(finalReason);
      // Reset form
      setSelectedReason("");
      setCustomReason("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deny tour request");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason("");
      setCustomReason("");
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Deny Tour Request
        </h3>

        <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Client:</span> {clientName}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Property:</span> {propertyAddress}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>
              Reason for Denial <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              {PREDEFINED_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "Other (specify below)" && (
            <div>
              <Label>
                Custom Reason <span className="text-red-500">*</span>
              </Label>
              <TextArea
                placeholder="Please provide a specific reason for denying this tour request..."
                rows={3}
                value={customReason}
                onChange={setCustomReason}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Denying..." : "Deny Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
