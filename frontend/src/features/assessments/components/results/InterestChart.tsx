"use client";

import React from "react";
import {
  Compass,
  Wrench,
  Search,
  Palette,
  HeartHandshake,
  Award,
  FileSpreadsheet,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { DimensionScoreItem, StudentProfileVector } from "../../types/assessment.types";

interface InterestChartProps {
  dimensions?: DimensionScoreItem[];
  profileVector?: StudentProfileVector;
  className?: string;
}

const RIASEC_META: Record<
  string,
  {
    label: string;
    code: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    barColor: string;
    borderHighlight: string;
  }
> = {
  builder: {
    label: "Builder",
    code: "R",
    description: "Hands-on making, mechanical systems, robotics & practical engineering",
    icon: <Wrench className="w-4 h-4" />,
    color: "from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    barColor: "bg-amber-500",
    borderHighlight: "border-amber-500/40",
  },
  explorer: {
    label: "Explorer",
    code: "I",
    description: "Scientific inquiry, analytical deduction & research analytics",
    icon: <Search className="w-4 h-4" />,
    color: "from-cyan-500/15 to-blue-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    barColor: "bg-cyan-500",
    borderHighlight: "border-cyan-500/40",
  },
  creator: {
    label: "Creator",
    code: "A",
    description: "Visual arts, innovative design, writing & imaginative media",
    icon: <Palette className="w-4 h-4" />,
    color: "from-pink-500/15 to-purple-500/15 text-pink-700 dark:text-pink-400 border-pink-500/30",
    barColor: "bg-pink-500",
    borderHighlight: "border-pink-500/40",
  },
  helper: {
    label: "Helper",
    code: "S",
    description: "Community service, empathy, teaching, counseling & healthcare",
    icon: <HeartHandshake className="w-4 h-4" />,
    color: "from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    barColor: "bg-emerald-500",
    borderHighlight: "border-emerald-500/40",
  },
  leader: {
    label: "Leader",
    code: "E",
    description: "Enterprise initiative, public speaking, leadership & strategy",
    icon: <Award className="w-4 h-4" />,
    color: "from-indigo-500/15 to-violet-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
    barColor: "bg-indigo-500",
    borderHighlight: "border-indigo-500/40",
  },
  organiser: {
    label: "Organiser",
    code: "C",
    description: "Information management, operations, logistics & financial systems",
    icon: <FileSpreadsheet className="w-4 h-4" />,
    color: "from-slate-500/15 to-gray-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    barColor: "bg-slate-500",
    borderHighlight: "border-slate-500/40",
  },
};

export function InterestChart({ dimensions, profileVector, className = "" }: InterestChartProps) {
  // Ordered strictly in standard Holland RIASEC 3x2 matrix
  const riasecOrderedKeys = ["builder", "explorer", "creator", "helper", "leader", "organiser"];

  const interestItems = riasecOrderedKeys.map((key) => {
    let score = 50;
    if (profileVector && typeof profileVector[key as keyof StudentProfileVector] === "number") {
      score = profileVector[key as keyof StudentProfileVector];
    } else if (dimensions && dimensions.length > 0) {
      const match = dimensions.find(
        (d) =>
          d.code.toUpperCase().includes(key.toUpperCase()) ||
          d.name.toLowerCase().includes(key.toLowerCase())
      );
      if (match) {
        score = Math.round(match.scalePositionPercentage || 0);
      }
    }
    return {
      key,
      meta: RIASEC_META[key] || RIASEC_META.builder,
      score: Math.max(0, Math.min(100, score)),
    };
  });

  // Calculate dominant & supporting patterns or broad tie from scores
  const sortedByScore = [...interestItems].sort((a, b) => b.score - a.score);
  const topScore = sortedByScore[0]?.score ?? 0;
  const tiedWithTop = sortedByScore.filter((item) => item.score === topScore);
  const isBroadTie = tiedWithTop.length >= 3;

  const dominant1 = sortedByScore[0];
  const dominant2 = sortedByScore[1];
  const supporting1 = sortedByScore[2];
  const supporting2 = sortedByScore[3];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-5 print:p-5 print:rounded-2xl print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3ECEA] dark:border-white/10 pb-4 print:pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              RIASEC 6-Cluster Interest Distribution
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0]">
              Relative attraction across practical, investigative, artistic, social, enterprising, and structured domains
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[10px] font-mono font-bold text-[#526866] dark:text-[#9FB3B0]">
          <span>Holland RIASEC Framework</span>
          <span>•</span>
          <span className="text-[#008F83] dark:text-[#00BFA5] font-black">Normalized Interest Score</span>
        </div>
      </div>

      {/* 3x2 Unified Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 print:grid-cols-3 print:gap-3">
        {interestItems.map((item) => {
          const { meta, score } = item;
          const isTopTier = score >= 75;
          const alignmentText =
            score >= 75
              ? "Dominant Alignment"
              : score >= 50
              ? "Moderate Alignment"
              : "Emerging Exploration";

          return (
            <div
              key={item.key}
              className={`p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border ${
                isTopTier ? "border-[#00BFA5]/40 shadow-xs" : "border-[#E3ECEA] dark:border-white/10"
              } space-y-3 transition-all print:bg-[#F9FCFB] print:border-[#E3ECEA] print:p-3.5`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${meta.color} shrink-0`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      {meta.label} ({meta.code})
                    </h4>
                    <span className="text-[9.5px] font-mono font-bold text-[#008F83] dark:text-[#00BFA5]">
                      {alignmentText}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-black text-[#172B2A] dark:text-white px-2 py-0.5 rounded-lg bg-white/80 dark:bg-white/10 border border-[#E3ECEA] dark:border-white/15 block">
                    {score} / 100
                  </span>
                  <span className="text-[9px] font-mono text-[#728B88] dark:text-[#9FB3B0]">
                    Interest Scale
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${meta.barColor}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#728B88] dark:text-[#9FB3B0] line-clamp-1 print:line-clamp-2 leading-tight">
                  {meta.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern Interpretation Block */}
      {isBroadTie ? (
        <div className="p-4 rounded-2xl bg-teal-500/10 dark:bg-teal-950/20 border border-teal-500/30 space-y-1.5 print:bg-[#F0FDF4] print:border-[#00BFA5]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 print:text-[#008F83]">
              <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>Broad Interest Pattern (Distributed Orientation)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-800 dark:text-teal-300">
              Exploratory
            </span>
          </div>
          <p className="text-xs font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
            {tiedWithTop.map((item) => item.meta.label).join(", ")} currently show similarly elevated interest scores ({topScore}/100).
          </p>
          <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
            These results suggest broad exploratory interest across multiple domains rather than a sharply dominant RIASEC pattern.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Dominant Interest Pattern */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between gap-3 print:bg-[#F0FDF4] print:border-[#00BFA5]/30">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 print:text-[#065F46]">
                <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Dominant Interest Pattern</span>
              </div>
              <p className="text-xs font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
                {dominant1?.meta.label} ({dominant1?.score}/100) + {dominant2?.meta.label} ({dominant2?.score}/100)
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/80 dark:bg-white/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shrink-0 print:border-[#00BFA5]/30 print:text-[#065F46]">
              Primary Driver
            </span>
          </div>

          {/* Supporting Pattern */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between gap-3 print:bg-[#F0F9FF] print:border-cyan-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300 print:text-[#0369A1]">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                <span>Supporting Interest Pattern</span>
              </div>
              <p className="text-xs font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
                {supporting1?.meta.label} ({supporting1?.score}/100) + {supporting2?.meta.label} ({supporting2?.score}/100)
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/80 dark:bg-white/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 shrink-0 print:border-cyan-200 print:text-[#0369A1]">
              Complementary
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
