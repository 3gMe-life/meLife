"use client";

import React, { Suspense } from "react";
import { ParentConnectRedemptionView } from "@/features/parent-connect/components/ParentConnectRedemptionView";
import { LoadingState } from "@/features/dashboard/components/common/LoadingState";

export default function ParentConnectPublicPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ParentConnectRedemptionView />
    </Suspense>
  );
}
