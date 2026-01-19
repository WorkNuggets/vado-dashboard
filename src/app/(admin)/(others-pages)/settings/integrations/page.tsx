"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/button/Button";

// CRM Provider definitions
interface CRMProvider {
  id: string;
  name: string;
  description: string;
  logo?: string;
  status: "not_connected" | "connected" | "syncing" | "error";
  lastSync?: Date;
  features: string[];
}

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<CRMProvider[]>([
    {
      id: "chime",
      name: "Chime CRM",
      description: "Real estate CRM built for agents by agents",
      status: "not_connected",
      features: [
        "Contact sync",
        "Property sync",
        "Activity tracking",
        "Lead management",
      ],
    },
    {
      id: "followupboss",
      name: "Follow Up Boss",
      description: "Simple, powerful CRM for real estate teams",
      status: "not_connected",
      features: [
        "Lead routing",
        "Email campaigns",
        "Contact management",
        "Action plans",
      ],
    },
    {
      id: "custom",
      name: "Custom Integration",
      description: "Connect to your custom CRM using our API",
      status: "not_connected",
      features: [
        "Custom webhooks",
        "API access",
        "Flexible data mapping",
        "Real-time sync",
      ],
    },
  ]);

  const handleConnect = (providerId: string) => {
    // Placeholder for connection logic
    alert(`Connecting to ${providerId}... (Coming soon)`);
  };

  const handleDisconnect = (providerId: string) => {
    // Placeholder for disconnection logic
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, status: "not_connected" } : p
      )
    );
  };

  const handleSync = (providerId: string) => {
    // Placeholder for manual sync
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, status: "syncing" as const } : p
      )
    );

    // Simulate sync completion
    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? { ...p, status: "connected" as const, lastSync: new Date() }
            : p
        )
      );
    }, 2000);
  };

  const getStatusBadge = (status: CRMProvider["status"]) => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
            Connected
          </span>
        );
      case "syncing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400"></span>
            Syncing...
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400"></span>
            Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            Not Connected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          CRM Integrations
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Connect your favorite CRM to sync contacts, properties, and activities
        </p>
      </div>

      {/* Integration Status Overview */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Integration Status
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Integrations
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {providers.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Connected
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {providers.filter((p) => p.status === "connected").length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Available
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {providers.filter((p) => p.status === "not_connected").length}
            </p>
          </div>
        </div>
      </div>

      {/* CRM Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Provider Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {provider.name}
                  </h3>
                  {getStatusBadge(provider.status)}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {provider.description}
                </p>

                {/* Features */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Features:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {provider.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Sync */}
                {provider.lastSync && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Last synced:{" "}
                    {provider.lastSync.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:min-w-[200px]">
                {provider.status === "not_connected" ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleConnect(provider.id)}
                    className="w-full"
                  >
                    Connect
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleSync(provider.id)}
                      disabled={provider.status === "syncing"}
                      className="w-full"
                    >
                      {provider.status === "syncing" ? "Syncing..." : "Sync Now"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisconnect(provider.id)}
                      className="w-full"
                    >
                      Disconnect
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20 lg:p-6">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
              CRM Integrations Coming Soon
            </h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
              Full CRM integration functionality is currently in development.
              Connect buttons will be enabled once integration support is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
