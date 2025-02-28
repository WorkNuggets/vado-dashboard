import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VADO Sign In",
  description: "This is Sign In Page for VADO Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
