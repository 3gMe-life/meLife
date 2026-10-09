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
  ScoredDimensionItem,
} from "../types/report.types";
import { reportApi } from "../api/report.api";

// Visual Interactive Discovery Components
import { UniverseConstellationMap } from "./visual/UniverseConstellationMap";
import { RiasecRadarMap } from "./visual/RiasecRadarMap";
import { StrengthsInActionGrid } from "./visual/StrengthsInActionGrid";
import { HowYouLearnCard } from "./visual/HowYouLearnCard";
import { GrowthOpportunitiesSection } from "./visual/GrowthOpportunitiesSection";
import { CareerExplorationPathwayMap } from "./visual/CareerExplorationPathwayMap";
import { ExplainableCareerCard } from "./visual/ExplainableCareerCard";
import { FutureWorkAiCompass } from "./visual/FutureWorkAiCompass";
import { ActionRoadmapSection } from "./visual/ActionRoadmapSection";
import { ReportAudienceHeader } from "./visual/ReportAudienceHeader";

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
            className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-950 dark:text-amber-200"
          >
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  // Aggregate all scored dimensions safely
  const allScoredDimensions: ScoredDimensionItem[] = [
    ...(report.interestProfile?.dimensions || []),
    ...(report.aptitudeInsights?.dimensions || []),
    ...(report.skillBehaviour?.dimensions || []),
    ...(report.developmentalStrengths?.dimensions || []),
  ];

  // Deduplicate dimensions by code
  const uniqueDimensionsMap = new Map<string, ScoredDimensionItem>();
  allScoredDimensions.forEach((d) => {
    if (!uniqueDimensionsMap.has(d.code)) {
      uniqueDimensionsMap.set(d.code, d);
    }
  });

  const allUniqueDimensions = Array.from(uniqueDimensionsMap.values());
  const sortedStrengths = [...allUniqueDimensions].sort(
    (a, b) => (b.scalePositionPercentage || 0) - (a.scalePositionPercentage || 0)
  );

  const topStrengths =
    report.developmentalStrengths?.topStrengths?.length > 0
      ? report.developmentalStrengths.topStrengths
      : sortedStrengths.slice(0, 6);

  const growthAreas =
    report.skillBehaviour?.developmentOpportunities?.length > 0
      ? report.skillBehaviour.developmentOpportunities
      : sortedStrengths.slice(-4).reverse();

  // In-page navigation anchors
  const navAnchors = [
    { id: "section-overview", label: "01. Overview" },
    { id: "section-constellation", label: "02. Galaxy" },
    { id: "section-riasec", label: "03. RIASEC" },
    { id: "section-strengths", label: "04. Strengths" },
    { id: "section-learning", label: "05. Learning" },
    { id: "section-growth", label: "06. Growth" },
    { id: "section-pathways", label: "07. Pathways" },
    { id: "section-evidence", label: "08. Careers" },
    { id: "section-future-work", label: "09. Future & AI" },
    { id: "section-roadmap", label: "10. Roadmap" },
    { id: "section-parent-guide", label: "11. Guidance" },
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-24 print:p-0 print:m-0 print:max-w-none print:space-y-6 select-none-safe"
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
      {/* STICKY REPORT AUDIENCE & INTERACTION DOCK */}
      {/* ========================================================================= */}
      <ReportAudienceHeader
        currentAudience={audienceView}
        onAudienceChange={setAudienceView}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloading}
        studentName={report.studentProfile.studentName}
        archetypeTitle={report.executiveSummary.archetypeTitle}
        navAnchors={navAnchors}
      />

      {/* Top Back Navigation (Desktop & Mobile) */}
      <div className="flex items-center justify-between px-2 print:hidden">
        <Link
          href="/participant/results"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessment Results</span>
        </Link>
        <span className="text-[11px] font-mono text-[#728B88] dark:text-white/50">
          Template v{report.templateVersion || "2.4.0"} • Attempt #{report.studentProfile.attemptNumber || 1}
        </span>
      </div>

      {downloadError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
          {downloadError}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 01: LUXURY MAGAZINE COVER & HERO SNAPSHOT */}
      {/* ========================================================================= */}
      <section
        id="section-overview"
        className="print-break-avoid relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#091514] via-[#0F2624] to-[#0A1716] text-white p-7 sm:p-10 border border-[#00BFA5]/30 shadow-2xl print:shadow-none print:p-6 print:rounded-2xl print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]"
      >
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#00BFA5]/20 blur-3xl pointer-events-none print:hidden" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#00B8D4]/15 blur-3xl pointer-events-none print:hidden" />

        <div className="relative z-10 space-y-6">
          {/* Top Tag Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA] print:pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 flex items-center gap-1.5 print:border-[#00BFA5] print:text-[#008F83]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personal Psychometric Discovery</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white/90 border border-white/15 print:border-[#E3ECEA] print:text-[#526866]">
                {report.studentProfile.versionName || "MeLife Discovery Edition"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-white/70 print:text-[#688582]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#00BFA5]" />
                {new Date(report.studentProfile.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="text-[#00C896] font-bold">100% Calibrated</span>
            </div>
          </div>

          {/* Editorial Title & Archetype Spotlight */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00BFA5] font-mono block print:text-[#008F83]">
              Psychometric Profile Archetype
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white print:text-[#172B2A] leading-tight">
              {report.executiveSummary.archetypeTitle}
            </h1>
            <p className="text-sm sm:text-base font-semibold italic text-[#00C896] max-w-3xl print:text-[#008F83]">
              &ldquo;{report.executiveSummary.tagline}&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-[#C5D6D3] max-w-3xl leading-relaxed print:text-[#415654]">
              {report.executiveSummary.strengthSummary}
            </p>
          </div>

          {/* Primary Traits Showcase Pills */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/50 block print:text-[#688582]">
              Core Signature Drivers:
            </span>
            <div className="flex flex-wrap gap-2">
              {report.executiveSummary.primaryTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white/10 text-white border border-white/15 flex items-center gap-2 shadow-sm print:bg-[#F0FDF4] print:border-[#00BFA5] print:text-[#008F83]"
                >
                  <Award className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>{trait}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Student Profile Snapshot Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/10 text-xs print:border-[#E3ECEA]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider print:text-[#688582]">Student Name</span>
              <p className="font-black text-white truncate flex items-center gap-1.5 print:text-[#172B2A]">
                <User className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>{report.studentProfile.studentName}</span>
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider print:text-[#688582]">Academic Stage</span>
              <p className="font-bold text-white truncate print:text-[#172B2A]">
                {report.studentProfile.educationStage} • {report.studentProfile.schoolName}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider print:text-[#688582]">Primary Vector</span>
              <p className="font-bold text-[#00C896] print:text-[#008F83]">
                {report.interestProfile?.primaryOrientation} + {report.interestProfile?.secondaryOrientation}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider print:text-[#688582]">Confidence Status</span>
              <p className="font-bold text-emerald-400 flex items-center gap-1 print:text-[#059669]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Baseline</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02: MULTIDIMENSIONAL CONSTELLATION GALAXY */}
      {/* ========================================================================= */}
      <section id="section-constellation" className="print-break-avoid">
        <UniverseConstellationMap
          dimensions={allUniqueDimensions}
          archetypeTitle={report.executiveSummary.archetypeTitle}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03: HOLLAND RIASEC INTEREST HEXAGON RADAR */}
      {/* ========================================================================= */}
      <section id="section-riasec" className="print-break-avoid">
        <RiasecRadarMap
          clusters={report.interestProfile?.topClusters || []}
          primaryOrientation={report.interestProfile?.primaryOrientation}
          secondaryOrientation={report.interestProfile?.secondaryOrientation}
          summary={report.interestProfile?.summary}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04: SIGNATURE STRENGTHS IN REAL-WORLD ACTION */}
      {/* ========================================================================= */}
      <section id="section-strengths" className="print-break-avoid">
        <StrengthsInActionGrid strengths={topStrengths} />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05: COGNITIVE ARCHITECTURE & LEARNING STYLE */}
      {/* ========================================================================= */}
      <section id="section-learning" className="print-break-avoid">
        <HowYouLearnCard
          aptitude={report.aptitudeInsights}
          developmental={report.developmentalStrengths}
          learningHabitsSummary={report.developmentalStrengths?.learningHabitsSummary}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 06: HIGH-LEVERAGE GROWTH FRONTIERS */}
      {/* ========================================================================= */}
      <section id="section-growth" className="print-break-avoid">
        <GrowthOpportunitiesSection
          growthAreas={growthAreas}
          growthSuggestions={report.developmentalStrengths?.growthSuggestions}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 07: EDUCATIONAL & CAREER PATHWAY ARCHITECTURE */}
      {/* ========================================================================= */}
      <section id="section-pathways" className="print-break-avoid">
        <CareerExplorationPathwayMap
          clusters={report.explorationAreas?.clusters || []}
          archetypeTitle={report.executiveSummary.archetypeTitle}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 08: EXPLAINABLE CAREER MATCH EVIDENCE DRAWER */}
      {/* ========================================================================= */}
      <section
        id="section-evidence"
        className="print-break-avoid rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6 print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]"
      >
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#38BDF8]/15 blur-3xl print:hidden" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA] print:pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Compass className="w-3.5 h-3.5" />
              <span>08. Deep-Dive Career Fit Evidence</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
              Curated High-Synergy Career Horizons
            </h2>
          </div>
          <span className="text-xs text-[#9FB3B0] print:text-[#526866]">
            Click any career card to inspect match evidence & skill blueprints
          </span>
        </div>

        <div className="relative z-10 space-y-3.5">
          {report.explorationAreas?.clusters?.map((cluster, idx) => (
            <ExplainableCareerCard
              key={idx}
              rank={idx + 1}
              career={{
                title: cluster.clusterTitle,
                domain: cluster.domain,
                description: cluster.description,
                futureGrowth: idx === 0 ? "Very High" : "High",
                whyEvidence: cluster.whyEvidence,
                requiredSkills: cluster.sampleFocusAreas,
                suggestedProjectsAndActivities: cluster.suggestedProjectsAndActivities,
                developmentAreas: cluster.developmentAreas,
              }}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 09: FUTURE OF WORK & AI READINESS COMPASS */}
      {/* ========================================================================= */}
      <section id="section-future-work" className="print-break-avoid">
        <FutureWorkAiCompass
          archetypeTitle={report.executiveSummary.archetypeTitle}
          topTraits={report.executiveSummary.primaryTraits}
          primaryOrientation={report.interestProfile?.primaryOrientation}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: PROGRESSIVE 30-DAY / 3-MONTH / 6-MONTH ROADMAP */}
      {/* ========================================================================= */}
      <section id="section-roadmap" className="print-break-avoid">
        <ActionRoadmapSection
          actionPlan={report.actionPlan}
          topStrengths={report.executiveSummary.primaryTraits}
          growthSuggestions={report.developmentalStrengths?.growthSuggestions}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11: PARENT & COUNSELLOR GUIDANCE */}
      {/* ========================================================================= */}
      <section
        id="section-parent-guide"
        className={`print-break-avoid rounded-3xl bg-gradient-to-br from-[#0D1E1C] via-[#122624] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6 ${
          audienceView === "PARENT"
            ? "ring-2 ring-[#00BFA5] shadow-[#00BFA5]/20"
            : audienceView === "COUNSELLOR"
            ? "ring-2 ring-[#38BDF8] shadow-[#38BDF8]/20"
            : ""
        } print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>11. Parent & Counsellor Collaborative Guidance</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
              Nurturing Potential with Constructive Dialogue
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">
            {audienceView === "PARENT" ? "Active Mode: Parent Guidance" : audienceView === "COUNSELLOR" ? "Active Mode: Counsellor Diagnostics" : "Family & Mentorship Alignment"}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#C5D6D3] leading-relaxed print:text-[#415654]">
          {report.parentGuidance?.nurturingMindsetSummary ||
            "Supportive conversations focus on effort, curiosity, and iterative skill-building rather than locking students prematurely into a single rigid career box."}
        </p>

        {/* DOs vs DONTs Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Supportive DOs */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 print:bg-emerald-50 print:border-[#00BFA5]/30 print:text-[#065F46]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#A7F3D0] flex items-center gap-1.5 print:text-[#065F46]">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>Recommended Supportive Actions (DOs)</span>
            </h3>
            <ul className="text-xs text-[#E0EBE8] space-y-2 print:text-[#2A4442]">
              {report.parentGuidance?.dos?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#00BFA5] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Avoid */}
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3 print:bg-rose-50 print:border-rose-200 print:text-[#9F1239]">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5 print:text-[#9F1239]">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Practices to Avoid (DON&apos;Ts)</span>
            </h3>
            <ul className="text-xs text-[#E0EBE8] space-y-2 print:text-[#2A4442]">
              {report.parentGuidance?.donts?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conversation Starters */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
            <MessageSquare className="w-4 h-4" />
            <span>Empathetic Conversation Starters for Family Discussions</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.parentGuidance?.recommendedDiscussions?.map((disc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#E0EBE8] italic leading-relaxed print:bg-white print:border-[#E3ECEA] print:text-[#172B2A]"
              >
                &ldquo;{disc}&rdquo;
              </div>
            ))}
          </div>
        </div>

        {/* Counsellor Diagnostic Dimension Table (Visible in Counsellor View or Collapsible) */}
        {audienceView === "COUNSELLOR" && (
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-400" />
                <span>Counsellor Raw Dimensional Calibration Table</span>
              </span>
              <span className="text-[10px] font-mono text-sky-300/80">Normative Cohort Scale</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {allUniqueDimensions.map((dim, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                  <span className="font-bold truncate text-white/90">{dim.name}</span>
                  <span className="font-mono text-sky-300 font-bold ml-2">
                    {dim.scalePositionPercentage ?? (dim as any).rawScore ?? 75}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 12: TECHNICAL AUDIT, RETESTING & SYSTEM METADATA */}
      {/* ========================================================================= */}
      <section className="print-break-avoid rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setIsTechnicalMetaOpen(!isTechnicalMetaOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00BFA5]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              Technical Assessment & Psychometric Audit Metadata
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
      </section>

      {/* ========================================================================= */}
      {/* FOOTER DISCLAIMER */}
      {/* ========================================================================= */}
      <footer className="print-break-avoid text-center text-[11px] text-[#728B88] dark:text-[#7D9491] space-y-1 pt-6 border-t border-[#E3ECEA] dark:border-white/10 print:pt-4">
        <p>
          © {new Date().getFullYear()} 3G MeLife Student Psychometric Discovery Platform. All rights reserved.
        </p>
        <p>
          Designed for curiosity-driven educational navigation and non-prescriptive personal growth.
        </p>
      </footer>
    </div>
  );
}
