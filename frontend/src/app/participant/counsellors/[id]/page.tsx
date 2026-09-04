"use client";

import React, { use } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { CounsellorProfileView } from "@/features/counsellors/components/CounsellorProfileView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CounsellorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <CounsellorProfileView counsellorId={resolvedParams.id} />
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
