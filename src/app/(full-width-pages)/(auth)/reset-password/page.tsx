import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "VADO Reset Password",
  description:
    "This is Password Reset Page Dashboard Template",
  // other metadata
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
