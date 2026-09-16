"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { StudentProfileSettingsView } from "@/features/participants/components/settings/StudentProfileSettingsView";

export default function ParticipantSettingsPage() {
  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <div className="space-y-6">
        <PageHeader
          title="Student Profile & Calibration Settings"
          subtitle="Manage your personal identity, educational benchmark calibration, evaluation preferences, and account security."
        />

        <StudentProfileSettingsView />
      </div>
    </DashboardShell>
  );
}
