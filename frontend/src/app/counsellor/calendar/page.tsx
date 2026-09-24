"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { CounsellorCalendarView } from "@/features/counsellors/components/CounsellorCalendarView";

export default function CounsellorCalendarPage() {
  return (
    <CounsellorLayout>
      <CounsellorCalendarView />
    </CounsellorLayout>
  );
}
