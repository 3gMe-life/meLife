"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AiJobRiskFinderResult,
  StudentConstructScoreDetails,
  OccupationalTaskExposureItem,
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
  Briefcase,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Users,
  Lock,
  Workflow,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface AiJobRiskFinderResultViewProps {
  result: AiJobRiskFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "tasks" | "readiness" | "skills" | "counsellor" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "AI Career Outlook", icon: <Sparkles className="w-4 h-4" /> },
  { id: "tasks", label: "Task Transformation", icon: <Workflow className="w-4 h-4" /> },
  { id: "readiness", label: "Student AI Readiness", icon: <Brain className="w-4 h-4" /> },
  { id: "skills", label: "Future Skills & Outlook", icon: <Zap className="w-4 h-4" /> },
  { id: "counsellor", label: "Counsellor & Methodology", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "history", label: "Retake History", icon: <TrendingUp className="w-4 h-4" /> },
];

export const AiJobRiskFinderResultView: React.FC<AiJobRiskFinderResultViewProps> = ({
  result,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState<string>("ALL");

  const { mutate: startRetake, isPending: isRetaking } = useStartRetakeMutation();
  const { data: historyData } = useAssessmentHistoryQuery("AI_JOB_RISK_FINDER");

  const handleRetakeConfirm = () => {
    startRetake(
      { assessmentCode: "AI_JOB_RISK_FINDER", versionCode: result.versionCode || "AI_JOB_RISK_FINDER_V1" },
      {
        onSuccess: (data) => {
          setIsRetakeModalOpen(false);
          toast.success("Fresh AI Job Risk Finder session initialized.");
          router.push(`/participant/assessments`);
        },
        onError: (err: any) => {
          setIsRetakeModalOpen(false);
          toast.error(err?.message || "Could not initialize retake attempt.");
        },
      }
    );
  };

  const occ = result.targetCareerProfile;
  const syn = result.dualEvidenceSynthesis;
  const constructs = result.sortedConstructs || [];

  const filteredTasks = (occ?.tasks || []).filter((task) => {
    if (taskFilter === "ALL") return true;
    return task.transformationMode === taskFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-default/60 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <Cpu className="w-4 h-4" />
          <span>Occupational AI Transformation Assessment</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => setIsRetakeModalOpen(true)}
            disabled={isRetaking}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* HERO BANNER: Scientific AI Transformation Positioning */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-teal-900/40">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide uppercase">
                <Cpu className="w-3.5 h-3.5" />
                Workforce Future & AI Impact Assessment
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  AI Job Risk & Transformation Finder
                </h1>
                <p className="mt-2 text-slate-300 text-base leading-relaxed">
                  Evaluating occupational AI task exposure, transformation velocity, human-critical capabilities, and individual adaptability to guide proactive future skill development.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-slate-200">
                  <span className="text-slate-400 mr-1.5">Target Field:</span>
                  <span className="font-semibold text-white">{occ?.careerTitle || "Technology & Software"}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-slate-200">
                  <span className="text-slate-400 mr-1.5">Archetype:</span>
                  <span className="font-semibold text-teal-300">{occ?.archetypeTitle || "AI-Augmented Systems"}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-slate-200">
                  <span className="text-slate-400 mr-1.5">Readiness:</span>
                  <span className="font-semibold text-emerald-300">{result.studentReadinessTier}</span>
                </div>
              </div>
            </div>

            {/* Student AI Readiness Metric Card */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center w-full sm:w-64">
              <span className="text-xs uppercase tracking-wider text-teal-200 font-medium">
                Student AI Readiness
              </span>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black text-white">{result.studentReadinessIndex}</span>
                <span className="text-lg font-bold text-teal-300">/100</span>
              </div>
              <p className="mt-2 text-xs text-slate-300 font-medium">
                {result.studentReadinessTier}
              </p>
              <div className="mt-4 pt-4 border-t border-white/15 flex justify-between text-xs text-slate-300">
                <span>Completed: {result.completedQuestions}/30</span>
                <span>Quality: Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & EXECUTIVE SYNTHESIS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 4 Core Dimensions Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: AI Task Exposure */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    AI Task Exposure
                  </span>
                  <Workflow className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {occ?.taskExposureBand || "High"}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {occ?.overallTaskExposureIndex || 78}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${occ?.overallTaskExposureIndex || 78}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Degree to which repetitive information processing and digital routines in this field are streamlined by AI.
                </p>
              </div>

              {/* Card 2: AI Augmentation Potential */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    AI Augmentation
                  </span>
                  <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {occ?.augmentationBand || "Very High"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {occ?.aiAugmentationPotential || 92}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${occ?.aiAugmentationPotential || 92}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  How strongly intelligent copilot tools elevate productivity, analytics, and creative execution for professionals.
                </p>
              </div>

              {/* Card 3: Human-Critical Requirements */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Human Criticality
                  </span>
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {occ?.humanCriticalBand || "Very High"}
                  </span>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {occ?.humanCriticalRequirement || 85}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${occ?.humanCriticalRequirement || 85}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enduring reliance on complex judgment, ethical responsibility, empathy, and holistic system design.
                </p>
              </div>

              {/* Card 4: Evolution Velocity */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Evolution Velocity
                  </span>
                  <RefreshCw className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {occ?.transformationVelocity || "Rapid"}
                  </span>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {occ?.adaptationUrgency || 88}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${occ?.adaptationUrgency || 88}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Rate at which tools, workflows, and required domain skills are evolving in this career path.
                </p>
              </div>
            </div>

            {/* Dual-Evidence Executive Synthesis Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-teal-50/80 via-cyan-50/50 to-white dark:from-teal-950/20 dark:via-cyan-950/10 dark:to-slate-900 border border-teal-200/60 dark:border-teal-800/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-base">
                <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Dual-Evidence Psychometric Synthesis</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {syn?.synthesisSummary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {syn?.alignmentHighlights?.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enduring Human Capabilities & Top Student Strengths */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Non-Automatable Human Capabilities */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Enduring Human Capabilities in {occ?.careerTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Critical capabilities that remain deeply human and resistant to direct automation:
                </p>
                <ul className="space-y-2.5">
                  {occ?.enduringHumanCapabilities?.map((cap, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <Target className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Student Readiness Top Strengths */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Your Demonstrated Strengths
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Self-reported orientations that provide strong foundations for future technology adoption:
                </p>
                <div className="space-y-3">
                  {result.topStrengths?.map((strength, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {strength.dimensionName}
                        </span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">
                          {strength.normalizedScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {strength.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OCCUPATIONAL TASK TRANSFORMATION */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Occupational Task-Level AI Exposure Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Occupations are not single homogeneous units. Each task within {occ?.careerTitle} is impacted differently based on digital intensity, rule predictability, and human judgment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter:</span>
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">All Modes</option>
                  <option value="AI-Augmented">AI-Augmented</option>
                  <option value="Human-Led">Human-Led</option>
                  <option value="Collaborative Synthesis">Collaborative Synthesis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.taskId}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {task.frequency}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {task.taskName}
                      </h4>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        task.transformationMode === "AI-Augmented"
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                          : task.transformationMode === "Human-Led"
                          ? "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300"
                          : "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {task.transformationMode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.taskDescription}
                  </p>

                  {/* Task Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Digital Intensity</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{task.digitalIntensity}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Human Judgment</span>
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{task.humanJudgmentRequirement}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">AI Augmentation</span>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{task.aiAugmentationPotential}%</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{task.counsellingInsight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT AI READINESS PROFILE */}
        {activeTab === "readiness" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    6 Core Student AI Readiness Constructs
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Construct scores normalized on a 0–100 scale based on standard 30-item administered battery.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-teal-700 dark:text-teal-300">
                  Overall: {result.studentReadinessIndex}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {constructs.map((construct) => (
                <div
                  key={construct.dimensionCode}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {construct.dimensionName}
                    </h4>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      {construct.normalizedScore}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${construct.normalizedScore}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {construct.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Developmental Focus: </span>
                    <span>{construct.developmentalFocus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FUTURE SKILLS & EMERGING OPPORTUNITIES */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Priority Skill Cards */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Recommended Skills to Develop for {occ?.careerTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable skills that ensure longevity, strategic adaptability, and high creative leverage in this field:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {occ?.futureSkillPriorities?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {skill.skillName}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 flex-shrink-0">
                        {skill.importance}
                      </span>
                    </div>
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {skill.category}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {skill.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Career Horizons */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Emerging AI-Enabled Opportunities in this Domain
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {occ?.emergingOpportunities?.map((opp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900 border border-blue-100 dark:border-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{opp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COUNSELLOR GUIDE & METHODOLOGY */}
        {activeTab === "counsellor" && (
          <div className="space-y-6">
            {/* Counsellor Discussion Prompts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Counsellor & Mentor Discussion Prompts
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key questions for career guidance sessions with students, educators, or parents:
              </p>

              <div className="space-y-3">
                {syn?.counsellorDiscussionPrompts?.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{prompt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology & Limitations */}
            <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <Info className="w-4 h-4 text-slate-500" />
                <span>Scientific Methodology & Construct Integrity</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {syn?.methodologyNote}
              </p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                <strong>Important Notice:</strong> {syn?.pilotDisclaimer}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RETAKE HISTORY & TIMELINE */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Assessment Attempt History & Longitudinal Milestones
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    View prior completed attempts and track how your AI readiness evolves over time.
                  </p>
                </div>
                <button
                  onClick={() => setIsRetakeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Retake</span>
                </button>
              </div>

              {historyData?.history && historyData.history.length > 0 ? (
                <AssessmentTimeline history={historyData.history} />
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
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
        assessmentName="AI Job Risk Finder"
        isPending={isRetaking}
      />
    </div>
  );
};
