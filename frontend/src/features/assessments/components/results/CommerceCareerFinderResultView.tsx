"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CommerceCareerFinderResult,
  CommerceFamilyCode,
  CommerceCareerFamilyScoreItem,
} from "../../types/assessment.types";
import {
  Sparkles,
  Compass,
  Lightbulb,
  Target,
  Brain,
  Printer,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  BarChart3,
  Layers,
  GraduationCap,
  Info,
  ChevronRight,
  Calculator,
  TrendingDown,
  Briefcase,
  PieChart,
  DollarSign,
  Building2,
  FileSpreadsheet,
  Users,
  Scale,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface CommerceCareerFinderResultViewProps {
  result: CommerceCareerFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "families" | "dimensions" | "clusters" | "academic" | "counsellor" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Career Overview", icon: <Sparkles className="w-4 h-4" /> },
  { id: "families", label: "4-Family Matrix", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "dimensions", label: "Dimension Profile", icon: <Brain className="w-4 h-4" /> },
  { id: "clusters", label: "Career Clusters", icon: <Briefcase className="w-4 h-4" /> },
  { id: "academic", label: "Academic Review", icon: <BookOpen className="w-4 h-4" /> },
  { id: "counsellor", label: "Counsellor Guide", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "history", label: "Milestone History", icon: <TrendingUp className="w-4 h-4" /> },
];

const FAMILY_THEMES: Record<
  CommerceFamilyCode,
  {
    icon: React.ReactNode;
    color: string;
    bgLight: string;
    bgDark: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    barGradient: string;
    accentColor: string;
  }
> = {
  ACCOUNTING_AUDIT_TAX: {
    icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    color: "#059669",
    bgLight: "bg-emerald-50/80",
    bgDark: "dark:bg-emerald-950/20",
    borderColor: "border-emerald-300/40 dark:border-emerald-700/40",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    barGradient: "from-emerald-500 to-teal-400",
    accentColor: "#10B981",
  },
  FINANCE_INVESTMENT_BANKING: {
    icon: <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    color: "#2563EB",
    bgLight: "bg-blue-50/80",
    bgDark: "dark:bg-blue-950/20",
    borderColor: "border-blue-300/40 dark:border-blue-700/40",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    badgeText: "text-blue-700 dark:text-blue-300",
    barGradient: "from-blue-500 to-cyan-400",
    accentColor: "#3B82F6",
  },
  BUSINESS_MANAGEMENT_ENTREPRENEURSHIP: {
    icon: <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    color: "#D97706",
    bgLight: "bg-amber-50/80",
    bgDark: "dark:bg-amber-950/20",
    borderColor: "border-amber-300/40 dark:border-amber-700/40",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
    badgeText: "text-amber-700 dark:text-amber-300",
    barGradient: "from-amber-500 to-orange-400",
    accentColor: "#F59E0B",
  },
  ECONOMICS_ANALYTICS_FINTECH: {
    icon: <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    color: "#7C3AED",
    bgLight: "bg-purple-50/80",
    bgDark: "dark:bg-purple-950/20",
    borderColor: "border-purple-300/40 dark:border-purple-700/40",
    badgeBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    badgeText: "text-purple-700 dark:text-purple-300",
    barGradient: "from-purple-500 to-indigo-400",
    accentColor: "#8B5CF6",
  },
};

export const CommerceCareerFinderResultView: React.FC<CommerceCareerFinderResultViewProps> = ({
  result,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  const retakeMutation = useStartRetakeMutation();
  const { data: historyData } = useAssessmentHistoryQuery("COMMERCE_CAREER_FINDER");

  const primary = result.primaryFamily;
  const secondary = result.secondaryFamily;
  const primaryTheme = FAMILY_THEMES[primary?.familyCode] || FAMILY_THEMES.ACCOUNTING_AUDIT_TAX;
  const secondaryTheme = FAMILY_THEMES[secondary?.familyCode] || FAMILY_THEMES.FINANCE_INVESTMENT_BANKING;

  const handleStartRetake = () => {
    retakeMutation.mutate({ assessmentCode: "COMMERCE_CAREER_FINDER" }, {
      onSuccess: (res) => {
        setIsRetakeModalOpen(false);
        toast.success("Fresh Commerce Career Finder session initialized.");
        router.push(`/participant/assessments/${res.attemptId}`);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to initiate retake session.");
      },
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto pb-16 print:p-0 print:space-y-4">
      {/* 1. Header & Pilot Disclaimer Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden print:bg-none print:text-black print:p-0 print:shadow-none">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Standard Pilot Edition
              </span>
              <span className="text-xs text-emerald-200/70 font-medium">
                45 Items Administered (40 Likert + 5 Scenarios)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
              Commerce Career Compatibility Profile
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Educational guidance evaluation exploring career affinities across Accounting, Finance, Business Management, and Economics & FinTech.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsRetakeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>

        {/* Pilot Advisory Callout */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-emerald-100/70">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300" />
          <p className="leading-relaxed">
            {result.responseQuality?.pilotDisclaimer ||
              "This assessment is educational career guidance evidence. Results should be interpreted with academic records, eligibility requirements, student interests, career goals, current course requirements and professional counselling."}
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-default print:hidden no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 inline-flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-primary text-slate-900 shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: Career Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Hero Recommendation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Career Alignment (Leading Pathway) */}
            <div className={`lg:col-span-7 rounded-3xl border ${primaryTheme.borderColor} ${primaryTheme.bgLight} ${primaryTheme.bgDark} p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs`}>
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-white/10 text-text-primary border border-border-default">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Primary Career Alignment</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${primaryTheme.badgeBg}`}>
                  {primary.alignment}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-surface-elevated shadow-xs flex items-center justify-center">
                    {primaryTheme.icon}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    {primary.familyName}
                  </h2>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {primary.counsellingNote}
                </p>
              </div>

              {/* Progress Bar & Score Metrics */}
              <div className="space-y-2 bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-border-default">
                <div className="flex justify-between items-baseline text-xs font-bold text-text-primary">
                  <span>Overall Compatibility</span>
                  <span className="text-xl font-extrabold text-text-primary">
                    {primary.displayPercentage}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${primaryTheme.barGradient} transition-all duration-500`}
                    style={{ width: `${Math.min(100, primary.displayPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-text-secondary pt-1 font-medium">
                  <span>Likert Alignment: {primary.likertDisplayPercentage}%</span>
                  <span>Scenario Preference: {primary.choiceDisplayPercentage}%</span>
                </div>
              </div>

              {/* Suggested Pathways & Example Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/80 dark:bg-surface-elevated p-4 rounded-2xl border border-border-default space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Core Pathways
                  </span>
                  <p className="text-xs font-bold text-text-primary">
                    {primary.suggestedPathways}
                  </p>
                </div>
                <div className="bg-white/80 dark:bg-surface-elevated p-4 rounded-2xl border border-border-default space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Example Qualifications
                  </span>
                  <p className="text-xs font-bold text-text-primary">
                    {primary.exampleAreas}
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Pathway & Recommendation Clarity */}
            <div className="lg:col-span-5 space-y-6">
              {/* Secondary Alignment */}
              <div className={`rounded-3xl border ${secondaryTheme.borderColor} ${secondaryTheme.bgLight} ${secondaryTheme.bgDark} p-6 space-y-4 shadow-xs`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Secondary Pathway
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${secondaryTheme.badgeBg}`}>
                    {secondary.displayPercentage}% Match
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-surface-elevated shadow-xs flex items-center justify-center">
                    {secondaryTheme.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary leading-tight">
                      {secondary.familyName}
                    </h3>
                    <p className="text-[11px] text-text-secondary">{secondary.alignment}</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {secondary.counsellingNote}
                </p>
              </div>

              {/* Recommendation Clarity & Gap */}
              <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Clarity & Exploration Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      result.clarity === "High Clarity"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40"
                        : result.clarity === "Moderate Clarity"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40"
                    }`}
                  >
                    {result.clarity}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-text-secondary">
                    <span>Score Separation Gap</span>
                    <span className="font-bold text-text-primary">{result.scoreGapPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, result.scoreGapPercentage * 3)}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed bg-surface-base p-3 rounded-xl border border-border-default/60">
                  {result.guidance?.interpretationSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Quick 4-Family Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.sortedFamilies.map((fam, idx) => {
              const theme = FAMILY_THEMES[fam.familyCode] || FAMILY_THEMES.ACCOUNTING_AUDIT_TAX;
              return (
                <div
                  key={fam.familyCode}
                  className="bg-surface-elevated rounded-2xl border border-border-default p-5 space-y-3 hover:border-primary/40 transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-surface-base text-text-secondary text-xs font-mono font-bold flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-text-secondary uppercase">
                        Rank #{idx + 1}
                      </span>
                    </div>
                    <span className="text-base font-extrabold text-text-primary">
                      {fam.displayPercentage}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                    {fam.familyName}
                  </h4>

                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient}`}
                      style={{ width: `${fam.displayPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-text-secondary pt-1">
                    <span>Likert: {fam.likertDisplayPercentage}%</span>
                    <span>Choice: {fam.choiceDisplayPercentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: 4-Family Matrix */}
      {activeTab === "families" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-2">
            <h3 className="text-lg font-bold text-text-primary">
              Comprehensive 4-Family Compatibility Matrix
            </h3>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              Calculated using the 70% Likert Construct Alignment + 30% Forced-Choice Preference model. Each career family measures distinct behavioral and commercial orientation patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.sortedFamilies.map((fam, idx) => {
              const theme = FAMILY_THEMES[fam.familyCode] || FAMILY_THEMES.ACCOUNTING_AUDIT_TAX;
              return (
                <div
                  key={fam.familyCode}
                  className={`rounded-3xl border ${theme.borderColor} ${theme.bgLight} ${theme.bgDark} p-6 space-y-5 shadow-xs`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-surface-elevated shadow-xs flex items-center justify-center shrink-0">
                        {theme.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                          Career Family #{idx + 1}
                        </span>
                        <h4 className="text-lg font-extrabold text-text-primary">
                          {fam.familyName}
                        </h4>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeBg}`}>
                      {fam.alignment}
                    </span>
                  </div>

                  {/* Compatibility Bar & Details */}
                  <div className="bg-white/80 dark:bg-surface-elevated p-4 rounded-2xl border border-border-default space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-text-secondary">Combined Compatibility</span>
                      <span className="text-xl font-extrabold text-text-primary">{fam.displayPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient}`}
                        style={{ width: `${fam.displayPercentage}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-surface-base p-2.5 rounded-xl border border-border-default/60">
                        <span className="text-[10px] text-text-secondary block">Likert Alignment (70%)</span>
                        <span className="font-bold text-text-primary">{fam.likertDisplayPercentage}% ({fam.likertPoints}/50 pts)</span>
                      </div>
                      <div className="bg-surface-base p-2.5 rounded-xl border border-border-default/60">
                        <span className="text-[10px] text-text-secondary block">Scenario Preference (30%)</span>
                        <span className="font-bold text-text-primary">{fam.choiceDisplayPercentage}% ({fam.choiceCount}/5 choices)</span>
                      </div>
                    </div>
                  </div>

                  {/* Exploration & Counselling Guidance */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-text-primary block mb-1">Suggested Pathways:</span>
                      <p className="text-text-secondary bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-border-default/40">
                        {fam.suggestedPathways}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block mb-1">Example Qualification Tracks:</span>
                      <p className="text-text-secondary bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-border-default/40 font-mono text-[11px]">
                        {fam.exampleAreas}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block mb-1">Counsellor Focus Note:</span>
                      <p className="text-text-secondary italic">
                        {fam.counsellingNote}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB 3: Dimension Profile */}
      {activeTab === "dimensions" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-2">
            <h3 className="text-lg font-bold text-text-primary">
              6-Dimension Behavioral & Aptitude Profile
            </h3>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              These six dimensions measure underlying cognitive habits, commercial curiosity, data comfort, and leadership orientation. Dimension strengths provide descriptive self-discovery context alongside career compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.sortedDimensions.map((dim, idx) => (
              <div
                key={dim.dimensionCode}
                className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-text-secondary px-2.5 py-1 rounded-lg bg-surface-base border border-border-default">
                    DIM #{idx + 1}
                  </span>
                  <span className="text-lg font-extrabold text-primary">
                    {dim.normalizedScore}%
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-text-primary">
                    {dim.dimensionName}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-3">
                    {dim.description}
                  </p>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${dim.normalizedScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-text-secondary">
                    <span>Raw: {dim.rawScore}/{dim.maxScore}</span>
                    <span>Answered: {dim.answeredCount} items</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: Career Clusters & Pathways */}
      {activeTab === "clusters" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-2">
            <h3 className="text-lg font-bold text-text-primary">
              Commerce Career Clusters & Practical Pathways
            </h3>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              Explore concrete career clusters, professional qualification bodies, and emerging domain opportunities linked to your primary and secondary alignment profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accounting, Audit & Tax */}
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">Accounting, Audit & Tax</h4>
                  <span className="text-[11px] text-text-secondary">Regulatory, Compliance & Financial Reporting</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Chartered Accountancy (CA / CPA):</strong> Statutory audit, corporate taxation, and financial compliance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Management Accounting (CMA / CIMA):</strong> Cost control, internal audit, and performance budgeting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tax Advisory & Governance:</strong> Cross-border taxation, transfer pricing, and ESG compliance.</span>
                </li>
              </ul>
            </div>

            {/* Finance, Investment & Banking */}
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">Finance, Investment & Banking</h4>
                  <span className="text-[11px] text-text-secondary">Capital Markets, Corporate Finance & Treasury</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Investment Banking & M&A (CFA):</strong> Valuation, IPO underwriting, capital raising, and financial modeling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Commercial & Retail Banking:</strong> Credit risk analysis, treasury management, and corporate loan structuring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Wealth & Asset Management:</strong> Portfolio management, mutual funds, and private equity research.</span>
                </li>
              </ul>
            </div>

            {/* Business, Management & Entrepreneurship */}
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">Business, Management & Entrepreneurship</h4>
                  <span className="text-[11px] text-text-secondary">Enterprise Leadership, Strategy & Operations</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Management & Consulting (BBA / MBA):</strong> Corporate strategy, organizational change, and operations management.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Venture Building & Entrepreneurship:</strong> Startup incubation, business model design, and scaleup management.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Marketing, Sales & Brand Management:</strong> Customer acquisition, go-to-market strategy, and brand expansion.</span>
                </li>
              </ul>
            </div>

            {/* Economics, Analytics & FinTech */}
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">Economics, Analytics & FinTech</h4>
                  <span className="text-[11px] text-text-secondary">Quantitative Economics, Algorithmic Finance & Data Science</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Applied Economics & Policy Analysis:</strong> Econometric forecasting, market research, and central bank research.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Business Analytics & Financial Data:</strong> Quantitative trading, risk modeling, and business intelligence dashboards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>FinTech & Digital Payments:</strong> Blockchain finance, neo-banking product management, and automated underwriting.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: Academic Review */}
      {activeTab === "academic" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-2">
            <h3 className="text-lg font-bold text-text-primary">
              Academic Review & Subject Considerations
            </h3>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              Psychometric compatibility must be reviewed alongside academic evidence, course prerequisites, and student interests. Assessment scores do not replace official eligibility or exam qualifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Core Academic Subject Guidance
              </h4>
              <div className="space-y-3">
                {(result.guidance?.academicSubjectGuidance || []).map((guide, idx) => (
                  <div key={idx} className="bg-surface-base p-4 rounded-2xl border border-border-default/60 space-y-1">
                    <span className="text-xs font-bold text-text-primary block">
                      {guide.split(":")[0]}
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {guide.split(":")[1] || guide}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Final Decision Principle (Excel Specification)
              </h4>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300/40 dark:border-emerald-700/40 p-5 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-semibold">
                {result.guidance?.finalDecisionPrinciple ||
                  "Student Interest + Academic Performance + Commerce Career Finder Result + Career Goals + Subject Eligibility + Career Counsellor Guidance + Parent Support"}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-text-primary block">Key Verification Steps:</span>
                <ul className="space-y-2 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Verify Mathematics / Applied Math requirements for quantitative degrees (e.g., B.Sc Economics / FinTech).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Cross-reference Accountancy grades for professional streams like CA Foundation or ACCA exemptions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Evaluate student communication comfort for management, consulting, and negotiation roles.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: Counsellor Guide */}
      {activeTab === "counsellor" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-2">
            <h3 className="text-lg font-bold text-text-primary">
              Counsellor Interpretation Workspace & Guidelines
            </h3>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              Standard operating procedures for career counsellors interpreting Commerce Career Finder profiles. Combine assessment evidence with student voice, academic trends, and labor market reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Do's */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 rounded-3xl border border-emerald-300/40 dark:border-emerald-700/40 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Recommended Interpretation Practices (Do)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                {(result.guidance?.doGuidelines || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-3xl border border-rose-300/40 dark:border-rose-700/40 p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Practices to Avoid (Don't)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                {(result.guidance?.avoidGuidelines || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Counsellor Principles Table */}
          {result.guidance?.counsellorPrinciples && (
            <div className="bg-surface-elevated rounded-3xl border border-border-default overflow-hidden shadow-xs">
              <div className="p-6 border-b border-border-default">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Interpretation Matrix across Core Areas
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-base text-text-secondary font-bold border-b border-border-default">
                    <tr>
                      <th className="p-4">Area</th>
                      <th className="p-4">Use in Interpretation</th>
                      <th className="p-4 text-emerald-600 dark:text-emerald-400">Do</th>
                      <th className="p-4 text-rose-600 dark:text-rose-400">Avoid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {result.guidance.counsellorPrinciples.map((cp, idx) => (
                      <tr key={idx} className="hover:bg-surface-base/50">
                        <td className="p-4 font-bold text-text-primary whitespace-nowrap">{cp.area}</td>
                        <td className="p-4 text-text-secondary">{cp.interpretation}</td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-300 font-medium">{cp.doText}</td>
                        <td className="p-4 text-rose-800 dark:text-rose-300 font-medium">{cp.avoidText}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. TAB 7: Milestone History */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-primary">
                Commerce Career Finder Assessment History
              </h3>
              <p className="text-xs text-text-secondary">
                Track changes in career alignment and dimension preferences across multiple retakes.
              </p>
            </div>
            <button
              onClick={() => setIsRetakeModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary text-slate-900 font-bold text-xs hover:bg-primary-hover transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Retake</span>
            </button>
          </div>

          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 md:p-8">
            {historyData?.history && historyData.history.length > 0 ? (
              <AssessmentTimeline history={historyData.history} />
            ) : (
              <div className="p-8 text-center bg-surface-subtle rounded-2xl border border-border-subtle">
                <TrendingUp className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-xs font-semibold text-text-secondary">
                  This is your initial baseline attempt (Attempt #1). Future retakes will appear here for longitudinal comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        assessmentName="Commerce Career Finder"
        isPending={retakeMutation.isPending}
      />
    </div>
  );
};
