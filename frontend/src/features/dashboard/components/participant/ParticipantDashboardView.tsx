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
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { MetricCard } from "../common/MetricCard";
import { AssessmentProgressCard } from "../common/AssessmentProgressCard";
import { CareerPathwayCard } from "../common/CareerPathwayCard";
import { VoucherRedeemModal } from "../common/VoucherRedeemModal";
import { useParticipantAssessmentsQuery } from "@/features/assessments/hooks/useParticipantAssessmentsQuery";
import type { UserProfile } from "../../../auth/types/auth.types";
import type { CareerPathwayPreview, StrengthTrait } from "../../types/dashboard.types";

interface ParticipantDashboardViewProps {
  user: UserProfile;
  educationStage?: string | null;
}

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
  const { data: assessmentData, isLoading: isAssessmentsLoading } = useParticipantAssessmentsQuery();

  const formatStage = (s?: string | null) => {
    if (!s) return "Student Profile";
    return s
      .replace("grade_", "Class ")
      .replace("college", "College / University")
      .replace("_", " ")
      .toUpperCase();
  };

  const assessmentsResult = assessmentData;
  const isProfileIncomplete = assessmentsResult?.state === "PROFILE_INCOMPLETE";
  const assessments = assessmentsResult?.assessments || [];
  const completedCount = assessmentsResult?.completedCount || 0;
  const totalCount = assessmentsResult?.totalAvailable || 0;
  const overallProgressPercent = assessmentsResult?.overallProgressPercentage || 0;

  const firstPendingAssessment = assessments.find((a) => a.status !== "COMPLETED");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      {/* 1. Dynamic Hero Welcome & Readiness Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#F7FAF9] to-[#EBF2F0] dark:from-[#172B2A] dark:via-[#172B2A]/95 dark:to-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-8 shadow-xs dark:shadow-2xl transition-colors duration-200">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#00BFA5]/15 dark:from-[#00BFA5]/25 via-[#00B8D4]/10 dark:via-[#00B8D4]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-[#00C896]/10 dark:from-[#00C896]/15 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3G MeLife Student Portal</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF2F0] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10">
                <GraduationCap className="w-3.5 h-3.5 text-[#00B8D4]" />
                <span>{formatStage(assessmentsResult?.educationStage || educationStage)}</span>
              </span>
              {assessmentsResult?.derivedAge !== null && assessmentsResult?.derivedAge !== undefined && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF2F0] dark:bg-white/5 text-[#008F83] dark:text-[#00BFA5] border border-[#E3ECEA] dark:border-white/10">
                  Age: {assessmentsResult.derivedAge} yrs
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              Welcome back, {user.firstName}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              {totalCount > 0 ? (
                <>
                  Your career discovery journey is <strong className="text-[#172B2A] dark:text-[#F7FAF9]">{overallProgressPercent}% calibrated</strong>. Complete your eligible psychometric assessments to generate your detailed career guidance report.
                </>
              ) : isProfileIncomplete ? (
                <>
                  Please complete your participant calibration profile to unlock your personalized psychometric assessments.
                </>
              ) : (
                <>
                  Explore available career pathways and psychometric resources calibrated to your profile.
                </>
              )}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-[#00B8D4]" />
              <span>Redeem Voucher Code</span>
            </button>

            {firstPendingAssessment ? (
              <Link
                href={`/participant/assessments/${firstPendingAssessment.code || firstPendingAssessment.id}`}
                className="px-5 py-3 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {firstPendingAssessment.status === "IN_PROGRESS"
                    ? `Resume Assessment (${firstPendingAssessment.progressPercentage}%)`
                    : "Start Assessment"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : isProfileIncomplete ? (
              <Link
                href="/participant/onboarding"
                className="px-5 py-3 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Calibration</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/participant/assessments"
                className="px-5 py-3 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/25"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Assessments</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Incomplete Profile Callout Banner */}
      {isProfileIncomplete && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Participant Calibration Incomplete
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                We need your date of birth and educational stage to calibrate your age-appropriate psychometric assessments.
              </p>
            </div>
          </div>
          <Link
            href="/participant/onboarding"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Complete Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          id="assessments-metric"
          title="Assessments Available"
          value={isAssessmentsLoading ? "..." : `${completedCount} / ${totalCount}`}
          subtitle={totalCount > 0 ? `${totalCount} calibrated module${totalCount > 1 ? "s" : ""}` : "Awaiting calibration"}
          iconName="BookOpenCheck"
          trend={totalCount > 0 ? { value: `${overallProgressPercent}% Done`, isPositive: true } : undefined}
          accentColor="teal"
        />

        <MetricCard
          id="archetype-metric"
          title="Dominant Archetype"
          value="Analytical Strategist"
          subtitle="Investigative & Systems"
          iconName="BrainCircuit"
          trend={{ value: "92nd %ile", isPositive: true }}
          accentColor="indigo"
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
          accentColor="teal"
        />
      </div>

      {/* 3. Assessments Hub & Psychometric Strengths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Psychometric Assessments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] tracking-tight flex items-center gap-2">
                <span>Psychometric Assessment Battery</span>
                {totalCount > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                    {completedCount}/{totalCount} Completed
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Validated psychometric assessments tailored to your educational stage.
              </p>
            </div>

            <Link
              href="/participant/assessments"
              className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Loading Skeleton */}
          {isAssessmentsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 space-y-4 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-[#EBF2F0] dark:bg-white/10 rounded-full" />
                    <div className="w-16 h-4 bg-[#EBF2F0] dark:bg-white/10 rounded-full" />
                  </div>
                  <div className="w-3/4 h-5 bg-[#EBF2F0] dark:bg-white/10 rounded-md" />
                  <div className="w-full h-10 bg-[#EBF2F0] dark:bg-white/10 rounded-md" />
                  <div className="w-full h-8 bg-[#EBF2F0] dark:bg-white/10 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty Assessment State */}
          {!isAssessmentsLoading && assessments.length === 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {isProfileIncomplete
                  ? "Calibration Required"
                  : "No assessments are currently available for your profile"}
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-md mx-auto leading-relaxed">
                {isProfileIncomplete
                  ? "Please complete your educational profile to calibrate and unlock your customized psychometric battery."
                  : "We are currently preparing new assessment modules for your educational demographic. Check back soon!"}
              </p>
              {isProfileIncomplete && (
                <Link
                  href="/participant/onboarding"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all mt-2"
                >
                  <span>Complete Calibration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

          {/* Real Assessment Cards Grid */}
          {!isAssessmentsLoading && assessments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assessments.map((assessment) => (
                <AssessmentProgressCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Psychometric Archetype & Core Strengths Summary */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#00BFA5]" />
              <span>Core Strengths & Archetype</span>
            </h2>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
              Calibrated from your completed assessments.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#172B2A] backdrop-blur-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 space-y-4 shadow-xs dark:shadow-xl transition-colors duration-200">
            {/* Top Archetype Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00BFA5]/10 via-transparent to-[#00B8D4]/10 dark:from-[#00BFA5]/15 dark:to-[#00B8D4]/10 border border-[#00BFA5]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block mb-1">
                Identified Career Archetype
              </span>
              <h3 className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                The Analytical Strategist
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                You excel at deconstructing complex technical problems, identifying algorithmic patterns, and building structured systems.
              </p>
            </div>

            {/* Strengths Progress Bars */}
            <div className="space-y-3.5 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                Calibrated Dimension Scores
              </h4>

              {DEFAULT_STRENGTHS.map((trait) => (
                <div key={trait.dimension} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] truncate max-w-[180px]">
                      {trait.dimension}
                    </span>
                    <span className="font-mono font-bold text-[#008F83] dark:text-[#00BFA5]">
                      {trait.score}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] transition-all duration-500"
                      style={{ width: `${trait.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/participant/results"
                className="w-full py-2.5 px-4 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-colors flex items-center justify-center gap-2 group"
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
            <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#00B8D4]" />
              <span>Recommended Career Pathways</span>
            </h2>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
              Personalized career streams dynamically mapped to your psychometric cognitive profile.
            </p>
          </div>

          <Link
            href="/participant/pathways"
            className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline flex items-center gap-1 transition-colors"
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
      <div className="rounded-3xl bg-gradient-to-r from-white via-[#F7FAF9] to-[#EBF2F0] dark:from-[#172B2A] dark:via-[#172B2A]/90 dark:to-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs dark:shadow-xl transition-colors duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 border border-[#00BFA5]/30 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0 shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Official 3G MeLife Career Guidance Report
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-xl leading-relaxed">
              Your preliminary psychometric profile is ready for download. Share this report with your school counselor or parents to plan your academic subject selection.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <Link
            href="/participant/results"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/20 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />
            <span>Download PDF Report</span>
          </Link>

          <Link
            href="/participant/counsellor"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Counselor Session</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
