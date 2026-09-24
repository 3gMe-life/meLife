"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorSessionsView } from "@/features/counsellors/components/CounsellorSessionsView";

export default function CounsellorSessionsPage() {
  return (
    <CounsellorLayout>
      <CounsellorSessionsView />
    </CounsellorLayout>
  );
}
