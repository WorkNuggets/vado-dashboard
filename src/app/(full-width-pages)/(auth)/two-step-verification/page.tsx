import OtpForm from "@/components/auth/OtpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "VADO Two Step Verification Page",
  description: "This is SignUp Page TailAdmin Dashboard Template",
  // other metadata
};

export default function OtpVerification() {
  return <OtpForm />;
}
