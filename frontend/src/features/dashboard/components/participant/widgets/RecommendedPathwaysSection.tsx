"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu,
  Dna,
  BarChart3,
  Layers,
} from "lucide-react";
import type { CareerPathwayPreview } from "@/features/dashboard/types/dashboard.types";

interface RecommendedPathwaysSectionProps {
  pathways?: CareerPathwayPreview[];
}

const DEFAULT_PATHWAYS: CareerPathwayPreview[] = [
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

export function RecommendedPathwaysSection({
  pathways = DEFAULT_PATHWAYS,
}: RecommendedPathwaysSectionProps) {
  const displayList = pathways.length > 0 ? pathways : DEFAULT_PATHWAYS;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3ECEA] dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              Recommended Career Pathways
            </h2>
          </div>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Personalized occupational streams dynamically aligned with your psychometric profile.
          </p>
        </div>

        <Link
          href="/participant/pathways"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline transition-colors self-start sm:self-auto"
        >
          <span>Explore All Pathways</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Pathways Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {displayList.map((pathway, idx) => (
          <div
            key={pathway.id || idx}
            className="p-5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Top Row: Category + Match Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] uppercase tracking-wider truncate">
                  {pathway.category}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0 font-mono">
                  {pathway.matchScore}% Match
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors line-clamp-1 mb-1">
                  {pathway.title}
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed line-clamp-2">
                  {pathway.description}
                </p>
              </div>

              {/* Core Skills Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] block">
                  Core Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pathway.keySkills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Explore Link */}
            <div className="pt-3 border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-[#728B88] dark:text-[#7D9491]">
                {pathway.growthOutlook} Growth
              </span>
              <Link
                href="/participant/pathways"
                className="inline-flex items-center gap-1 font-bold text-[#008F83] dark:text-[#00BFA5] group-hover:text-[#00BFA5] transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
