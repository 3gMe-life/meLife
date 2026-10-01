"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { Inbox, MessageSquare, ShieldCheck, Clock } from "lucide-react";

export default function ParentMessagesPage() {
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
            title="Messages & Counsellor Communication"
            subtitle="Direct communication channel with your child's assigned certified career counsellors."
          />

          <div className="p-12 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5] flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              No Unread Messages
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto mb-6">
              When a career counsellor or school advisor sends an update regarding your child's psychometric evaluation or guidance notes, it will appear here.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] text-[#526866] dark:text-[#9FB3B0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>End-to-End Encrypted Communications</span>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
