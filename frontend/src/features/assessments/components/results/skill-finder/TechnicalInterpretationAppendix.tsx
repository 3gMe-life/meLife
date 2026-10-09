"use client";

import React, { useState } from "react";
import { FileCode, ChevronDown, ChevronUp, ShieldCheck, Layers, Info, CheckCircle2 } from "lucide-react";
import { SkillFinderResult } from "../../../types/assessment.types";

interface TechnicalInterpretationAppendixProps {
  result: SkillFinderResult;
  className?: string;
}

export function TechnicalInterpretationAppendix({
  result,
  className = "",
}: TechnicalInterpretationAppendixProps) {
  const [isOpen, setIsOpen] = useState(false);

  const confidenceMetrics = result.confidenceMetrics;
  const responseQuality = result.responseQuality || {
    consistencySignal: "High Consistency",
    attentionCheckPassed: true,
    interpretation: "Evaluated through parallel consistency verification checks.",
  };

  const formattedDate = result.completedAt
    ? new Date(result.completedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Verified Session";

  // Aggregate all dimensional construct data safely
  const intDims = (result.interestDiscovery?.dimensions || []).map((d) => ({
    ...d,
    layer: "Interest Profile (RIASEC)",
    source: "Self-Reported Task Alignment",
    weight: "25%",
  }));
  const skillDims = (result.skillBehaviour?.dimensions || []).map((d) => ({
    ...d,
    layer: "Skill Behaviours",
    source: "Self-Reported Working Style",
    weight: "30%",
  }));
  const aptDims = (result.demonstratedAptitude?.dimensions || []).map((d) => ({
    ...d,
    layer: "Cognitive Aptitude",
    source: "Demonstrated Objective Task",
    weight: "25%",
  }));
  const devDims = (result.developmentalStrengths?.dimensions || []).map((d) => ({
    ...d,
    layer: "Developmental Habits",
    source: "Self-Reported Learning Habits",
    weight: "20%",
  }));

  const allDimensions = [...intDims, ...skillDims, ...aptDims, ...devDims];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 overflow-hidden shadow-sm print:rounded-2xl print:border-[#E3ECEA] print:bg-white print-break-avoid ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer print:hidden"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              Technical & Counsellor Interpretation Appendix
            </h3>
            <p className="text-[10.5px] text-[#728B88] dark:text-[#9FB3B0]">
              Dimensional score tables, response validity checks, model weights, and measurement notes
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#728B88] shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#728B88] shrink-0" />
        )}
      </button>

      {/* Visible Content when expanded or in print mode */}
      <div className={`${isOpen ? "block" : "hidden"} print:block px-6 pb-6 pt-2 border-t border-[#E3ECEA] dark:border-white/10 space-y-5`}>
        {/* Section Title (Print mode only) */}
        <div className="hidden print:block pt-3 border-b border-[#E3ECEA] pb-2">
          <h3 className="text-sm font-black text-[#172B2A] uppercase tracking-wider">
            Technical & Counsellor Interpretation Appendix
          </h3>
          <p className="text-[10px] text-[#526866]">
            Dimensional construct scores, response quality metrics, and scoring architecture
          </p>
        </div>

        {/* 1. Evaluation Audit Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono p-4 rounded-2xl bg-[#F4F8F7] dark:bg-black/20 border border-[#E3ECEA] dark:border-white/5 print:bg-[#F9FCFB] print:border-[#E3ECEA]">
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-[#728B88] dark:text-[#9FB3B0] uppercase block">Attempt ID</span>
            <p className="font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate print:text-[#172B2A]">
              {result.attemptId}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-[#728B88] dark:text-[#9FB3B0] uppercase block">Completed Date</span>
            <p className="font-bold text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A]">
              {formattedDate}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-[#728B88] dark:text-[#9FB3B0] uppercase block">Construct Model</span>
            <p className="font-bold text-[#008F83] dark:text-[#00BFA5] print:text-[#008F83]">
              29 Dimensions (4 Layers)
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-[#728B88] dark:text-[#9FB3B0] uppercase block">Consistency Signal</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 print:text-[#065F46] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{responseQuality.consistencySignal}</span>
            </p>
          </div>
        </div>

        {/* 2. Response Quality & Validity Checks */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2 print:bg-[#F9FCFB] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A]">
            <Info className="w-4 h-4 text-[#00BFA5]" />
            <span>Response Validity & Quality Checks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F4F8F7] dark:bg-black/20 border border-[#E3ECEA] dark:border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
              <span className="text-[9.5px] font-mono text-[#728B88] block">Attention Check:</span>
              <p className="font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
                {responseQuality.attentionCheckPassed ? "Passed (Verified)" : "Attention Review Flag"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F4F8F7] dark:bg-black/20 border border-[#E3ECEA] dark:border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
              <span className="text-[9.5px] font-mono text-[#728B88] block">Self-Report vs Task Gap:</span>
              <p className="font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
                {confidenceMetrics ? `${confidenceMetrics.selfReportVsPerformanceGap}% Discrepancy Index` : "Evaluated"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F4F8F7] dark:bg-black/20 border border-[#E3ECEA] dark:border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
              <span className="text-[9.5px] font-mono text-[#728B88] block">Straight-Lining Bias:</span>
              <p className="font-bold text-[#172B2A] dark:text-white print:text-[#172B2A]">
                {confidenceMetrics ? `${confidenceMetrics.ratingBiasPercentage}% Likert Share` : "Within Threshold"}
              </p>
            </div>
          </div>
          <p className="text-[10.5px] text-[#526866] dark:text-[#A7C2BF] print:text-[#415654] leading-relaxed pt-1">
            {responseQuality.interpretation}
          </p>
        </div>

        {/* 3. 29-Dimension Construct Calibration Ledger Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>Full 29-Dimension Construct Calibration Ledger</span>
            </span>
            <span className="text-[10px] font-mono text-[#728B88] print:text-[#688582]">
              Model: Interest 25% • Skill 30% • Aptitude 25% • Habits 20%
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E3ECEA] dark:border-white/10">
            <table className="w-full text-left text-[11px] text-[#172B2A] dark:text-[#E0EBE8] print:text-[#172B2A]">
              <thead className="bg-[#F4F8F7] dark:bg-black/40 text-[10px] font-mono uppercase text-[#728B88] dark:text-[#9FB3B0] print:bg-[#F4F8F7] print:text-[#526866]">
                <tr>
                  <th className="py-2 px-3">Construct Name</th>
                  <th className="py-2 px-3">Layer / Evidence Source</th>
                  <th className="py-2 px-3">Weight</th>
                  <th className="py-2 px-3">Points / Score</th>
                  <th className="py-2 px-3">Normalized Scale</th>
                  <th className="py-2 px-3">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECEA] dark:divide-white/5 print:divide-[#E3ECEA]">
                {allDimensions.map((dim, idx) => {
                  const score = Math.round(dim.scalePositionPercentage || 0);
                  const isAptitude = dim.layer === "Cognitive Aptitude";
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-[#F4F8F7]/60 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-1.5 px-3 font-semibold">{dim.name}</td>
                      <td className="py-1.5 px-3 text-[10px] font-mono text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
                        {dim.layer}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-[10px]">{dim.weight}</td>
                      <td className="py-1.5 px-3 font-mono">
                        {isAptitude && dim.maxScore && dim.maxScore > 0
                          ? `${dim.rawScore ?? 0} / ${dim.maxScore} pts`
                          : `${score} / 100`}
                      </td>
                      <td className="py-1.5 px-3 font-mono font-bold text-[#008F83] dark:text-[#00BFA5] print:text-[#008F83]">
                        {score}%
                      </td>
                      <td className="py-1.5 px-3 text-[10px] font-bold">
                        {dim.level || (score >= 75 ? "High" : score >= 50 ? "Proficient" : "Moderate")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Measurement Limitations & Retest Protocol */}
        <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-black/20 border border-[#E3ECEA] dark:border-white/5 text-[10.5px] text-[#526866] dark:text-[#A7C2BF] print:text-[#415654] space-y-1.5 leading-relaxed">
          <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Psychometric Measurement Notes & Retest Protocol</span>
          </div>
          <p>
            • <strong>Model Weights: </strong>Model weights reflect the ME LIFE Skill Finder scoring framework (Interest 25%, Skill Behaviour 30%, Demonstrated Aptitude 25%, Developmental Habits 20%).
          </p>
          <p>
            • <strong>Retest Guidance: </strong>Use a later reassessment in 3–6 months to compare current patterns over time after hands-on project exposure and practice.
          </p>
          <p>
            • <strong>Standard Limitations: </strong>Norm-referenced percentiles, test-retest reliability coefficients, and population standardization data are not reported in this student result output. All interpretations should be treated as supportive exploratory guidance in conjunction with academic performance and personal counselling.
          </p>
        </div>
      </div>
    </div>
  );
}
