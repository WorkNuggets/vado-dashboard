"use client";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import React, { useState } from "react";
import Label from "../form/Label";
import Back from "./Back";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        // More descriptive error messages
        if (resetError.message.includes("rate limit")) {
          throw new Error("Too many reset attempts. Please try again in a few minutes.");
        } else if (resetError.message.includes("User not found")) {
          throw new Error("No account found with this email address.");
        } else {
          throw new Error(resetError.message);
        }
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <Back className="w-full max-w-md pt-10 mx-auto" />
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="text-center">
            <div className="mb-4 text-6xl">✅</div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We've sent a password reset link to <strong>{email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              Didn't receive the email? Check your spam folder, wait a few minutes, or{" "}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                try again
              </button>
              . Still no email?{" "}
              <a
                href="mailto:support@vadoapp.com"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Contact support
              </a>
              .
            </p>
            <div className="mt-6">
              <Link
                href="/signin"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <Back className="w-full max-w-md pt-10 mx-auto" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Forgot Your Password?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the email address linked to your account, and we'll send you a link to reset your
            password.
          </p>
          {error && (
            <div className="mt-3 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
        <div>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-5">
              {/* <!-- Email --> */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* <!-- Button --> */}
              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5 space-y-2">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Wait, I remember my password...{" "}
              <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Sign In
              </Link>
            </p>
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Need help?{" "}
              <a
                href="mailto:support@vadoapp.com"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
