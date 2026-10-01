"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ParentReportsView } from "@/features/parent-connect/components/ParentReportsView";
import { LoadingState } from "@/features/dashboard/components/common/LoadingState";
import { ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function ParentReportsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <ParentReportsView user={user} />
      )}
    </DashboardShell>
  );
}
