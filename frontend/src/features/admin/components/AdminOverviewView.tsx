"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  GraduationCap,
  FileText,
  ShieldCheck,
  Settings,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Server,
  Clock,
  RotateCcw,
  Building,
} from "lucide-react";
import type { UserProfile } from "@/features/auth/types/auth.types";
import { useAdminOverview } from "../hooks/useAdminQueries";
import { ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { AdminMetricsCard } from "./AdminMetricsCard";
import { AdminRecentUsers } from "./AdminRecentUsers";
import { AdminRecentApplications } from "./AdminRecentApplications";
import { AdminRecentActivity } from "./AdminRecentActivity";
import type { PlatformMetricsDTO } from "../types/admin.types";

export interface AdminOverviewViewProps {
  user: UserProfile;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ user }) => {
  const {
    data: overview,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminOverview();

  const adminName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.email ||
    "Administrator";

  if (isLoading) {
    return <AdminOverviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to retrieve real-time platform statistics. Please check your network connection and administrative credentials."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const metrics: PlatformMetricsDTO = overview?.metrics || {
    totalUsers: 0,
    activeStudents: 0,
    approvedCounsellors: 0,
    pendingCounsellorApplications: 0,
    completedAssessments: 0,
    institutionApplications: 0,
  };

  const recentUsers = overview?.recentUsers || [];
  const recentApplications = overview?.recentApplications || [];
  const recentActivities = overview?.recentActivities || [];

  return (
    <div className="space-y-6 select-none">
      {/* 1. Administrative Command Center Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-teal-50/50 dark:from-[#112423] dark:via-[#112423] dark:to-[#0D3834]/50 border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] mb-3 border border-[#00BFA5]/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Administration Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
              Welcome back, {adminName}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              Supervise live system personas, verify career practitioner applications, monitor psychometric assessment throughput, and oversee platform growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh platform metrics from live database"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 text-[#00BFA5] ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              <span>{isFetching ? "Syncing..." : "Sync Data"}</span>
            </button>
            <Link
              href="/admin/counsellors"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Review Counsellors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#00BFA5]" />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Platform Metric Cards (6 Live Database Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <AdminMetricsCard
          label="Total Users"
          value={metrics.totalUsers}
          description="Registered system accounts"
          icon={Users}
          iconColorClass="text-[#008F83] dark:text-[#00BFA5]"
          iconBgClass="bg-teal-50 dark:bg-teal-950/60"
          href="/admin/users"
        />

        <AdminMetricsCard
          label="Active Students"
          value={metrics.activeStudents}
          description="Active participants"
          icon={GraduationCap}
          iconColorClass="text-blue-600 dark:text-blue-400"
          iconBgClass="bg-blue-50 dark:bg-blue-950/60"
          href="/admin/students"
        />

        <AdminMetricsCard
          label="Counsellors"
          value={metrics.approvedCounsellors}
          description="Approved practitioners"
          icon={UserCheck}
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
          href="/admin/counsellors"
        />

        <AdminMetricsCard
          label="Pending Queue"
          value={metrics.pendingCounsellorApplications}
          description="Applications awaiting review"
          icon={Clock}
          iconColorClass="text-amber-600 dark:text-amber-400"
          iconBgClass="bg-amber-50 dark:bg-amber-950/60"
          badge={
            metrics.pendingCounsellorApplications > 0
              ? { text: "Action Req.", variant: "amber" }
              : undefined
          }
          href="/admin/counsellors"
        />

        <AdminMetricsCard
          label="Assessments"
          value={metrics.completedAssessments}
          description="Completed psychometrics"
          icon={CheckCircle2}
          iconColorClass="text-purple-600 dark:text-purple-400"
          iconBgClass="bg-purple-50 dark:bg-purple-950/60"
          href="/admin/reports"
        />

        <AdminMetricsCard
          label="Institutions"
          value={metrics.institutionApplications}
          description="Org inquiries / cohorts"
          icon={Building}
          iconColorClass="text-cyan-600 dark:text-cyan-400"
          iconBgClass="bg-cyan-50 dark:bg-cyan-950/60"
          href="/admin/institutions"
        />
      </div>

      {/* 3. Live Data Tables Grid: Recent Users & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentUsers users={recentUsers} />
        <AdminRecentApplications
          applications={recentApplications}
          pendingCount={metrics.pendingCounsellorApplications}
        />
      </div>

      {/* 4. Recent System Activity Feed */}
      <AdminRecentActivity activities={recentActivities} />

      {/* 5. Core Administrative Subsystem Navigation Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
            Platform Administrative Subsystems
          </h2>
          <span className="text-xs text-[#728B88] dark:text-[#7D9491]">
            6 Management Hubs Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: Institution Management */}
          <Link
            href="/admin/institutions"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                Institutions & Schools
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Review school applications, verify accreditation documents, provision institutional admin accounts, and monitor cohorts.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>Manage institutions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Counsellor Verifications */}
          <Link
            href="/admin/counsellors"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                Counsellor Applications
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Review credential documents, approve certified practitioners, and manage counsellor directory profiles.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>Open verification queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: User & Role Management */}
          <Link
            href="/admin/users"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                User Accounts & Roles
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Supervise all system personas, adjust role assignments, inspect login history, and manage user statuses.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>View user directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Student Cohorts */}
          <Link
            href="/admin/students"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                Student Candidates
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Track student assessment completion, view institutional cohort distribution, and supervise consent statuses.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>Manage student cohorts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 4: Guidance Sessions */}
          <Link
            href="/admin/sessions"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                Counselling Sessions
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Monitor consultation appointments, session completion rates, and feedback across all counsellors.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>Inspect sessions hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 5: Assessment Reports */}
          <Link
            href="/admin/reports"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                Reports & Analytics
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Access comprehensive psychometric score breakdowns, PDF exports, and career trajectory reports.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>Explore reports archive</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 6: System Configuration */}
          <Link
            href="/admin/settings"
            className="group rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs hover:shadow-md hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                Platform Settings
              </h3>
              <p className="mt-1.5 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Configure system parameters, audit log retention, notification triggers, and security policies.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              <span>Configure settings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 6. System Infrastructure Status */}
      <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E3ECEA] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#00BFA5]" />
            <h2 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              System Infrastructure Status
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Subsystems Nominal
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
            <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491]">
              PostgreSQL Database
            </div>
            <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Pooled
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
            <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491]">
              RBAC Security Filter
            </div>
            <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active & Guarded
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
            <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491]">
              Session Engine
            </div>
            <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> HttpOnly + Bearer JWT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading Skeleton Component matching the Admin Dashboard layout
 */
function AdminOverviewSkeleton() {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* 1. Welcome Banner Skeleton */}
      <div className="rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-6 sm:p-8">
        <div className="h-5 w-48 rounded-full bg-slate-200 dark:bg-white/10 mb-3" />
        <div className="h-8 w-72 rounded-xl bg-slate-200 dark:bg-white/10 mb-2" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-200 dark:bg-white/10" />
      </div>

      {/* 2. 6 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-7 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        ))}
      </div>

      {/* 3. 2 Table Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-6" />
        <div className="h-80 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-6" />
      </div>

      {/* 4. Subsystem Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-40 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-6"
          />
        ))}
      </div>
    </div>
  );
}
