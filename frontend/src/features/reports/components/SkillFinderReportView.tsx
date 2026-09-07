"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Download,
  Printer,
  Globe,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Award,
  ArrowLeft,
} from "lucide-react";
import { SkillFinderReportDTO } from "../types/report.types";
import { reportApi } from "../api/report.api";

interface SkillFinderReportViewProps {
  report: SkillFinderReportDTO;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const SUPPORTED_REPORT_LANGUAGES = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ta", label: "Tamil", native: "தமிழ்", dir: "ltr" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", dir: "ltr" },
];

export function SkillFinderReportView({
  report,
  currentLanguage,
  onLanguageChange,
}: SkillFinderReportViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const activeLangConfig =
    SUPPORTED_REPORT_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_REPORT_LANGUAGES[0];
  const isRtl = activeLangConfig.dir === "rtl";

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      await reportApi.downloadReportPdf(
        report.reportId,
        currentLanguage,
        `Skill_Finder_Report_${report.studentProfile.studentName.replace(/\s+/g, "_")}.pdf`
      );
    } catch (err) {
      setDownloadError(
        err instanceof Error
          ? err.message
          : "Failed to download PDF report. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-16 print:p-0 print:m-0 print:max-w-none print:space-y-5"
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          body {
            background: white !important;
            color: #172b2a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* 1. Header Toolbar (Navigation, Language Selector, PDF & Print Actions) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#172B2A]/80 backdrop-blur-xl border border-[#E3ECEA] dark:border-white/10 rounded-2xl p-4 shadow-sm print:hidden">
        <Link
          href={`/participant/results`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-[#00BFA5]" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none cursor-pointer font-bold"
              aria-label="Select report language"
            >
              {SUPPORTED_REPORT_LANGUAGES.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9]"
                >
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
            <span>Print</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#00BFA5]/25 cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-[#172B2A] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? "Generating PDF..." : "Download PDF Report"}</span>
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
          {downloadError}
        </div>
      )}

      {/* 2. Official Report Header Banner */}
      <div className="print-break-avoid relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#102423] to-[#0D1C1B] text-white p-6 sm:p-8 border border-white/10 shadow-xl print:shadow-none print:p-5 print:rounded-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00BFA5]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#00B8D4]/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3G MeLife Official Report</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white/90 border border-white/15">
                {report.studentProfile.versionName}
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/60">
              ID: {report.reportId.slice(0, 13)}...
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              Skill Finder Psychometric Report
            </h1>
            <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-2xl leading-relaxed">
              Discovering foundational cognitive aptitudes, exploratory interest patterns, and durable learning habits to guide future learning pathways.
            </p>
          </div>

          {/* Student Profile Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase">Student Name</span>
              <p className="font-bold text-white truncate">{report.studentProfile.studentName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase">Age / Class</span>
              <p className="font-bold text-white">
                {report.studentProfile.age ? `${report.studentProfile.age} yrs` : "N/A"} • {report.studentProfile.educationStage}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase">School / Institution</span>
              <p className="font-bold text-white truncate">{report.studentProfile.schoolName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase">Evaluation Date</span>
              <p className="font-bold text-[#00BFA5]">
                {new Date(report.studentProfile.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section 1: Executive Learning Profile Summary */}
      <div className="print-break-avoid rounded-3xl bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border-2 border-[#00BFA5]/40 dark:border-[#00BFA5]/30 p-6 sm:p-8 shadow-lg print:shadow-none print:p-5 print:rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] mb-1 block">
              1. Executive Learning Profile Summary
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
              <span>{report.executiveSummary.archetypeTitle}</span>
            </h2>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 border border-[#00BFA5]/30 text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
            {report.executiveSummary.reliabilityNote}
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold italic text-[#008F83] dark:text-[#00BFA5] mb-4">
          &ldquo;{report.executiveSummary.tagline}&rdquo;
        </p>

        <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed mb-5">
          {report.executiveSummary.strengthSummary}
        </p>

        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2 mb-5">
          <span className="text-[11px] font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider block">
            Exploratory Orientation Framing
          </span>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            {report.executiveSummary.explorationFraming}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mr-1">Primary Traits:</span>
          {report.executiveSummary.primaryTraits.map((trait, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Section 2: Interest Discovery (Holland RIASEC) */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            2. Vocational & Exploratory Interest Profile
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Holland RIASEC Orientation Breakdown
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1 max-w-2xl">
            {report.interestProfile.summary}
          </p>
        </div>

        {/* Top 3 Clusters Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.interestProfile.topClusters.map((cluster, idx) => (
            <div
              key={cluster.code}
              className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-4 space-y-2 hover:border-[#00BFA5]/40 transition-colors print:p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
                  Top #{idx + 1} Affinity
                </span>
                <span className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  {cluster.percentage}%
                </span>
              </div>
              <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                {cluster.name}
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] line-clamp-2">
                {cluster.clusterTitle}
              </p>
            </div>
          ))}
        </div>

        {/* 6 Dimensions Progress Meters */}
        <div className="space-y-3.5 pt-2">
          {report.interestProfile.dimensions.map((dim) => (
            <div key={dim.code} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#172B2A] dark:text-[#F7FAF9]">{dim.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#526866] dark:text-[#9FB3B0]">
                    {dim.level}
                  </span>
                  <span className="text-[#008F83] dark:text-[#00BFA5]">
                    {Math.round(dim.scalePositionPercentage)}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] transition-all duration-700"
                  style={{ width: `${Math.max(5, dim.scalePositionPercentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Section 3: Skill Behaviour Profile */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            3. Skill Behaviour Profile
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Problem Solving & Behavioural Strengths
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            {report.skillBehaviour.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strongest Box */}
          <div className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-5 space-y-4 print:p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Strongest Behavioural Instincts</span>
            </h3>
            <div className="space-y-3">
              {report.skillBehaviour.strongestIndicators.map((str) => (
                <div key={str.code} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    <span>{str.name}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400">{str.level}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/70">
                    {str.description || "Consistently demonstrates proactive problem-solving execution."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Box */}
          <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 space-y-4 print:p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>High-Potential Growth Opportunities</span>
            </h3>
            <div className="space-y-3">
              {report.skillBehaviour.developmentOpportunities.map((grw) => (
                <div key={grw.code} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
                    <span>{grw.name}</span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">{grw.level}</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70">
                    {grw.description || "Opportunity to nurture and strengthen through guided practice."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Section 4: Demonstrated Cognitive Aptitude */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
              4. Demonstrated Cognitive Aptitude
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Task Performance & Logic Reasoning
            </h2>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#00B8D4]/15 border border-[#00B8D4]/30 text-xs font-black text-[#00B8D4] shrink-0">
            Overall Accuracy: {report.aptitudeInsights.overallAccuracyPercentage}%
          </div>
        </div>

        <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
          {report.aptitudeInsights.summary}
        </p>

        {/* Aptitude Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.aptitudeInsights.dimensions.map((dim) => (
            <div
              key={dim.code}
              className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2 print:p-2.5"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#172B2A] dark:text-[#F7FAF9]">{dim.name}</span>
                <span className="text-[#008F83] dark:text-[#00BFA5] font-black">
                  {Math.round(dim.scalePositionPercentage)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] to-[#00C896]"
                  style={{ width: `${Math.max(5, dim.scalePositionPercentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Section 5: Developmental Strengths & Learning Habits */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            5. Developmental Strengths & Learning Habits
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Habits to Cultivate & Suggestions
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            {report.developmentalStrengths.learningHabitsSummary}
          </p>
        </div>

        <div className="space-y-2.5">
          {report.developmentalStrengths.growthSuggestions.map((sug, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-start gap-3 print:p-3"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#172B2A] dark:text-[#F7FAF9] leading-relaxed">
                {sug}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Section 6: Recommended Exploration Pathways */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            6. Recommended Exploration Pathways
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Curiosity-Driven Exploration Directions
          </h2>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 mt-2">
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
              {report.explorationAreas.framingDisclaimer}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.explorationAreas.clusters.map((cluster, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-5 space-y-4 hover:border-[#00BFA5]/40 transition-colors print:p-4"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00BFA5]" />
                <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  {cluster.clusterTitle}
                </h3>
              </div>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {cluster.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#E3ECEA] dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block">
                  Sample Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.sampleFocusAreas.map((area, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00B8D4] block">
                  Suggested Hands-on Activities:
                </span>
                <ul className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1 list-disc list-inside">
                  {cluster.suggestedProjectsAndActivities.map((act, actIdx) => (
                    <li key={actIdx}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Section 7: Parent & Educator Guidance */}
      <div className="print-break-avoid rounded-3xl bg-gradient-to-br from-[#FAF6EC] via-white to-[#F9F7F1] dark:from-[#211E16] dark:via-[#191814] dark:to-[#141310] border border-[#E5C158]/40 dark:border-[#E5C158]/20 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#996B00] dark:text-[#E5C158] block mb-1">
            7. Parent & Educator Guidance
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Nurturing Your Child&apos;s Natural Potential
          </h2>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#C5BBAA] mt-1.5 leading-relaxed">
            {report.parentGuidance.nurturingMindsetSummary}
          </p>
        </div>

        {/* DOs vs DONTs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3 print:p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Practices (DOs)</span>
            </h3>
            <ul className="text-xs text-emerald-900 dark:text-emerald-300/80 space-y-2 list-disc list-inside leading-relaxed">
              {report.parentGuidance.dos.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3 print:p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Practices to Avoid (DON&apos;Ts)</span>
            </h3>
            <ul className="text-xs text-rose-900 dark:text-rose-300/80 space-y-2 list-disc list-inside leading-relaxed">
              {report.parentGuidance.donts.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conversation Starters */}
        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-3 print:p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>Empathetic Conversation Starters</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.parentGuidance.recommendedDiscussions.map((disc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] italic leading-relaxed"
              >
                &ldquo;{disc}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. Footer Disclaimer */}
      <div className="print-break-avoid text-center text-[11px] text-[#728B88] dark:text-[#7D9491] space-y-1 pt-6 border-t border-[#E3ECEA] dark:border-white/10 print:pt-4">
        <p>
          © {new Date().getFullYear()} 3G MeLife Psychometric Assessment System. All rights reserved.
        </p>
        <p>
          Calibrated strictly for student discovery and non-prescriptive educational orientation.
        </p>
      </div>
    </div>
  );
}
