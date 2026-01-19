"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import type { Profile, AgentProfile } from "@/types/entities";
import { updateAgentProfile } from "@/services/profile.service";

interface AgentLicenseCardProps {
  profile: Profile;
  agentProfile: AgentProfile | null;
  onUpdate: () => void;
}

export default function AgentLicenseCard({
  profile,
  agentProfile,
  onUpdate,
}: AgentLicenseCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: agentProfile?.license_number || "",
    licenseState: agentProfile?.license_state || "",
    licenseExpiryDate: agentProfile?.license_expiry_date || "",
    yearsExperience: agentProfile?.years_experience?.toString() || "",
  });

  const handleSave = async () => {
    if (!agentProfile) return;

    try {
      setSaving(true);

      await updateAgentProfile(profile.id, {
        license_number: formData.licenseNumber,
        license_state: formData.licenseState,
        license_expiry_date: formData.licenseExpiryDate || null,
        years_experience: formData.yearsExperience
          ? parseInt(formData.yearsExperience)
          : null,
      });

      onUpdate();
      closeModal();
    } catch (error) {
      console.error("Failed to update license info:", error);
      alert("Failed to update license info. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!agentProfile) {
    return null;
  }

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpiringSoon = (dateString: string | null) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                License Information
              </h4>
              {agentProfile.license_verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-success-700 bg-success-50 rounded-full dark:bg-success-900/20 dark:text-success-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  License Number
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {agentProfile.license_number || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  License State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {agentProfile.license_state || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Expiry Date
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium ${
                      isExpired(agentProfile.license_expiry_date)
                        ? "text-error-600 dark:text-error-400"
                        : isExpiringSoon(agentProfile.license_expiry_date)
                          ? "text-warning-600 dark:text-warning-400"
                          : "text-gray-800 dark:text-white/90"
                    }`}
                  >
                    {formatExpiryDate(agentProfile.license_expiry_date)}
                  </p>
                  {isExpiringSoon(agentProfile.license_expiry_date) && (
                    <span className="text-xs text-warning-600 dark:text-warning-400">
                      (Expiring soon)
                    </span>
                  )}
                  {isExpired(agentProfile.license_expiry_date) && (
                    <span className="text-xs text-error-600 dark:text-error-400">
                      (Expired)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Years of Experience
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {agentProfile.years_experience
                    ? `${agentProfile.years_experience} years`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit License Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your license details and professional credentials.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>License Number</Label>
                  <Input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseNumber: e.target.value })
                    }
                    placeholder="e.g., 12345678"
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>License State</Label>
                  <Input
                    type="text"
                    value={formData.licenseState}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseState: e.target.value })
                    }
                    placeholder="e.g., CA, TX, NY"
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.licenseExpiryDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseExpiryDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsExperience: e.target.value,
                      })
                    }
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                disabled={saving}
              >
                Close
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
