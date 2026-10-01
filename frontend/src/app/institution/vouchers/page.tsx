"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useInstitutionProfile } from "@/features/institutions/hooks/useInstitutionQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { Ticket, ShieldCheck, CheckCircle2, Zap } from "lucide-react";

export default function InstitutionVouchersPage() {
  const { data: profile, isLoading, isError, refetch } = useInstitutionProfile();

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Assessment Vouchers & Credits
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Institutional quota, student evaluation license capacity, and voucher codes
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError || !profile ? (
          <ErrorState message="Unable to load voucher license details." onRetry={() => refetch()} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                  Licensed Student Capacity
                </span>
                <div className="p-2 rounded-xl bg-[#00BFA5]/10 text-[#00BFA5]">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                {profile.studentCapacity?.toLocaleString() || 1500}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Active Institutional Tier
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                  Assessment Battery License
                </span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                Unlimited
              </div>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
                EDT & Psychometric Suites
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                  License Validity
                </span>
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                2026-2027
              </div>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">
                Full Academic Cycle
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
