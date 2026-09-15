"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RightCareerFinderResult,
  RightCareerFamilyCode,
  RightCareerFamilyScoreItem,
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
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  BarChart3,
  GraduationCap,
  Info,
  ChevronRight,
  Briefcase,
  Users,
  Scale,
  Code,
  HeartPulse,
  Palette,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface RightCareerFinderResultViewProps {
  result: RightCareerFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "families" | "dimensions" | "explainability" | "academic" | "counsellor" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Vocational Alignment", icon: <Sparkles className="w-4 h-4" /> },
  { id: "families", label: "6-Family Matrix", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "explainability", label: "Explainability & Drivers", icon: <Zap className="w-4 h-4" /> },
  { id: "dimensions", label: "9-Construct Profile", icon: <Brain className="w-4 h-4" /> },
  { id: "academic", label: "Pathways & Industry", icon: <BookOpen className="w-4 h-4" /> },
  { id: "counsellor", label: "Counsellor Guide", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "history", label: "Milestone History", icon: <TrendingUp className="w-4 h-4" /> },
];

const FAMILY_THEMES: Record<
  RightCareerFamilyCode,
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
  TECH_COMPUTING_AI: {
    icon: <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    color: "#2563EB",
    bgLight: "bg-blue-50/80",
    bgDark: "dark:bg-blue-950/20",
    borderColor: "border-blue-300/40 dark:border-blue-700/40",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    badgeText: "text-blue-700 dark:text-blue-300",
    barGradient: "from-blue-600 to-cyan-400",
    accentColor: "#3B82F6",
  },
  BUSINESS_FINANCE_ENTERPRISE: {
    icon: <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    color: "#059669",
    bgLight: "bg-emerald-50/80",
    bgDark: "dark:bg-emerald-950/20",
    borderColor: "border-emerald-300/40 dark:border-emerald-700/40",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    barGradient: "from-emerald-600 to-teal-400",
    accentColor: "#10B981",
  },
  HEALTHCARE_LIFE_SCIENCES: {
    icon: <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    color: "#E11D48",
    bgLight: "bg-rose-50/80",
    bgDark: "dark:bg-rose-950/20",
    borderColor: "border-rose-300/40 dark:border-rose-700/40",
    badgeBg: "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200",
    badgeText: "text-rose-700 dark:text-rose-300",
    barGradient: "from-rose-600 to-pink-400",
    accentColor: "#F43F5E",
  },
  LAW_POLICY_GOVERNANCE: {
    icon: <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    color: "#D97706",
    bgLight: "bg-amber-50/80",
    bgDark: "dark:bg-amber-950/20",
    borderColor: "border-amber-300/40 dark:border-amber-700/40",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
    badgeText: "text-amber-700 dark:text-amber-300",
    barGradient: "from-amber-500 to-orange-400",
    accentColor: "#F59E0B",
  },
  CREATIVE_DESIGN_MEDIA: {
    icon: <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    color: "#7C3AED",
    bgLight: "bg-purple-50/80",
    bgDark: "dark:bg-purple-950/20",
    borderColor: "border-purple-300/40 dark:border-purple-700/40",
    badgeBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    badgeText: "text-purple-700 dark:text-purple-300",
    barGradient: "from-purple-600 to-fuchsia-400",
    accentColor: "#8B5CF6",
  },
  ENGINEERING_SUSTAINABILITY: {
    icon: <Wrench className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    color: "#0D9488",
    bgLight: "bg-teal-50/80",
    bgDark: "dark:bg-teal-950/20",
    borderColor: "border-teal-300/40 dark:border-teal-700/40",
    badgeBg: "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200",
    badgeText: "text-teal-700 dark:text-teal-300",
    barGradient: "from-teal-600 to-cyan-400",
    accentColor: "#14B8A6",
  },
};

