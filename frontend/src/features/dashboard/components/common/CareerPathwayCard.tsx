import React from "react";
import Link from "next/link";
import { TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import type { CareerPathwayPreview } from "../../types/dashboard.types";

interface CareerPathwayCardProps {
  pathway: CareerPathwayPreview;
}

export function CareerPathwayCard({ pathway }: CareerPathwayCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:shadow-xl group">
      <div>
        {/* Top Header: Stream & Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {pathway.stream}
          </span>
          <div className="flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>{pathway.matchScore}% Match</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#2DD4BF] transition-colors mb-1.5 line-clamp-1">
          {pathway.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {pathway.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Core Skill Affinities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {pathway.keySkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Growth & Details Link */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Growth: <strong className="text-slate-200">{pathway.growthOutlook}</strong></span>
        </div>

        <Link
          href={`/participant/pathways#${pathway.id}`}
          className="text-xs font-bold text-[#14B8A6] hover:text-[#2DD4BF] hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
