"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  School,
  Users,
  GraduationCap,
  Layers,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  Ban,
  Activity,
  Check,
  Globe,
  User,
  Shield,
  FileText,
} from "lucide-react";
import {
  useAdminInstitutionDetail,
  useUpdateInstitutionStatus,
} from "../hooks/useAdminQueries";
import { ErrorState, LoadingState } from "@/features/dashboard/components/common/LoadingState";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

interface AdminInstitutionDetailViewProps {
  institutionId: string;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "N/A";
  }
}

export const AdminInstitutionDetailView: React.FC<
  AdminInstitutionDetailViewProps
> = ({ institutionId }) => {
  const [activeTab, setActiveTab] = useState<"cohorts" | "students" | "admin">(
    "cohorts"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    data: detail,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminInstitutionDetail(institutionId);

  const updateStatusMutation = useUpdateInstitutionStatus();

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="py-12">
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to retrieve institution profile details."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { institution, classes = [], recentStudents = [], stats } = detail;

  const handleToggleStatus = async () => {
    try {
      const nextStatus = !institution.isActive;
      await updateStatusMutation.mutateAsync({
        id: institution.id,
        isActive: nextStatus,
      });
      setToastMessage(
        `Institution ${institution.name} is now ${
          nextStatus ? "Active" : "Suspended"
        }.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to toggle status.";
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const capacityPercent = Math.min(
    100,
    Math.round(
      ((stats?.totalStudents || 0) / (institution.studentCapacity || 1)) * 100
    )
  );

  return (
    <div className="space-y-6 select-none">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E3ECEA] dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/institutions"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#00BFA5] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Institutions Directory</span>
            </Link>
            <span className="text-xs text-[#728B88] dark:text-[#7D9491]">/</span>
            <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              {institution.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
              {institution.name}
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[#008F83] dark:text-[#00BFA5] font-bold border border-[#E3ECEA] dark:border-white/10">
              {institution.code}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                institution.isActive
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  institution.isActive ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {institution.isActive ? "Active Partner" : "Suspended"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-0.5">
            {[institution.city, institution.state, institution.country]
              .filter(Boolean)
              .join(", ") || "Institution Overview"}{" "}
            • Enrolled Since {formatDate(institution.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={updateStatusMutation.isPending}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              institution.isActive
                ? "bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>
              {institution.isActive ? "Suspend Access" : "Activate Institution"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-all cursor-pointer"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 text-[#00BFA5] ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Total Students
            </span>
            <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {stats?.totalStudents || 0}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Active enrolled learners
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Active Cohorts
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {stats?.totalClasses || classes.length}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Classes & grade sections
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Licensed Capacity
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {capacityPercent}%
            </span>
            <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
              ({stats?.totalStudents || 0}/{institution.studentCapacity})
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
            <div
              className="bg-[#00BFA5] h-1 rounded-full"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Assessment Rate
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {stats?.assessmentCompletionRate || 88}%
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Psychometric completion
          </p>
        </div>
      </div>

      {/* 3. Institution Summary Card */}
      <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-5 shadow-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3 flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Administrative Profile & Contact Data</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
              Official Email
            </span>
            <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[#00BFA5]" />
              {institution.contactEmail}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
              Phone / Helpline
            </span>
            <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-[#00BFA5]" />
              {institution.phone || "Not specified"}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
              Designated Admin Account
            </span>
            <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-[#00BFA5]" />
              {institution.adminUser?.name || "Institution Admin"} (
              {institution.adminUser?.email})
            </span>
          </div>
        </div>
      </div>

      {/* 4. Tabbed Detail Lists */}
      <div className="space-y-4">
        {/* Tab Controls */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("cohorts")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cohorts"
                ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cohorts & Classes ({classes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "students"
                ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Roster ({recentStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "admin"
                ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Features</span>
          </button>
        </div>

        {/* Tab 1: Cohorts */}
        {activeTab === "cohorts" && (
          <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs overflow-hidden">
            {classes.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  title="No Cohorts Provisioned"
                  description="This institution currently has no classes or cohorts created."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E3ECEA]/60 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] bg-[#F4F8F7]/50 dark:bg-white/5">
                      <th className="py-3 pl-6 pr-3">Cohort Name</th>
                      <th className="py-3 px-3">Grade & Division</th>
                      <th className="py-3 px-3">Academic Year</th>
                      <th className="py-3 px-3">Enrolled Learners</th>
                      <th className="py-3 px-3">Teacher Coordinator</th>
                      <th className="py-3 pl-3 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                    {classes.map((cls) => (
                      <tr
                        key={cls.id}
                        className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 pl-6 pr-3 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                          {cls.name}
                        </td>
                        <td className="py-4 px-3 text-[#526866] dark:text-[#9FB3B0] font-semibold">
                          Grade {cls.gradeLevel} - {cls.division}
                        </td>
                        <td className="py-4 px-3 font-mono text-[#728B88] dark:text-[#7D9491]">
                          {cls.academicYear}
                        </td>
                        <td className="py-4 px-3 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                          {cls.studentCount} Students
                        </td>
                        <td className="py-4 px-3 text-[#526866] dark:text-[#9FB3B0]">
                          {cls.coordinatorName || "Unassigned"}
                        </td>
                        <td className="py-4 pl-3 pr-6 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cls.isActive
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : "bg-slate-200 dark:bg-white/10 text-slate-600"
                            }`}
                          >
                            {cls.isActive ? "Active" : "Archived"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Students */}
        {activeTab === "students" && (
          <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs overflow-hidden">
            {recentStudents.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  title="No Students Enrolled"
                  description="No students have enrolled under this institution yet."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E3ECEA]/60 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] bg-[#F4F8F7]/50 dark:bg-white/5">
                      <th className="py-3 pl-6 pr-3">Student Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Roll Number</th>
                      <th className="py-3 px-3">Enrollment Date</th>
                      <th className="py-3 pl-3 pr-6 text-right">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                    {recentStudents.map((st) => (
                      <tr
                        key={st.id}
                        className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 pl-6 pr-3 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                          {st.name}
                        </td>
                        <td className="py-4 px-3 text-[#526866] dark:text-[#9FB3B0]">
                          {st.email}
                        </td>
                        <td className="py-4 px-3 font-mono text-[#728B88] dark:text-[#7D9491]">
                          {st.rollNumber || "N/A"}
                        </td>
                        <td className="py-4 px-3 text-[#526866] dark:text-[#9FB3B0]">
                          {formatDate(st.joinedAt)}
                        </td>
                        <td className="py-4 pl-3 pr-6 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Security & Features */}
        {activeTab === "admin" && (
          <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
              Institution RBAC & Features Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Student Directory & Bulk Import</span>
                </div>
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-1">
                  Enables institutional admin to manage student rosters and generate registration invitations.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Cohort Assessments & Vouchers</span>
                </div>
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-1">
                  Allows allocating psychometric test batteries to classes in batch.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Counsellor & Guidance Connect</span>
                </div>
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-1">
                  Permits assigning institutional students to certified career practitioners.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aggregate Analytics & Reports</span>
                </div>
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-1">
                  Cohort readiness distributions and psychometric trait comparisons.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
