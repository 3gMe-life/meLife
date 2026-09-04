"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { CounsellorListView } from "@/features/counsellors/components/CounsellorListView";

export default function ParticipantCounsellorsPage() {
  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <CounsellorListView />
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
