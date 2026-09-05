"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { CareerMatchDTO } from "../types/career.types";
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

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Top Accent Gradient on Hover */}
      <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-[#00BFA5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="space-y-4">
        {/* Header Badges: Category & Match Percentage */}
        <div className="flex items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0]">
            {career.category}
          </span>

          <MatchScore score={career.matchPercentage} size="sm" />
        </div>

        {/* Title & Industry */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors leading-snug">
            {career.title}
          </h3>
          <p className="text-[11px] font-semibold text-[#728B88] dark:text-[#7D9491] mt-0.5">
            {career.industry}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed line-clamp-3">
          {career.description}
        </p>

        {/* Core Skill Affinities Tags */}
        <div className="space-y-1.5 pt-2 border-t border-[#E3ECEA] dark:border-white/10">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] block">
            Core Skill Affinities:
          </span>
          <SkillTags skills={career.keySkills || []} maxVisible={4} />
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
