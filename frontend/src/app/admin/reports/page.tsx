"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { FileText, ArrowLeft } from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";

export default function AdminReportsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();
  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Reports Management."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-6 select-none animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#00BFA5] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </Link>
                <span className="text-xs text-[#728B88] dark:text-[#7D9491]">/</span>
                <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
                  Reports
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
                Psychometric & Career Reports Hub
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                Inspect generated psychometric profiles, career alignment indexes, and downloadable PDF reports.
              </p>
            </div>
          </div>

          {/* Hub Content Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto shadow-xs">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Platform Career Reports Catalog
            </h2>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              To inspect individual student assessments and full explainable RIASEC / skill discovery results, use the{" "}
              <Link href="/admin/users?role=PARTICIPANT" className="text-[#008F83] dark:text-[#00BFA5] font-bold underline">
                Student Directory
              </Link>{" "}
              or search individual learner accounts.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/admin/students"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-xs hover:shadow-md transition-all"
              >
                Inspect Student Cohorts
              </Link>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
