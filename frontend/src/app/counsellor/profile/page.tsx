"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorProfileSettingsView } from "@/features/counsellors/components/CounsellorProfileSettingsView";

export default function CounsellorProfilePage() {
  return (
    <CounsellorLayout>
      <CounsellorProfileSettingsView />
    </CounsellorLayout>
  );
}
