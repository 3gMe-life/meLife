"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { InstitutionClassesView } from "@/features/institutions/components/InstitutionClassesView";

export default function InstitutionCohortsPage() {
  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <InstitutionClassesView />
    </DashboardShell>
  );
}
