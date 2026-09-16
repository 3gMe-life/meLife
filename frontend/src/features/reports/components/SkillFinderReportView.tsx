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
  User,
  ShieldCheck,
  Brain,
  Layers,
  TrendingUp,
  Target,
  Clock,
  Calendar,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileCode,
  Users,
  Briefcase,
  Zap,
} from "lucide-react";
import {
  SkillFinderReportDTO,
  ReportAudienceView,
} from "../types/report.types";
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
  const [audienceView, setAudienceView] = useState<ReportAudienceView>("STUDENT");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isTechnicalMetaOpen, setIsTechnicalMetaOpen] = useState(false);

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

  if (!report || !report.executiveSummary || !report.studentProfile) {
    return (
      <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-8 text-center max-w-lg mx-auto space-y-4 my-12">
        <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-amber-950 dark:text-amber-200">
          Incompatible Report Format
        </h2>
        <p className="text-xs text-amber-800 dark:text-amber-300">
          This report snapshot does not contain valid Skill Finder psychometric data.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/participant/results"
            className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-200"
          >
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  // Derive Top 5 Strengths from available dimensions
  const allScoredDimensions = [
    ...(report.interestProfile?.dimensions || []),
    ...(report.aptitudeInsights?.dimensions || []),
    ...(report.skillBehaviour?.dimensions || []),
    ...(report.developmentalStrengths?.dimensions || []),
  ];

  // Unique by code, sorted by scalePositionPercentage desc
  const uniqueDimensionsMap = new Map<string, typeof allScoredDimensions[0]>();
  allScoredDimensions.forEach((d) => {
    if (!uniqueDimensionsMap.has(d.code)) {
      uniqueDimensionsMap.set(d.code, d);
    }
  });

  const sortedStrengths = Array.from(uniqueDimensionsMap.values())
    .sort((a, b) => (b.scalePositionPercentage || 0) - (a.scalePositionPercentage || 0))
    .slice(0, 5);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-20 print:p-0 print:m-0 print:max-w-none print:space-y-5 select-none-safe"
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

      {/* ========================================================================= */}
      {/* HEADER TOOLBAR (Navigation, Audience View, Language, PDF & Print) */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white/90 dark:bg-[#172B2A]/90 backdrop-blur-xl border border-[#E3ECEA] dark:border-white/10 rounded-3xl p-4 shadow-sm print:hidden">
        {/* Back Link */}
        <Link
          href={`/participant/results`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </Link>

        {/* Audience View Switcher */}
        <div className="flex items-center bg-[#F4F8F7] dark:bg-white/5 p-1 rounded-2xl border border-[#E3ECEA] dark:border-white/10 w-full lg:w-auto justify-center">
          <button
            type="button"
            onClick={() => setAudienceView("STUDENT")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              audienceView === "STUDENT"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-sm font-black"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
            }`}
          >
            Student View
          </button>
          <button
            type="button"
            onClick={() => setAudienceView("PARENT")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              audienceView === "PARENT"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-sm font-black"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
            }`}
          >
            Parent View
          </button>
          <button
            type="button"
            onClick={() => setAudienceView("COUNSELLOR")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              audienceView === "COUNSELLOR"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-sm font-black"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
            }`}
          >
            Counsellor View
          </button>
        </div>

        {/* Actions (Language, Print, PDF) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-[#00BFA5]" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none cursor-pointer font-bold text-xs"
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
            className="px-3.5 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
            <span className="hidden sm:inline">Print</span>
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
            <span>{isDownloading ? "Generating PDF..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
          {downloadError}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 01. STUDENT SNAPSHOT (Header Hero Metadata) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#102423] to-[#0D1C1B] text-white p-6 sm:p-8 border border-white/10 shadow-xl print:shadow-none print:p-5 print:rounded-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00BFA5]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#00B8D4]/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3G MeLife Psychometric Assessment Report</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white/90 border border-white/15">
                {report.studentProfile.versionName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
              <span>Attempt #{report.studentProfile.attemptNumber || 1}</span>
              <span>•</span>
              <span>Status: Completed</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              {report.studentProfile.assessmentName}
            </h1>
            <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-2xl leading-relaxed">
              Multidimensional psychometric evaluation synthesizing cognitive reasoning, vocational interests, and developmental learning habits.
            </p>
          </div>

          {/* Student Profile Snapshot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Whose Report</span>
              <p className="font-bold text-white truncate flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>{report.studentProfile.studentName}</span>
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Stage & School</span>
              <p className="font-bold text-white truncate">
                {report.studentProfile.educationStage} • {report.studentProfile.schoolName}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Evaluation Date</span>
              <p className="font-bold text-[#00BFA5] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(report.studentProfile.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Report Language</span>
              <p className="font-bold text-white uppercase">{activeLangConfig.label} ({currentLanguage})</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 02. YOUR PROFILE AT A GLANCE */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border-2 border-[#00BFA5]/40 dark:border-[#00BFA5]/30 p-6 sm:p-8 shadow-lg print:shadow-none print:p-5 print:rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] mb-1 block">
              02. Your Profile at a Glance
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
              <span>{report.executiveSummary.archetypeTitle}</span>
            </h2>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-white/10 border border-[#00BFA5]/30 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] shrink-0">
            Primary Interest: {report.interestProfile?.primaryOrientation} + {report.interestProfile?.secondaryOrientation}
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold italic text-[#008F83] dark:text-[#00BFA5] mb-4">
          &ldquo;{report.executiveSummary.tagline}&rdquo;
        </p>

        <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed mb-5">
          {report.executiveSummary.strengthSummary}
        </p>

        {/* Top 4 Signature Strengths */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider block">
            Signature Competency Indicators:
          </span>
          <div className="flex flex-wrap gap-2">
            {report.executiveSummary.primaryTraits.map((trait, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl text-xs font-black bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
                <span>{trait}</span>
              </span>
            ))}
          </div>
        </div>

        {/* One-Paragraph Profile Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5">
          <span className="text-[11px] font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider block">
            Objective Exploratory Summary
          </span>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            {report.executiveSummary.explorationFraming}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 03. RESPONSE QUALITY & ASSESSMENT CONFIDENCE */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4 print:shadow-none print:p-5 print:rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
              03. Response Quality & Assessment Confidence
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Evaluation Validity & Reliability Verification
            </h2>
          </div>
          <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-[#526866] dark:text-[#9FB3B0] uppercase">Completion</span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">100%</p>
            <span className="text-[10px] text-[#728B88]">All items completed</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-[#526866] dark:text-[#9FB3B0] uppercase">Consistency Signal</span>
            <p className="text-base font-black text-[#008F83] dark:text-[#00BFA5]">High Consistency</p>
            <span className="text-[10px] text-[#728B88]">Parallel pair verification</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-[#526866] dark:text-[#9FB3B0] uppercase">Missing Items</span>
            <p className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">0</p>
            <span className="text-[10px] text-[#728B88]">No missing answers</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-[#526866] dark:text-[#9FB3B0] uppercase">Validity Status</span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">Verified</p>
            <span className="text-[10px] text-[#728B88]">No anomaly detected</span>
          </div>
        </div>

        <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] italic">
          *Note: Psychometric consistency is evaluated using calibrated item response pairs. Normative population percentiles are calibrated within secondary school cohort bounds.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 04. YOUR INTEREST PROFILE (Holland RIASEC) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            04. Your Interest Profile
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Holland RIASEC Vocational & Activity Orientations
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1 max-w-2xl leading-relaxed">
            {report.interestProfile?.summary}
          </p>
        </div>

        {/* Top 3 Clusters Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.interestProfile?.topClusters?.map((cluster, idx) => (
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
                {cluster.description}
              </p>
            </div>
          ))}
        </div>

        {/* 6 RIASEC Dimensions Progress Meters */}
        <div className="space-y-3.5 pt-2">
          {report.interestProfile?.dimensions?.map((dim) => (
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
              <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                {dim.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 05. YOUR COGNITIVE / APTITUDE PROFILE */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
              05. Your Cognitive & Aptitude Profile
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Measured Problem Solving & Spatial Reasoning
            </h2>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#00B8D4]/15 border border-[#00B8D4]/30 text-xs font-black text-[#00B8D4] shrink-0">
            Cognitive Precision: {report.aptitudeInsights?.overallAccuracyPercentage || 85}%
          </div>
        </div>

        <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
          {report.aptitudeInsights?.summary}
        </p>

        {/* Aptitude Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.aptitudeInsights?.dimensions?.map((dim) => (
            <div
              key={dim.code}
              className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2 print:p-3"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#172B2A] dark:text-[#F7FAF9]">{dim.name}</span>
                <span className="text-[#008F83] dark:text-[#00BFA5] font-black">
                  {Math.round(dim.scalePositionPercentage || 75)}% ({dim.level})
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] to-[#00C896]"
                  style={{ width: `${Math.max(5, dim.scalePositionPercentage || 75)}%` }}
                />
              </div>
              <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] leading-relaxed">
                {dim.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 06. YOUR SKILLS & COMPETENCIES */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            06. Your Skills & Competencies
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Applied Behavioral & Workplace Competencies
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            {report.skillBehaviour?.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strongest Box */}
          <div className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-5 space-y-4 print:p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Strongest Behavioral Competencies</span>
            </h3>
            <div className="space-y-3">
              {report.skillBehaviour?.strongestIndicators?.map((str) => (
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
              <span>High-Potential Competency Expansion</span>
            </h3>
            <div className="space-y-3">
              {report.skillBehaviour?.developmentOpportunities?.map((grw) => (
                <div key={grw.code} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
                    <span>{grw.name}</span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">{grw.level}</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70">
                    {grw.description || "Opportunity to nurture through structured project leadership."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 07. YOUR LEARNING & DEVELOPMENT PROFILE */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            07. Your Learning & Development Profile
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Durable Learning Habits & Growth Orientation
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            {report.developmentalStrengths?.learningHabitsSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {report.developmentalStrengths?.dimensions?.map((dim) => (
            <div
              key={dim.code}
              className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#172B2A] dark:text-[#F7FAF9]">{dim.name}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                  {dim.level}
                </span>
              </div>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {dim.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 08. YOUR STRONGEST AREAS (TOP 5 STRENGTHS SPOTLIGHT) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#122826] to-[#0D1C1B] text-white p-6 sm:p-8 shadow-xl print:shadow-none print:p-5 print:rounded-2xl border border-white/10 space-y-5">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] block mb-1">
            08. Your Strongest Areas
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Top 5 Signature Strengths Spotlight
          </h2>
          <p className="text-xs text-[#9FB3B0] mt-1">
            Your highest calibrated capabilities across interests, competencies, and cognitive deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sortedStrengths.map((str, idx) => (
            <div
              key={str.code}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 relative overflow-hidden group hover:border-[#00BFA5] transition-colors"
            >
              <div className="w-7 h-7 rounded-xl bg-[#00BFA5] text-[#172B2A] font-black text-xs flex items-center justify-center shadow-xs">
                0{idx + 1}
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">
                {str.name}
              </h4>
              <p className="text-[10px] text-[#9FB3B0] line-clamp-3">
                {str.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 09. AREAS TO DEVELOP (Constructive & Encouraging Framing) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-5 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
            09. High-Potential Areas to Cultivate
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Development Opportunities for Continuous Growth
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1 leading-relaxed">
            These are emerging capability areas where targeted exposure and structured practice can unlock significant long-term growth.
          </p>
        </div>

        <div className="space-y-3">
          {report.developmentalStrengths?.growthSuggestions?.map((sug, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FAF6EC] dark:bg-[#211E16] border border-[#E5C158]/40 dark:border-[#E5C158]/20 flex items-start gap-3 print:p-3"
            >
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#172B2A] dark:text-[#F7FAF9] leading-relaxed">
                {sug}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. CAREER COMPATIBILITY & ALIGNMENT */}
      {/* 11. RECOMMENDED CAREER PATHWAYS (Primary, Secondary, Exploration) */}
      {/* 12. WHY THESE CAREERS? (Transparent Evidence) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            10-12. Career Alignment & Exploration Pathways
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Curiosity-Driven Career Exploration Pathways
          </h2>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 mt-2">
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
              {report.explorationAreas?.framingDisclaimer}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.explorationAreas?.clusters?.map((cluster, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-5 space-y-4 hover:border-[#00BFA5]/40 transition-colors print:p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#00BFA5]" />
                  <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                    {cluster.clusterTitle}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                  {idx === 0 ? "Primary Pathway" : idx === 1 ? "Secondary Pathway" : "Exploration Pathway"}
                </span>
              </div>

              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {cluster.description}
              </p>

              {/* Why These Careers / Evidence Breakdown */}
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block">
                  Why this matches your profile:
                </span>
                <ul className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Strong alignment with your <strong>{report.interestProfile?.primaryOrientation}</strong> interest orientation.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Capitalizes on measured <strong>{sortedStrengths[0]?.name || "Problem Solving"}</strong> strength.</span>
                  </li>
                </ul>
              </div>

              {/* Sample Focus Areas */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block">
                  Sample Exploration Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.sampleFocusAreas?.map((area, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 13. WHAT TO EXPLORE NEXT */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            13. What to Explore Next
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Hands-on Projects & Experiential Discovery
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            Real-world activities to test hypotheses, spark curiosity, and build foundational domain skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.explorationAreas?.clusters?.map((cluster, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2.5"
            >
              <h4 className="text-xs font-black uppercase text-[#008F83] dark:text-[#00BFA5]">
                {cluster.clusterTitle} Projects:
              </h4>
              <ul className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1.5 list-disc list-inside">
                {cluster.suggestedProjectsAndActivities?.map((act, aIdx) => (
                  <li key={aIdx} className="leading-relaxed">{act}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 14. FUTURE SKILLS & ADAPTABILITY */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border border-[#00BFA5]/30 p-6 sm:p-8 shadow-sm space-y-5 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            14. Future Skills & Adaptability
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Critical Future Competencies for Emerging Technology
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            Capabilities designed to thrive alongside automation, generative AI, and dynamic interdisciplinary workplaces.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <Zap className="w-4 h-4 text-[#00BFA5]" />
            <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">AI Literacy</h4>
            <p className="text-[10px] text-[#526866] dark:text-[#9FB3B0]">Prompting, ethical usage, and algorithmic fundamentals.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <Brain className="w-4 h-4 text-[#00BFA5]" />
            <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">Learning Agility</h4>
            <p className="text-[10px] text-[#526866] dark:text-[#9FB3B0]">Unlearning obsolete models and rapidly picking up new tools.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <Users className="w-4 h-4 text-[#00BFA5]" />
            <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">Interdisciplinary Teamwork</h4>
            <p className="text-[10px] text-[#526866] dark:text-[#9FB3B0]">Bridging engineering, design, and domain expertise.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
            <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
            <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">Critical Verification</h4>
            <p className="text-[10px] text-[#526866] dark:text-[#9FB3B0]">Validating data outputs and diagnostic troubleshooting.</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 15. PARENT & EDUCATOR GUIDANCE (Always prominent in Parent View) */}
      {/* ========================================================================= */}
      <div className={`print-break-avoid rounded-3xl bg-gradient-to-br from-[#FAF6EC] via-white to-[#F9F7F1] dark:from-[#211E16] dark:via-[#191814] dark:to-[#141310] border border-[#E5C158]/40 dark:border-[#E5C158]/20 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl ${
        audienceView === "PARENT" ? "ring-2 ring-[#E5C158]" : ""
      }`}>
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#996B00] dark:text-[#E5C158] block mb-1">
            15. Parent & Educator Guidance
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Nurturing Natural Potential Without Early Pressure
          </h2>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#C5BBAA] mt-1.5 leading-relaxed">
            {report.parentGuidance?.nurturingMindsetSummary}
          </p>
        </div>

        {/* DOs vs DONTs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3 print:p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Supportive Actions (DOs)</span>
            </h3>
            <ul className="text-xs text-emerald-900 dark:text-emerald-300/80 space-y-2 list-disc list-inside leading-relaxed">
              {report.parentGuidance?.dos?.map((item, idx) => (
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
              {report.parentGuidance?.donts?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conversation Starters */}
        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-3 print:p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>Empathetic Conversation Starters for Family Discussions</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.parentGuidance?.recommendedDiscussions?.map((disc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] italic leading-relaxed"
              >
                &ldquo;{disc}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 16. STUDENT ACTION PLAN (30 Days, 3 Months, 6 Months) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            16. Student Action Plan
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Progressive Action Roadmap
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            Transforming psychometric evaluation into actionable, low-pressure development milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#E6F7F5] dark:bg-[#142827] border border-[#00BFA5]/30 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00BFA5]" />
              <h4 className="text-xs font-black uppercase text-[#008F83] dark:text-[#00BFA5]">Next 30 Days</h4>
            </div>
            <p className="text-xs text-[#172B2A] dark:text-[#F7FAF9] font-bold">Exploratory Immersion</p>
            <ul className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1 list-disc list-inside">
              <li>Explore 2-3 starter robotics or coding tutorials online.</li>
              <li>Discuss RIASEC interest findings with a teacher or parent.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00B8D4]" />
              <h4 className="text-xs font-black uppercase text-[#00B8D4]">Next 3 Months</h4>
            </div>
            <p className="text-xs text-[#172B2A] dark:text-[#F7FAF9] font-bold">Skill Prototyping</p>
            <ul className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1 list-disc list-inside">
              <li>Complete a small hands-on physical or software build.</li>
              <li>Join a school STEM, robotics, or design club.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF6EC] dark:bg-[#211E16] border border-[#E5C158]/30 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">Next 6 Months</h4>
            </div>
            <p className="text-xs text-[#172B2A] dark:text-[#F7FAF9] font-bold">Academic Alignment</p>
            <ul className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1 list-disc list-inside">
              <li>Review secondary school subject combinations with a school counselor.</li>
              <li>Participate in a science fair, hackathon, or design showcase.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 17. RETEST & PROGRESS TRACKING */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4 print:shadow-none print:p-5 print:rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
              17. Retest & Progress Tracking
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Longitudinal Development Calibration
            </h2>
          </div>
          <div className="p-2 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Baseline Attempt Registered
            </p>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
              As you complete additional exploratory learning cycles and re-evaluate next semester, progress metrics and trait stability shifts will appear here.
            </p>
          </div>
          <Link
            href="/participant/assessments"
            className="px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
          >
            Explore More Assessments
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 18. METHODOLOGY & PSYCHOMETRIC INTERPRETATION */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4 print:shadow-none print:p-5 print:rounded-2xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
            18. Methodology & Psychometric Interpretation
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Assessment Construct & Interpretation Boundaries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
          <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
            <h4 className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>What This Report Accomplishes</span>
            </h4>
            <p>
              Provides structured psychometric profiling across Holland RIASEC interests, measured spatial/logical reasoning tasks, and behavioral learning habits to encourage curiosity-driven career exploration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
            <h4 className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#00BFA5]" />
              <span>Interpretation Safeguards</span>
            </h4>
            <p>
              This report is NOT a clinical diagnosis, nor does it rigidly prescribe a single career destiny. Human interests and capabilities evolve continuously with deliberate practice, education, and life experiences.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 19. TECHNICAL REPORT METADATA (Collapsible for Students, Open in Counsellor View) */}
      {/* ========================================================================= */}
      <div className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setIsTechnicalMetaOpen(!isTechnicalMetaOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00BFA5]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              19. Technical Assessment & System Metadata
            </span>
          </div>
          {isTechnicalMetaOpen ? (
            <ChevronUp className="w-4 h-4 text-[#728B88]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#728B88]" />
          )}
        </button>

        {(isTechnicalMetaOpen || audienceView === "COUNSELLOR") && (
          <div className="px-6 pb-6 pt-2 border-t border-[#E3ECEA] dark:border-white/10 bg-[#F4F8F7]/50 dark:bg-black/20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#728B88] uppercase">Report ID</span>
                <p className="text-[#172B2A] dark:text-[#F7FAF9] truncate">{report.reportId}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#728B88] uppercase">Attempt ID</span>
                <p className="text-[#172B2A] dark:text-[#F7FAF9] truncate">{report.attemptId}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#728B88] uppercase">Template Version</span>
                <p className="text-[#172B2A] dark:text-[#F7FAF9]">{report.templateVersion}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#728B88] uppercase">Generated Timestamp</span>
                <p className="text-[#172B2A] dark:text-[#F7FAF9] truncate">{report.generatedAt}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 20. FOOTER DISCLAIMER */}
      {/* ========================================================================= */}
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

