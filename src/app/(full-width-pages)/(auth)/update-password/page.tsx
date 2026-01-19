import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VADO Update Password",
  description: "Update your password",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
