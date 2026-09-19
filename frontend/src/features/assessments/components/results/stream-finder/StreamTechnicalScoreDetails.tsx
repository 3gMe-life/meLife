"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileCode, Info, ShieldCheck, Target, Layers } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";

interface StreamTechnicalScoreDetailsProps {
  result: StreamFinderResult;
}

export const StreamTechnicalScoreDetails: React.FC<StreamTechnicalScoreDetailsProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B1B19] border border-[#E3ECEA] dark:border-white/10 overflow-hidden shadow-sm print:border-[#E3ECEA] print:bg-white print:text-[#172B2A]">
      {/* Clickable Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] block">
              Assessment Details & Counsellor Data
            </span>
            <span className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
              Collapsible technical scoring breakdown, raw point allocations, and evaluation audit
            </span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-surface-muted text-text-secondary print:hidden">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content Drawer */}
      {(isOpen || typeof window === "undefined") && (
        <div className="px-6 pb-6 pt-2 border-t border-[#E3ECEA] dark:border-white/10 space-y-6 bg-[#F4F8F7]/40 dark:bg-black/20">
          {/* Scientific Interpretation Safeguard Notice */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong>Technical Scoring Safeguard:</strong> These are internal assessment raw scores used by the assessment system to compute relative alignment across disciplines. They are not percentages of school marks or academic exam performance.
            </div>
          </div>

          {/* 4-Stream Raw Points Matrix Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              4-Stream Point Distribution
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E3ECEA] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#526866] dark:text-white/50 bg-white dark:bg-white/5">
                    <th className="p-3 rounded-l-xl">Stream</th>
                    <th className="p-3">Trait Points (Q1–60)</th>
                    <th className="p-3">Choice Points (Q61–80)</th>
                    <th className="p-3">Total Raw Score</th>
                    <th className="p-3">Max Possible</th>
                    <th className="p-3 rounded-r-xl">Relative %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECEA] dark:divide-white/5 font-mono">
                  {result.sortedStreams.map((s, idx) => (
                    <tr key={s.stream} className="hover:bg-white/40 dark:hover:bg-white/5">
                      <td className="p-3 font-sans font-bold text-[#172B2A] dark:text-white">
                        {idx + 1}. {s.stream}
                      </td>
                      <td className="p-3">{s.traitPoints} / {s.maxTraitPoints}</td>
                      <td className="p-3">{s.choicePoints} / {s.maxChoicePoints}</td>
                      <td className="p-3 font-bold text-[#008F83] dark:text-[#00BFA5]">{s.totalRaw}</td>
                      <td className="p-3 text-white/50">{s.maxTotal}</td>
                      <td className="p-3 font-bold text-[#172B2A] dark:text-white">{s.displayPercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6 Section Breakdown Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              6 Evaluated Constructs Raw Point Allocation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {result.sectionBreakdown.map((sec, idx) => (
                <div
                  key={sec.sectionCode || idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172B2A] dark:text-white">{sec.sectionName}</span>
                    <span className="text-[10px] text-white/40 font-mono">{sec.questionCount} Qs</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                    <div>Sci: <strong className="text-teal-500">{sec.scienceScore}</strong></div>
                    <div>Com: <strong className="text-blue-500">{sec.commerceScore}</strong></div>
                    <div>Hum: <strong className="text-amber-500">{sec.humanitiesScore}</strong></div>
                    <div>App: <strong className="text-purple-500">{sec.appliedScore}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Metadata Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E3ECEA] dark:border-white/10 text-xs font-mono text-[#526866] dark:text-[#728B88]">
            <div>
              <span className="text-[10px] uppercase block text-white/40">Result ID</span>
              <span className="text-[#172B2A] dark:text-white truncate block">{result.resultId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase block text-white/40">Attempt ID</span>
              <span className="text-[#172B2A] dark:text-white truncate block">{result.attemptId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase block text-white/40">Evaluation Date</span>
              <span className="text-[#172B2A] dark:text-white block">
                {new Date(result.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase block text-white/40">Score Gap Delta</span>
              <span className="text-[#008F83] dark:text-[#00C896] font-bold block">
                +{result.scoreGapPercentage}% ({result.clarity})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
