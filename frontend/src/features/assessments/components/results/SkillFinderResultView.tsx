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
} from "lucide-react";
import { ProfileDimensionCard } from "./ProfileDimensionCard";
import { InterestChart } from "./InterestChart";
import { StrengthCard } from "./StrengthCard";
import { DevelopmentCard } from "./DevelopmentCard";
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
    consistencySignal: "Adequate Consistency",
    attentionCheckPassed: true,
    interpretation: "",
  };

  const profileConfidence =
    result.profileConfidence ||
    result.confidenceMetrics?.level ||
    responseQuality.consistencySignal;

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

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-6xl mx-auto space-y-8 pb-16 print:p-0 print:space-y-6"
    >
      {/* 1. REPORT HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#1A3331] to-[#0D1C1B] border border-[#00BFA5]/25 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFA5]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#008F83]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00BFA5]/15 text-[#00BFA5] border border-[#00BFA5]/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Official Psychometric Assessment Report</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {result.versionName || "Skill Finder Assessment Report"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Standardized 29-dimension psychometric profile evaluating interests (25%), skill behaviours (30%), cognitive aptitude (25%), and developmental habits (20%).
            </p>
          </div>

          {/* Action Bar (Print & Language Switcher) */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-colors">
                <Globe className="w-4 h-4 text-[#00BFA5]" />
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
              onClick={() => setIsRetakeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#00BFA5]" />
              <span>Retake</span>
            </button>

            <Link
              href="/participant/reports/skill-finder"
              className="px-4 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs shadow-lg shadow-[#00BFA5]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Official Report</span>
            </Link>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>


        {/* Status Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-0.5">Profile Confidence:</span>
            <span className="font-bold text-[#00BFA5] text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {profileConfidence}
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-0.5">Completed Date:</span>
            <span className="font-semibold text-slate-200 text-sm">
              {result.completedAt
                ? new Date(result.completedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Completed"}
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-0.5">Guidance Framework:</span>
            <span className="font-semibold text-slate-200 text-sm">
              29-Dimension Construct Model
            </span>
          </div>
        </div>
      </div>

      {/* 2. LEARNING PROFILE HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-[#172B2A]/90 dark:via-[#1A3331]/90 dark:to-[#0D1C1B] border-2 border-[#00BFA5]/30 p-6 sm:p-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00BFA5] text-[#172B2A] font-black text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Psychometric Learning Profile</span>
            </div>
            <div className="text-xs font-semibold text-text-tertiary">
              Non-Prescriptive Synthesis
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              {learningProfile.archetypeTitle}
            </h2>
            <p className="text-sm font-semibold text-[#008F83] dark:text-[#00BFA5] mt-1">
              {learningProfile.tagline}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed max-w-4xl">
            {learningProfile.strengthSummary}
          </p>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-border-default space-y-2">
            <span className="text-xs font-bold text-text-primary block">
              🧭 Exploratory Alignment:
            </span>
            <p className="text-xs text-text-secondary leading-relaxed">
              {learningProfile.explorationFraming}
            </p>
          </div>

          {/* Primary Traits Badges */}
          {learningProfile.primaryTraits && learningProfile.primaryTraits.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {learningProfile.primaryTraits.map((trait, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1 rounded-xl bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/25 text-xs font-bold"
                >
                  ✓ {trait}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. NAVIGATION TABS (Screen Only) */}
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

      {/* 4. TAB 1: EXECUTIVE OVERVIEW */}
      {(activeTab === "overview" || typeof window === "undefined") && (
        <div className="space-y-8">
          {/* Interest Distribution Visualizer */}
          <InterestChart
            dimensions={interestDiscovery.dimensions}
            profileVector={result.profileVector}
          />

          {/* 2-Column Pillars Summary Grid: Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrengthCard
              strengths={strongestSkills}
              title="Top Skill Strengths"
              subtitle="Demonstrated high-performing behavioral capabilities"
            />
            <DevelopmentCard
              developmentAreas={devGrowthAreas}
              title="Emerging Growth Opportunities"
              subtitle="Target areas for experiential enrichment"
            />
          </div>
        </div>
      )}

      {/* 5. TAB 2: INTEREST DISCOVERY */}
      {(activeTab === "interests" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
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

      {/* 6. TAB 3: SKILL BEHAVIOURS */}
      {(activeTab === "skills" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
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

      {/* 7. TAB 4: DEMONSTRATED APTITUDE */}
      {(activeTab === "aptitude" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
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

      {/* 8. TAB 5: DEVELOPMENTAL HABITS */}
      {(activeTab === "development" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
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

      {/* 9. TAB 6: CAREER EXPLORATION */}
      {(activeTab === "exploration" || typeof window === "undefined") && (
        <div className="space-y-6">
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

          {/* Integrated Career Guidance & Exploration Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1E1D] to-slate-900 border border-teal-500/30 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/40">
                <span>✦</span> Ready for Next Stage
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Unlock Your 10-Section Career Guidance Report & Pathway Matches
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your psychometric scores have been mapped into ranked career exploration pathways, educational roadmaps, and certified counsellor consultation summaries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                href="/participant/career-reports"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs md:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View Full Career Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/participant/pathways"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Careers</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 7: MY SKILL JOURNEY & LONGITUDINAL GROWTH */}
      {activeTab === "growth" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {latestComparisonData?.hasComparison && latestComparisonData.comparison ? (
            <div className="space-y-8">
              {/* Executive Longitudinal Comparison Header */}
              <GrowthComparisonCard comparison={latestComparisonData.comparison} />

              {/* Top Gains & Psychological Insights */}
              <GrowthInsightsCard
                topGains={latestComparisonData.comparison.topGains}
                narrativeInsights={latestComparisonData.comparison.narrativeInsights}
              />

              {/* Construct Layer Growth Charts */}
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

