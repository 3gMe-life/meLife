"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useInstitutionStudents, useInstitutionClasses } from "@/features/institutions/hooks/useInstitutionQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import {
  FileText,
  Search,
  Download,
  School,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  ExternalLink,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function InstitutionReportsPage() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");

  const { data: students = [], isLoading: isStudentsLoading, isError, refetch } = useInstitutionStudents(
    selectedClass !== "ALL" ? selectedClass : undefined
  );
  const { data: classes = [], isLoading: isClassesLoading } = useInstitutionClasses();

  const isLoading = isStudentsLoading || isClassesLoading;

  const assessedStudents = students.filter(
    (stu) => stu.assessmentStatus === "COMPLETED" || stu.assessmentStatus === "IN_PROGRESS"
  );

  const filteredStudents = assessedStudents.filter((stu) => {
    const matchesSearch =
      (stu.studentName && stu.studentName.toLowerCase().includes(search.toLowerCase())) ||
      (stu.studentEmail && stu.studentEmail.toLowerCase().includes(search.toLowerCase())) ||
      (stu.rollNumber && stu.rollNumber.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Student & Cohort Psychometric Reports
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Access generated career evaluation dossiers, cognitive benchmarks, and strength matrices
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
              placeholder="Search by student name, roll number, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
            />
          </div>

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
        </div>

        {/* Content Body */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message="Unable to load reports directory." onRetry={() => refetch()} />
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
            <FileText className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              No reports available yet
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto mb-4">
              As students complete their assigned psychometric assessments, individual and batch dossiers will populate here.
            </p>
            <Link
              href="/institution/assessments"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#00BFA5] text-[#0A1A18] hover:bg-[#00A892] transition-colors"
            >
              <span>View Allocated Tests</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((stu) => (
              <div
                key={stu.id}
                className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                      {stu.className || "Cohort"}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors mb-1">
                    {stu.studentName}
                  </h3>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-4">
                    Roll: {stu.rollNumber || "—"} • {stu.studentEmail}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] mb-4 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#728B88]">Battery</span>
                      <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">Entrepreneur Development</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#728B88]">Aptitude Index</span>
                      <span className="font-bold text-[#00BFA5]">High Alignment</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] flex items-center justify-between text-xs">
                  <span className="text-[#728B88]">PDF Available</span>
                  <button
                    onClick={() => window.open(`/participant/reports?studentId=${stu.studentId}`, "_blank")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00BFA5]/15 hover:bg-[#00BFA5]/25 text-[#008F83] dark:text-[#00BFA5] font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Dossier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
