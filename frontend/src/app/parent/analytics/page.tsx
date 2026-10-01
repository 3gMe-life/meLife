"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useConnectedChildrenQuery } from "@/features/parent-connect/hooks/useParentConnectQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { BarChart3, TrendingUp, Sparkles, BrainCircuit, GraduationCap, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ParentAnalyticsPage() {
  const { data: authData, isLoading: isAuthLoading } = useCurrentUserQuery();
  const { data: childrenData, isLoading: isChildrenLoading, isError, refetch } = useConnectedChildrenQuery();

  const user = authData?.data?.user;
  const children = Array.isArray(childrenData?.data) ? childrenData.data : [];
  const isLoading = isAuthLoading || isChildrenLoading;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6 max-w-7xl">
          <PageHeader
            title="Children Psychometric & Career Analytics"
            subtitle="Cross-sectional insight into your children's assessment performance, aptitude benchmarks, and career alignment."
          />

          {children.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] text-center max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5] flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                No Linked Children Yet
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-5">
                Connect your child using their voucher code to start monitoring their psychometric growth.
              </p>
              <Link
                href="/parent/connect"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#0D1C1B] text-xs font-bold shadow-md shadow-[#00BFA5]/20 hover:opacity-95 transition-all"
              >
                <span>Connect Child</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      Connected Children
                    </span>
                    <div className="p-2 rounded-xl bg-[#00BFA5]/10 text-[#00BFA5]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                    {children.length}
                  </div>
                  <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-1">
                    Active student profiles
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      Total Assessments
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                    {children.reduce((acc: number, c: any) => acc + (c.completedAssessmentsCount || 0), 0)}
                  </div>
                  <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-1">
                    Evaluations completed
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      Career Alignment Index
                    </span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                      <Compass className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                    88.4%
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>High clarity index</span>
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      AI Career Matches
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                    12+
                  </div>
                  <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-1">
                    Curated recommendations
                  </p>
                </div>
              </div>

              {/* Children Overview List */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-4">
                  Student Assessment Progress Overview
                </h3>
                <div className="divide-y divide-[#E2EBE9] dark:divide-[#1E3836]">
                  {children.map((child: any) => (
                    <div
                      key={child.studentId}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00B8D4] to-[#00BFA5] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#00BFA5]/20">
                          {child.firstName?.charAt(0)}
                          {child.lastName?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                            {child.firstName} {child.lastName}
                          </h4>
                          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                            {child.educationStage || "Student"} • Grade {child.gradeLevel || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/parent/children/${child.studentId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:border-[#00BFA5] transition-colors"
                        >
                          <span>View Detail & Metrics</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#00BFA5]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
