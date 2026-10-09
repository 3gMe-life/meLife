"use client";

import React from "react";
import { Sparkles, Compass, Activity, Brain, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { SkillFinderResult } from "../../../types/assessment.types";

interface CrossEvidenceSynthesisProps {
  result: SkillFinderResult;
  className?: string;
}

export function CrossEvidenceSynthesis({ result, className = "" }: CrossEvidenceSynthesisProps) {
  // Extract key variables safely
  const topClusters = result.interestDiscovery?.topClusters || [];
  const topInterest1 = topClusters[0]?.name || "Practical & Technical";
  const topInterest2 = topClusters[1]?.name || "Scientific Inquiry";

  const strongestSkills = result.skillBehaviour?.strongestIndicators || [];
  const topSkill1 = strongestSkills[0]?.name || "Applied Problem Solving";
  const topSkill2 = strongestSkills[1]?.name || "Execution & Initiative";

  const demonstratedAptitude = result.demonstratedAptitude;
  const accuracy = demonstratedAptitude?.overallAccuracyPercentage ?? 50;
  const aptDims = demonstratedAptitude?.dimensions || [];
  const totalEarnedPoints = aptDims.reduce((acc, d) => acc + (d.rawScore || 0), 0);
  const totalPossiblePoints = aptDims.reduce((acc, d) => acc + (d.maxScore || 0), 0);

  // Find lowest scoring aptitude dimensions that need more evidence
  const sortedAptDims = [...aptDims].sort(
    (a, b) => (a.scalePositionPercentage || 0) - (b.scalePositionPercentage || 0)
  );
  const lowAptDims = sortedAptDims.filter((d) => (d.scalePositionPercentage || 0) < 50);
  const needMoreEvidenceNames =
    lowAptDims.length > 0
      ? lowAptDims.slice(0, 2).map((d) => d.name).join(" and ")
      : "further complex reasoning challenges";

  // Synthesize cross-layer narrative deterministically
  let taskNarrative = "";

  if (accuracy >= 70) {
    taskNarrative = `Your objective task performance (${totalEarnedPoints}/${totalPossiblePoints} pts, ${accuracy}%) shows strong positive congruence with your self-reported strengths in ${topSkill1}.`;
  } else if (accuracy >= 45) {
    taskNarrative = `Your objective task performance (${totalEarnedPoints}/${totalPossiblePoints} pts, ${accuracy}%) shows moderate alignment, with solid reasoning foundations and opportunities to sharpen speed and accuracy through practice.`;
  } else {
    taskNarrative = `Current performance on several objective reasoning tasks (${totalEarnedPoints}/${totalPossiblePoints} pts, ${accuracy}%) provides less supporting evidence today compared to your high self-reported confidence in ${topSkill1}. This does not rule out technical pathways; rather, it highlights areas where structured practice, repeated exposure, and future reassessment will build stronger evidence of developing capability.`;
  }

  const explorationNext = result.explorationDirections?.[0]?.clusterTitle || `${topInterest1} Projects`;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#1A3331] to-[#0D1C1B] text-white border border-[#00BFA5]/35 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6 print:p-5 print:rounded-2xl print:bg-white print:text-[#172B2A] print:border-[#00BFA5]/50 print:shadow-none print-break-avoid ${className}`}
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00BFA5]/10 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA] print:pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/20 text-[#00C896] flex items-center justify-center shrink-0 print:border print:border-[#00BFA5]/30 print:text-[#008F83]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white print:text-[#172B2A] tracking-tight">
              Putting Your Results Together
            </h3>
            <p className="text-[11px] text-[#A7C2BF] print:text-[#688582]">
              Cross-Evidence Synthesis • Comparing interests, self-reported behaviours, and objective task performance
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83] print:bg-[#F0FDF4]">
          Combined Synthesis
        </span>
      </div>

      {/* 5-Pillar Structured Cross-Evidence Breakdown */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. What You Are Drawn Toward */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00BFA5] print:text-[#008F83]">
            <Compass className="w-4 h-4" />
            <span>01. What You Are Drawn Toward</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            Your strongest vocational interest alignment points toward <strong className="text-white print:text-[#172B2A]">{topInterest1}</strong> and <strong className="text-white print:text-[#172B2A]">{topInterest2}</strong> environments.
          </p>
        </div>

        {/* 2. What You Report About Yourself */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 print:text-[#059669]">
            <Activity className="w-4 h-4" />
            <span>02. What You Report About Yourself</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            You report high confidence and regular habits in <strong className="text-white print:text-[#172B2A]">{topSkill1}</strong> and <strong className="text-white print:text-[#172B2A]">{topSkill2}</strong>.
          </p>
        </div>

        {/* 3. What You Demonstrated Today */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400 print:text-[#0284C7]">
            <Brain className="w-4 h-4" />
            <span>03. What You Demonstrated Today</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            {taskNarrative}
          </p>
        </div>

        {/* 4. What Needs More Evidence */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 print:text-[#B45309]">
            <AlertCircle className="w-4 h-4" />
            <span>04. What Needs More Evidence</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            Additional practice and evaluation in <strong className="text-white print:text-[#172B2A]">{needMoreEvidenceNames}</strong> will clarify whether current task scores reflect momentary unfamiliarity or a focused learning target.
          </p>
        </div>

        {/* 5. What to Explore Next */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 md:col-span-2 lg:col-span-2 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00C896] print:text-[#008F83]">
            <ArrowRight className="w-4 h-4" />
            <span>05. Recommended Next Step</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            Engage in hands-on trial projects in <strong className="text-white print:text-[#172B2A]">{explorationNext}</strong> to test whether daily practical engagement sustains your genuine interest, while practicing cognitive reasoning puzzles gradually.
          </p>
        </div>
      </div>

      {/* Reassurance Disclaimer */}
      <div className="relative z-10 text-[11px] text-[#A7C2BF] print:text-[#526866] italic leading-relaxed border-t border-white/10 print:border-[#E3ECEA] pt-3 flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
        <span>
          Differences between self-reported style and current task performance can occur, especially when students have different levels of familiarity, practice, attention, or experience with the task format. It highlights where hands-on practice, mentorship, and repeated exposure can build stronger evidence of developing capability over time.
        </span>
      </div>
    </div>
  );
}
