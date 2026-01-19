"use client";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import Back from "./Back";

export default function UpdatePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Password strength validation
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Check if passwords match
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Password strength scoring (0-4)
  const passwordStrength = Object.values(passwordValidation).filter(Boolean).length;

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const getPasswordStrengthTextColor = () => {
    if (passwordStrength <= 2) return "text-red-600 dark:text-red-400";
    if (passwordStrength === 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  // Check if user has valid session from reset link
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Invalid or expired reset link. Please request a new one.");
      }
    };

    checkSession();
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must meet all requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        if (updateError.message.includes("same as the old password")) {
          throw new Error("New password must be different from your current password");
        } else {
          throw new Error(updateError.message);
        }
      }

      // Success - redirect to signin
      alert("Password updated successfully! Please sign in with your new password.");
      router.push("/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <Back className="w-full max-w-md pt-10 mx-auto" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Update Your Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below. Make sure it's strong and secure.
          </p>
          {error && (
            <div className="mt-3 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
        <div>
          <form onSubmit={handleUpdatePassword}>
            <div className="space-y-5">
              {/* <!-- New Password --> */}
              <div>
                <Label>
                  New Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordTouched(true)}
                    disabled={loading}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>

                {/* Password Strength Bar */}
                {passwordTouched && password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            bar <= passwordStrength ? getPasswordStrengthColor() : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    {getPasswordStrengthText() && (
                      <p className={`text-xs font-medium ${getPasswordStrengthTextColor()}`}>
                        Password strength: {getPasswordStrengthText()}
                      </p>
                    )}
                  </div>
                )}

                {/* Password Strength Indicators */}
                {passwordTouched && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          passwordValidation.minLength
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordValidation.minLength
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          passwordValidation.hasUppercase
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordValidation.hasUppercase
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          passwordValidation.hasNumber
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordValidation.hasNumber
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        One number
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          passwordValidation.hasSymbol
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordValidation.hasSymbol
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        One special character (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* <!-- Confirm Password --> */}
              <div>
                <Label>
                  Confirm Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordTouched(true)}
                    disabled={loading}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>

                {/* Password Match Indicator */}
                {confirmPasswordTouched && confirmPassword.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          passwordsMatch
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordsMatch
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* <!-- Button --> */}
              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
