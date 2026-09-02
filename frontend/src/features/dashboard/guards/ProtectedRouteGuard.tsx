"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useCurrentUserQuery } from "../../auth/hooks/useCurrentUserQuery";
import { resolveDashboardRoute } from "../../auth/constants/auth.constants";
import { StudentOnboardingModal } from "../../auth/components/StudentOnboardingModal";
import { useAuthFlowStore } from "../../auth/store/auth-flow.store";
import type { UserRole } from "../../auth/types/auth.types";

interface ProtectedRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRouteGuard({
  children,
  allowedRoles,
}: ProtectedRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useCurrentUserQuery();
  const setOnboardingModalOpen = useAuthFlowStore((s) => s.setOnboardingModalOpen);

  const user = data?.data?.user;
  const role = data?.data?.role;
  const onboarding = data?.data?.onboarding;

  useEffect(() => {
    if (isLoading) return;

    // 1. Not authenticated -> Redirect to login
    if (isError || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Role restriction check -> Redirect to authorized dashboard
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      const authorizedRoute = resolveDashboardRoute(role);
      router.replace(authorizedRoute);
      return;
    }

    // 3. Participant Onboarding Check
    if (role === "PARTICIPANT" && onboarding && !onboarding.completed) {
      setOnboardingModalOpen(true);
    }
  }, [user, role, onboarding, isLoading, isError, allowedRoles, router, pathname, setOnboardingModalOpen]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center text-white select-none">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center shadow-xl shadow-[#2563EB]/25 mb-5 animate-pulse">
            <span className="text-xl font-black tracking-wider text-white">3G</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
            <Loader2 className="w-4 h-4 animate-spin text-[#14B8A6]" />
            <span>Authenticating 3G MeLife session...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error / Unauthenticated fallback
  if (isError || !user) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold mb-1">Session Required</h2>
        <p className="text-xs text-slate-400 mb-4">
          Please sign in with your 3G MeLife credentials to continue.
        </p>
      </div>
    );
  }

  return (
    <>
      <StudentOnboardingModal />
      {children}
    </>
  );
}
