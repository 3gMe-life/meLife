"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  School,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  FileText,
  LineChart,
  Compass,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Brain,
  MessageSquare,
  Users,
  Briefcase,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useChildOverviewQuery } from "../hooks/useParentConnectQueries";

interface ParentStudentDetailViewProps {
  studentId: string;
}

export function ParentStudentDetailView({ studentId }: ParentStudentDetailViewProps) {
  const { data, isLoading, isError, refetch } = useChildOverviewQuery(studentId);

  const overview = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="h-44 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800" />
          ))}
        </div>
        <div className="h-96 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800" />
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Child Profile Not Accessible
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We could not load the child profile. Ensure this student is actively linked to your parent account.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/parent/children"
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition-all"
          >
            Back to Children
          </Link>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F5B54] text-white hover:bg-[#0A413C] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { student, relationship, assessments = [], reports = [], counsellingSessionsCount = 0 } = overview;
  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
  const initials = `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase() || "ST";
  const completedAssessmentsCount = assessments.filter((a) => a.status === "COMPLETED").length;
  const totalAssessments = assessments.length || 6;
  const reportsCount = reports.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link
          href="/parent/children"
          className="inline-flex items-center gap-1.5 font-medium hover:text-[#0F5B54] dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Children Profiles
        </Link>
        <span>/</span>
        <span className="font-bold text-gray-800 dark:text-gray-200">{fullName}</span>
      </div>

      {/* SECTION 1: Student Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Student Avatar */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0F5B54] via-teal-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-teal-700/20">
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-[#0F5B54] dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Connected as {relationship?.relationshipType || "Parent"} ✓
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>{student.gradeLevel || "Grade Level: Not set"}</span>
                {student.age && <span>• Age: {student.age} Years</span>}
                <span>• {student.schoolName || "3G MeLife Learning Academy"}</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-slate-800 gap-2">
            <Link
              href={`/parent/reports?studentId=${student.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              View Generated Reports
            </Link>
            <span className="text-[11px] text-gray-400">
              Verified on {new Date(relationship?.verifiedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Progress Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#0F5B54] dark:text-teal-400 flex items-center justify-center">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Assessments Completed
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {completedAssessmentsCount} / {totalAssessments}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Reports Generated
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {reportsCount} {reportsCount === 1 ? "Report" : "Reports"}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Counselling Sessions
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {counsellingSessionsCount} {counsellingSessionsCount === 1 ? "Session" : "Sessions"}
            </h3>
          </div>
        </div>
      </div>

      {/* SECTION 2: Academic Information */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Academic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              School / Institution
            </span>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              {student.schoolName || "3G MeLife Learning Academy"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Grade / Class
            </span>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              {student.gradeLevel || "Not configured"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Education Stage
            </span>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              {student.educationStage || "Secondary School"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Curriculum / Board
            </span>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              {student.curriculumOrBoard || "Standard CBSE / National"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Assessment Journey (6 Batteries) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Assessment Journey
            </h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completedAssessmentsCount} of {totalAssessments} Batteries Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((assessment) => {
            const isCompleted = assessment.status === "COMPLETED";
            const isInProgress = assessment.status === "IN_PROGRESS";

            // Find matching report if completed
            const matchingReport = reports.find(
              (r) =>
                r.assessmentCode.toLowerCase() === assessment.assessmentCode.toLowerCase() ||
                r.assessmentCode.replace(/-/g, "_").toLowerCase() ===
                  assessment.assessmentCode.replace(/-/g, "_").toLowerCase()
            );

            return (
              <div
                key={assessment.assessmentCode}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? "bg-teal-50/30 dark:bg-teal-950/10 border-teal-200 dark:border-teal-900/50"
                    : isInProgress
                    ? "bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50"
                    : "bg-gray-50/50 dark:bg-slate-800/30 border-gray-100 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {assessment.category || "Assessment Battery"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {assessment.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isCompleted
                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                        : isInProgress
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3 h-3" />
                        In Progress
                      </>
                    ) : (
                      "Not Started"
                    )}
                  </span>
                </div>

                {isCompleted && (
                  <div className="mt-4 pt-3 border-t border-teal-100 dark:border-teal-900/30 space-y-2">
                    {assessment.dominantTraits && assessment.dominantTraits.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 font-semibold">Key Strengths:</span>
                        {assessment.dominantTraits.map((trait) => (
                          <span
                            key={trait}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-100 dark:border-slate-700"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-gray-400">
                        {assessment.completedAt
                          ? `Completed on ${new Date(assessment.completedAt).toLocaleDateString()}`
                          : "Completed"}
                      </span>

                      {matchingReport ? (
                        <Link
                          href={`/parent/reports/${matchingReport.id}`}
                          className="inline-flex items-center gap-1 font-bold text-[#0F5B54] dark:text-teal-400 hover:underline"
                        >
                          View Report
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <Link
                          href={`/parent/reports?studentId=${student.id}`}
                          className="inline-flex items-center gap-1 font-bold text-[#0F5B54] dark:text-teal-400 hover:underline"
                        >
                          Reports List
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Career Journey Timeline */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Career Journey Timeline
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#0F5B54] before:via-teal-400 before:to-gray-200 dark:before:to-slate-800">
          {/* Step 1 */}
          <div className="relative space-y-1">
            <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#0F5B54] text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Student Registered & Connected
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Account created and linked to parent portal for continuous progress monitoring.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative space-y-1">
            <div
              className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                completedAssessmentsCount > 0
                  ? "bg-[#0F5B54] text-white"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-500"
              }`}
            >
              {completedAssessmentsCount > 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Psychometric Assessment Battery
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completedAssessmentsCount > 0
                ? `${completedAssessmentsCount} of ${totalAssessments} assessment modules completed.`
                : "Student has not yet completed the initial assessment battery."}
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative space-y-1">
            <div
              className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                reportsCount > 0
                  ? "bg-[#0F5B54] text-white"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-500"
              }`}
            >
              {reportsCount > 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Career Exploration Report Generated
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {reportsCount > 0
                ? `${reportsCount} comprehensive psychometric & stream recommendation reports generated.`
                : "Awaiting assessment completion to generate personalized career blueprint."}
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative space-y-1">
            <div
              className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                counsellingSessionsCount > 0
                  ? "bg-[#0F5B54] text-white"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-500"
              }`}
            >
              {counsellingSessionsCount > 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              1-on-1 Certified Career Counselling Session
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {counsellingSessionsCount > 0
                ? `${counsellingSessionsCount} guidance sessions conducted with career advisor.`
                : "Schedule a session with our certified counselors to discuss your child's career pathways."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
