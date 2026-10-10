"use client";

import React from "react";
import { Compass, Activity, Brain, Target, Sparkles } from "lucide-react";
import { SkillFinderResult } from "../../../types/assessment.types";

interface EvidenceSnapshotProps {
  result: SkillFinderResult;
  className?: string;
}

export function EvidenceSnapshot({ result, className = "" }: EvidenceSnapshotProps) {
  // Extract real available data
  const topClusters = result.interestDiscovery?.topClusters || [];
  const primaryInterests =
    topClusters.length > 0
      ? topClusters.slice(0, 2).map((c) => c.name).join(" + ")
      : "Exploring Vocational Areas";

  const strongestSkills = result.skillBehaviour?.strongestIndicators || [];
  const skillSummary =
    strongestSkills.length > 0
      ? strongestSkills
          .slice(0, 2)
          .map((s) => s.name)
          .join(", ")
      : "Balanced behavioral distribution";

  const demonstratedAptitude = result.demonstratedAptitude;
  const accuracy = demonstratedAptitude?.overallAccuracyPercentage ?? 0;
  const aptDims = demonstratedAptitude?.dimensions || [];
  const totalEarnedPoints = aptDims.reduce((acc, d) => acc + (d.rawScore || 0), 0);
  const totalPossiblePoints = aptDims.reduce((acc, d) => acc + (d.maxScore || 0), 0);

  let aptitudeSummary = "Session tasks evaluated";
  if (totalPossiblePoints > 0) {
    if (accuracy >= 75) {
      aptitudeSummary = `Strong objective task evidence (${totalEarnedPoints}/${totalPossiblePoints} pts, ${accuracy}%)`;
    } else if (accuracy >= 45) {
      aptitudeSummary = `Moderate objective task evidence (${totalEarnedPoints}/${totalPossiblePoints} pts, ${accuracy}%)`;
    } else {
      aptitudeSummary = `Emerging task evidence (${totalEarnedPoints}/${totalPossiblePoints} pts, ${accuracy}%) — practice recommended`;
    }
  } else {
    aptitudeSummary = "Qualitative reasoning tasks evaluated";
  }

  const devStrengths = result.developmentalStrengths?.topStrengths || [];
  const devSummary =
    devStrengths.length > 0
      ? devStrengths
          .slice(0, 2)
          .map((d) => d.name)
          .join(", ")
      : "Active developmental learning habits";

  const snapshotCards = [
    {
      layer: "INTEREST EVIDENCE",
      code: "RIASEC 25%",
      title: primaryInterests,
      description: "Primary vocational task environments and activities that currently attract your interest.",
      statusText: topClusters.length > 0 ? `${Math.round(topClusters[0]?.scalePositionPercentage || 50)} / 100 Interest Alignment` : "Evaluated",
      icon: <Compass className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />,
      border: "border-[#00BFA5]/30",
      badge: "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] print:border-[#00BFA5]/30 print:text-[#008F83]",
      bg: "bg-[#00BFA5]/5 print:bg-[#F0FDF4]",
    },
    {
      layer: "SELF-REPORTED BEHAVIOUR",
      code: "STYLE 30%",
      title: skillSummary,
      description: "Strongest ways you describe your approach to problem solving, execution, and teamwork.",
      statusText: strongestSkills.length > 0 ? `${Math.round(strongestSkills[0]?.scalePositionPercentage || 50)} / 100 Self-Reported Indicator` : "Self-Reported",
      icon: <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 print:border-emerald-300 print:text-[#065F46]",
      bg: "bg-emerald-500/5 print:bg-[#F0FDF4]",
    },
    {
      layer: "DEMONSTRATED PERFORMANCE",
      code: "TASK 25%",
      title: aptitudeSummary,
      description: "Objective cognitive problem-solving points achieved in this single assessment session.",
      statusText: totalPossiblePoints > 0 ? `${totalEarnedPoints} / ${totalPossiblePoints} Points (${accuracy}% Current Task Score)` : `${accuracy}% Current Task Score`,
      icon: <Brain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      border: "border-cyan-500/30",
      badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 print:border-cyan-300 print:text-[#0369A1]",
      bg: "bg-cyan-500/5 print:bg-[#F0F9FF]",
    },
    {
      layer: "DEVELOPMENTAL HABITS",
      code: "GROWTH 20%",
      title: devSummary,
      description: "Malleable learning attitudes and adaptability indicators observed across situations.",
      statusText: devStrengths.length > 0 ? `${Math.round(devStrengths[0]?.scalePositionPercentage || 50)} / 100 Developmental Habit Indicator` : "Trainable",
      icon: <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      border: "border-amber-500/30",
      badge: "bg-amber-500/15 text-amber-800 dark:text-amber-300 print:border-amber-300 print:text-[#92400E]",
      bg: "bg-amber-500/5 print:bg-[#FEF8E7]",
    },
  ];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:bg-white print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0 print:border print:border-[#00BFA5]/30 print:text-[#008F83]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight print:text-[#172B2A]">
              Evidence Snapshot
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
              Cross-sectional summary of current assessment evidence across all 4 layers
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83] print:bg-[#F0FDF4]">
          4-Layer Evidence Balance
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {snapshotCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${card.border} ${card.bg} flex flex-col justify-between space-y-3 transition-all print:border-[#E3ECEA]`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {card.icon}
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
                    {card.layer}
                  </span>
                </div>
              </div>
              <span className={`text-[9.5px] font-mono font-black px-2 py-0.5 rounded-md ${card.badge} inline-block`}>
                {card.statusText}
              </span>
              <h4 className="text-xs font-black text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A] leading-snug pt-1">
                {card.title}
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#A7C2BF] print:text-[#415654] leading-tight">
                {card.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E3ECEA]/60 dark:border-white/5 print:border-[#E3ECEA] text-[9.5px] font-mono text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
              Evidence Weight: {card.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