export function RightCareerFinderResultView({
  result,
  onLanguageChange,
  currentLanguage = "en",
}: RightCareerFinderResultViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  const retakeMutation = useStartRetakeMutation();
  const { data: historyData } = useAssessmentHistoryQuery("RIGHT_CAREER_FINDER");

  const primary = result.primaryFamily;
  const secondary = result.secondaryFamily;
  const primaryTheme = FAMILY_THEMES[primary?.familyCode || "TECH_COMPUTING_AI"];
  const secondaryTheme = FAMILY_THEMES[secondary?.familyCode || "BUSINESS_FINANCE_ENTERPRISE"];

  const handleStartRetake = () => {
    retakeMutation.mutate(
      { assessmentCode: "RIGHT_CAREER_FINDER" },
      {
        onSuccess: (res) => {
          setIsRetakeModalOpen(false);
          toast.success("Fresh Career Finder session initialized.");
          router.push(`/participant/assessments/${res.attemptId}`);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to initiate retake session.");
        },
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20 print:bg-white print:pb-0">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  3G MeLife Psychometric Platform
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Standard Pilot Edition
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Compass className="w-8 h-8 text-indigo-400" />
                {result.assessmentName || "Career Finder"}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
                Comprehensive vocational alignment report mapping your core interests and work scenarios across 6 overarching career families.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/20 transition backdrop-blur-sm"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
              <button
                onClick={() => setIsRetakeModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 mt-8 overflow-x-auto no-scrollbar border-b border-white/10 pb-px">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                    isActive
                      ? "border-indigo-400 text-indigo-400 bg-white/5 rounded-t-lg"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-t-lg"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Primary & Secondary Hero Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Primary Fit Card */}
              <div
                className={`lg:col-span-7 rounded-2xl p-6 sm:p-8 border shadow-sm ${primaryTheme.bgLight} ${primaryTheme.bgDark} ${primaryTheme.borderColor} relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  {primaryTheme.icon}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${primaryTheme.badgeBg}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Primary Alignment
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Clarity: {result.clarity}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {primary.familyName}
                </h2>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                    {primary.displayPercentage}%
                  </span>
                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${primaryTheme.badgeBg}`}>
                    {primary.alignment}
                  </span>
                </div>

                {/* Progress breakdown */}
                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Likert Construct Score (70% weight)</span>
                      <span>{primary.likertDisplayPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${primaryTheme.barGradient}`}
                        style={{ width: `${primary.likertDisplayPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Scenario Choice Preference (30% weight)</span>
                      <span>{primary.choiceDisplayPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${primaryTheme.barGradient}`}
                        style={{ width: `${primary.choiceDisplayPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Suggested Pathways */}
                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Suggested Career Pathways
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        {primary.suggestedPathways}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Target className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Key Exploration Domains
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        {primary.exampleAreas}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Fit Card */}
              <div
                className={`lg:col-span-5 rounded-2xl p-6 sm:p-8 border shadow-sm ${secondaryTheme.bgLight} ${secondaryTheme.bgDark} ${secondaryTheme.borderColor} relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${secondaryTheme.badgeBg}`}>
                      <Lightbulb className="w-3.5 h-3.5" />
                      Secondary Alignment
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Gap: {result.scoreGapPercentage}%
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {secondary.familyName}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {secondary.displayPercentage}%
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${secondaryTheme.badgeBg}`}>
                      {secondary.alignment}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                    {secondary.counsellingNote}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Hybrid & Cross-Functional Direction
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {secondary.suggestedPathways}
                  </p>
                </div>
              </div>
            </div>

            {/* Interpretation Summary Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Psychometric Alignment Summary
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated via 70/30 Likert-Construct & Scenario Engine
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.guidance.interpretationSummary}
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Recommended Exploration Direction
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {result.guidance.careerExplorationDirection}
                </p>
              </div>
            </div>

            {/* Quick 6-Family Compatibility Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  All 6 Career Families Ranked
                </h3>
                <button
                  onClick={() => setActiveTab("families")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  View full matrix <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.sortedFamilies.map((fam, idx) => {
                  const theme = FAMILY_THEMES[fam.familyCode];
                  return (
                    <div
                      key={fam.familyCode}
                      className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.badgeBg}`}>
                            {fam.alignment}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                            {theme.icon}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {fam.familyName}
                          </h4>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-xs text-slate-500">Compatibility</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            {fam.displayPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${theme.barGradient}`}
                            style={{ width: `${fam.displayPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 6-FAMILY MATRIX */}
        {activeTab === "families" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Complete 6-Family Career Compatibility Matrix
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Weighted synthesis combining Likert constructs (70%) and forced-choice scenario selections (30%).
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {result.sortedFamilies.map((fam, index) => {
                  const theme = FAMILY_THEMES[fam.familyCode];
                  return (
                    <div
                      key={fam.familyCode}
                      className={`p-6 rounded-2xl border transition-all ${
                        index === 0
                          ? `${theme.bgLight} ${theme.bgDark} ${theme.borderColor} shadow-md`
                          : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                            {theme.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">
                                Rank #{index + 1}
                              </span>
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                {fam.familyName}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {fam.exampleAreas}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                              {fam.displayPercentage}%
                            </span>
                            <div className="text-xs text-slate-500">Compatibility</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeBg}`}>
                            {fam.alignment}
                          </span>
                        </div>
                      </div>

                      {/* Bar graph */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                        <div className="bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            <span>Likert Construct Affinity (70%)</span>
                            <span>{fam.likertDisplayPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${theme.barGradient}`}
                              style={{ width: `${fam.likertDisplayPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            <span>Scenario Preference ({fam.choiceCount}/5 choices)</span>
                            <span>{fam.choiceDisplayPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${theme.barGradient}`}
                              style={{ width: `${fam.choiceDisplayPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-900/40 p-3 rounded-xl">
                        <strong className="text-slate-900 dark:text-white">Guidance Note: </strong>
                        {fam.counsellingNote}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPLAINABILITY & DRIVER CONSTRUCTS */}
        {activeTab === "explainability" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Explainability Layer & Key Match Drivers
                  </h3>
                  <p className="text-sm text-slate-500">
                    Diagnostic breakdown of the top psychometric construct drivers behind your primary match with {primary.familyName}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(result.primaryDriverConstructs || []).map((driver, idx) => (
                  <div
                    key={driver.dimensionCode}
                    className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                          Driver #{idx + 1}
                        </span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {driver.normalizedScore}%
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                        {driver.dimensionName}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {driver.rationale}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500">
                      Construct Weight in Family: <strong>{Math.round(driver.weight * 100)}%</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decision Principle Box */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-indigo-50/80 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Psychometric Interpretive Principle
                </h4>
                <p className="text-xs sm:text-sm text-indigo-800/90 dark:text-indigo-300/90 mt-2 leading-relaxed">
                  {result.guidance.finalDecisionPrinciple}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 9 CONSTRUCT DIMENSIONS */}
        {activeTab === "dimensions" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  9 Core Psychometric Construct Dimensions
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Granular scores across the 9 non-redundant vocational dimensions (45 administered Likert items).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {result.sortedDimensions.map((dim) => (
                  <div
                    key={dim.dimensionCode}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {dim.dimensionName}
                        </h4>
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {dim.normalizedScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        {dim.description}
                      </p>
                    </div>

                    <div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-indigo-600"
                          style={{ width: `${dim.normalizedScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Level: <strong>{dim.interpretation}</strong></span>
                        <span>Link: <strong>{dim.strongestCareerLink}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PATHWAYS & INDUSTRY */}
        {activeTab === "academic" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Industry Pathways & Academic Specialization Guidelines
                  </h3>
                  <p className="text-sm text-slate-500">
                    Actionable subject mapping and skill building roadmaps for {primary.familyName}.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {result.guidance.academicSubjectGuidance.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-800">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Primary Pathway Focus Areas ({primary.familyName})
                </h4>
                <div className="p-5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Suggested Pathways: </strong>{primary.suggestedPathways}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                    <strong>Key Example Domains: </strong>{primary.exampleAreas}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: COUNSELLOR GUIDE */}
        {activeTab === "counsellor" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Counsellor & Mentor Consultation Protocols
                  </h3>
                  <p className="text-sm text-slate-500">
                    Evidence-based counselling dos, don'ts, and consultative principles.
                  </p>
                </div>
              </div>

              {/* DOs and DON'Ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recommended Actions (DO)
                  </h4>
                  <ul className="space-y-3">
                    {result.guidance.doGuidelines.map((g, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40">
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Practices to Avoid (DON'T)
                  </h4>
                  <ul className="space-y-3">
                    {result.guidance.avoidGuidelines.map((g, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Core Principles */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Individualized Family Consultation Principles
                </h4>
                {result.guidance.counsellorPrinciples.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                  >
                    <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {p.area}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {p.interpretation}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/40 dark:border-slate-700/40">
                      <div className="text-emerald-700 dark:text-emerald-300">
                        <strong>Action: </strong>{p.doText}
                      </div>
                      <div className="text-rose-700 dark:text-rose-300">
                        <strong>Caution: </strong>{p.avoidText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MILESTONE HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Milestone Retake History & Growth Progression
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Track changes in your vocational alignment across multiple attempts.
                  </p>
                </div>
                <button
                  onClick={() => setIsRetakeModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Retake
                </button>
              </div>

              {historyData?.history && historyData.history.length > 0 ? (
                <AssessmentTimeline history={historyData.history} />
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Compass className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm">This is your initial baseline attempt (Attempt #1).</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Future retakes will appear here for longitudinal comparison.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Global Quality Disclaimer Footer */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            Educational & Vocational Exploration Disclaimer
          </div>
          <p>{result.responseQuality?.pilotDisclaimer}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-400">
            <span>Attempt ID: {result.attemptId}</span>
            <span>Version: {result.versionCode || "RIGHT_CAREER_FINDER_V1"}</span>
            <span>Completed Questions: {result.completedQuestions}/{result.totalQuestions}</span>
            <span>Quality Signal: {result.responseQuality?.qualityFlag || "NORMAL"}</span>
          </div>
        </div>
      </div>

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        assessmentName={result.assessmentName || "Career Finder"}
        isPending={retakeMutation.isPending}
      />
    </div>
  );
}
