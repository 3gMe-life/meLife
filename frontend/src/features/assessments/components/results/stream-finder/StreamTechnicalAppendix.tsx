"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileCode, Info } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";
import { formatFullAssessmentDate } from "@/lib/date.utils";

interface StreamTechnicalAppendixProps {
  result: StreamFinderResult;
}

export const StreamTechnicalAppendix: React.FC<StreamTechnicalAppendixProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Safe date formatting
  const formattedDate = formatFullAssessmentDate(result.completedAt || (result as any).createdAt);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B1B19] border border-[#E3ECEA] dark:border-white/10 overflow-hidden shadow-sm print:border-[#E3ECEA] print:bg-white print:text-[#172B2A] flex flex-col justify-between">
      {/* Clickable Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer print:py-2.5 print:px-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] block">
              09. Assessment Details & Technical Appendix
            </span>
            <span className="text-[10.5px] text-[#526866] dark:text-[#9FB3B0]">
              Raw scoring matrices, construct point allocations, and psychometric evaluation audit
            </span>
          </div>
        </div>

        <div className="p-1.5 rounded-xl bg-surface-muted text-text-secondary print:hidden">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content Drawer (always expanded in print) */}
      <div className={`${isOpen ? "block" : "hidden print:block"} px-5 pb-5 pt-1 border-t border-[#E3ECEA] dark:border-white/10 space-y-4 bg-[#F4F8F7]/40 dark:bg-black/20 print:bg-white print:px-4 print:pb-4 print:space-y-3`}>
        {/* Scientific Interpretation Safeguard Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2 print:bg-amber-50 print:border-amber-200 print:text-amber-900 print:p-2.5">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Technical Scoring Safeguard:</strong> These scores represent relative assessment alignment and are not school marks, examination scores, IQ scores, or guaranteed predictions of future performance.
          </div>
        </div>

        {/* 4-Stream Raw Points Matrix Table */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              4-Stream Raw Point Distribution Matrix
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/20 font-bold">
              {result.assessmentMode === "CORE"
                ? "Core Form (48 items • 88 max/stream)"
                : result.assessmentMode === "EXTENDED"
                ? "Extended Battery (80 items • 120–145 max/stream)"
                : "80 Items"}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E3ECEA] dark:border-white/10 text-[9.5px] font-bold uppercase tracking-wider text-[#526866] dark:text-white/50 bg-white dark:bg-white/5">
                  <th className="p-2 rounded-l-lg">Stream</th>
                  <th className="p-2">
                    {result.assessmentMode === "CORE"
                      ? "Trait Points (Likert 32)"
                      : "Trait Points (Likert 60)"}
                  </th>
                  <th className="p-2">
                    {result.assessmentMode === "CORE"
                      ? "Choice Points (FC 16)"
                      : "Choice Points (FC 20)"}
                  </th>
                  <th className="p-2">Total Raw Score</th>
                  <th className="p-2">Max Possible</th>
                  <th className="p-2 rounded-r-lg">Relative %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECEA] dark:divide-white/5 font-mono text-[11px]">
                {result.sortedStreams.map((s, idx) => (
                  <tr key={s.stream} className="hover:bg-white/40 dark:hover:bg-white/5">
                    <td className="p-2 font-sans font-bold text-[#172B2A] dark:text-white">
                      {idx + 1}. {s.stream}
                    </td>
                    <td className="p-2">{s.traitPoints} / {s.maxTraitPoints}</td>
                    <td className="p-2">{s.choicePoints} / {s.maxChoicePoints}</td>
                    <td className="p-2 font-bold text-[#008F83] dark:text-[#00BFA5]">{s.totalRaw}</td>
                    <td className="p-2 text-[#526866] dark:text-white/50">{s.maxTotal}</td>
                    <td className="p-2 font-bold text-[#172B2A] dark:text-white">{s.displayPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6 Section Breakdown Points */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
            6 Evaluated Constructs Raw Point Allocation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {result.sectionBreakdown.map((sec, idx) => (
              <div
                key={sec.sectionCode || idx}
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5 print:bg-white print:border-[#E3ECEA]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#172B2A] dark:text-white">{sec.sectionName}</span>
                  <span className="text-[9.5px] text-[#526866] dark:text-white/40 font-mono">{sec.questionCount} Items</span>
                </div>
                <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-[#526866] dark:text-[#9FB3B0]">
                  <div>Sci: <strong className="text-teal-600 dark:text-teal-400">{sec.scienceScore}</strong></div>
                  <div>Com: <strong className="text-blue-600 dark:text-blue-400">{sec.commerceScore}</strong></div>
                  <div>Hum: <strong className="text-amber-600 dark:text-amber-400">{sec.humanitiesScore}</strong></div>
                  <div>App: <strong className="text-purple-600 dark:text-purple-400">{sec.appliedScore}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Metadata Footer Audit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E3ECEA] dark:border-white/10 text-[11px] font-mono text-[#526866] dark:text-[#728B88]">
          <div>
            <span className="text-[9px] uppercase block text-[#526866] dark:text-white/40">Result ID</span>
            <span className="text-[#172B2A] dark:text-white truncate block">{result.resultId}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase block text-[#526866] dark:text-white/40">Attempt ID</span>
            <span className="text-[#172B2A] dark:text-white truncate block">{result.attemptId}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase block text-[#526866] dark:text-white/40">Evaluation Date</span>
            <span className="text-[#172B2A] dark:text-white block">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase block text-[#526866] dark:text-white/40">Top-Score Gap Delta</span>
            <span className="text-[#008F83] dark:text-[#00C896] font-bold block">
              +{result.scoreGapPercentage}% ({result.clarity})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
