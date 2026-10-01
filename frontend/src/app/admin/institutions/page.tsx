"use client";

import React from "react";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminInstitutionApplicationsView } from "@/features/admin/components/AdminInstitutionApplicationsView";
import {
  LoadingState,
  ErrorState,
} from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function AdminInstitutionsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();

  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Institution Management Portal."
          onRetry={() => refetch()}
        />
      ) : (
        <AdminInstitutionApplicationsView />
      )}
    </AdminLayout>
  );
}
