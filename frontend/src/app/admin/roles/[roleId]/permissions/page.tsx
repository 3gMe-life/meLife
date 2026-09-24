"use client";

import React, { use } from "react";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminRolePermissionsView } from "@/features/admin/components/AdminRolePermissionsView";
import {
  LoadingState,
  ErrorState,
} from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

interface PageProps {
  params: Promise<{ roleId: string }>;
}

export default function AdminRolePermissionsPage({ params }: PageProps) {
  const { roleId } = use(params);
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Role Permission Matrix."
          onRetry={() => refetch()}
        />
      ) : (
        <AdminRolePermissionsView roleIdOrName={roleId} />
      )}
    </AdminLayout>
  );
}
