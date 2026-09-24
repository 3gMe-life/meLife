"use client";

import React from "react";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminCounsellorApplicationsView } from "@/features/admin/components/AdminCounsellorApplicationsView";
import {
  LoadingState,
  ErrorState,
} from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function AdminCounsellorsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Counsellor Verification Portal."
          onRetry={() => refetch()}
        />
      ) : (
        <AdminCounsellorApplicationsView />
      )}
    </AdminLayout>
  );
}
