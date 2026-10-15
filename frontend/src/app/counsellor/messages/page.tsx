"use client";

import React from "react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { MessagingLayout } from "@/features/messaging/components/MessagingLayout";

export default function CounsellorMessagesPage() {
  return (
    <CounsellorLayout>
      <MessagingLayout isCounsellorView={true} />
    </CounsellorLayout>
  );
}
