"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  Eye,
  Layers,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { CareerMatchDTO, CareerTier } from "../types/career.types";
import { MatchScore } from "./MatchScore";
import { SkillTags } from "./SkillTags";

interface CareerCardProps {
  career: CareerMatchDTO;
  onQuickView?: (career: CareerMatchDTO) => void;
}

export function CareerCard({ career, onQuickView }: CareerCardProps) {
  // Determine Growth styling
  const growthColor =
    career.futureGrowth === "Very High"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : career.futureGrowth === "High"
      ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";

  // Determine Tier styling
  const getTierBadge = (tier?: CareerTier) => {
    switch (tier) {
      case "PRIMARY":
        return {
          label: "Strong Alignment",
          className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        };
      case "SECONDARY":
        return {
          label: "High Compatibility",
          className: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
        };
      case "EXPLORE_FURTHER":
        return {
          label: "Recommended for Exploration",
          className: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
        };
      case "DEVELOPING":
      default:
        return {
          label: "Developing Alignment",
          className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        };
    }
  };

  const tierConfig = getTierBadge(career.tier);
  const primaryDriver = career.driverConstructs?.[0] || career.reasoning?.driverConstructs?.[0];

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Top Accent Gradient on Hover */}
      <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-[#00BFA5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="space-y-4">
        {/* Header Badges: Tier, Domain & Match Percentage */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tierConfig.className}`}
            >
              {tierConfig.label}
            </span>

            {career.isEmerging && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Emerging</span>
              </span>
            )}
          </div>

          <MatchScore score={career.matchPercentage} size="sm" />
        </div>

        {/* Hierarchy Context: Domain > Cluster / Category */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#728B88] dark:text-[#9FB3B0]">
          <Layers className="w-3 h-3 text-[#00BFA5]" />
          <span>{career.domainName || career.category}</span>
          {career.clusterName && (
            <>
              <span className="text-[#A5B8B5]">•</span>
              <span className="text-[#526866] dark:text-[#C2D6D3]">{career.clusterName}</span>
            </>
          )}
        </div>

        {/* Title & Short Specialization */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors leading-snug">
            {career.title}
          </h3>
          {career.specialization && (
            <p className="text-[11px] font-semibold text-[#008F83] dark:text-[#00BFA5] mt-0.5">
              Focus: {career.specialization}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed line-clamp-3">
          {career.description}
        </p>

        {/* Explainability Driver Highlight */}
        {primaryDriver && (
          <div className="rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-2.5 text-[11px] text-[#526866] dark:text-[#C2D6D3] flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
            <div className="line-clamp-2">
              <span className="font-bold text-[#172B2A] dark:text-white">
                {primaryDriver.constructName || primaryDriver.dimensionName}:
              </span>{" "}
              {primaryDriver.rationale || "High psychological alignment based on your demonstrated assessment profile."}
            </div>
          </div>
        )}

        {/* Core Skill Affinities Tags */}
        <div className="space-y-1.5 pt-2 border-t border-[#E3ECEA] dark:border-white/10">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] block">
            Core Skill Affinities:
          </span>
          <SkillTags skills={career.keySkills || career.coreSkills || []} maxVisible={4} />
        </div>
      </div>

      {/* Footer Strip: Future Growth Outlook & Action CTA */}
      <div className="mt-6 pt-4 border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between gap-3">
        {/* Growth Badge */}
        <div className="flex items-center gap-1.5">
          <div
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${growthColor}`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{career.futureGrowth} Growth</span>
          </div>
        </div>

        {/* Actions: Quick View + Explore */}
        <div className="flex items-center gap-2">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(career)}
              className="p-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 hover:bg-[#00BFA5]/20 text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] transition-colors cursor-pointer shadow-2xs"
              title="Quick preview"
              aria-label="Quick preview career"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <Link
            href={`/participant/career-pathways/${career.slug || career.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/10 group-hover:bg-[#00BFA5] text-[#172B2A] dark:text-white group-hover:text-[#172B2A] text-xs font-black transition-all cursor-pointer shadow-sm group-hover:shadow-md group-hover:shadow-[#00BFA5]/25"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
