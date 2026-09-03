"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useCurrentUserQuery } from "../../auth/hooks/useCurrentUserQuery";
import { resolveDashboardRoute } from "../../auth/constants/auth.constants";
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
      if (pathname !== "/participant/onboarding") {
        router.replace("/participant/onboarding");
        return;
      }
    }
  }, [user, role, onboarding, isLoading, isError, allowedRoles, router, pathname]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center text-[#172B2A] dark:text-[#F7FAF9] select-none transition-colors duration-200">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center shadow-xl shadow-[#00BFA5]/25 mb-5 animate-pulse">
            <span className="text-xl font-black tracking-wider text-[#172B2A]">3G</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#526866] dark:text-[#9FB3B0]">
            <Loader2 className="w-4 h-4 animate-spin text-[#00BFA5]" />
            <span>Authenticating 3G MeLife session...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error / Unauthenticated fallback
  if (isError || !user) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center text-[#172B2A] dark:text-[#F7FAF9] p-4 transition-colors duration-200">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-400 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold mb-1">Session Required</h2>
        <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-4">
          Please sign in with your 3G MeLife credentials to continue.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
