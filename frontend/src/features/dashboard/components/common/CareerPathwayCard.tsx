import React from "react";
import Link from "next/link";
import { TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import type { CareerPathwayPreview } from "../../types/dashboard.types";

interface CareerPathwayCardProps {
  pathway: CareerPathwayPreview;
}

export function CareerPathwayCard({ pathway }: CareerPathwayCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#172B2A] backdrop-blur-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 sm:p-6 flex flex-col justify-between hover:border-[#00BFA5]/50 dark:hover:border-[#00BFA5]/40 shadow-xs dark:shadow-none transition-all duration-300 hover:shadow-lg group">
      <div>
        {/* Top Header: Stream & Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0]">
            {pathway.stream}
          </span>
          <div className="flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 shadow-2xs">
            <Sparkles className="w-3 h-3" />
            <span>{pathway.matchScore}% Match</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors mb-1.5 line-clamp-1">
          {pathway.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed mb-4 line-clamp-2">
          {pathway.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-1.5">
            Core Skill Affinities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {pathway.keySkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-[#EBF2F0] dark:bg-[#0D1C1B] text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Growth & Details Link */}
      <div className="pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#728B88] dark:text-[#7D9491]">
          <TrendingUp className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00C896]" />
          <span>Growth: <strong className="text-[#172B2A] dark:text-[#F7FAF9]">{pathway.growthOutlook}</strong></span>
        </div>

        <Link
          href={`/participant/pathways#${pathway.id}`}
          className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
