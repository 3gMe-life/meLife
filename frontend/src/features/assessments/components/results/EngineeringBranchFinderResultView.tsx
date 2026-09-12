"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EngineeringBranchFinderResult,
  EngineeringBranchCode,
  EngineeringBranchScoreItem,
} from "../../types/assessment.types";
import {
  Sparkles,
  Compass,
  Lightbulb,
  Target,
  Brain,
  Activity,
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
  ExternalLink,
  Cpu,
  Wrench,
  Building,
  Atom,
  HeartPulse,
  Rocket,
  Code,
  Radio,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface EngineeringBranchFinderResultViewProps {
  result: EngineeringBranchFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "branches" | "constructs" | "projects" | "counsellor" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Branch Overview", icon: <Sparkles className="w-4 h-4" /> },
  { id: "branches", label: "8-Branch Matrix", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "constructs", label: "Construct Profiles", icon: <Brain className="w-4 h-4" /> },
  { id: "projects", label: "Suggested Projects", icon: <Wrench className="w-4 h-4" /> },
  { id: "counsellor", label: "Counsellor Guide", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "history", label: "Milestone History", icon: <TrendingUp className="w-4 h-4" /> },
];

const BRANCH_THEMES: Record<
  EngineeringBranchCode,
  {
    icon: React.ReactNode;
    color: string;
    bgLight: string;
    bgDark: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    barGradient: string;
  }
> = {
  CSE: {
    icon: <Code className="w-5 h-5 text-indigo-500" />,
    color: "#6366F1",
    bgLight: "bg-indigo-50/80",
    bgDark: "dark:bg-indigo-950/20",
    borderColor: "border-indigo-300/40 dark:border-indigo-700/40",
    badgeBg: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    barGradient: "from-indigo-500 to-cyan-400",
  },
  ECE: {
    icon: <Radio className="w-5 h-5 text-teal-500" />,
    color: "#14B8A6",
    bgLight: "bg-teal-50/80",
    bgDark: "dark:bg-teal-950/20",
    borderColor: "border-teal-300/40 dark:border-teal-700/40",
    badgeBg: "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200",
    badgeText: "text-teal-700 dark:text-teal-300",
    barGradient: "from-teal-500 to-emerald-400",
  },
  EEE: {
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    color: "#F59E0B",
    bgLight: "bg-amber-50/80",
    bgDark: "dark:bg-amber-950/20",
    borderColor: "border-amber-300/40 dark:border-amber-700/40",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
    badgeText: "text-amber-700 dark:text-amber-300",
    barGradient: "from-amber-500 to-orange-400",
  },
  ME: {
    icon: <Wrench className="w-5 h-5 text-blue-500" />,
    color: "#3B82F6",
    bgLight: "bg-blue-50/80",
    bgDark: "dark:bg-blue-950/20",
    borderColor: "border-blue-300/40 dark:border-blue-700/40",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    badgeText: "text-blue-700 dark:text-blue-300",
    barGradient: "from-blue-500 to-sky-400",
  },
  CE: {
    icon: <Building className="w-5 h-5 text-emerald-500" />,
    color: "#10B981",
    bgLight: "bg-emerald-50/80",
    bgDark: "dark:bg-emerald-950/20",
    borderColor: "border-emerald-300/40 dark:border-emerald-700/40",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    barGradient: "from-emerald-500 to-green-400",
  },
  CHE: {
    icon: <Atom className="w-5 h-5 text-purple-500" />,
    color: "#8B5CF6",
    bgLight: "bg-purple-50/80",
    bgDark: "dark:bg-purple-950/20",
    borderColor: "border-purple-300/40 dark:border-purple-700/40",
    badgeBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    badgeText: "text-purple-700 dark:text-purple-300",
    barGradient: "from-purple-500 to-pink-400",
  },
  BME: {
    icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
    color: "#F43F5E",
    bgLight: "bg-rose-50/80",
    bgDark: "dark:bg-rose-950/20",
    borderColor: "border-rose-300/40 dark:border-rose-700/40",
    badgeBg: "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200",
    badgeText: "text-rose-700 dark:text-rose-300",
    barGradient: "from-rose-500 to-red-400",
  },
  AERO: {
    icon: <Rocket className="w-5 h-5 text-sky-500" />,
    color: "#0284C7",
    bgLight: "bg-sky-50/80",
    bgDark: "dark:bg-sky-950/20",
    borderColor: "border-sky-300/40 dark:border-sky-700/40",
    badgeBg: "bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200",
    badgeText: "text-sky-700 dark:text-sky-300",
    barGradient: "from-sky-500 to-blue-600",
  },
};

export const EngineeringBranchFinderResultView: React.FC<EngineeringBranchFinderResultViewProps> = ({
  result,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(result.primaryBranch?.branchCode || null);

  const startRetakeMutation = useStartRetakeMutation();
  const { data: historyData } = useAssessmentHistoryQuery(
    result.assessmentCode || "ENGINEERING_BRANCH_FINDER"
  );

  const handleRetakeConfirm = async () => {
    try {
      const res = await startRetakeMutation.mutateAsync({
        assessmentCode: result.assessmentCode,
      });
      setIsRetakeModalOpen(false);
      toast.success(
        "New Engineering Branch Finder session started! Your previous exploration profile is safely saved."
      );
      router.push(`/participant/assessments/${res.attemptId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to start retake attempt.");
    }
  };

  const primary = result.primaryBranch;
  const secondary = result.secondaryBranch;
  const primaryTheme = BRANCH_THEMES[primary?.branchCode] || BRANCH_THEMES.CSE;
  const secondaryTheme = BRANCH_THEMES[secondary?.branchCode] || BRANCH_THEMES.ME;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Pilot Required & Explorer Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5 font-medium">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Development / Pilot Assessment:</strong> This report reflects exploratory psychometric patterns intended for educational guidance. Psychometric validation remains ongoing.
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[10px] shrink-0">
          Pilot Edition v2.0
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Engineering Branch Exploration Profile</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Engineering Disciplines Exploration Report
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Based on your responses across 64 Likert preferences and 16 practical engineering scenarios, here is your personal affinity matrix across 8 core engineering domains.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsRetakeModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Exploration</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-slate-900 text-xs font-bold transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-default scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-slate-900 shadow-sm font-bold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Hero Top 2 Branches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Branch Card */}
            <div className={`rounded-3xl border ${primaryTheme.borderColor} ${primaryTheme.bgLight} ${primaryTheme.bgDark} p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    <span>Primary Exploration Area</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-text-primary">
                    {primary.branchName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl md:text-3xl font-black text-text-primary">
                    {primary.displayPercentage}%
                  </span>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                    {primary.alignment}
                  </p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                {primary.coreFocus}
              </p>

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                  Why this area appeared:
                </span>
                <p className="text-xs text-text-secondary leading-relaxed bg-white/60 dark:bg-black/20 p-3 rounded-xl">
                  {result.explorationRationale.primaryWhy}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider w-full">
                  Key Subjects:
                </span>
                {primary.keySchoolSubjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border-subtle text-[11px] font-medium text-text-secondary"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Secondary Branch Card */}
            <div className={`rounded-3xl border ${secondaryTheme.borderColor} ${secondaryTheme.bgLight} ${secondaryTheme.bgDark} p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Secondary Exploration Area</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-text-primary">
                    {secondary.branchName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl md:text-3xl font-black text-text-primary">
                    {secondary.displayPercentage}%
                  </span>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                    {secondary.alignment}
                  </p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                {secondary.coreFocus}
              </p>

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                  Secondary Exploration Rationale:
                </span>
                <p className="text-xs text-text-secondary leading-relaxed bg-white/60 dark:bg-black/20 p-3 rounded-xl">
                  {result.explorationRationale.secondaryWhy}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider w-full">
                  Key Subjects:
                </span>
                {secondary.keySchoolSubjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border-subtle text-[11px] font-medium text-text-secondary"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interdisciplinary Exploration Alert if Mixed Profile */}
          {result.isMixedProfile && result.explorationRationale.interdisciplinaryNote && (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
                  Interdisciplinary Engineering Profile ({result.clarity})
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  {result.explorationRationale.interdisciplinaryNote}
                </p>
              </div>
            </div>
          )}

          {/* 8-Branch Quick Progress Bar Matrix */}
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Complete 8-Branch Compatibility Ranking
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Ranked by combined Likert preference ratings and forced-choice scenario selections
                </p>
              </div>
              <button
                onClick={() => setActiveTab("branches")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Full Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {result.sortedBranches.map((branch, idx) => {
                const theme = BRANCH_THEMES[branch.branchCode] || BRANCH_THEMES.CSE;
                return (
                  <div key={branch.branchCode} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-surface-subtle text-text-muted font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        {theme.icon}
                        <span className="font-bold text-text-primary">
                          {branch.branchName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-text-muted hidden sm:inline">
                          {branch.alignment}
                        </span>
                        <span className="font-black text-text-primary w-10 text-right">
                          {branch.displayPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-surface-subtle rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(5, branch.displayPercentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8-Branch Matrix */}
      {activeTab === "branches" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.sortedBranches.map((branch, idx) => {
              const theme = BRANCH_THEMES[branch.branchCode] || BRANCH_THEMES.CSE;
              const isExpanded = expandedBranch === branch.branchCode;

              return (
                <div
                  key={branch.branchCode}
                  className={`bg-surface-elevated rounded-3xl border border-border-default p-6 space-y-4 transition-all ${
                    isExpanded ? "ring-2 ring-primary/40 shadow-md" : "hover:border-border-hover"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-surface-subtle border border-border-subtle">
                        {theme.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                            Rank #{idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${theme.badgeBg}`}>
                            {branch.branchCode}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-text-primary">
                          {branch.branchName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-text-primary">
                        {branch.displayPercentage}%
                      </span>
                      <p className="text-[10px] text-text-muted font-semibold uppercase">
                        {branch.alignment}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {branch.coreFocus}
                  </p>

                  <div className="bg-surface-subtle p-3 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px] text-text-muted font-medium">
                      <span>Likert Rating Points (Max 40):</span>
                      <span className="font-bold text-text-primary">{branch.likertPoints} / 40</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted font-medium">
                      <span>Choice Scenario Points (Max 10):</span>
                      <span className="font-bold text-text-primary">{branch.choicePoints} / 10</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-text-primary font-bold pt-1 border-t border-border-subtle">
                      <span>Total Raw Points:</span>
                      <span>{branch.totalRaw} / 50</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Example Specialization Areas:
                    </span>
                    <p className="text-xs text-text-secondary">
                      {branch.exampleAreas}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Counselling Note:
                    </span>
                    <p className="text-xs text-text-secondary italic">
                      {branch.counsellingNote}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Constructs Breakdown */}
      {activeTab === "constructs" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">
                8 Psychometric Construct Profiles (C01–C08)
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Normalized 0–100 scores measuring cognitive orientation, analytical preference, and technical affinity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.topConstructs.map((construct) => (
                <div
                  key={construct.constructCode}
                  className="bg-surface-subtle rounded-2xl p-5 border border-border-subtle space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                        {construct.constructCode}
                      </span>
                      <h4 className="text-sm font-bold text-text-primary">
                        {construct.name}
                      </h4>
                    </div>
                    <span className="text-lg font-black text-text-primary">
                      {construct.normalizedScore}
                    </span>
                  </div>

                  <div className="w-full bg-border-default rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.max(5, construct.normalizedScore)}%` }}
                    />
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {construct.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mr-1">
                      Related:
                    </span>
                    {construct.associatedBranches.map((b) => (
                      <span
                        key={b}
                        className="px-1.5 py-0.5 rounded bg-surface-elevated text-[10px] font-bold text-text-secondary border border-border-subtle"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Suggested Projects */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Actionable Engineering Projects & Explorations
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Recommended practical extracurricular projects to validate your interest in {primary.branchName} and {secondary.branchName}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Projects */}
              <div className="bg-surface-subtle rounded-2xl p-6 border border-border-subtle space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-text-primary">
                  {primaryTheme.icon}
                  <span>Projects in {primary.branchName}</span>
                </div>
                <ul className="space-y-2.5">
                  {primary.suggestedProjects.map((proj, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{proj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secondary Projects */}
              <div className="bg-surface-subtle rounded-2xl p-6 border border-border-subtle space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-text-primary">
                  {secondaryTheme.icon}
                  <span>Projects in {secondary.branchName}</span>
                </div>
                <ul className="space-y-2.5">
                  {secondary.suggestedProjects.map((proj, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{proj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Counsellor Guide */}
      {activeTab === "counsellor" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Counsellor Discussion & Guidance Framework
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Open-ended prompts and subject readiness guidelines for student-counsellor mentoring sessions
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Recommended Discussion Questions
              </h4>
              <div className="space-y-2">
                {result.counsellorGuide.discussionQuestions.map((q, idx) => (
                  <div key={idx} className="bg-surface-subtle p-3.5 rounded-xl text-xs text-text-secondary font-medium">
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Recommended Next Steps
              </h4>
              <div className="space-y-2">
                {result.counsellorGuide.recommendedNextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary bg-surface-subtle p-3.5 rounded-xl">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: History & Longitudinal Tracking */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-3xl border border-border-default p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Assessment Retake & Longitudinal History
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Track your engineering discipline exploration trajectory across time
                </p>
              </div>
              <button
                onClick={() => setIsRetakeModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-slate-900 text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New Retake Attempt</span>
              </button>
            </div>

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

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleRetakeConfirm}
        assessmentName="Engineering Branch Finder"
        isPending={startRetakeMutation.isPending}
      />
    </div>
  );
};
