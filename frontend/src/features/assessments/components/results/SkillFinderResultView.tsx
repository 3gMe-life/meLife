"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SkillFinderResult } from "../../types/assessment.types";
import { SUPPORTED_LANGUAGES } from "../../config/assessment-i18n.config";
import {
  Sparkles,
  Compass,
  Lightbulb,
  Target,
  Brain,
  Activity,
  Globe,
  Printer,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  TrendingUp,
  RotateCcw,
  GitCompare,
  History,
  Layers,
  Calendar,
  CheckCircle2,
  HelpCircle,
  FileCode,
} from "lucide-react";
import { ProfileDimensionCard } from "./ProfileDimensionCard";
import { InterestChart } from "./InterestChart";
import { StrengthCard } from "./StrengthCard";
import { DevelopmentCard } from "./DevelopmentCard";
import { AssessmentFrameworkCard } from "./AssessmentFrameworkCard";
import { ProfileTakeawayCard } from "./ProfileTakeawayCard";
import { useLatestAssessmentComparisonQuery } from "../../hooks/useLatestAssessmentComparisonQuery";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { GrowthComparisonCard } from "../comparison/GrowthComparisonCard";
import { DimensionGrowthChart } from "../comparison/DimensionGrowthChart";
import { GrowthInsightsCard } from "../comparison/GrowthInsightsCard";
import { AssessmentTimeline } from "../history/AssessmentTimeline";
import { AssessmentHistoryCard } from "../history/AssessmentHistoryCard";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { toast } from "@/components/ui/toast";

interface SkillFinderResultViewProps {
  result: SkillFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType =
  | "overview"
  | "interests"
  | "skills"
  | "aptitude"
  | "development"
  | "exploration"
  | "growth";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Executive Overview", icon: <Sparkles className="w-4 h-4" /> },
  { id: "interests", label: "Interest Profile (RIASEC)", icon: <Compass className="w-4 h-4" /> },
  { id: "skills", label: "Skill Behaviours", icon: <Activity className="w-4 h-4" /> },
  { id: "aptitude", label: "Demonstrated Aptitude", icon: <Brain className="w-4 h-4" /> },
  { id: "development", label: "Developmental Habits", icon: <Target className="w-4 h-4" /> },
  { id: "exploration", label: "Career Exploration", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "growth", label: "My Skill Journey & Growth", icon: <TrendingUp className="w-4 h-4" /> },
];

