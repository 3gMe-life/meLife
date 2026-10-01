"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useInstitutionStudents, useInstitutionClasses } from "@/features/institutions/hooks/useInstitutionQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import {
  GraduationCap,
  Search,
  Filter,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  School,
  FileText,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function InstitutionStudentsPage() {
  const searchParams = useSearchParams();
  const initialClassId = searchParams.get("classId") || "ALL";

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState(initialClassId);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const { data: students = [], isLoading: isStudentsLoading, isError, refetch } = useInstitutionStudents(
    selectedClass !== "ALL" ? selectedClass : undefined
  );
  const { data: classes = [], isLoading: isClassesLoading } = useInstitutionClasses();

  const isLoading = isStudentsLoading || isClassesLoading;

  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      (stu.studentName && stu.studentName.toLowerCase().includes(search.toLowerCase())) ||
      (stu.studentEmail && stu.studentEmail.toLowerCase().includes(search.toLowerCase())) ||
      (stu.rollNumber && stu.rollNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      selectedStatus === "ALL" || stu.assessmentStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Student Directory & Rosters
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Manage enrolled learners, monitor evaluation progress, and inspect guardian links
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 p-4 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
            <input
              type="text"
              placeholder="Search by student name, email, roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
            >
              <option value="ALL">All Cohorts & Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
            >
              <option value="ALL">All Assessment Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NOT_STARTED">Not Started</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message="Unable to load student directory." onRetry={() => refetch()} />
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
            <Users className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              No students found
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto mb-4">
              {search || selectedClass !== "ALL" || selectedStatus !== "ALL"
                ? "Try adjusting your search criteria or filter options."
                : "Students enrolled in this institution will appear here."}
            </p>
            <Link
              href="/institution/classes"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#00BFA5] text-[#0A1A18] hover:bg-[#00A892] transition-colors"
            >
              <School className="w-4 h-4" />
              <span>Manage Cohorts</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] bg-[#F7FAF9] dark:bg-[#172B2A] text-[11px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                    <th className="py-3.5 px-5">Student</th>
                    <th className="py-3.5 px-4">Roll No.</th>
                    <th className="py-3.5 px-4">Cohort / Class</th>
                    <th className="py-3.5 px-4">Psychometric Status</th>
                    <th className="py-3.5 px-4">Parent Link</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECEA] dark:divide-[rgba(227,236,234,0.06)] text-xs">
                  {filteredStudents.map((stu) => (
                    <tr
                      key={stu.id}
                      className="hover:bg-[#F7FAF9]/60 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shrink-0">
                            {stu.studentName?.[0] || "S"}
                          </div>
                          <div>
                            <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9] block">
                              {stu.studentName || "Student"}
                            </span>
                            <span className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                              {stu.studentEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#526866] dark:text-[#9FB3B0]">
                        {stu.rollNumber || "—"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                          <School className="w-3 h-3" />
                          <span>{stu.className || "Unassigned"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {stu.assessmentStatus === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        ) : stu.assessmentStatus === "IN_PROGRESS" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" />
                            <span>In Progress</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                            <span>Not Started</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {stu.hasParentLinked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verified Link</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#728B88]">Unlinked</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/institution/reports?studentId=${stu.studentId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] hover:border-[#00BFA5] transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#00BFA5]" />
                          <span>View Report</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] bg-[#F7FAF9] dark:bg-[#172B2A] flex items-center justify-between text-xs text-[#728B88]">
              <span>Showing {filteredStudents.length} enrolled learners</span>
              <span className="font-semibold text-[#00BFA5]">Institution Scoped</span>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
