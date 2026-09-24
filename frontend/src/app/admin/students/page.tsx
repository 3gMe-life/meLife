"use client";

import React from "react";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminUsersView } from "@/features/admin/components/AdminUsersView";
import {
  LoadingState,
  ErrorState,
} from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function AdminStudentsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Student Cohort Directory."
          onRetry={() => refetch()}
        />
      ) : (
        <AdminUsersView
          initialRole="PARTICIPANT"
          breadcrumbLabel="Students Directory"
          title="Student Cohorts & Assessment Participants"
          subtitle="Supervise registered learners, check assessment completions, and inspect individual psychometric and career profiles."
        />
      )}
    </AdminLayout>
  );
}