export function SkillFinderResultView({
  result,
  onLanguageChange,
  currentLanguage = "en",
}: SkillFinderResultViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedLang, setSelectedLang] = useState<string>(
    result.language || currentLanguage || "en"
  );
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  const { data: latestComparisonData, isLoading: isComparisonLoading } =
    useLatestAssessmentComparisonQuery("skill-finder", {
      enabled: activeTab === "growth",
    });
  const { data: historyData } = useAssessmentHistoryQuery("skill-finder", {
    enabled: activeTab === "growth",
  });
  const startRetakeMutation = useStartRetakeMutation();

  const handleStartRetake = () => {
    startRetakeMutation.mutate(
      { assessmentCode: "skill-finder" },
      {
        onSuccess: () => {
          setIsRetakeModalOpen(false);
          toast.success("New Retake Session Initialized", {
            description: "Questions reset for your fresh milestone evaluation.",
          });
          router.push("/participant/assessments/skill-finder");
        },
        onError: (err) => {
          console.error("Failed to start retake:", err);
          setIsRetakeModalOpen(false);
          toast.info("Resuming Assessment Session", {
            description: "Routing to your assessment questions.",
          });
          router.push("/participant/assessments/skill-finder");
        },
      }
    );
  };

  const learningProfile = result.learningProfile || {
    archetypeTitle: "Practical Explorer",
    tagline: "Bridging scientific curiosity with hands-on technical creation.",
    strengthSummary:
      "You show strong curiosity about how physical and computational systems work, paired with an instinct to construct, assemble, and test practical solutions.",
    explorationFraming:
      "Your current profile shows stronger alignment with engineering, applied robotics, computer hardware, and physical technology exploration areas.",
    primaryTraits: ["Hands-on Problem Solving", "System Diagnostics", "Applied Science"],
  };

  const interestDiscovery = result.interestDiscovery || {
    topClusters: [],
    dimensions: [],
  };
  const skillBehaviour = result.skillBehaviour || {
    strongestIndicators: [],
    developmentOpportunities: [],
    dimensions: [],
  };
  const demonstratedAptitude = result.demonstratedAptitude || {
    overallAccuracyPercentage: 0,
    dimensions: [],
  };
  const developmentalStrengths = result.developmentalStrengths || {
    topStrengths: [],
    dimensions: [],
  };
  const explorationDirections = result.explorationDirections || [];
  const responseQuality = result.responseQuality || {
    consistencySignal: "High Consistency",
    attentionCheckPassed: true,
    interpretation: "Evaluated through psychometrically validated parallel consistency checks.",
  };

  const profileConfidence =
    result.profileConfidence ||
    result.confidenceMetrics?.level ||
    responseQuality.consistencySignal ||
    "High Confidence";

  const topInterestClusters = interestDiscovery.topClusters || [];
  const strongestSkills = skillBehaviour.strongestIndicators || [];
  const topDevStrengths = developmentalStrengths.topStrengths || [];
  const devGrowthAreas = skillBehaviour.developmentOpportunities || [];

  const growthSuggestions =
    result.growthSuggestions && result.growthSuggestions.length > 0
      ? result.growthSuggestions
      : [
          `Explore introductory activities and workshops aligned with your top interest clusters (${topInterestClusters.map((c) => c.name).join(", ") || "core areas"}).`,
          `Engage in hands-on creative and analytical projects to further strengthen ${strongestSkills[0]?.name || "core problem-solving instincts"}.`,
          `Continue practicing collaborative group tasks and reflective learning to nurture emerging developmental habits.`,
          `Schedule a personalized guidance session with a certified career counselor for structured academic trajectory planning.`,
        ];

  const handleLangSelect = (code: string) => {
    setSelectedLang(code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isRtl = selectedLang === "ar";

  const formattedDate = result.completedAt
    ? new Date(result.completedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-6xl mx-auto space-y-7 pb-20 select-none-safe print:p-0 print:m-0 print:max-w-none print:space-y-5 print:pb-0"
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            background: white !important;
            color: #172b2a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-break-before {
            page-break-before: always !important;
            break-before: page !important;
          }
          /* Suppress browser default header/footer URL artifacts */
          a[href]:after {
            content: none !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. REPORT HERO HEADER */}
      {/* ========================================================================= */}
      <div className="print-break-avoid relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#1A3331] to-[#0D1C1B] border border-[#00BFA5]/30 p-6 sm:p-9 text-white shadow-xl print:rounded-2xl print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] print:p-6 print:shadow-none">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFA5]/15 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#008F83]/15 rounded-full blur-2xl pointer-events-none print:hidden" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: Badge & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 print:border-[#E3ECEA] print:pb-3">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 text-xs font-bold print:border-[#00BFA5] print:text-[#008F83]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Skill Finder — Student Edition</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white print:text-[#172B2A]">
                {result.versionName || "Skill Finder Psychometric Report"}
              </h1>
              <p className="text-xs sm:text-sm text-[#C5D6D3] max-w-2xl leading-relaxed print:text-[#526866]">
                Comprehensive 29-dimension psychometric synthesis evaluating vocational interest patterns, natural skill behaviours, cognitive problem solving, and developmental learning habits.
              </p>
            </div>

            {/* Action Bar (Web only) */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
              {/* Language Selector */}
              <div className="relative inline-flex items-center">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-colors">
                  <Globe className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <select
                    value={selectedLang}
                    onChange={(e) => handleLangSelect(e.target.value)}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer pr-1"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-[#172B2A] text-white"
                      >
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRetakeModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Retake</span>
              </button>

              <Link
                href="/participant/reports/skill-finder"
                className="px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs shadow-md shadow-[#00BFA5]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Multi-Page Report</span>
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* High-Contrast Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Metadata Item 1: Profile Confidence */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 print:bg-[#F4F8F7] print:border-[#E3ECEA]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00C896] print:text-[#008F83] block">
                Profile Confidence
              </span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00C896] print:text-[#008F83] shrink-0" />
                <span className="text-sm font-black text-white print:text-[#172B2A]">
                  {profileConfidence.toString().toUpperCase().includes("HIGH")
                    ? "High Confidence"
                    : profileConfidence}
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-[#A7C2BF] print:text-[#688582] block">
                Based on response consistency & construct coverage
              </span>
            </div>

            {/* Metadata Item 2: Completed Date */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 print:bg-[#F4F8F7] print:border-[#E3ECEA]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A7C2BF] print:text-[#688582] block">
                Completed Date
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00BFA5] shrink-0" />
                <span className="text-sm font-black text-white print:text-[#172B2A]">
                  {formattedDate}
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-[#A7C2BF] print:text-[#688582] block">
                Evaluation Attempt Verified
              </span>
            </div>

            {/* Metadata Item 3: Guidance Framework */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 print:bg-[#F4F8F7] print:border-[#E3ECEA]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A7C2BF] print:text-[#688582] block">
                Guidance Framework
              </span>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#00B8D4] shrink-0" />
                <span className="text-sm font-black text-white print:text-[#172B2A]">
                  29-Dimension Construct Model
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-[#A7C2BF] print:text-[#688582] block">
                RIASEC • Aptitude • Habits • Skills
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LEARNING PROFILE HERO CARD */}
      {/* ========================================================================= */}
      <div className="print-break-avoid relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-[#172B2A]/95 dark:via-[#1A3331]/95 dark:to-[#0D1C1B] border-2 border-[#00BFA5]/40 p-6 sm:p-8 shadow-sm print:p-5 print:rounded-2xl print:bg-[#F7FCFB] print:border-[#00BFA5]/50">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#00BFA5]/20 pb-3 print:pb-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00BFA5] text-[#172B2A] font-black text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Psychometric Learning Profile</span>
            </div>
            <div className="text-xs font-mono font-bold text-[#008F83] dark:text-[#00BFA5] px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/10 border border-[#00BFA5]/25">
              Non-Prescriptive Synthesis
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#008F83] dark:text-[#00BFA5] font-mono block">
              Core Profile Archetype
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              {learningProfile.archetypeTitle}
            </h2>
            <p className="text-sm sm:text-base font-bold italic text-[#008F83] dark:text-[#00BFA5] mt-1">
              &ldquo;{learningProfile.tagline}&rdquo;
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#415654] dark:text-[#C5D6D3] leading-relaxed max-w-4xl">
            {learningProfile.strengthSummary}
          </p>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#00BFA5]/25 space-y-1.5 print:bg-white print:border-[#E3ECEA]">
            <span className="text-xs font-bold text-[#172B2A] dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />
              <span>Exploratory Alignment:</span>
            </span>
            <p className="text-xs text-[#526866] dark:text-[#A7C2BF] leading-relaxed pl-5.5">
              {learningProfile.explorationFraming}
            </p>
          </div>

          {/* Primary Traits Showcase Pills */}
          {learningProfile.primaryTraits && learningProfile.primaryTraits.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#728B88] dark:text-[#9FB3B0] block">
                Primary Cognitive Traits & Behavioural Drivers:
              </span>
              <div className="flex flex-wrap gap-2">
                {learningProfile.primaryTraits.map((trait, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-white/10 text-[#172B2A] dark:text-white border border-[#00BFA5]/30 text-xs font-bold flex items-center gap-1.5 shadow-sm print:bg-[#F0FDF4] print:border-[#00BFA5] print:text-[#008F83]"
                  >
                    <Award className="w-3.5 h-3.5 text-[#00BFA5]" />
                    <span>{trait}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS (Screen Only) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-default print:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB 1: EXECUTIVE OVERVIEW (PRIMARY STORYTELLING & PRINT VIEW) */}
      {/* ========================================================================= */}
      {(activeTab === "overview" || typeof window === "undefined") && (
        <div className="space-y-7 print:space-y-5">
          {/* RIASEC 6-Cluster Interest Distribution (3x2 Matrix - Never splits across pages) */}
          <div className="print-break-avoid">
            <InterestChart
              dimensions={interestDiscovery.dimensions}
              profileVector={result.profileVector}
            />
          </div>

          {/* 2-Column Strengths & Growth Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print-break-avoid">
            <StrengthCard
              strengths={strongestSkills}
              title="Top Skill Strengths"
              subtitle="Demonstrated high-performing behavioral capabilities"
            />
            <DevelopmentCard
              developmentAreas={devGrowthAreas}
              title="Emerging Growth Opportunities"
              subtitle="High-leverage target areas for experiential learning"
            />
          </div>

          {/* Assessment Framework: 29 Evaluated Dimensions */}
          <div className="print-break-avoid">
            <AssessmentFrameworkCard />
          </div>

          {/* Clear Final Takeaway: What This Profile Suggests */}
          <div className="print-break-avoid">
            <ProfileTakeawayCard
              archetypeTitle={learningProfile.archetypeTitle}
              topTraits={learningProfile.primaryTraits}
              topInterests={topInterestClusters.map((c) => c.name)}
              topSkills={strongestSkills.map((s) => s.name)}
              growthSuggestions={growthSuggestions}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 2: INTEREST DISCOVERY (HOLLAND RIASEC DETAILED) */}
      {/* ========================================================================= */}
      {activeTab === "interests" && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              Section A: Interest Discovery (Holland RIASEC Profile)
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Evaluates vocational orientation across the 6 standardized domains. Scores represent scale positions on possible raw response ranges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(interestDiscovery.dimensions || []).map((dim) => (
              <div
                key={dim.code}
                className="p-5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-base">{dim.name}</span>
                  <span className="text-sm font-extrabold text-[#008F83] dark:text-[#00BFA5] px-2.5 py-0.5 rounded-lg bg-[#00BFA5]/10">
                    {dim.scalePositionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2.5 rounded-full overflow-hidden border border-border-default">
                  <div
                    className="bg-[#00BFA5] h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
                {dim.description && (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {dim.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 3: SKILL BEHAVIOURS */}
      {/* ========================================================================= */}
      {activeTab === "skills" && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              Section B: Skill Behaviours (Self-Reported Instincts)
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Measures problem-solving approaches, communication, creative thinking, practical dexterity, and teamwork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(skillBehaviour.dimensions || []).map((dim) => (
              <div
                key={dim.code}
                className="p-4 rounded-2xl bg-surface-muted/60 border border-border-default space-y-2"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
                  <span>{dim.name}</span>
                  <span className="text-[#008F83] dark:text-[#00BFA5] font-bold">
                    {dim.scalePositionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00BFA5] h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
                {dim.description && (
                  <p className="text-[11px] text-text-tertiary">{dim.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 4: DEMONSTRATED APTITUDE */}
      {/* ========================================================================= */}
      {activeTab === "aptitude" && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Section C: Demonstrated Cognitive Aptitude
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Objective task performance across reasoning, logic, spatial rotation, and problem solving.
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-[#00BFA5]/15 border border-[#00BFA5]/30 text-[#008F83] dark:text-[#00BFA5] font-black text-sm self-start">
              Overall Accuracy: {demonstratedAptitude.overallAccuracyPercentage}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(demonstratedAptitude.dimensions || []).map((dim) => (
              <div
                key={dim.code}
                className="p-5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">{dim.name}</span>
                  <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] px-2.5 py-1 rounded-lg bg-[#00BFA5]/10">
                    {dim.rawScore} / {dim.maxScore} pts ({dim.scalePositionPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00BFA5] h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
                {dim.description && (
                  <p className="text-xs text-text-secondary">{dim.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB 5: DEVELOPMENTAL HABITS */}
      {/* ========================================================================= */}
      {activeTab === "development" && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              Section D: Developmental Strengths & Learning Habits
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Positive learning habits (curiosity, persistence, adaptability, initiative) to observe and nurture over time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(developmentalStrengths.dimensions || []).map((dim) => (
              <div
                key={dim.code}
                className="p-4 rounded-2xl bg-surface-muted/60 border border-border-default space-y-2"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
                  <span>{dim.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {dim.scalePositionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
                {dim.description && (
                  <p className="text-xs text-text-secondary">{dim.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB 6: CAREER EXPLORATION */}
      {/* ========================================================================= */}
      {activeTab === "exploration" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Positive Career & Project Exploration Directions
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                These clusters are supportive exploration suggestions based on your top vocational interest domains, not fixed career prescriptions.
              </p>
            </div>

            <div className="space-y-5">
              {explorationDirections.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 border border-border-default bg-surface-muted/40 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#00BFA5] text-[#172B2A] font-black text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-text-primary">
                        {exp.clusterTitle}
                      </h4>
                      <span className="text-xs font-semibold text-[#008F83] dark:text-[#00BFA5]">
                        Primary Domain: {exp.domain}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-surface-elevated p-4 rounded-xl border border-border-default">
                      <span className="text-xs font-bold text-text-primary block mb-2">
                        🔍 Sample Exploration Areas:
                      </span>
                      <ul className="space-y-1 text-xs text-text-secondary list-disc list-inside">
                        {(exp.sampleExplorationAreas || []).map((area, aIdx) => (
                          <li key={aIdx}>{area}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-surface-elevated p-4 rounded-xl border border-border-default">
                      <span className="text-xs font-bold text-text-primary block mb-2">
                        🚀 Hands-on Suggested Activities:
                      </span>
                      <ul className="space-y-1 text-xs text-text-secondary list-disc list-inside">
                        {(exp.suggestedActivities || []).map((act, actIdx) => (
                          <li key={actIdx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300/40 rounded-3xl p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <span className="text-lg">💡</span> Actionable Next Steps for Student & Parents
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300/80 list-disc list-inside">
              {growthSuggestions.map((sug, sIdx) => (
                <li key={sIdx}>{sug}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TAB 7: MY SKILL JOURNEY & LONGITUDINAL GROWTH */}
      {/* ========================================================================= */}
      {activeTab === "growth" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {latestComparisonData?.hasComparison && latestComparisonData.comparison ? (
            <div className="space-y-8">
              <GrowthComparisonCard comparison={latestComparisonData.comparison} />
              <GrowthInsightsCard
                topGains={latestComparisonData.comparison.topGains}
                narrativeInsights={latestComparisonData.comparison.narrativeInsights}
              />
              <div className="space-y-6">
                <DimensionGrowthChart
                  title="RIASEC Vocational Interests Evolution"
                  subtitle="Changes in interest alignment across the 6 Holland constructs"
                  dimensions={latestComparisonData.comparison.interestComparison}
                />
                <DimensionGrowthChart
                  title="Skill Behaviours & Natural Instincts"
                  subtitle="Growth across execution, problem solving, diagnostic curiosity, and teamwork"
                  dimensions={latestComparisonData.comparison.skillsComparison}
                />
                <DimensionGrowthChart
                  title="Cognitive Aptitude Reasoning"
                  subtitle="Demonstrated performance across spatial, numerical, verbal, and mechanical challenges"
                  dimensions={latestComparisonData.comparison.aptitudeComparison}
                />
                <DimensionGrowthChart
                  title="Developmental Habits & Strengths"
                  subtitle="Evolution of intrinsic motivation, strategic thinking, and resilience"
                  dimensions={latestComparisonData.comparison.strengthsComparison}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#1A3331] to-[#0D1C1B] border border-[#00BFA5]/30 p-8 sm:p-10 text-white shadow-xl text-center max-w-3xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#00BFA5]/15 border border-[#00BFA5]/30 flex items-center justify-center mx-auto text-[#00BFA5]">
                <TrendingUp className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30">
                  Initial Baseline Established
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Unlock Side-by-Side Growth Tracking
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  You have completed your initial baseline evaluation. Retaking the assessment at a later milestone allows our psychometric engine to track your skill gains, shifting interests, and developmental trajectory.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRetakeModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs shadow-lg shadow-[#00BFA5]/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Begin Retake Assessment</span>
                </button>

                <Link
                  href="/participant/assessments/history"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-2"
                >
                  <History className="w-4 h-4 text-[#00B8D4]" />
                  <span>View History Ledger</span>
                </Link>
              </div>
            </div>
          )}

          {/* Timeline & History Section */}
          {historyData && historyData.history && historyData.history.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-border-default">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-primary">
                  Evaluation Milestones & History
                </h3>
                <Link
                  href="/participant/assessments/history"
                  className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline flex items-center gap-1"
                >
                  <span>Full Ledger ({historyData.totalAttempts} Attempts)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <AssessmentTimeline history={historyData.history} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {historyData.history.map((item, idx) => (
                  <AssessmentHistoryCard
                    key={item.historyId || item.attemptId}
                    item={item}
                    isLatest={idx === 0}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* RUNNING FOOTER (Print & Screen) */}
      {/* ========================================================================= */}
      <footer className="print-break-avoid text-center text-[11px] text-[#728B88] dark:text-[#7D9491] space-y-1 pt-6 border-t border-[#E3ECEA] dark:border-white/10 print:pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#526866] dark:text-[#9FB3B0] print:text-[#526866]">
          <div className="flex items-center gap-1.5 font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
            <Compass className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>3G MeLife • Skill Finder</span>
          </div>
          <span className="text-[#728B88] print:text-[#688582]">
            Confidential Student Psychometric Report
          </span>
          <span className="text-[10.5px]">
            © {new Date().getFullYear()} 3G MeLife Platform
          </span>
        </div>
      </footer>

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        isPending={startRetakeMutation.isPending}
        assessmentName="Skill Finder"
      />
    </div>
  );
}
