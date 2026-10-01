"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { AdminInstitutionDetailView } from "@/features/admin/components/AdminInstitutionDetailView";
import {
  LoadingState,
  ErrorState,
} from "@/features/dashboard/components/common/LoadingState";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export default function AdminInstitutionDetailPage() {
  const params = useParams();
  const institutionId = typeof params?.id === "string" ? params.id : "";

  const { data, isLoading, isError, refetch } = useCurrentUserQuery();
  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to view Institution details."
          onRetry={() => refetch()}
        />
      ) : (
        <AdminInstitutionDetailView institutionId={institutionId} />
      )}
    </AdminLayout>
  );
}
