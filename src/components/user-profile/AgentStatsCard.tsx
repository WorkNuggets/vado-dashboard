"use client";
import React, { useEffect, useState } from "react";
import type { Profile, AgentProfile } from "@/types/entities";
import {
  getPropertiesCount,
  getCompletedToursCount,
  getTourRequestsThisMonth,
} from "@/services/profile.service";

interface AgentStatsCardProps {
  profile: Profile;
  agentProfile: AgentProfile | null;
}

export default function AgentStatsCard({
  profile,
  agentProfile,
}: AgentStatsCardProps) {
  const [stats, setStats] = useState({
    propertiesCount: 0,
    toursCompleted: 0,
    tourRequestsThisMonth: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile.id) return;

      try {
        const [properties, tours, requests] = await Promise.all([
          getPropertiesCount(profile.id),
          getCompletedToursCount(profile.id),
          getTourRequestsThisMonth(profile.id),
        ]);

        setStats({
          propertiesCount: properties,
          toursCompleted: tours,
          tourRequestsThisMonth: requests,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [profile.id]);

  if (!agentProfile) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-5 h-5 text-gray-300 dark:text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
        Statistics & Performance
      </h4>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Average Rating */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
              Rating
            </p>
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {agentProfile.average_rating?.toFixed(1) || "0.0"}
            </p>
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              / 5.0
            </p>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(agentProfile.average_rating || 0)}
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {agentProfile.total_reviews || 0} reviews
          </p>
        </div>

        {/* Properties */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-green-600 uppercase dark:text-green-400">
              Properties
            </p>
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          {stats.loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.propertiesCount}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Active listings
          </p>
        </div>

        {/* Completed Tours */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-purple-600 uppercase dark:text-purple-400">
              Tours
            </p>
            <svg
              className="w-5 h-5 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          {stats.loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.toursCompleted}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Completed tours
          </p>
        </div>

        {/* Tour Requests This Month */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-orange-600 uppercase dark:text-orange-400">
              This Month
            </p>
            <svg
              className="w-5 h-5 text-orange-600 dark:text-orange-400"
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
          </div>
          {stats.loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.tourRequestsThisMonth}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Tour requests
          </p>
        </div>
      </div>
    </div>
  );
}
