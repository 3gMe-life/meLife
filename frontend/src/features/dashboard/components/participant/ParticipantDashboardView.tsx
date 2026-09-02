"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BrainCircuit,
  Play,
  ArrowRight,
  GraduationCap,
  Download,
  Calendar,
  KeyRound,
  Compass,
} from "lucide-react";
import { MetricCard } from "../common/MetricCard";
import { AssessmentProgressCard } from "../common/AssessmentProgressCard";
import { CareerPathwayCard } from "../common/CareerPathwayCard";
import { VoucherRedeemModal } from "../common/VoucherRedeemModal";
import type { UserProfile } from "../../../auth/types/auth.types";
import type { AssessmentItem, CareerPathwayPreview, StrengthTrait } from "../../types/dashboard.types";

interface ParticipantDashboardViewProps {
  user: UserProfile;
  educationStage?: string | null;
}

// Curated Psychometric Assessment Modules
const DEFAULT_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "personality-big-five",
    code: "MELIFE-P1",
    title: "Personality Dimensions & Temperament",
    category: "Psychometrics",
    description: "Evaluates the Big Five personality traits, behavioral instincts, and learning preferences.",
    estimatedMinutes: 15,
    questionCount: 40,
    status: "COMPLETED",
    progressPercentage: 100,
    completedAt: "2026-08-28",
    dominantTrait: "Analytical & Conscientious",
  },
  {
    id: "cognitive-aptitude",
    code: "MELIFE-A1",
    title: "Cognitive Aptitude & Logical Reasoning",
    category: "Aptitude",
    description: "Measures abstract logic, spatial reasoning, numerical fluency, and pattern recognition.",
    estimatedMinutes: 25,
    questionCount: 30,
    status: "COMPLETED",
    progressPercentage: 100,
    completedAt: "2026-08-30",
    dominantTrait: "Quantitative Logic (92nd %ile)",
  },
  {
    id: "career-interest-riasec",
    code: "MELIFE-I1",
    title: "Career Interest Inventory (RIASEC)",
    category: "Vocational",
    description: "Identifies your Holland Code career interest spectrum across Realistic, Investigative, and Artistic spheres.",
    estimatedMinutes: 20,
    questionCount: 48,
    status: "IN_PROGRESS",
    progressPercentage: 45,
  },
  {
    id: "eq-work-styles",
    code: "MELIFE-E1",
    title: "Emotional Intelligence & Workplace Dynamics",
    category: "Interpersonal",
    description: "Assesses self-awareness, empathy in teamwork, stress management, and collaborative decision making.",
    estimatedMinutes: 15,
    questionCount: 35,
    status: "NOT_STARTED",
    progressPercentage: 0,
  },
];

// Curated Recommended Career Pathways
const DEFAULT_CAREER_PATHWAYS: CareerPathwayPreview[] = [
  {
    id: "ai-systems-architect",
    title: "AI & Machine Learning Architect",
    category: "Computational Technology",
    matchScore: 94,
    stream: "STEM / Advanced Computing",
    growthOutlook: "Very High",
    keySkills: ["Neural Architectures", "Discrete Math", "Systems Thinking", "Python/Rust"],
    description: "Designs, trains, and deploys intelligent models for autonomous systems and scientific discovery.",
  },
  {
    id: "biomedical-data-scientist",
    title: "Biomedical Data Scientist",
    category: "Bio-Informatics",
    matchScore: 89,
    stream: "Applied Biology & Analytics",
    growthOutlook: "High",
    keySkills: ["Genomic Data", "Statistical Inference", "Clinical Research", "Bio-Computing"],
    description: "Applies high-throughput computational analytics to accelerate therapeutic development and genomics.",
  },
  {
    id: "quantitative-economic-strategist",
    title: "Quantitative Economic Strategist",
    category: "Financial Technology",
    matchScore: 86,
    stream: "Mathematics & Economics",
    growthOutlook: "High",
    keySkills: ["Algorithmic Modeling", "Econometrics", "Risk Analysis", "Game Theory"],
    description: "Formulates predictive econometric models and quantitative algorithms for capital allocation.",
  },
];

// Strength Traits
const DEFAULT_STRENGTHS: StrengthTrait[] = [
  {
    dimension: "Quantitative & Logical Reasoning",
    score: 92,
    level: "High",
    description: "Exceptional ability to deconstruct complex mathematical patterns and algorithmic structures.",
  },
  {
    dimension: "Abstract & Strategic Problem Solving",
    score: 86,
    level: "High",
    description: "Skilled at identifying underlying system linkages and formulating long-term multi-step solutions.",
  },
  {
    dimension: "Emotional Intelligence & Collaboration",
    score: 79,
    level: "Proficient",
    description: "Effectively articulates technical concepts and collaborates with diverse cross-functional teams.",
  },
  {
    dimension: "Adaptive Learning & Resilience",
    score: 88,
    level: "High",
    description: "Quickly absorbs novel frameworks and persists through ambiguous, unstructured challenges.",
  },
];

