"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorStudentsView } from "@/features/counsellors/components/CounsellorStudentsView";

export default function CounsellorStudentsPage() {
  return (
    <CounsellorLayout>
      <CounsellorStudentsView />
    </CounsellorLayout>
  );
}
