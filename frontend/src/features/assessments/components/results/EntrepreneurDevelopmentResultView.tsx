"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EntrepreneurDevelopmentResult,
  EntrepreneurDimensionScoreDetails,
  StartupRoadmapPhase,
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
  Briefcase,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Users,
  Lock,
  Workflow,
  ShieldAlert,
  HelpCircle,
  Rocket,
  Compass as CompassIcon,
  Flame,
  Check,
  Clock,
  Download,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface EntrepreneurDevelopmentResultViewProps {
  result: EntrepreneurDevelopmentResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "dimensions" | "strengths" | "roadmap" | "recommendations" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Executive Archetype", icon: <Sparkles className="w-4 h-4" /> },
  { id: "dimensions", label: "10-Dimension Profile", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "strengths", label: "Strengths & Growth", icon: <Zap className="w-4 h-4" /> },
  { id: "roadmap", label: "Startup Roadmap", icon: <Rocket className="w-4 h-4" /> },
  { id: "recommendations", label: "Frameworks & Books", icon: <BookOpen className="w-4 h-4" /> },
  { id: "history", label: "Assessment History", icon: <RotateCcw className="w-4 h-4" /> },
];

export const EntrepreneurDevelopmentResultView: React.FC<EntrepreneurDevelopmentResultViewProps> = ({
  result,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<EntrepreneurDimensionScoreDetails | null>(
    result.dimensions?.[0] || null
  );

  const { mutate: startRetake, isPending: isRetaking } = useStartRetakeMutation();
  const { data: historyData, isLoading: isHistoryLoading } = useAssessmentHistoryQuery(
    result.assessmentCode
  );

  const handleRetakeConfirm = () => {
    startRetake(
      { assessmentCode: result.assessmentCode, versionCode: result.versionCode || "ENTREPRENEUR_DEVELOPMENT_V1" },
      {
        onSuccess: () => {
          setIsRetakeModalOpen(false);
          toast.success("Fresh Entrepreneur Development Test session initialized.");
          router.push("/participant/assessments");
        },
        onError: (err: any) => {
          setIsRetakeModalOpen(false);
          toast.error(err?.message || "Could not initialize retake attempt.");
        },
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Archetype Badge Color Config
  const getArchetypeBadgeColor = (code: string) => {
    switch (code) {
      case "INNOVATOR":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "BUILDER":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "LEADER":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "EXPLORER":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "GROWTH_ENTREPRENEUR":
      default:
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
    }
  };

  // Readiness Index Tier Color
  const getReadinessColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 stroke-emerald-500";
    if (score >= 70) return "text-teal-500 stroke-teal-500";
    if (score >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: "Exceptional", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200" };
    if (score >= 70) return { label: "High", bg: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200" };
    if (score >= 50) return { label: "Moderate", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200" };
    return { label: "Foundational", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200" };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Rocket className="w-4 h-4" />
            <span>Psychometric Assessment Result</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Entrepreneur Development Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standard Edition • 10 Venture Constructs • Startup Readiness Model
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => setIsRetakeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* 2. Top Tabs */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-gray-200 dark:border-slate-800 gap-2 print:hidden">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: EXECUTIVE ARCHETYPE & READINESS OVERVIEW           */}
      {/* ========================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Archetype Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-teal-800/40">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PRIMARY ENTREPRENEURIAL ARCHETYPE</span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {result.primaryArchetype?.title || "The Innovator"}
                  </h2>
                  <p className="text-teal-200 text-base sm:text-lg font-medium mt-1">
                    {result.primaryArchetype?.tagline}
                  </p>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {result.primaryArchetype?.description}
                </p>

                {/* Secondary Archetype Pill */}
                {result.secondaryArchetype && (
                  <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-semibold text-gray-300">Secondary Affinity:</span>
                    <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-teal-200 font-medium">
                      {result.secondaryArchetype.title} ({result.secondaryArchetype.affinityScore}% match)
                    </span>
                  </div>
                )}
              </div>

              {/* ERI Score Gauge Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center min-w-[240px]">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200 mb-2">
                  Entrepreneurial Readiness (ERI)
                </span>
                <div className="relative w-32 h-32 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-white/20"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className={getReadinessColor(result.readinessIndex)}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - (result.readinessIndex || 0) / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">
                      {result.readinessIndex ?? 75}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-teal-200">/ 100</span>
                  </div>
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{result.readinessBand}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Superpowers, Leadership Style & Blind Spots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Superpowers */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Core Superpowers</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Natural venture strengths</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {(result.primaryArchetype?.keySuperpowers || []).map((power, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>{power}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Leadership Style */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Leadership Style</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">How you lead teams</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {result.primaryArchetype?.leadershipStyle}
              </p>
              <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Complementary Co-Founders:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(result.primaryArchetype?.idealCoFounders || []).map((cf, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium"
                    >
                      {cf}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Blind Spots */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Venture Blind Spots</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Risks to monitor</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {(result.primaryArchetype?.blindSpots || []).map((spot, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{spot}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Archetype Affinities Comparison Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              5 Entrepreneur Archetype Alignment Matrix
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Composite alignment across all five startup founder archetypes.
            </p>

            <div className="space-y-4">
              {(result.archetypeAffinities || []).map((arch) => (
                <div key={arch.archetypeCode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{arch.title}</span>
                      {arch.isPrimary && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 text-[10px] font-bold">
                          PRIMARY
                        </span>
                      )}
                      {arch.isSecondary && (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 text-[10px] font-bold">
                          SECONDARY
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                      {arch.affinityScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        arch.isPrimary
                          ? "bg-teal-600 dark:bg-teal-400"
                          : arch.isSecondary
                          ? "bg-teal-400 dark:bg-teal-600"
                          : "bg-gray-300 dark:bg-slate-700"
                      }`}
                      style={{ width: `${arch.affinityScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 10-DIMENSION PROFILE BREAKDOWN                     */}
      {/* ========================================================= */}
      {activeTab === "dimensions" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-teal-950 dark:text-teal-200">
              10-Dimension Psychometric Breakdown
            </h3>
            <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mt-1 leading-relaxed">
              Every dimension is calibrated across 6 questions (5 Likert items + 1 Situational Judgment scenario) with a maximum of 30 points per dimension.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(result.dimensions || []).map((dim, idx) => {
              const badge = getScoreBadge(dim.percentageScore);
              return (
                <div
                  key={dim.dimensionCode}
                  onClick={() => setSelectedDimension(dim)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all cursor-pointer hover:shadow-md ${
                    selectedDimension?.dimensionCode === dim.dimensionCode
                      ? "border-teal-500 ring-2 ring-teal-500/20 shadow-sm"
                      : "border-gray-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {dim.dimensionName}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg}`}>
                      {dim.percentageScore}% • {dim.band}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {dim.description}
                  </p>

                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full bg-teal-600 dark:bg-teal-400 transition-all duration-700"
                      style={{ width: `${dim.percentageScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
                    <span>Raw Score: {dim.rawScore} / {dim.maxPossibleRaw}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-medium">
                      Weight: {(dim.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Dimension Detail Card */}
          {selectedDimension && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-200 dark:border-teal-900/40 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                <Info className="w-4 h-4" />
                <span>Dimension In-Depth Analysis</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {selectedDimension.dimensionName} ({selectedDimension.percentageScore}%)
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {selectedDimension.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                    Core Observable Indicators
                  </h4>
                  <ul className="space-y-1.5">
                    {(selectedDimension.coreIndicators || []).map((ind, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                    Developmental Focus
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl">
                    {selectedDimension.developmentalFocus}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STRENGTHS & GROWTH AREAS                           */}
      {/* ========================================================= */}
      {activeTab === "strengths" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Top 3 Entrepreneurial Strengths
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your highest scoring dimensional pillars
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(result.strengths || []).map((st) => (
                <div
                  key={st.dimensionCode}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-bold">
                        {st.score}%
                      </span>
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {st.dimensionName}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {st.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                      Leverage Tip:
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {st.leverageTip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development / Growth Areas */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Priority Venture Growth Areas
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Targeted dimensions for skill cultivation and deliberate practice
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(result.developmentAreas || []).map((dev) => (
                <div
                  key={dev.dimensionCode}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/40 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-bold">
                        {dev.score}%
                      </span>
                      <Target className="w-4 h-4 text-amber-500" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {dev.dimensionName}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {dev.gapSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                        Action Item:
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dev.actionItem}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 block mb-0.5">
                        Suggested Exercise:
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dev.suggestedExercise}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: 4-STAGE STARTUP ROADMAP                            */}
      {/* ========================================================= */}
      {activeTab === "roadmap" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Personalized 4-Stage Startup Execution Roadmap
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">
              Calibrated specifically for your {result.primaryArchetype?.title} profile.
            </p>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-800">
              {(result.roadmap || []).map((phase, idx) => (
                <div key={phase.phaseNumber} className="relative flex items-start gap-6">
                  {/* Step Circle */}
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-4 ring-white dark:ring-slate-900 z-10 font-mono">
                    0{phase.phaseNumber}
                  </div>

                  {/* Step Content */}
                  <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-6 flex-1 border border-gray-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {phase.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{phase.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                          Key Objectives & Actions:
                        </span>
                        <ul className="space-y-1.5">
                          {(phase.objectives || []).map((obj, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {phase.milestones && phase.milestones.length > 0 && (
                        <div className="pt-2 border-t border-gray-200/60 dark:border-slate-700/60">
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                            Phase Milestone:
                          </span>
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
                            <Target className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{phase.milestones[0]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: FRAMEWORKS, BOOKS & PRACTICAL PROJECTS             */}
      {/* ========================================================= */}
      {activeTab === "recommendations" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Core Frameworks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-teal-500" />
              <span>Recommended Venture Frameworks</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(result.learningRecommendations?.coreFrameworks || []).map((fw, i) => (
                <div key={i} className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{fw.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{fw.description}</p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                    Application: {fw.application}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Reading List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-500" />
              <span>Curated Founder Reading List</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(result.learningRecommendations?.recommendedBooks || []).map((b, i) => (
                <div key={i} className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{b.title}</h4>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mb-2">by {b.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experiential Projects */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-500" />
              <span>Experiential Startup Sprint Projects</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(result.learningRecommendations?.practicalProjects || []).map((p, i) => (
                <div key={i} className="bg-teal-50/50 dark:bg-teal-950/20 p-4 rounded-xl border border-teal-100 dark:border-teal-900/30">
                  <h4 className="text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">{p.title}</h4>
                  <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mb-2 leading-relaxed">{p.objective}</p>
                  <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                    Deliverable: {p.deliverable}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: ASSESSMENT HISTORY & RETAKE TIMELINE               */}
      {/* ========================================================= */}
      {activeTab === "history" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Assessment Attempt History
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Track your previous evaluations and progression over time.
            </p>

            {isHistoryLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : historyData?.history && historyData.history.length > 0 ? (
              <AssessmentTimeline history={historyData.history} />
            ) : (
              <div className="py-8 text-center text-xs text-gray-500">
                This is your first recorded session for the Entrepreneur Development Test.
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
        assessmentName="Entrepreneur Development Test"
        isPending={isRetaking}
      />
    </div>
  );
};
