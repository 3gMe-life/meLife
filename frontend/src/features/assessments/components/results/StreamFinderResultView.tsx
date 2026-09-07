"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StreamFinderResult, StreamName, StreamScoreItem } from "../../types/assessment.types";
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
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface StreamFinderResultViewProps {
  result: StreamFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "streams" | "sections" | "careers" | "evidence" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Stream Overview", icon: <Sparkles className="w-4 h-4" /> },
  { id: "streams", label: "4-Stream Matrix", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "sections", label: "Sectional Breakdown", icon: <Layers className="w-4 h-4" /> },
  { id: "careers", label: "Career Clusters", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "evidence", label: "Academic Evidence", icon: <BookOpen className="w-4 h-4" /> },
  { id: "history", label: "Milestone History", icon: <TrendingUp className="w-4 h-4" /> },
];

const STREAM_THEMES: Record<
  StreamName,
  {
    color: string;
    bgLight: string;
    bgDark: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    barGradient: string;
  }
> = {
  Science: {
    color: "#00BFA5",
    bgLight: "bg-teal-50/80",
    bgDark: "dark:bg-teal-950/20",
    borderColor: "border-teal-300/40 dark:border-teal-700/40",
    badgeBg: "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200",
    badgeText: "text-teal-700 dark:text-teal-300",
    barGradient: "from-teal-500 to-emerald-400",
  },
  Commerce: {
    color: "#3B82F6",
    bgLight: "bg-blue-50/80",
    bgDark: "dark:bg-blue-950/20",
    borderColor: "border-blue-300/40 dark:border-blue-700/40",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    badgeText: "text-blue-700 dark:text-blue-300",
    barGradient: "from-blue-500 to-indigo-400",
  },
  Humanities: {
    color: "#F59E0B",
    bgLight: "bg-amber-50/80",
    bgDark: "dark:bg-amber-950/20",
    borderColor: "border-amber-300/40 dark:border-amber-700/40",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
    badgeText: "text-amber-700 dark:text-amber-300",
    barGradient: "from-amber-500 to-orange-400",
  },
  "Applied / Technical": {
    color: "#8B5CF6",
    bgLight: "bg-purple-50/80",
    bgDark: "dark:bg-purple-950/20",
    borderColor: "border-purple-300/40 dark:border-purple-700/40",
    badgeBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    badgeText: "text-purple-700 dark:text-purple-300",
    barGradient: "from-purple-500 to-violet-400",
  },
};

