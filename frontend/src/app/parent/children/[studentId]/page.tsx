"use client";

import React, { use } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ParentStudentDetailView } from "@/features/parent-connect/components/ParentStudentDetailView";

interface ParentStudentDetailPageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default function ParentStudentDetailPage({ params }: ParentStudentDetailPageProps) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      <ParentStudentDetailView studentId={studentId} />
    </DashboardShell>
  );
}
