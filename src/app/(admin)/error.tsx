"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin section error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="primary" size="sm">
            Try again
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline" size="sm">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
