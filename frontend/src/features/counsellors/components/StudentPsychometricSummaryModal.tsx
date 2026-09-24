"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  Sparkles,
  Compass,
  Brain,
  Briefcase,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { StudentPsychometricSummaryDTO } from "../types/counsellor.types";
import { useStudentSummary } from "../hooks/useCounsellorQueries";

interface StudentPsychometricSummaryModalProps {
  studentId: string | null;
  studentName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentPsychometricSummaryModal: React.FC<
  StudentPsychometricSummaryModalProps
> = ({ studentId, studentName, isOpen, onClose }) => {
  const { data: summary, isLoading, error } = useStudentSummary(
    studentId || "",
    isOpen
  );

  if (!isOpen || !studentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Safe Psychometric Assessment Summary</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {summary?.studentName || studentName || "Student Profile"}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {summary?.gradeLevel && (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                {summary.gradeLevel}
              </span>
            )}
            {summary?.schoolName && <span>• {summary.schoolName}</span>}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading student psychometrics...</p>
          </div>
        ) : error ? (
          <div className="my-6 rounded-2xl border border-rose-100 bg-rose-50/70 p-5 text-center dark:border-rose-950/60 dark:bg-rose-950/30">
            <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
            <h3 className="mt-2 text-sm font-bold text-rose-900 dark:text-rose-200">
              Consent Required or Profile Inaccessible
            </h3>
            <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
              {error instanceof Error
                ? error.message
                : "The student has not granted profile sharing consent, or assessment results are not available yet."}
            </p>
          </div>
        ) : summary && !summary.isAssessed ? (
          <div className="my-6 rounded-2xl border border-amber-100 bg-amber-50/70 p-5 text-center dark:border-amber-950/60 dark:bg-amber-950/30">
            <Compass className="mx-auto h-8 w-8 text-amber-500" />
            <h3 className="mt-2 text-sm font-bold text-amber-900 dark:text-amber-200">
              Assessment Pending
            </h3>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              This student has not yet completed the 3G MeLife Skill Finder psychometric assessment. General career guidance will be provided during the session.
            </p>
          </div>
        ) : summary ? (
          <div className="mt-6 space-y-6">
            {/* 1. Learning Archetype Card */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 p-4 dark:border-indigo-950/60 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  <Sparkles className="h-3 w-3" />
                  Primary Archetype
                </span>
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  RIASEC: {summary.riasecCode}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {summary.archetype}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Cognitive orientation focused on holistic problem solving and multidisciplinary exploration.
              </p>
            </div>

            {/* 2. Top Interest Dimensions & Aptitudes */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Interest Dimensions */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Top Interest Clusters</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {summary.topInterestDimensions?.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demonstrated Aptitudes */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Aptitude & Strengths</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {summary.topAptitudes?.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-purple-600 dark:bg-purple-400"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Top Career Pathways */}
            {summary.topCareerPathways && summary.topCareerPathways.length > 0 && (
              <div>
                <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Top Recommended Pathways</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {summary.topCareerPathways.map((pathway, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-850"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {pathway.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {pathway.category}
                        </span>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {pathway.matchPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Privacy Guarantee Footer */}
            <div className="rounded-xl bg-slate-100/70 p-3 text-[11px] text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                🔒 Privacy Guarantee:
              </span>{" "}
              Raw test responses, item-level weights, and calibration algorithms are strictly secured and never displayed.
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          {summary?.isAssessed ? (
            <a
              href={`/participant/reports`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition"
            >
              <span>View Comprehensive Report</span>
            </a>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
