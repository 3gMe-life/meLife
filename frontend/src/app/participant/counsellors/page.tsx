"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { FeatureRouteGuard } from "@/features/access-control/components/FeatureRouteGuard";
import { CounsellorListView } from "@/features/counsellors/components/CounsellorListView";

export default function ParticipantCounsellorsPage() {
  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <FeatureRouteGuard featureKey="participant.counsellor">
          <CounsellorListView />
        </FeatureRouteGuard>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
