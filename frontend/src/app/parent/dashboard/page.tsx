"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ParentDashboardView } from "@/features/parent-connect/components/ParentDashboardView";
import { LoadingState } from "@/features/dashboard/components/common/LoadingState";
import { ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function ParentDashboardPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <ParentDashboardView user={user} />
      )}
    </DashboardShell>
  );
}
