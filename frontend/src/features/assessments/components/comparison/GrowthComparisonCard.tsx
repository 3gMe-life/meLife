import React from "react";
import { LongitudinalComparisonResult } from "../../types/assessment.types";
import { TrendingUp, ArrowRight, Calendar, Sparkles, Award, Clock } from "lucide-react";

interface GrowthComparisonCardProps {
  comparison: LongitudinalComparisonResult;
}

export function GrowthComparisonCard({ comparison }: GrowthComparisonCardProps) {
  const oldDate = comparison.oldCompletedDate
    ? new Date(comparison.oldCompletedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Initial Evaluation";

  const newDate = comparison.newCompletedDate
    ? new Date(comparison.newCompletedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Current Evaluation";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#1A3331] to-[#0D1C1B] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFA5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#00B8D4]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/40 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Longitudinal Growth Synthesis</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">
            <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
            <span>{comparison.daysBetween} Days Between Assessments</span>
          </div>
        </div>

        {/* Trajectory Title & Summary */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-[#00BFA5]" />
            <span>{comparison.growthTrajectory}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
            {comparison.growthSummary}
          </p>
        </div>

        {/* Side-by-Side Archetype Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Previous Evaluation Card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Previous Evaluation</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{oldDate}</span>
              </div>
            </div>

            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span>{comparison.oldArchetype.title}</span>
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {comparison.oldArchetype.description}
            </p>
          </div>

          {/* Current Evaluation Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#00BFA5]/15 to-transparent border border-[#00BFA5]/40 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#00BFA5]">
              <span className="font-bold uppercase tracking-wider">Current Evaluation</span>
              <div className="flex items-center gap-1 font-semibold">
                <Calendar className="w-3 h-3 text-[#00BFA5]" />
                <span>{newDate}</span>
              </div>
            </div>

            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00BFA5]" />
              <span>{comparison.newArchetype.title}</span>
            </h4>

            <p className="text-xs text-slate-200 leading-relaxed">
              {comparison.newArchetype.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
