"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorDashboardView } from "@/features/counsellors/components/CounsellorDashboardView";

export default function CounsellorDashboardPage() {
  return (
    <CounsellorLayout>
      <CounsellorDashboardView />
    </CounsellorLayout>
  );
}
