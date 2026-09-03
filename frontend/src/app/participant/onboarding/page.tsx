"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { ParticipantOnboardingWizard } from "@/features/participants/components/onboarding/ParticipantOnboardingWizard";
import { ThemeToggle } from "@/features/dashboard/components/shell/ThemeToggle";

export default function ParticipantOnboardingPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useCurrentUserQuery();

  const user = data?.data?.user;
  const role = data?.data?.role;
  const onboarding = data?.data?.onboarding;

  useEffect(() => {
    if (isLoading) return;

    // 1. Not logged in -> Redirect to login
    if (isError || !user) {
      router.replace("/login?redirect=/participant/onboarding");
      return;
    }

    // 2. If already onboarded, send directly to participant dashboard
    if (role === "PARTICIPANT" && onboarding?.completed) {
      router.replace("/participant/dashboard");
    }
  }, [user, role, onboarding, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center text-[#172B2A] dark:text-[#F7FAF9]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00BFA5] mb-3" />
        <p className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
          Verifying participant session...
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#F7FAF9] dark:bg-[#0D1C1B] text-[#172B2A] dark:text-[#F7FAF9] flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Bar */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Calibration</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Center Wizard */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex items-center justify-center my-auto py-4">
        <ParticipantOnboardingWizard />
      </main>

      {/* Sub-footer */}
      <footer className="w-full max-w-4xl mx-auto pt-6 text-center text-xs text-[#728B88] dark:text-[#9FB3B0]/60">
        <p>© {new Date().getFullYear()} 3G ME LIFE. Psychometric Assessment & Career Guidance Platform.</p>
      </footer>
    </div>
  );
}
