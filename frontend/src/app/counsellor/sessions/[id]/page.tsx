"use client";

import React, { use } from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorSessionDetailView } from "@/features/counsellors/components/CounsellorSessionDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CounsellorSessionDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <CounsellorLayout>
      <CounsellorSessionDetailView sessionId={resolvedParams.id} />
    </CounsellorLayout>
  );
}
