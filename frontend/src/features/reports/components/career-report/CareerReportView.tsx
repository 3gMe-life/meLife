"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CareerReportDTO } from "../../types/career-report.types";
import { CoverSection } from "./CoverSection";
import { ExecutiveSummarySection } from "./ExecutiveSummarySection";
import { PsychometricProfileSection } from "./PsychometricProfileSection";
import { StrengthAnalysisSection } from "./StrengthAnalysisSection";
import { CareerMatchesSection } from "./CareerMatchesSection";

const CareerDeepDiveSection = dynamic(
  () => import("./CareerDeepDiveSection").then((m) => m.CareerDeepDiveSection),
  { ssr: true }
);
const AlternativePathwaysSection = dynamic(
  () => import("./AlternativePathwaysSection").then((m) => m.AlternativePathwaysSection),
  { ssr: true }
);
const DevelopmentPlanSection = dynamic(
  () => import("./DevelopmentPlanSection").then((m) => m.DevelopmentPlanSection),
  { ssr: true }
);
const ParentGuidanceSection = dynamic(
  () => import("./ParentGuidanceSection").then((m) => m.ParentGuidanceSection),
  { ssr: true }
);
const ClosingSummarySection = dynamic(
  () => import("./ClosingSummarySection").then((m) => m.ClosingSummarySection),
  { ssr: true }
);
const CounsellorInsightsSection = dynamic(
  () => import("./CounsellorInsightsSection").then((m) => m.CounsellorInsightsSection),
  { ssr: true }
);
import {
  Download,
  Languages,
  Printer,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Compass,
  Zap,
  Target,
  Users,
  BookMarked,
  Share2,
} from "lucide-react";
import { useDownloadCareerReportPdfMutation } from "../../hooks/useCareerReportQueries";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CareerReportViewProps {
  report: CareerReportDTO;
  onLanguageChange?: (lang: string) => void;
  currentLanguage?: string;
  isCounsellorView?: boolean;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
];

const SECTIONS = [
  { id: "section-cover", label: "Cover & Archetype", icon: Compass },
  { id: "section-summary", label: "Executive Summary", icon: Layers },
  { id: "section-psychometrics", label: "RIASEC Interests", icon: Sparkles },
  { id: "section-strengths", label: "Cognitive Strengths", icon: Zap },
  { id: "section-matches", label: "Career Matches", icon: Compass },
  { id: "section-deepdives", label: "Career Deep Dive", icon: BookMarked },
  { id: "section-alternatives", label: "Alternative Pathways", icon: Compass },
  { id: "section-development", label: "Skill Development", icon: Target },
  { id: "section-parent-guidance", label: "Parent Guidance", icon: Users },
  { id: "section-closing", label: "Summary & Next Steps", icon: Sparkles },
];

