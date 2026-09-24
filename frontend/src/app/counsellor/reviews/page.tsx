"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorReviewsView } from "@/features/counsellors/components/CounsellorReviewsView";

export default function CounsellorReviewsPage() {
  return (
    <CounsellorLayout>
      <CounsellorReviewsView />
    </CounsellorLayout>
  );
}
