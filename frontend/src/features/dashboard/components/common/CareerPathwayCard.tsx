import React from "react";
import Link from "next/link";
import { TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import type { CareerPathwayPreview } from "../../types/dashboard.types";

interface CareerPathwayCardProps {
  pathway: CareerPathwayPreview;
}

export function CareerPathwayCard({ pathway }: CareerPathwayCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 shadow-xs dark:shadow-none transition-all duration-300 hover:shadow-lg group">
      <div>
        {/* Top Header: Stream & Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
            {pathway.stream}
          </span>
          <div className="flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 shadow-2xs">
            <Sparkles className="w-3 h-3" />
            <span>{pathway.matchScore}% Match</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors mb-1.5 line-clamp-1">
          {pathway.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {pathway.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Core Skill Affinities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {pathway.keySkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Growth & Details Link */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Growth: <strong className="text-slate-800 dark:text-slate-200">{pathway.growthOutlook}</strong></span>
        </div>

        <Link
          href={`/participant/pathways#${pathway.id}`}
          className="text-xs font-bold text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] dark:hover:text-[#2DD4BF] hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