export function StreamFinderResultView({ result }: StreamFinderResultViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  const { data: historyData } = useAssessmentHistoryQuery("stream-finder");
  const startRetakeMutation = useStartRetakeMutation();

  const handleStartRetake = () => {
    startRetakeMutation.mutate(
      { assessmentCode: "stream-finder" },
      {
        onSuccess: () => {
          setIsRetakeModalOpen(false);
          toast.success("New Stream Finder Session Initialized", {
            description: "Questions reset for your fresh milestone evaluation.",
          });
          router.push("/participant/assessments/stream-finder");
        },
        onError: (err) => {
          console.error("Failed to start retake:", err);
          setIsRetakeModalOpen(false);
          toast.info("Resuming Assessment Session", {
            description: "Routing to your assessment questions.",
          });
          router.push("/participant/assessments/stream-finder");
        },
      }
    );
  };

  const primaryStream = result.primaryStream || "Science";
  const primaryTheme = STREAM_THEMES[primaryStream] || STREAM_THEMES.Science;
  const secondaryStream = result.secondaryStream || "Commerce";
  const secondaryTheme = STREAM_THEMES[secondaryStream] || STREAM_THEMES.Commerce;

  // Clarity badge configuration
  const clarityConfig: Record<
    string,
    { label: string; badgeClass: string; description: string }
  > = {
    "High Clarity": {
      label: "High Recommendation Clarity",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300/40",
      description: "A prominent preference gap (≥15%) confirms high confidence in your primary stream selection.",
    },
    "Moderate Clarity": {
      label: "Moderate Recommendation Clarity",
      badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300/40",
      description: "Clear primary alignment (8%–14% gap) with strong secondary stream as a complementary choice.",
    },
    "Mixed Profile / Further Exploration": {
      label: "Mixed Profile / Dual Affinity",
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300/40",
      description: "Close score gap (<8%) indicates versatile dual-interest affinity across multiple disciplines.",
    },
  };

  const clarityInfo = clarityConfig[result.clarity] || clarityConfig["High Clarity"];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-elevated border border-border-default rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
              Class 9–10 Secondary Edition
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${clarityInfo.badgeClass}`}>
              {result.clarity}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Stream Finder Comprehensive Report
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Senior Secondary (Class 11–12) Academic Stream Alignment & Vocational Battery
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 print:hidden">
          <button
            onClick={() => setIsRetakeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-border-default hover:bg-surface-muted/60 text-text-secondary hover:text-text-primary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Retake Stream Finder for fresh milestone comparison"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-surface-muted hover:bg-border-default text-text-primary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <Link
            href="/participant/counselling"
            className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-slate-900 hover:text-white text-xs font-black transition-all shadow-md shadow-[#00BFA5]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book Counsellor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Hero Recommendation Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 border border-teal-500/30 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Stream Ranking & Clarity */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-teal-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Senior Secondary Path</span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300/80 font-bold mb-1">
                Primary Stream Alignment
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
                <span>{primaryStream}</span>
                <span className="text-2xl sm:text-3xl font-bold text-teal-400 bg-teal-950/60 px-3 py-1 rounded-2xl border border-teal-500/30">
                  {result.primaryDisplayPercentage}%
                </span>
              </h2>
              <p className="text-sm font-semibold text-teal-200/90 mt-1">
                {result.primaryAlignment}
              </p>
            </div>

            {/* Secondary Stream */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Secondary Complementary Stream
                </span>
                <span className="text-base font-bold text-white">
                  {secondaryStream} ({result.secondaryDisplayPercentage}%)
                </span>
                <span className="text-xs text-slate-300 ml-2">
                  • {result.secondaryAlignment}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Differential Gap</span>
                <span className="text-sm font-black text-amber-300">
                  +{result.scoreGapPercentage}% Advantage
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {result.counsellingSummary || clarityInfo.description}
            </p>
          </div>

          {/* Right: 4-Stream Quick Visual Summary */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Stream Match Index</span>
              <span className="text-[11px] font-normal text-slate-400">80 Evaluated Items</span>
            </h3>

            {result.sortedStreams.map((s) => {
              const theme = STREAM_THEMES[s.stream] || STREAM_THEMES.Science;
              const isPrimary = s.stream === primaryStream;

              return (
                <div key={s.stream} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isPrimary ? "text-white flex items-center gap-1.5" : "text-slate-300"}`}>
                      {isPrimary && <Award className="w-3.5 h-3.5 text-teal-400" />}
                      {s.stream}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400 text-[11px]">{s.totalRaw}/{s.maxTotal} pts</span>
                      <span className={`font-black ${isPrimary ? "text-teal-300 font-bold" : "text-slate-200"}`}>
                        {s.displayPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${theme.barGradient}`}
                      style={{ width: `${Math.max(s.displayPercentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="border-b border-border-default print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border-primary text-primary font-black"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-default"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Content Panels */}
      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* 4 Stream Compatibility Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  4 Stream Compatibility Assessment
                </h3>
                <p className="text-xs text-text-secondary">
                  Calculated from 60 Likert Trait points + 20 Forced-Choice Scenario points (Total Raw / Max Points)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {result.sortedStreams.map((s, idx) => {
                const theme = STREAM_THEMES[s.stream];
                const isPrimary = idx === 0;
                const isSecondary = idx === 1;

                return (
                  <div
                    key={s.stream}
                    className={`rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between ${
                      isPrimary
                        ? `${theme.bgLight} ${theme.bgDark} ${theme.borderColor} shadow-md ring-2 ring-primary/20`
                        : "bg-surface-elevated border-border-default hover:border-border-hover"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                          isPrimary
                            ? theme.badgeBg
                            : isSecondary
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-surface-muted text-text-tertiary"
                        }`}>
                          {isPrimary ? "#1 Primary Fit" : isSecondary ? "#2 Secondary Fit" : `#${idx + 1} Stream`}
                        </span>
                        <span className="text-2xl font-black text-text-primary">
                          {s.displayPercentage}%
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-text-primary mb-1">
                        {s.stream}
                      </h4>
                      <p className={`text-xs font-bold mb-4 ${theme.badgeText}`}>
                        {s.alignment}
                      </p>

                      <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient}`}
                          style={{ width: `${Math.max(s.displayPercentage, 3)}%` }}
                        />
                      </div>

                      <div className="space-y-2 text-xs text-text-secondary border-t border-border-default/60 pt-3">
                        <div className="flex justify-between">
                          <span>Trait Points (Q1–60):</span>
                          <span className="font-mono font-bold text-text-primary">{s.traitPoints} / {s.maxTraitPoints}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Choice Points (Q61–80):</span>
                          <span className="font-mono font-bold text-text-primary">{s.choicePoints} / {s.maxChoicePoints}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-border-default pt-1.5 font-bold text-text-primary">
                          <span>Total Raw Score:</span>
                          <span className="font-mono">{s.totalRaw} / {s.maxTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matched Career Clusters Preview */}
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-text-primary">
                    Recommended Career Clusters for Your Profile
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Mapped directly from your stream alignment combination
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("careers")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Career Paths</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.careerClusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-surface-muted/50 border border-border-default space-y-3.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                      {cluster.profileKey}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                      Suggested Career Families
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.suggestedCareerFamilies.map((fam, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-1 rounded-lg bg-surface-elevated text-xs font-semibold text-text-primary border border-border-default"
                        >
                          {fam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                      Example Specialization Areas
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.exampleAreas.map((area, aIdx) => (
                        <span
                          key={aIdx}
                          className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 text-[11px] font-medium border border-teal-200/40 dark:border-teal-800/40"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border-default">
                    💡 <span className="font-semibold text-text-primary">Counselling Note:</span> {cluster.counsellingNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 4-STREAM DETAILED MATRIX */}
      {activeTab === "streams" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-text-primary">
                Detailed 4-Stream Scoring Matrix
              </h3>
              <p className="text-xs text-text-secondary">
                Exact point allocations and maximum potential score distribution per academic discipline
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-default text-xs font-bold text-text-secondary uppercase tracking-wider bg-surface-muted/50">
                    <th className="p-4 rounded-l-2xl">Academic Stream</th>
                    <th className="p-4">Trait Points (Q1–60)</th>
                    <th className="p-4">Choice Points (Q61–80)</th>
                    <th className="p-4">Total Raw Score</th>
                    <th className="p-4">Max Points</th>
                    <th className="p-4">Compatibility %</th>
                    <th className="p-4 rounded-r-2xl">Alignment Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default text-xs sm:text-sm">
                  {result.sortedStreams.map((s, idx) => {
                    const isTop = idx === 0;
                    const theme = STREAM_THEMES[s.stream];

                    return (
                      <tr
                        key={s.stream}
                        className={`hover:bg-surface-muted/40 transition-colors ${
                          isTop ? "bg-primary-50/30 dark:bg-primary-950/20 font-semibold" : ""
                        }`}
                      >
                        <td className="p-4 font-bold text-text-primary flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: theme.color }}
                          />
                          {s.stream}
                          {isTop && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-primary text-slate-900">
                              TOP
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono">{s.traitPoints} / {s.maxTraitPoints}</td>
                        <td className="p-4 font-mono">{s.choicePoints} / {s.maxChoicePoints}</td>
                        <td className="p-4 font-mono font-bold text-text-primary">{s.totalRaw}</td>
                        <td className="p-4 font-mono text-text-tertiary">{s.maxTotal}</td>
                        <td className="p-4 font-mono font-bold text-primary">{s.displayPercentage}%</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${theme.badgeBg}`}>
                            {s.alignment}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Score Gap Breakdown Card */}
            <div className="p-6 rounded-2xl bg-surface-muted/60 border border-border-default space-y-3">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>Decision Differential & Recommendation Rule</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                  <div className="text-text-tertiary font-medium">Primary Stream</div>
                  <div className="text-base font-black text-text-primary mt-1">
                    {result.primaryStream} ({result.primaryDisplayPercentage}%)
                  </div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                  <div className="text-text-tertiary font-medium">Secondary Stream</div>
                  <div className="text-base font-black text-text-primary mt-1">
                    {result.secondaryStream} ({result.secondaryDisplayPercentage}%)
                  </div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                  <div className="text-text-tertiary font-medium">Score Gap Differential</div>
                  <div className="text-base font-black text-teal-600 dark:text-teal-400 mt-1">
                    {result.scoreGapPercentage}% ({result.clarity})
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                • <strong>High Clarity (Gap ≥ 15%):</strong> Unambiguous choice. Prioritize primary stream directly.<br />
                • <strong>Moderate Clarity (Gap 8%–14%):</strong> Definite leaning. Keep secondary stream as elective or backup.<br />
                • <strong>Mixed Profile (Gap &lt; 8%):</strong> Dual affinity. Consider interdisciplinary subjects (e.g., Economics with Maths, Psychology with Biology).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 6 SECTION BREAKDOWNS */}
      {activeTab === "sections" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-text-primary">
                6 Sectional Dimension Breakdowns
              </h3>
              <p className="text-xs text-text-secondary">
                Explore how your responses were distributed across each evaluated construct
              </p>
            </div>

            <div className="space-y-4">
              {result.sectionBreakdown.map((sec, idx) => (
                <div
                  key={sec.sectionCode}
                  className="rounded-2xl border border-border-default p-5 bg-surface-muted/30 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">{sec.sectionName}</h4>
                        <span className="text-[11px] text-text-secondary">
                          {sec.questionCount} Questions Evaluated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Mini Progress Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-teal-700 dark:text-teal-300">Science</span>
                        <span className="font-mono font-bold text-text-primary">{sec.scienceScore} pts</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(sec.scienceScore * 5, 100)}%` }} />
                      </div>
                    </div>

                    <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Commerce</span>
                        <span className="font-mono font-bold text-text-primary">{sec.commerceScore} pts</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(sec.commerceScore * 5, 100)}%` }} />
                      </div>
                    </div>

                    <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-amber-700 dark:text-amber-300">Humanities</span>
                        <span className="font-mono font-bold text-text-primary">{sec.humanitiesScore} pts</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(sec.humanitiesScore * 5, 100)}%` }} />
                      </div>
                    </div>

                    <div className="p-3 bg-surface-elevated rounded-xl border border-border-default">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-purple-700 dark:text-purple-300">Applied</span>
                        <span className="font-mono font-bold text-text-primary">{sec.appliedScore} pts</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(sec.appliedScore * 5, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAREER CLUSTERS */}
      {activeTab === "careers" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-text-primary">
                Career Pathways & Vocational Guidance
              </h3>
              <p className="text-xs text-text-secondary">
                Curated specializations aligned with your primary ({primaryStream}) and secondary ({secondaryStream}) academic inclinations
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {result.careerClusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-6 sm:p-8 border-2 border-primary/30 bg-primary-50/20 dark:bg-primary-950/10 space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-xl font-black text-text-primary">
                      {cluster.profileKey}
                    </h4>
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-primary text-slate-900">
                      Best Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        Core Career Families
                      </h5>
                      <ul className="space-y-2">
                        {cluster.suggestedCareerFamilies.map((fam, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>{fam}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        Specialized Fields & Degree Programs
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {cluster.exampleAreas.map((area, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-3 py-1.5 rounded-xl bg-surface-elevated text-xs font-semibold text-text-primary border border-border-default shadow-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-elevated border border-border-default">
                    <div className="text-xs font-bold text-primary mb-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Academic & Counselling Recommendation</span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {cluster.counsellingNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACADEMIC EVIDENCE */}
      {activeTab === "evidence" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-text-primary">
                Academic Evidence & Board Thresholds
              </h3>
              <p className="text-xs text-text-secondary">
                Cross-referencing your psychometric affinity with Class 10 school board academic requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.academicEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-surface-muted/40 border border-border-default space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-text-primary">{ev.subject}</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-text-tertiary block">Stream Relevance:</span>
                      <span className="text-text-primary">{ev.relevance}</span>
                    </div>
                    <div className="p-2.5 bg-surface-elevated rounded-xl border border-border-default">
                      <span className="font-semibold text-teal-700 dark:text-teal-300 block mb-0.5">Threshold Note:</span>
                      <span className="text-text-secondary">{ev.thresholdNote}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MILESTONE HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  Stream Finder Evaluation History
                </h3>
                <p className="text-xs text-text-secondary">
                  Track your stream stability and career clarity progression across evaluation milestones
                </p>
              </div>
              <button
                onClick={() => setIsRetakeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-slate-900 font-bold text-xs hover:bg-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New Evaluation</span>
              </button>
            </div>

            {historyData?.history && historyData.history.length > 0 ? (
              <AssessmentTimeline
                history={historyData.history}
                onSelectAttempt={(item) => router.push(`/participant/results/${item.attemptId}`)}
              />
            ) : (
              <div className="p-8 text-center bg-surface-muted/30 rounded-2xl border border-border-default text-xs text-text-secondary">
                This is your initial baseline Stream Finder evaluation. Retake during Class 10 term transitions to measure clarity stability.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        assessmentName="Stream Finder (Secondary Edition)"
        isPending={startRetakeMutation.isPending}
      />
    </div>
  );
}
