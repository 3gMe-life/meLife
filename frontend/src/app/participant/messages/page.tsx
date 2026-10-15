"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { MessagingLayout } from "@/features/messaging/components/MessagingLayout";

export default function ParticipantMessagesPage() {
  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <MessagingLayout isCounsellorView={false} />
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
