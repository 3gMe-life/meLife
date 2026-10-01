"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { StudentParentConnectView } from "@/features/parent-connect/components/StudentParentConnectView";

export default function StudentParentConnectPage() {
  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <StudentParentConnectView />
    </DashboardShell>
  );
}
