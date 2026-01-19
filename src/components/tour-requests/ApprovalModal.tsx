"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (message: string, scheduledDate?: string) => Promise<void>;
  propertyAddress: string;
  clientName: string;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  onApprove,
  propertyAddress,
  clientName,
}: ApprovalModalProps) {
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a response message");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onApprove(message, scheduledDate || undefined);
      // Reset form
      setMessage("");
      setScheduledDate("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve tour request");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMessage("");
      setScheduledDate("");
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Approve Tour Request
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
              Response Message <span className="text-red-500">*</span>
            </Label>
            <TextArea
              placeholder="Great! I'd be happy to show you this property. Let me know what time works best for you..."
              rows={4}
              value={message}
              onChange={setMessage}
            />
          </div>

          <div>
            <Label>Scheduled Date & Time (Optional)</Label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Set a specific date and time for the tour
            </p>
          </div>

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
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Approving..." : "Approve Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
