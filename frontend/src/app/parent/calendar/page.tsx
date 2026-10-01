"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { Calendar as CalendarIcon, Clock, Video, UserCheck } from "lucide-react";

export default function ParentCalendarPage() {
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
            title="Guidance Calendar & Appointments"
            subtitle="Scheduled counselling sessions, debriefing meetings, and psychometric review calls."
          />

          <div className="p-12 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5] flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              No Upcoming Guidance Sessions
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-md mx-auto mb-6">
              When a certified career counsellor schedules an assessment debrief or 1-on-1 guidance appointment for your child, calendar details and video links will be synchronized here.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