export const CareerReportView: React.FC<CareerReportViewProps> = ({
  report: rawReport,
  onLanguageChange,
  currentLanguage = "en",
  isCounsellorView = false,
}) => {
  const router = useRouter();
  const report: CareerReportDTO = (rawReport as any)?.data || rawReport;
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const downloadMutation = useDownloadCareerReportPdfMutation();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(isCounsellorView ? "/counsellor/students" : "/participant/reports");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadError(null);
      await downloadMutation.mutateAsync({
        reportId: report?.reportId || "latest",
        language: report?.language || currentLanguage,
        filename: `3G_MeLife_Career_Report_${report?.cover?.studentName?.replace(/\s+/g, "_") || "Student"}.pdf`,
      });
    } catch (err: any) {
      setDownloadError(err.message || "Failed to download PDF report.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navSections = report?.counsellorInsights
    ? [...SECTIONS, { id: "section-counsellor-insights", label: "Counsellor Insights", icon: ShieldCheck }]
    : SECTIONS;

  if (!report || !report.cover) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6 text-center text-slate-500">
        Report data is currently unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] p-4 md:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400 transition-all cursor-pointer shadow-2xs group shrink-0"
            title="Go back to previous page"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shrink-0">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {isCounsellorView ? "Practitioner Consultation Mode" : "Student Exploration Report"}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {report.cover?.studentName} &bull; {report.cover?.profileArchetype}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Switcher */}
          {onLanguageChange && (
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2">
              <Languages className="h-4 w-4 text-slate-400" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Copy Report Link to share with parents or counsellor"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Download Official PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloadMutation.isPending}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white hover:bg-teal-700 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Download className={`h-4 w-4 ${downloadMutation.isPending ? "animate-bounce" : ""}`} />
            <span>{downloadMutation.isPending ? "Generating PDF..." : "Download Official PDF"}</span>
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs text-rose-700 dark:text-rose-300">
          {downloadError}
        </div>
      )}

      {/* Unassessed Prompt Banner if student hasn't completed Skill Finder */}
      {!report.isAssessed && (
        <div className="mb-6 rounded-3xl border border-amber-300 dark:border-amber-900/60 bg-gradient-to-r from-amber-50 dark:from-amber-950/40 via-amber-100/30 to-transparent p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
              <Sparkles className="h-4 w-4 text-amber-600" /> Preliminary Exploration Preview
            </div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 max-w-2xl">
              This report is currently generated using foundational educational benchmarks. Complete the 3G MeLife Skill Finder assessment to unlock your personalized psychometric profile and tailored match affinities!
            </p>
          </div>

          <Link
            href="/participant/assessments"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-black text-white hover:bg-amber-700 transition-all shadow-sm"
          >
            <span>Take Skill Finder Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Main Grid: Sticky Sidebar + 10-Section Document Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Navigation Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 px-2">
              Report Flow
            </div>
            <nav className="space-y-1 text-xs">
              {navSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition-all cursor-pointer"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400">
                    {idx + 1}
                  </span>
                  <span className="truncate">{sec.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Counsellor Connect Quick Card */}
          <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-950/90 to-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Calendar className="h-4 w-4" /> 1-on-1 Guidance
            </div>
            <h4 className="mt-2 text-sm font-black text-white">
              Discuss Your Report with a Mentor
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Connect with our accredited guidance counsellors to map these findings into your subject selection and future career strategy.
            </p>
            <div className="mt-4">
              <Link
                href="/participant/counsellors"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-teal-300 transition-colors"
              >
                <span>Book Counselling Session</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Report Sections Document Container */}
        <div className="lg:col-span-9 space-y-8">
          {/* Section 1: Cover & Student Profile */}
          <CoverSection data={report.cover} reportId={report.reportId} />

          {/* Section 2: Executive Summary & Learning Orientation */}
          <ExecutiveSummarySection data={report.executiveSummary} />

          {/* Section 3: Psychometric RIASEC Interest Architecture */}
          <PsychometricProfileSection data={report.psychometricProfile} />

          {/* Section 4: Cognitive & Developmental Strength Analysis */}
          <StrengthAnalysisSection strengths={report.strengthAnalysis} />

          {/* Section 5: Recommended Career Exploration Pathways */}
          <CareerMatchesSection matches={report.careerMatches} />

          {/* Section 6: In-Depth Career Exploration Detail */}
          <CareerDeepDiveSection deepDives={report.careerDeepDives} />

          {/* Section 7: Alternative & Interdisciplinary Pathways */}
          <AlternativePathwaysSection pathways={report.alternativePathways} />

          {/* Section 8: Actionable Skill Development Plan */}
          <DevelopmentPlanSection data={report.developmentPlan} />

          {/* Section 9: Parent & Guardian Guidance Framework */}
          <ParentGuidanceSection data={report.parentGuidance} />

          {/* Section 10: Closing Summary & Counsellor CTA */}
          <ClosingSummarySection
            studentName={report.cover.studentName}
            reportId={report.reportId}
            templateVersion={report.templateVersion}
          />

          {/* Section 11: Counsellor Insights (Protected View) */}
          {report.counsellorInsights && (
            <CounsellorInsightsSection data={report.counsellorInsights} />
          )}
        </div>
      </div>
    </div>
  );
};
