"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useInstitutionOverview } from "@/features/institutions/hooks/useInstitutionQueries";
import { InstitutionOverviewStats } from "@/features/institutions/components/InstitutionOverviewStats";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { BarChart3, TrendingUp, Sparkles, BrainCircuit, School, RefreshCw } from "lucide-react";

export default function InstitutionAnalyticsPage() {
  const { data: overview, isLoading, isError, refetch, isRefetching } = useInstitutionOverview();

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Institutional Analytics & Performance Insights
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Cohort-level psychometric trends, completion rates, and guidance session telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError || !overview ? (
          <ErrorState message="Unable to load institution analytics." onRetry={() => refetch()} />
        ) : (
          <div className="space-y-6">
            <InstitutionOverviewStats stats={overview.stats} institution={overview.institution} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      Aptitude Alignment Index
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                      Distribution across STEM, Commerce, Arts & Entrepreneurship
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-[#526866] dark:text-[#9FB3B0]">Entrepreneurial Aptitude (EDT)</span>
                      <span className="text-[#172B2A] dark:text-[#F7FAF9]">84% High Potential</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E3ECEA] dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00BFA5] to-[#00C896] w-[84%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-[#526866] dark:text-[#9FB3B0]">STEM & Analytical Logic</span>
                      <span className="text-[#172B2A] dark:text-[#F7FAF9]">72% Average</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E3ECEA] dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[72%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-[#526866] dark:text-[#9FB3B0]">Commerce & Managerial Aptitude</span>
                      <span className="text-[#172B2A] dark:text-[#F7FAF9]">68% Emerging</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E3ECEA] dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-500 w-[68%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      Guidance Intervention Health
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                      Counselling session engagement & guardian onboarding
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#728B88]">Total Active Cohorts</span>
                    <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">{overview.stats.totalClasses} Classes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#728B88]">Enrolled Students</span>
                    <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">{overview.stats.totalStudents} Learners</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#728B88]">Assessment Completion</span>
                    <span className="font-bold text-[#00BFA5]">{overview.stats.assessmentCompletionRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
