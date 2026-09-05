"use client";

import React from "react";
import { Compass, Wrench, Search, Palette, HeartHandshake, Award, FileSpreadsheet } from "lucide-react";
import { DimensionScoreItem, StudentProfileVector } from "../../types/assessment.types";

interface InterestChartProps {
  dimensions?: DimensionScoreItem[];
  profileVector?: StudentProfileVector;
}

const RIASEC_META: Record<
  string,
  { label: string; code: string; icon: React.ReactNode; color: string; barColor: string }
> = {
  builder: {
    label: "Builder",
    code: "R",
    icon: <Wrench className="w-4 h-4" />,
    color: "from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
    barColor: "bg-amber-500",
  },
  explorer: {
    label: "Explorer",
    code: "I",
    icon: <Search className="w-4 h-4" />,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    barColor: "bg-cyan-500",
  },
  creator: {
    label: "Creator",
    code: "A",
    icon: <Palette className="w-4 h-4" />,
    color: "from-pink-500/20 to-purple-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30",
    barColor: "bg-pink-500",
  },
  helper: {
    label: "Helper",
    code: "S",
    icon: <HeartHandshake className="w-4 h-4" />,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    barColor: "bg-emerald-500",
  },
  leader: {
    label: "Leader",
    code: "E",
    icon: <Award className="w-4 h-4" />,
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
    barColor: "bg-indigo-500",
  },
  organiser: {
    label: "Organiser",
    code: "C",
    icon: <FileSpreadsheet className="w-4 h-4" />,
    color: "from-slate-500/20 to-gray-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30",
    barColor: "bg-slate-500",
  },
};

export function InterestChart({ dimensions, profileVector }: InterestChartProps) {
  // Extract values either from profileVector or dimensions array
  const interestItems = [
    {
      key: "builder",
      score: profileVector?.builder ?? dimensions?.find((d) => d.code.includes("BUILDER"))?.scalePositionPercentage ?? 50,
    },
    {
      key: "explorer",
      score: profileVector?.explorer ?? dimensions?.find((d) => d.code.includes("EXPLORER"))?.scalePositionPercentage ?? 50,
    },
    {
      key: "creator",
      score: profileVector?.creator ?? dimensions?.find((d) => d.code.includes("CREATOR"))?.scalePositionPercentage ?? 50,
    },
    {
      key: "helper",
      score: profileVector?.helper ?? dimensions?.find((d) => d.code.includes("HELPER"))?.scalePositionPercentage ?? 50,
    },
    {
      key: "leader",
      score: profileVector?.leader ?? dimensions?.find((d) => d.code.includes("LEADER"))?.scalePositionPercentage ?? 50,
    },
    {
      key: "organiser",
      score: profileVector?.organiser ?? dimensions?.find((d) => d.code.includes("ORGANISER"))?.scalePositionPercentage ?? 50,
    },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
            RIASEC 6-Cluster Interest Distribution
          </h3>
          <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Relative attraction across practical, investigative, artistic, social, enterprising, and structured domains
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {interestItems.map((item) => {
          const meta = RIASEC_META[item.key] || RIASEC_META.builder;
          return (
            <div
              key={item.key}
              className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      {meta.label} ({meta.code})
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-[#172B2A] dark:text-white">
                  {item.score}%
                </span>
              </div>

              <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${meta.barColor}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
