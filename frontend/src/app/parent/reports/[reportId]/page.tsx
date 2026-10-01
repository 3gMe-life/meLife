"use client";

import React, { use } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ParentReportDetailView } from "@/features/parent-connect/components/ParentReportDetailView";

interface ParentReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default function ParentReportDetailPage({ params }: ParentReportDetailPageProps) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.reportId;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      <ParentReportDetailView reportId={reportId} />
    </DashboardShell>
  );
}