export function ParticipantDashboardView({
  user,
  educationStage,
}: ParticipantDashboardViewProps) {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const formatStage = (s?: string | null) => {
    if (!s) return "Student Profile";
    return s
      .replace("grade_", "Class ")
      .replace("college", "College / University")
      .replace("_", " ")
      .toUpperCase();
  };

  const completedCount = DEFAULT_ASSESSMENTS.filter((a) => a.status === "COMPLETED").length;
  const totalCount = DEFAULT_ASSESSMENTS.length;
  const overallProgressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      {/* 1. Dynamic Hero Welcome & Readiness Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#2563EB]/25 via-[#14B8A6]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-[#14B8A6]/15 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3G MeLife Student Portal</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                <GraduationCap className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>{formatStage(educationStage)}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user.firstName}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your career discovery journey is <strong className="text-white">{overallProgressPercent}% calibrated</strong>. Complete your pending assessments to unlock your comprehensive psychometric report and career pathway matches.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <KeyRound className="w-4 h-4 text-[#14B8A6]" />
              <span>Redeem Voucher Code</span>
            </button>

            <Link
              href="/participant/assessments"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#2563EB]/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Assessment (45%)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          id="assessments-metric"
          title="Assessments Completed"
          value={`${completedCount} / ${totalCount}`}
          subtitle="2 modules calibrated"
          iconName="BookOpenCheck"
          trend={{ value: "+50% Done", isPositive: true }}
          accentColor="blue"
        />

        <MetricCard
          id="archetype-metric"
          title="Dominant Archetype"
          value="Analytical Strategist"
          subtitle="Investigative & Systems"
          iconName="BrainCircuit"
          trend={{ value: "92nd %ile", isPositive: true }}
          accentColor="teal"
        />

        <MetricCard
          id="affinity-metric"
          title="Top Career Affinity"
          value="94% Match"
          subtitle="AI Systems & Data Sciences"
          iconName="Target"
          trend={{ value: "Very High", isPositive: true }}
          accentColor="emerald"
        />

        <MetricCard
          id="reports-metric"
          title="Counselor Reports"
          value="1 Ready"
          subtitle="Comprehensive PDF Insight"
          iconName="FileText"
          accentColor="indigo"
        />
      </div>

      {/* 3. Assessments Hub & Psychometric Strengths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Psychometric Assessments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Psychometric Assessment Battery</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#60A5FA]">
                  {completedCount}/{totalCount} Completed
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Validated psychometric assessments tailored to your educational stage.
              </p>
            </div>

            <Link
              href="/participant/assessments"
              className="text-xs font-bold text-[#14B8A6] hover:text-[#2DD4BF] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEFAULT_ASSESSMENTS.map((assessment) => (
              <AssessmentProgressCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Psychometric Archetype & Core Strengths Summary */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#14B8A6]" />
              <span>Core Strengths & Archetype</span>
            </h2>
            <p className="text-xs text-slate-400">
              Calibrated from your completed assessments.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 space-y-4 shadow-xl">
            {/* Top Archetype Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#14B8A6]/15 via-transparent to-[#2563EB]/10 border border-[#14B8A6]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2DD4BF] block mb-1">
                Identified Career Archetype
              </span>
              <h3 className="text-base font-black text-white mb-1">
                The Analytical Strategist
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You excel at deconstructing complex technical problems, identifying algorithmic patterns, and building structured systems.
              </p>
            </div>

            {/* Strengths Progress Bars */}
            <div className="space-y-3.5 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Calibrated Dimension Scores
              </h4>

              {DEFAULT_STRENGTHS.map((trait) => (
                <div key={trait.dimension} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                      {trait.dimension}
                    </span>
                    <span className="font-mono font-bold text-[#14B8A6]">
                      {trait.score}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] transition-all duration-500"
                      style={{ width: `${trait.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/participant/results"
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Full Psychometric Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Recommended Career Pathways Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#2563EB]" />
              <span>Recommended Career Pathways</span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized career streams dynamically mapped to your psychometric cognitive profile.
            </p>
          </div>

          <Link
            href="/participant/pathways"
            className="text-xs font-bold text-[#14B8A6] hover:text-[#2DD4BF] hover:underline flex items-center gap-1 transition-colors"
          >
            <span>Explore All Pathways</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEFAULT_CAREER_PATHWAYS.map((pathway) => (
            <CareerPathwayCard key={pathway.id} pathway={pathway} />
          ))}
        </div>
      </div>

      {/* 5. Counselor Guidance & Report Download Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/20 border border-[#14B8A6]/30 text-[#2DD4BF] flex items-center justify-center shrink-0 shadow-md">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Official 3G MeLife Career Guidance Report
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Your preliminary psychometric profile is ready for download. Share this report with your school counselor or parents to plan your academic subject selection.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <Link
            href="/participant/results"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#14B8A6]" />
            <span>Download PDF Report</span>
          </Link>

          <Link
            href="/participant/counsellor"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#2563EB]/25"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Counselor Session</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
