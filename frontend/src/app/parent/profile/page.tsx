"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { User, Shield, Mail, Phone, Calendar } from "lucide-react";

export default function ParentProfilePage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();
  const user = data?.data?.user;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6 max-w-4xl">
          <PageHeader
            title="Parent Guardian Profile"
            subtitle="View your account verification status and verified guardian credentials."
          />

          <div className="p-8 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E2EBE9] dark:border-[#1E3836]">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00B8D4] to-[#00BFA5] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#00BFA5]/25">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                  {user.email}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verified Guardian Persona</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836]">
                <span className="text-[11px] font-semibold text-[#526866] dark:text-[#9FB3B0] block mb-1">
                  Account Status
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {user.status || "ACTIVE"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836]">
                <span className="text-[11px] font-semibold text-[#526866] dark:text-[#9FB3B0] block mb-1">
                  Primary Role
                </span>
                <span className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  PARENT_GUARDIAN
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
