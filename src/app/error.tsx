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
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Something went wrong
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline">
            Go home
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
