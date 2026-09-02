"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ParticipantDashboardView } from "@/features/dashboard/components/participant/ParticipantDashboardView";
import { LoadingState } from "@/features/dashboard/components/common/LoadingState";
import { ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function ParticipantDashboardPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;
  const educationStage = data?.data?.onboarding?.educationStage;

  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <ParticipantDashboardView
          user={user}
          educationStage={educationStage}
        />
      )}
    </DashboardShell>
  );
}
