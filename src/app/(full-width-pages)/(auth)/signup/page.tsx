import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VADO Sign Up Page",
  description: "This is Sign Up Page VADO Dashboard",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
