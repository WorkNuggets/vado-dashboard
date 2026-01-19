"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import type { Profile, AgentProfile } from "@/types/entities";
import { updateAgentProfile } from "@/services/profile.service";

interface AgentSpecializationsCardProps {
  profile: Profile;
  agentProfile: AgentProfile | null;
  onUpdate: () => void;
}

export default function AgentSpecializationsCard({
  profile,
  agentProfile,
  onUpdate,
}: AgentSpecializationsCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [saving, setSaving] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>(
    agentProfile?.specializations || []
  );
  const [inputValue, setInputValue] = useState("");

  const handleSave = async () => {
    if (!agentProfile) return;

    try {
      setSaving(true);

      await updateAgentProfile(profile.id, {
        specializations: specializations.length > 0 ? specializations : null,
      });

      onUpdate();
      closeModal();
    } catch (error) {
      console.error("Failed to update specializations:", error);
      alert("Failed to update specializations. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSpecialization = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !specializations.includes(trimmedValue) &&
      specializations.length < 10
    ) {
      setSpecializations([...specializations, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSpecialization();
    }
  };

  if (!agentProfile) {
    return null;
  }

  const commonSpecializations = [
    "Buyer's Agent",
    "Listing Agent",
    "Relocation",
    "Foreclosure",
    "Short-Sale",
    "Consulting",
    "Property Management",
    "Landlord",
    "First-Time Home Buyers",
    "Luxury Homes",
    "Commercial",
    "Investment Properties",
  ];

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
              Specializations
            </h4>

            {agentProfile.specializations &&
            agentProfile.specializations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {agentProfile.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-full dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No specializations added yet
              </p>
            )}
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
              Edit Specializations
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Add up to 10 specializations that describe your expertise.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 pb-3 overflow-y-auto custom-scrollbar max-h-[450px]">
              <div className="space-y-5">
                {/* Input for adding new specializations */}
                <div>
                  <Label>Add Specialization</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type and press Enter or click Add"
                      disabled={specializations.length >= 10}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddSpecialization}
                      disabled={!inputValue.trim() || specializations.length >= 10}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {specializations.length}/10 specializations
                  </p>
                </div>

                {/* Current specializations */}
                {specializations.length > 0 && (
                  <div>
                    <Label>Your Specializations</Label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg dark:border-gray-700">
                      {specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-full dark:bg-blue-900/20 dark:text-blue-400"
                        >
                          {spec}
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecialization(index)}
                            className="ml-1 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common specializations */}
                <div>
                  <Label>Common Specializations (Click to Add)</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonSpecializations
                      .filter((spec) => !specializations.includes(spec))
                      .map((spec, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (specializations.length < 10) {
                              setSpecializations([...specializations, spec]);
                            }
                          }}
                          disabled={specializations.length >= 10}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          + {spec}
                        </button>
                      ))}
                  </div>
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
