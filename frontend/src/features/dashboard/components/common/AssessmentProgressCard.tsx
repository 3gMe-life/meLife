import React from "react";
import Link from "next/link";
import { Clock, HelpCircle, CheckCircle2, Play, Sparkles, ArrowRight } from "lucide-react";
import type { AssessmentItem } from "../../types/dashboard.types";

interface AssessmentProgressCardProps {
  assessment: AssessmentItem;
}

export function AssessmentProgressCard({ assessment }: AssessmentProgressCardProps) {
  const isCompleted = assessment.status === "COMPLETED";
  const isInProgress = assessment.status === "IN_PROGRESS";

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>Completed</span>
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#2563EB]/30">
          <Play className="w-3 h-3 fill-current" />
          <span>In Progress</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        <span>Ready</span>
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 shadow-xs dark:shadow-none transition-all duration-300 hover:shadow-lg group">
      <div>
        {/* Top Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {assessment.category}
          </span>
          {getStatusBadge()}
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors mb-1.5 line-clamp-1">
          {assessment.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {assessment.description}
        </p>

        {/* Details: Duration & Questions */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>~{assessment.estimatedMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{assessment.questionCount} Questions</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress & Action CTA */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            <span>Progress</span>
            <span className={isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}>
              {assessment.progressPercentage}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-[#2563EB] to-[#14B8A6]"
              }`}
              style={{ width: `${assessment.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isCompleted ? (
            <Link
              href="/participant/results"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-xs font-bold text-slate-800 dark:text-white transition-colors flex items-center justify-center gap-2 group/btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Review Psychometric Insights</span>
            </Link>
          ) : isInProgress ? (
            <Link
              href={`/participant/assessments/${assessment.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-xs font-bold text-white transition-all shadow-md shadow-[#2563EB]/25 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/participant/assessments/${assessment.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 text-xs font-bold text-slate-800 dark:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
