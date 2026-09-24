"use client";

import React from "react";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminDashboardView } from "@/features/admin/components/AdminDashboardView";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <AdminDashboardView user={user} />
      )}
    </AdminLayout>
  );
}
