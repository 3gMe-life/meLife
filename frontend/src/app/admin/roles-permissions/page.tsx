"use client";

import React from "react";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminRolesView } from "@/features/admin/components/AdminRolesView";
import {
  LoadingState,
  ErrorState,
} from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function AdminRolesPermissionsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Roles & RBAC Governance."
          onRetry={() => refetch()}
        />
      ) : (
        <AdminRolesView />
      )}
    </AdminLayout>
  );
}
