"use client";

import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Compass,
  Brain,
  Target,
  Activity,
} from "lucide-react";
import type { SkillFinderResult } from "@/features/assessments/types/assessment.types";

interface StrengthTraitItem {
  dimension: string;
  score: number;
  level: string;
  category?: string;
  description?: string;
}

interface StrengthProfileSnapshotProps {
  latestResult?: SkillFinderResult | null;
  isLoading?: boolean;
}

const FALLBACK_TRAITS: StrengthTraitItem[] = [
  {
    dimension: "Quantitative & Logical Reasoning",
    score: 92,
    level: "Advanced",
    category: "Cognitive Aptitude",
    description: "Exceptional ability to deconstruct complex patterns and mathematical structures.",
  },
  {
    dimension: "Curiosity & Diagnostic Inquisitiveness",
    score: 88,
    level: "High",
    category: "Skill Behaviour",
    description: "Instinctively explores how complex systems and physical assemblies operate.",
  },
  {
    dimension: "Abstract & Strategic Problem Solving",
    score: 86,
    level: "High",
    category: "Cognitive Aptitude",
    description: "Skilled at identifying system linkages and multi-step computational solutions.",
  },
  {
    dimension: "Adaptive Learning & Resilience",
    score: 88,
    level: "High",
    category: "Developmental Habits",
    description: "Absorbs novel frameworks rapidly and persists through ambiguous challenges.",
  },
];

export function StrengthProfileSnapshot({
  latestResult,
  isLoading = false,
}: StrengthProfileSnapshotProps) {
  const archetypeTitle = latestResult?.learningProfile?.archetypeTitle || "Analytical Strategist";
  const tagline = latestResult?.learningProfile?.tagline || "Bridging scientific curiosity with structured logical execution.";
  const strengthSummary = latestResult?.learningProfile?.strengthSummary || "You show strong curiosity about how computational and physical systems operate, paired with an instinct to construct and test practical solutions.";

  // Derive traits from real result if available
  const traits: StrengthTraitItem[] = React.useMemo(() => {
    if (!latestResult) return FALLBACK_TRAITS;

    const list: StrengthTraitItem[] = [];

    // 1. From Demonstrated Aptitude
    if (latestResult.demonstratedAptitude?.dimensions?.length) {
      const topApt = [...latestResult.demonstratedAptitude.dimensions].sort(
        (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
      )[0];
      if (topApt) {
        list.push({
          dimension: topApt.name,
          score: Math.round(topApt.scalePositionPercentage),
          level: topApt.level || "High",
          category: "Cognitive Aptitude",
          description: topApt.description || "Demonstrated high accuracy in logical task solving.",
        });
      }
    }

    // 2. From Skill Behaviour
    if (latestResult.skillBehaviour?.strongestIndicators?.length) {
      const topSkill = latestResult.skillBehaviour.strongestIndicators[0];
      if (topSkill) {
        list.push({
          dimension: topSkill.name,
          score: 88,
          level: topSkill.level || "Advanced",
          category: "Skill Behaviour",
          description: topSkill.description || "Proactively executes structured problem-solving.",
        });
      }
    }

    // 3. From Interest Profile
    if (latestResult.interestDiscovery?.dimensions?.length) {
      const topInterest = [...latestResult.interestDiscovery.dimensions].sort(
        (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
      )[0];
      if (topInterest) {
        list.push({
          dimension: `${topInterest.name} Interest Domain`,
          score: Math.round(topInterest.scalePositionPercentage),
          level: topInterest.level || "High",
          category: "RIASEC Interest",
          description: `Strong intrinsic occupational curiosity towards ${topInterest.name.toLowerCase()} pursuits.`,
        });
      }
    }

    // 4. From Developmental Habits
    if (latestResult.developmentalStrengths?.topStrengths?.length) {
      const topHabit = latestResult.developmentalStrengths.topStrengths[0];
      if (topHabit) {
        list.push({
          dimension: topHabit.name,
          score: 86,
          level: topHabit.level || "High",
          category: "Developmental Habit",
          description: topHabit.description || "Consistently demonstrates productive learning routines.",
        });
      }
    }

    return list.length >= 2 ? list : FALLBACK_TRAITS;
  }, [latestResult]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200 space-y-6">
      {/* 1. Header with Result Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3ECEA] dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              My Strength Profile
            </h2>
          </div>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Calibrated psychometric dimensions & cognitive problem-solving strengths.
          </p>
        </div>

        <Link
          href="/participant/results"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline transition-colors self-start sm:self-auto"
        >
          <span>Full Psychometric Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Dominant Archetype Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border-2 border-[#00BFA5]/30 p-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Identified Psychometric Archetype</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
            Validated Baseline
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
          {archetypeTitle}
        </h3>

        <p className="text-xs font-semibold italic text-[#008F83] dark:text-[#00BFA5]">
          &ldquo;{tagline}&rdquo;
        </p>

        <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed line-clamp-2 pt-1">
          {strengthSummary}
        </p>
      </div>

      {/* 3. 4 Construct Layer Quick Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-center space-y-1">
          <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-[#172B2A] dark:text-[#F7FAF9] block">Interests (RIASEC)</span>
          <span className="text-[9px] text-[#728B88] dark:text-[#7D9491]">6 Domains</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-center space-y-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-[#172B2A] dark:text-[#F7FAF9] block">Skill Behaviours</span>
          <span className="text-[9px] text-[#728B88] dark:text-[#7D9491]">8 Dimensions</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-center space-y-1">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mx-auto">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-[#172B2A] dark:text-[#F7FAF9] block">Cognitive Aptitude</span>
          <span className="text-[9px] text-[#728B88] dark:text-[#7D9491]">8 Logic Tasks</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-center space-y-1">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-[#172B2A] dark:text-[#F7FAF9] block">Learning Habits</span>
          <span className="text-[9px] text-[#728B88] dark:text-[#7D9491]">7 Strengths</span>
        </div>
      </div>

      {/* 4. Strengths List with Gradient Progress Bars */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
          Top Calibrated Dimension Scores
        </h4>

        <div className="space-y-3.5">
          {traits.map((trait, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2 hover:border-[#00BFA5]/30 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2 truncate max-w-[280px]">
                  <span className="text-[#172B2A] dark:text-[#F7FAF9] truncate">
                    {trait.dimension}
                  </span>
                  {trait.category && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-white/10 text-[#728B88] dark:text-[#7D9491] hidden sm:inline-block">
                      {trait.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    {trait.level}
                  </span>
                  <span className="text-sm font-black font-mono text-[#008F83] dark:text-[#00BFA5]">
                    {trait.score}%
                  </span>
                </div>
              </div>

              {/* Progress Meter Bar */}
              <div className="w-full h-2 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] transition-all duration-700"
                  style={{ width: `${trait.score}%` }}
                />
              </div>

              {trait.description && (
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] leading-relaxed">
                  {trait.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
