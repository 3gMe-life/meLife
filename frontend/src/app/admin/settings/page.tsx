"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/features/admin/components/shell/AdminLayout";
import { ArrowLeft, ShieldCheck, Database, Server } from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";

export default function AdminSettingsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();
  const user = data?.data?.user;

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState
          message="Authentication required to access Admin Settings."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-6 select-none animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#00BFA5] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </Link>
                <span className="text-xs text-[#728B88] dark:text-[#7D9491]">/</span>
                <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
                  Settings
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
                Platform Configuration & System Settings
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                Overview of runtime configuration, database connectivity, and RBAC governance parameters.
              </p>
            </div>
          </div>

          {/* System Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                RBAC Security Model
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Strict PostgreSQL row and role-based enforcement with Super Admin protection safeguards.
              </p>
              <Link href="/admin/roles" className="inline-block text-xs font-bold text-[#008F83] dark:text-[#00BFA5] underline pt-1">
                View Roles & Permissions
              </Link>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                Database & Migrations
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Live PostgreSQL database pool active with schema validation and verified seed catalog.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                API Gateway Status
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Express.js REST API running on port 5001 with JWT session management and rate limiting.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
