"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { useFeatureAccess } from "../hooks/useFeatureAccess";
import { FEATURE_REGISTRY } from "../config/feature-registry.config";
import type { FeatureKey } from "../types/access-control.types";

export interface FeatureRouteGuardProps {
  /** Feature identifier required to view this route */
  featureKey: FeatureKey;
  /** Custom title for Access Denied screen */
  customTitle?: string;
  /** Custom explanation message */
  customMessage?: string;
  /** Fallback URL if user is denied access */
  fallbackUrl?: string;
  /** Page content to render when permitted */
  children: React.ReactNode;
}

/**
 * FeatureRouteGuard Component
 * Page-level route protection. Renders 403 Access Denied presentation
 * when the current user's role or permissions do not permit access to the feature.
 */
export function FeatureRouteGuard({
  featureKey,
  customTitle,
  customMessage,
  fallbackUrl,
  children,
}: FeatureRouteGuardProps) {
  const { canAccess, isLoading, userRole } = useFeatureAccess();
  const feature = FEATURE_REGISTRY[featureKey];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#0D7A5F] dark:text-[#52B788] animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Verifying security authorizations...
        </p>
      </div>
    );
  }

  const isPermitted = canAccess(featureKey);

  if (!isPermitted) {
    // Resolve appropriate fallback route based on role
    const defaultFallback =
      fallbackUrl ||
      (userRole === "CAREER_COUNSELLOR"
        ? "/counsellor/dashboard"
        : userRole === "PARTICIPANT"
        ? "/participant/dashboard"
        : userRole === "INSTITUTION_ADMIN"
        ? "/institution/dashboard"
        : userRole === "PARENT_GUARDIAN"
        ? "/parent/dashboard"
        : "/admin/dashboard");

    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#1A2E2C] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-500/5">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {customTitle || "Access Restricted"}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {customMessage ||
              `Your current account role (${userRole || "UNKNOWN"}) does not have the required permissions to access ${
                feature?.name || "this feature"
              }.`}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2.5">
            <Link
              href={defaultFallback}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D7A5F] hover:bg-[#0b634d] text-white text-sm font-semibold transition-all shadow-md shadow-[#0D7A5F]/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
