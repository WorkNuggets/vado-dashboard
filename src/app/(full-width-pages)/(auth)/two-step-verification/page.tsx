import OtpForm from "@/components/auth/OtpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "VADO Two Step Verification Page",
  description: "This is Sign Up Page VADO Dashboard",
  // other metadata
};

export default function OtpVerification() {
  return <OtpForm />;
}
