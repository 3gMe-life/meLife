"use client";

import React from "react";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { CounsellorApplicationPendingView } from "@/features/counsellors/components/CounsellorApplicationPendingView";

export default function CounsellorApplicationPendingPage() {
  return (
    <ProtectedRouteGuard>
      <CounsellorApplicationPendingView />
    </ProtectedRouteGuard>
  );
}
