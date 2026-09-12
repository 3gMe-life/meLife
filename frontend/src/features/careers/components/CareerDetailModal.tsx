"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Compass,
  Layers,
} from "lucide-react";
import { CareerMatchDTO } from "../types/career.types";
import { MatchScore } from "./MatchScore";
import { SkillTags } from "./SkillTags";

interface CareerDetailModalProps {
  career: CareerMatchDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !career) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Bar: Close Button & Category */}
        <div className="flex items-center justify-between gap-4 border-b border-[#E3ECEA] dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {career.category}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {career.industry}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close career modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Header Hero Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {career.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{career.futureGrowth} Industry Growth</span>
              </span>
              {career.confidence && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{career.confidence}</span>
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <MatchScore score={career.matchPercentage} size="lg" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {career.description}
        </p>

        {/* AI Exploration Reasoning */}
        {career.reasoning && (
          <div className="rounded-2xl border border-teal-500/20 bg-teal-50/50 dark:bg-teal-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Why This Matches You
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {career.reasoning.summary}
            </p>

            {career.reasoning.topMatchingFactors &&
              career.reasoning.topMatchingFactors.length > 0 && (
                <div className="pt-2 border-t border-teal-200/60 dark:border-teal-900/60 flex flex-wrap gap-2">
                  {career.reasoning.topMatchingFactors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                      {factor}
                    </span>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* 2-Column: Strength Alignments vs Development Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {career.strengthAlignment && career.strengthAlignment.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> Strength Alignment
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {career.strengthAlignment.slice(0, 3).map((st, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {career.developmentAreas && career.developmentAreas.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                <AlertCircle className="h-3.5 w-3.5" /> Growth Targets
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {career.developmentAreas.slice(0, 3).map((dev, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{dev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Key Skills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Core Competencies & Tools:
          </span>
          <SkillTags skills={career.keySkills || []} maxVisible={6} variant="teal" />
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-[#E3ECEA] dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Preview
          </button>

          <Link
            href={`/participant/career-pathways/${career.slug || career.id}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-teal-500/20 cursor-pointer"
          >
            <span>Open Full Pathway Guide</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
