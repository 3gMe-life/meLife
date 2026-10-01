"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import {
  useInstitutionAssessments,
  useInstitutionClasses,
  useAssignInstitutionAssessment,
} from "@/features/institutions/hooks/useInstitutionQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import {
  ClipboardCheck,
  PlusCircle,
  School,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const AVAILABLE_TEST_CATALOG = [
  {
    code: "ENTREPRENEUR_DEVELOPMENT_TEST",
    title: "Entrepreneur Development Test (EDT)",
    description: "Evaluates entrepreneurial aptitude, opportunity recognition, risk tolerance, and innovative mindset.",
    category: "Career & Mindset Evaluation",
    duration: "25-30 mins",
    questionsCount: 30,
  },
  {
    code: "SKILL_FINDER",
    title: "Skill Finder Aptitude Assessment",
    description: "Comprehensive multi-domain cognitive and behavioral skill mapper across technical and human skills.",
    category: "Psychometric Aptitude",
    duration: "35 mins",
    questionsCount: 45,
  },
];

export default function InstitutionAssessmentsPage() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssessmentCode, setSelectedAssessmentCode] = useState("ENTREPRENEUR_DEVELOPMENT_TEST");
  const [targetClassId, setTargetClassId] = useState("");
  const [deadline, setDeadline] = useState("");

  const { data: allocations = [], isLoading: isAssessLoading, isError, refetch } = useInstitutionAssessments();
  const { data: classes = [], isLoading: isClassesLoading } = useInstitutionClasses();
  const assignMutation = useAssignInstitutionAssessment();

  const isLoading = isAssessLoading || isClassesLoading;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCatalogItem = AVAILABLE_TEST_CATALOG.find((t) => t.code === selectedAssessmentCode);
    assignMutation.mutate(
      {
        assessmentCode: selectedAssessmentCode,
        classId: targetClassId || undefined,
        title: selectedCatalogItem?.title || selectedAssessmentCode,
        deadline: deadline || undefined,
      },
      {
        onSuccess: () => {
          setIsAssignModalOpen(false);
          setTargetClassId("");
          setDeadline("");
        },
      }
    );
  };

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Psychometric Assessment Allocations
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Manage battery allocations, test schedules, and student completion metrics
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:from-[#00A892] hover:to-[#00B285] text-[#0A1A18] font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Allocate Assessment</span>
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message="Unable to load institution assessment allocations." onRetry={() => refetch()} />
        ) : (
          <div className="space-y-6">
            {/* Active Allocations Grid */}
            <div>
              <h2 className="text-sm font-bold text-[#526866] dark:text-[#9FB3B0] uppercase tracking-wider mb-3">
                Active Cohort Allocations ({allocations.length})
              </h2>

              {allocations.length === 0 ? (
                <div className="py-12 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
                  <BrainCircuit className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
                  <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    No assessments assigned yet
                  </h3>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto mb-4">
                    Assign a psychometric battery to a cohort or to all students in this institution.
                  </p>
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#00BFA5] text-[#0A1A18] hover:bg-[#00A892] transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Assign First Test</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {allocations.map((a) => {
                    const completionPct =
                      a.totalAssigned > 0 ? Math.round((a.completedCount / a.totalAssigned) * 100) : 0;
                    return (
                      <div
                        key={a.id}
                        className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                              {a.assessmentCode === "ENTREPRENEUR_DEVELOPMENT_TEST" ? "EDT Active" : "Active"}
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{a.status}</span>
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                            {a.title}
                          </h3>
                          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-4">
                            Target Cohort:{" "}
                            <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                              {a.className || "All Enrolled Students"}
                            </span>
                          </p>

                          {/* Progress Meter */}
                          <div className="space-y-1.5 p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] mb-4 text-xs">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-[#728B88]">Evaluations Completed</span>
                              <span className="text-[#172B2A] dark:text-[#F7FAF9]">
                                {a.completedCount} / {a.totalAssigned} ({completionPct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#E3ECEA] dark:bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#00BFA5] to-[#00C896] rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(8, completionPct))}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] flex items-center justify-between text-xs">
                          <Link
                            href="/institution/reports"
                            className="font-bold text-[#00BFA5] hover:underline flex items-center gap-1"
                          >
                            <span>View Cohort Reports</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Assessment Catalog Details */}
            <div className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                Available Psychometric Catalog
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-5">
                Standardized batteries available for institutional allocation
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_TEST_CATALOG.map((cat) => (
                  <div
                    key={cat.code}
                    className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                          {cat.category}
                        </span>
                        <span className="text-[11px] text-[#728B88] font-medium">{cat.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.06)] flex items-center justify-between">
                      <span className="text-xs text-[#728B88]">{cat.questionsCount} Questions</span>
                      <button
                        onClick={() => {
                          setSelectedAssessmentCode(cat.code);
                          setIsAssignModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#00BFA5] text-[#0A1A18] font-bold text-xs hover:bg-[#00A892] transition-colors cursor-pointer"
                      >
                        Allocate to Cohort
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                Allocate Assessment to Cohort
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-4">
                Assign psychometric evaluation battery to selected classes.
              </p>

              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Assessment Battery
                  </label>
                  <select
                    value={selectedAssessmentCode}
                    onChange={(e) => setSelectedAssessmentCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  >
                    {AVAILABLE_TEST_CATALOG.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Target Class / Cohort
                  </label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  >
                    <option value="">All Enrolled Students (Entire Institution)</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Completion Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F7FAF9] dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assignMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-[#00BFA5] text-[#0A1A18] font-bold text-xs hover:bg-[#00A892] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {assignMutation.isPending ? "Allocating..." : "Confirm Allocation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
