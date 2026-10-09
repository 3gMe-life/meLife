"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  ArrowRight,
  Calendar,
  History,
  CheckCircle2,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  AssessmentReportConfigItem,
  getAssessmentReportConfig,
} from "../config/assessment-report.config";
import { reportApi } from "../api/report.api";

export interface CompletedAssessmentGroup {
  assessmentCode: string;
  latestAttemptId: string;
  latestResultId: string;
  latestCompletedAt: string;
  totalAttempts: number;
  allAttempts: Array<{
    attemptId: string;
    resultId: string;
    completedAt: string;
    result?: any;
  }>;
  reportId?: string;
}

interface CompletedAssessmentReportCardProps {
  assessmentGroup: CompletedAssessmentGroup;
  currentLanguage?: string;
}

export const CompletedAssessmentReportCard: React.FC<CompletedAssessmentReportCardProps> = ({
  assessmentGroup,
  currentLanguage = "en",
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const config: AssessmentReportConfigItem = getAssessmentReportConfig(
    assessmentGroup.assessmentCode
  );
  const IconComponent = config.icon;

  const formattedDate = new Date(
    assessmentGroup.latestCompletedAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const reportUrl = config.getReportRoute(
    assessmentGroup.latestAttemptId,
    assessmentGroup.latestResultId,
    assessmentGroup.reportId
  );

  const resultUrl = config.getResultRoute(assessmentGroup.latestAttemptId);

  const handleDownloadPdf = async () => {
    if (!config.pdfSupported) return;
    try {
      setIsDownloadingPdf(true);
      setDownloadError(null);
      await reportApi.downloadReportPdf(
        assessmentGroup.reportId || assessmentGroup.latestAttemptId,
        currentLanguage,
        `3G_MeLife_${config.shortTitle.replace(/\s+/g, "_")}_Report.pdf`
      );
    } catch (err) {
      setDownloadError(
        err instanceof Error
          ? err.message
          : "Failed to download PDF report. Please try again."
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const hasMultipleAttempts = assessmentGroup.totalAttempts > 1;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all group">
      <div>
        {/* Card Header: Icon + Category + Status Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.colorScheme.iconBg} shadow-2xs shrink-0`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.colorScheme.badgeBg} ${config.colorScheme.badgeText} border ${config.colorScheme.badgeBorder}`}
              >
                {config.category}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{formattedDate}</span>
                </span>
                {hasMultipleAttempts && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Attempt #{assessmentGroup.totalAttempts}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {config.title}
          </h3>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 line-clamp-1">
            {config.tagline}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 line-clamp-3">
            {config.description}
          </p>
        </div>

        {downloadError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-700 dark:text-rose-300">
            {downloadError}
          </div>
        )}
      </div>

      {/* Card Footer: Action Links & Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          {config.formalReportSupported ? (
            <Link
              href={reportUrl}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>View Report</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href={resultUrl}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>View Psychometric Insights</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {config.pdfSupported && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Download official PDF report"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              )}
              <span>{isDownloadingPdf ? "Preparing..." : "Download PDF"}</span>
            </button>
          )}
        </div>

        {/* History / Comparison Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {hasMultipleAttempts && (
            <Link
              href={`/participant/assessments/compare?assessmentCode=${assessmentGroup.assessmentCode.toLowerCase()}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
              title="Compare growth across attempts"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Growth</span>
            </Link>
          )}

          <Link
            href={`/participant/assessments/history?assessmentCode=${assessmentGroup.assessmentCode.toLowerCase()}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="View full attempt history"
          >
            <History className="w-3 h-3" />
            <span>History ({assessmentGroup.totalAttempts})</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
