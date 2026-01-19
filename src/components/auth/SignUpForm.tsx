"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import React, { useState } from "react";
import Back from "./Back";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
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

  // Calculate password strength score (0-4)
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

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up with Google");
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isChecked) {
      setError("You must agree to the Terms and Conditions");
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

      // Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        // Check for specific error types
        if (signUpError.message.includes("already registered")) {
          throw new Error("An account with this email already exists. Please sign in instead.");
        }
        throw signUpError;
      }

      // Check if user was actually created (Supabase returns user even if already exists)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }

      if (data.user) {
        // Check if @vadoapp.com email for auto-agent approval
        const isVadoEmail = email.endsWith("@vadoapp.com");

        // Create profile with full_name
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: `${firstName} ${lastName}`,
          email: email,
          is_agent: isVadoEmail, // Auto-approve @vadoapp.com emails as agents
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        // Check if email confirmation is required
        const emailConfirmationRequired = !data.session; // No session means confirmation is required

        if (isVadoEmail) {
          if (emailConfirmationRequired) {
            setSuccess(
              "Account created successfully! Please check your email to verify your account, then you can sign in. If you don't receive an email, check your spam folder or contact support@vadoapp.com."
            );
          } else {
            setSuccess(
              "Account created successfully! You can now sign in."
            );
          }
        } else {
          if (emailConfirmationRequired) {
            setSuccess(
              "Account created! Please check your email to verify your account. Note: Only @vadoapp.com email addresses have agent access. Contact support@vadoapp.com to become an agent."
            );
          } else {
            setSuccess(
              "Account created! However, only @vadoapp.com email addresses have agent access. Please contact support@vadoapp.com to become an agent."
            );
          }
        }

        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsChecked(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <Back className="w-full max-w-md sm:pt-10 mx-auto mb-5" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
            {error && (
              <div className="mt-3 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-3 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                {success}
              </div>
            )}
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                type="button"
                className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                {loading ? "Signing up..." : "Sign up with Google"}
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={handleEmailSignUp}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
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
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
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
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span>{" "}
                    and our <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5 space-y-2">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
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
    </div>
  );
}
