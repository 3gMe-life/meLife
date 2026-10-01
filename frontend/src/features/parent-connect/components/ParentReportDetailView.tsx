"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  Sparkles,
  Compass,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  School,
  Brain,
  Layers,
  TrendingUp,
  Target,
  FileText,
  Lightbulb,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  ShieldCheck,
  Check,
  X,
  BookOpen,
} from "lucide-react";
import { useParentReportDetailQuery } from "../hooks/useParentConnectQueries";
import { parentConnectApi } from "../api/parent-connect.api";
import { SkillFinderReportView } from "@/features/reports/components/SkillFinderReportView";

interface ParentReportDetailViewProps {
  reportId: string;
}

export function ParentReportDetailView({ reportId }: ParentReportDetailViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [language, setLanguage] = useState("en");

  const {
    data: reportDetailData,
    isLoading,
    isError,
    refetch,
  } = useParentReportDetailQuery(reportId);

  const reportDetail = reportDetailData?.data;

  const handleDownloadPdf = async () => {
    if (!reportDetail) return;
    try {
      setIsDownloading(true);
      const safeName = reportDetail.studentName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const filename = `MeLife_${reportDetail.assessmentCode}_${safeName}_${language}.pdf`;
      await parentConnectApi.downloadReportPdf(reportDetail.id, language, filename);
    } catch (err) {
      console.error("PDF Download error", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="h-32 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8" />
        <div className="h-96 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800" />
      </div>
    );
  }

  if (isError || !reportDetail) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Report Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We could not load this assessment report. Verify you have verified access to this child.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/parent/reports"
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition-all"
          >
            Back to Reports
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

  const {
    studentName,
    studentGrade,
    studentSchool,
    studentAge,
    reportTitle,
    profileArchetype,
    generatedAt,
    reportData,
  } = reportDetail;

  // If reportData has full SkillFinder structure, we can also render the interactive SkillFinderReportView
  // or render the structured Parent Report Sections
  const executiveSummary = reportData?.executiveSummary;
  const interestProfile = reportData?.interestProfile;
  const skillBehaviour = reportData?.skillBehaviour;
  const aptitudeInsights = reportData?.aptitudeInsights;
  const explorationAreas = reportData?.explorationAreas;
  const parentGuidance = reportData?.parentGuidance;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link
            href="/parent/reports"
            className="inline-flex items-center gap-1.5 font-medium hover:text-[#0F5B54] dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Assessment Reports
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
            {reportTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5B54] via-[#106F63] to-[#0A413C] p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Assessment Report
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {reportTitle}
            </h1>

            {profileArchetype && (
              <p className="text-sm text-emerald-100 font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Archetype Profile: <span className="font-bold text-white">{profileArchetype}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-emerald-100/90 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {studentName} {studentAge ? `(${studentAge} Yrs)` : ""}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {studentGrade || "Student Grade"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5" />
                {studentSchool || "Academy"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1.5 self-start md:self-auto min-w-[200px]">
            <div className="flex items-center justify-between text-emerald-200">
              <span>Status:</span>
              <span className="font-bold text-white">Completed ✓</span>
            </div>
            <div className="flex items-center justify-between text-emerald-200">
              <span>Generated Date:</span>
              <span className="font-bold text-white">
                {new Date(generatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Executive Summary */}
      {executiveSummary && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Executive Summary
            </h2>
          </div>

          {executiveSummary.tagline && (
            <p className="text-base font-semibold text-[#0F5B54] dark:text-teal-300 italic">
              &ldquo;{executiveSummary.tagline}&rdquo;
            </p>
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {executiveSummary.strengthSummary ||
              "This comprehensive report assesses key cognitive strengths, vocational inclinations, and potential educational trajectories based on the student's responses."}
          </p>

          {executiveSummary.primaryTraits && executiveSummary.primaryTraits.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Primary Core Traits:
              </span>
              <div className="flex flex-wrap gap-2">
                {executiveSummary.primaryTraits.map((trait: string) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-[#0F5B54] dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Interest Analysis (Holland RIASEC / Clusters) */}
      {interestProfile && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Interest Analysis & Orientations
            </h2>
          </div>

          {interestProfile.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {interestProfile.summary}
            </p>
          )}

          {/* Top Interest Clusters */}
          {interestProfile.topClusters && interestProfile.topClusters.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {interestProfile.topClusters.map((cluster: any) => (
                <div
                  key={cluster.code || cluster.name}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {cluster.name || cluster.clusterTitle}
                    </h3>
                    {cluster.percentage !== undefined && (
                      <span className="text-xs font-bold text-[#0F5B54] dark:text-teal-400">
                        {cluster.percentage}%
                      </span>
                    )}
                  </div>
                  {cluster.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {cluster.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Strength Profile & Skill Behaviour */}
      {skillBehaviour && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Strength Profile & Skill Behaviour
            </h2>
          </div>

          {skillBehaviour.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {skillBehaviour.summary}
            </p>
          )}

          {skillBehaviour.strongestIndicators && skillBehaviour.strongestIndicators.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Top Demonstrated Competencies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillBehaviour.strongestIndicators.map((ind: any) => (
                  <div
                    key={ind.name || ind.code}
                    className="p-3.5 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {ind.name}
                    </span>
                    {ind.score !== undefined && (
                      <span className="text-xs font-bold text-[#0F5B54] dark:text-teal-300">
                        {ind.score} / {ind.maxScore || 10}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: Intelligence Mapping & Aptitude */}
      {aptitudeInsights && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Intelligence Mapping & Aptitude Insights
            </h2>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {aptitudeInsights.cognitiveStrengthsText ||
              aptitudeInsights.summary ||
              "Student exhibits well-rounded analytical reasoning and spatial logic."}
          </p>
        </div>
      )}

      {/* SECTION 5: Career Recommendations & Exploration */}
      {explorationAreas && explorationAreas.clusters && explorationAreas.clusters.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0F5B54] dark:text-teal-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Career Recommendations & Pathways
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {explorationAreas.clusters.map((area: any) => (
              <div
                key={area.clusterTitle || area.domain}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 space-y-3"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0F5B54] dark:text-teal-400" />
                  {area.clusterTitle}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {area.description}
                </p>

                {area.sampleFocusAreas && area.sampleFocusAreas.length > 0 && (
                  <div className="pt-2 border-t border-gray-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Recommended Focus Pathways:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {area.sampleFocusAreas.map((focus: string) => (
                        <span
                          key={focus}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: Actionable Parent Guidance */}
      {parentGuidance && (
        <div className="rounded-3xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#0F5B54] dark:text-teal-300">
            <HeartHandshake className="w-6 h-6 text-[#0F5B54] dark:text-teal-400" />
            <h2 className="text-lg font-bold">
              Parent Guidance & Supportive Actions
            </h2>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {parentGuidance.nurturingMindsetSummary ||
              "As a parent, your encouragement is vital. Here are practical recommendations to support your child's exploration."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Supportive Actions */}
            {parentGuidance.supportiveActions && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/30 space-y-2.5">
                <h3 className="text-xs font-bold text-[#0F5B54] dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Supportive Actions to Take
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {parentGuidance.supportiveActions.map((action: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Discussions */}
            {parentGuidance.recommendedDiscussions && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/30 space-y-2.5">
                <h3 className="text-xs font-bold text-[#0F5B54] dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Conversation Starters at Home
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {parentGuidance.recommendedDiscussions.map((topic: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
