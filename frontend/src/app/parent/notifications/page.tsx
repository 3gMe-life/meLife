"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { Bell, CheckCheck, Sparkles, ShieldCheck } from "lucide-react";

export default function ParentNotificationsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();
  const user = data?.data?.user;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6 max-w-5xl">
          <PageHeader
            title="Notifications & Activity Feed"
            subtitle="Real-time alerts on child assessment completions, invitation links, and session scheduling."
          />

          <div className="p-6 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2EBE9] dark:border-[#1E3836]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#00BFA5]" />
                <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  Recent Activity
                </span>
              </div>
              <button className="text-[11px] font-semibold text-[#00BFA5] hover:underline flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#00BFA5]/10 text-[#00BFA5] shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  Parent Account Verified
                </h4>
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                  Welcome to 3G MeLife Parent Portal. You have secure access to linked children profiles and assessment reports.
                </p>
                <span className="text-[10px] text-[#738A87] mt-2 block">Just now</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
