"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { Award, Star, MessageSquare } from "lucide-react";

export default function ParentReviewsPage() {
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
            title="Reviews & Counsellor Feedback"
            subtitle="Share feedback, ratings, and testimonials for career guidance sessions provided to your child."
          />

          <div className="p-12 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              No Pending Reviews
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-md mx-auto mb-6">
              Following completed counselling interactions, you can leave structured feedback and ratings here to help maintain high guidance standards.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
