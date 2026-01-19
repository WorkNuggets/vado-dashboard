"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import AgentLicenseCard from "@/components/user-profile/AgentLicenseCard";
import AgentSpecializationsCard from "@/components/user-profile/AgentSpecializationsCard";
import AgentStatsCard from "@/components/user-profile/AgentStatsCard";
import BrokerageCard from "@/components/user-profile/BrokerageCard";
import { useAuth } from "@/context/AuthContext";
import { getFullProfile } from "@/services/profile.service";
import React, { useEffect, useState } from "react";
import type { Profile, AgentProfile } from "@/types/entities";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const { profile: profileData, agentProfile: agentProfileData } =
        await getFullProfile(user.id);

      if (!profileData) {
        setError("Profile not found");
        return;
      }

      setProfile(profileData);
      setAgentProfile(agentProfileData);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError("Please sign in to view your profile");
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <button
              onClick={fetchProfile}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {/* User Meta Card - Avatar, Name, Social Links */}
          <UserMetaCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />

          {/* Agent Stats - Only show for agents */}
          {agentProfile && <AgentStatsCard profile={profile} agentProfile={agentProfile} />}

          {/* Personal Information */}
          <UserInfoCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />

          {/* Agent-specific cards - Only show for agents */}
          {agentProfile && (
            <>
              <BrokerageCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />
              <AgentLicenseCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />
              <AgentSpecializationsCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />
              <UserAddressCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />
            </>
          )}

          {/* For non-agents, still show address card if it has content */}
          {!agentProfile && <UserAddressCard profile={profile} agentProfile={agentProfile} onUpdate={fetchProfile} />}
        </div>
      </div>
    </div>
  );
}
