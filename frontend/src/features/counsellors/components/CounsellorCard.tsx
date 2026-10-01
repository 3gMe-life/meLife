"use client";

import React from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  Award,
  Clock,
  Languages,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { CounsellorCardDTO } from "../types/counsellor.types";

interface CounsellorCardProps {
  counsellor: CounsellorCardDTO;
  onBookClick: (counsellor: CounsellorCardDTO) => void;
}

export const CounsellorCard: React.FC<CounsellorCardProps> = ({
  counsellor,
  onBookClick,
}) => {
  const matchScore = counsellor.matchPercentage || 90;
  const initials = counsellor.name
    ? counsellor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CC";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-500/50">
      {/* Top Banner & Match Affinity Badge */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar / Fallback */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-lg font-bold text-white shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-800">
              {counsellor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={counsellor.profileImage}
                  alt={counsellor.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900" title="Certified Mentor">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {counsellor.name}
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {counsellor.qualification}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {counsellor.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">({counsellor.reviewCount})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {counsellor.experienceYears}+ yrs exp
                </span>
              </div>
            </div>
          </div>

          {/* AI Match Badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/20 dark:bg-indigo-950/70 dark:text-indigo-300 dark:ring-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{matchScore}% Match</span>
            </div>
          </div>
        </div>

        {/* Match Reasoning Callout */}
        {counsellor.matchReason && (
          <div className="mt-4 rounded-xl bg-slate-50/80 p-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">AI Affinity: </span>
            {counsellor.matchReason}
          </div>
        )}

        {/* Bio Snippet */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {counsellor.bio}
        </p>

        {/* Specialisations Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {counsellor.specialisations.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {spec}
            </span>
          ))}
          {counsellor.specialisations.length > 3 && (
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              +{counsellor.specialisations.length - 3} more
            </span>
          )}
        </div>

        {/* Languages */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Languages className="h-3.5 w-3.5 text-slate-400" />
          <span className="line-clamp-1">{counsellor.languages.join(", ")}</span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-5 flex items-center gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Link
          href={`/participant/counsellors/${counsellor.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
        >
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>
        <button
          onClick={() => onBookClick(counsellor)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Book Session</span>
        </button>
      </div>
    </div>
  );
};
