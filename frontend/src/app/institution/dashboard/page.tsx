"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { InstitutionDashboardView } from "@/features/institutions/components/InstitutionDashboardView";

export default function InstitutionDashboardPage() {
  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <InstitutionDashboardView />
    </DashboardShell>
  );
}
