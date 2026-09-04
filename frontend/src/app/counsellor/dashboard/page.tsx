"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { CounsellorDashboardView } from "@/features/counsellors/components/CounsellorDashboardView";

export default function CounsellorDashboardPage() {
  return (
    <ProtectedRouteGuard allowedRoles={["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"]}>
      <DashboardShell allowedRoles={["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"]}>
        <CounsellorDashboardView />
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
