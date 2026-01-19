"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserSettings,
  updateUserSettings,
  applyThemePreference,
  type UserSettings,
} from "@/services/settings.service";
import Button from "@/components/ui/button/Button";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const userSettings = await getUserSettings(user.id);
        setSettings(userSettings);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchSettings();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleUpdateSettings = async (updates: Partial<UserSettings>) => {
    if (!user?.id || !settings) return;

    try {
      setSaving(true);
      const updatedSettings = await updateUserSettings(user.id, updates);
      setSettings(updatedSettings);

      // Apply theme change immediately
      if (updates.theme_preference) {
        applyThemePreference(updates.theme_preference);
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Failed to load settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {/* Email Tour Requests */}
          <div className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Tour Request Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Receive email notifications when you get new tour requests
              </p>
            </div>
            <button
              onClick={() =>
                handleUpdateSettings({
                  email_tour_requests: !settings.email_tour_requests,
                })
              }
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.email_tour_requests
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.email_tour_requests ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Email Messages */}
          <div className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Message Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Receive email notifications for new messages
              </p>
            </div>
            <button
              onClick={() =>
                handleUpdateSettings({
                  email_messages: !settings.email_messages,
                })
              }
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.email_messages
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.email_messages ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Email Digest Frequency */}
          <div className="flex items-start justify-between py-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Email Digest Frequency
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                How often should we send you activity summaries?
              </p>
            </div>
            <select
              value={settings.email_digest_frequency}
              onChange={(e) =>
                handleUpdateSettings({
                  email_digest_frequency: e.target.value as
                    | "daily"
                    | "weekly"
                    | "none",
                })
              }
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="none">Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Preferences */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Dashboard Preferences
        </h2>

        <div className="space-y-4">
          {/* Theme Preference */}
          <div className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Theme
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred theme appearance
              </p>
            </div>
            <select
              value={settings.theme_preference}
              onChange={(e) =>
                handleUpdateSettings({
                  theme_preference: e.target.value as
                    | "light"
                    | "dark"
                    | "system",
                })
              }
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Default Dashboard View */}
          <div className="flex items-start justify-between py-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Default Dashboard View
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose which page to show when you login
              </p>
            </div>
            <select
              value={settings.default_dashboard_view}
              onChange={(e) =>
                handleUpdateSettings({
                  default_dashboard_view: e.target.value,
                })
              }
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
            >
              <option value="overview">Overview</option>
              <option value="properties">Properties</option>
              <option value="tour-requests">Tour Requests</option>
              <option value="calendar">Calendar</option>
              <option value="messages">Messages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Account Settings
        </h2>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Password
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert("Password change functionality coming soon")}
            >
              Change Password
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-start justify-between py-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-error-600 dark:text-error-400">
                Delete Account
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            {!showDeleteConfirm ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-error-300 text-error-600 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/20"
              >
                Delete Account
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    alert("Account deletion functionality coming soon")
                  }
                  className="bg-error-600 hover:bg-error-700"
                >
                  Confirm Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
