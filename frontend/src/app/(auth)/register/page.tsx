import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | 3G ME LIFE",
  description:
    "Create your 3G MeLife account to discover strengths, explore educational pathways, and navigate career choices with confidence.",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
