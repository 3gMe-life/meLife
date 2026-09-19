"use client";

import React from "react";
import { Compass, BookOpen, CheckCircle2, ArrowRight, Layers, HelpCircle } from "lucide-react";
import { StreamFinderResult, StreamName, StreamScoreItem } from "../../../types/assessment.types";

interface StreamsToExploreGridProps {
  result: StreamFinderResult;
}

const STREAM_DETAILS: Record<
  StreamName,
  {
    subjects: string[];
    studyFocus: string;
    decisionFactor: string;
  }
> = {
  Science: {
    subjects: ["Physics", "Chemistry", "Mathematics / Biology", "Computer Science"],
    studyFocus: "Conceptual problem solving, numerical derivations, and laboratory experimentation.",
    decisionFactor: "Best investigated if you enjoy math, scientific curiosity, and technical/medical horizons.",
  },
  Commerce: {
    subjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics"],
    studyFocus: "Commercial case studies, financial modeling, and economic policy analysis.",
    decisionFactor: "Best investigated if you enjoy business logic, market structures, and financial management.",
  },
  Humanities: {
    subjects: ["History", "Political Science", "Psychology", "Sociology / Economics"],
    studyFocus: "Essay composition, critical textual analysis, and seminar debate discussions.",
    decisionFactor: "Best investigated if you enjoy exploring human culture, legal systems, and societal dynamics.",
  },
  "Applied / Technical": {
    subjects: ["Informatics Practices", "Engineering Graphics", "Applied Arts", "Vocational Design"],
    studyFocus: "Studio prototyping, software/hardware tools, and iterative project-based builds.",
    decisionFactor: "Best investigated if you enjoy active building, digital creation, and practical craftsmanship.",
  },
};

export const StreamsToExploreGrid: React.FC<StreamsToExploreGridProps> = ({ result }) => {
  const sorted = result.sortedStreams || [];
  const primaryItem = sorted[0];
  const secondaryItem = sorted[1];
  const thirdItem = sorted[2];
  const lowestItem = sorted[3];

  // Determine closely aligned streams (within 10% of primary)
  const primaryScore = primaryItem?.displayPercentage || 0;
  const closelyAligned = sorted.filter(
    (s, idx) => idx > 0 && Math.abs(primaryScore - s.displayPercentage) <= 10
  );
  const lowerRelative = sorted.filter(
    (s, idx) => idx > 0 && Math.abs(primaryScore - s.displayPercentage) > 10
  );

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Compass className="w-3.5 h-3.5" />
              <span>05. Streams to Explore</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Categorized Stream Investigation Tiers
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Grouped by relative psychometric alignment to guide your course syllabus exploration and subject elective planning.
          </p>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 self-start sm:self-auto print:border-[#E3ECEA] print:text-[#526866]">
          Non-Prescriptive Framework
        </span>
      </div>

      <div className="space-y-6 relative z-10">
        {/* TIER 1: PRIMARY ALIGNMENT */}
        {primaryItem && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#00C896] bg-[#00BFA5]/15 px-3 py-0.5 rounded-full border border-[#00BFA5]/30 print:text-[#008F83] print:bg-emerald-50">
                ⭐ Primary Alignment
              </span>
              <span className="text-xs text-white/50 print:text-[#688582]">
                Highest relative response affinity
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border-2 border-[#00BFA5]/50 print:bg-[#F7FAF9] print:border-[#00BFA5] print:text-[#172B2A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-lg sm:text-xl font-black text-white print:text-[#172B2A]">
                    {primaryItem.stream}
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#00C896] bg-[#00BFA5]/15 px-2.5 py-0.5 rounded-lg print:text-[#008F83]">
                    {primaryItem.displayPercentage}% Match
                  </span>
                </div>
                <span className="text-xs font-bold text-white/70 print:text-[#526866]">
                  {primaryItem.alignment}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-white print:border-[#E3ECEA]">
                  <span className="font-bold text-[#00BFA5] block mb-1 print:text-[#008F83]">
                    Typical Subject Combinations:
                  </span>
                  <p className="text-[#C5D6D3] print:text-[#415654]">
                    {STREAM_DETAILS[primaryItem.stream]?.subjects.join(", ")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-white print:border-[#E3ECEA]">
                  <span className="font-bold text-[#38BDF8] block mb-1 print:text-[#0284C7]">
                    Study Approach:
                  </span>
                  <p className="text-[#C5D6D3] print:text-[#415654]">
                    {STREAM_DETAILS[primaryItem.stream]?.studyFocus}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-white print:border-[#E3ECEA]">
                  <span className="font-bold text-[#F59E0B] block mb-1 print:text-[#B45309]">
                    Exploration Recommendation:
                  </span>
                  <p className="text-[#C5D6D3] print:text-[#415654]">
                    {STREAM_DETAILS[primaryItem.stream]?.decisionFactor}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIER 2: CLOSELY ALIGNED */}
        {closelyAligned.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#38BDF8] bg-sky-500/15 px-3 py-0.5 rounded-full border border-sky-500/30 print:text-[#0284C7] print:bg-sky-50">
                ✨ Closely Aligned Options
              </span>
              <span className="text-xs text-white/50 print:text-[#688582]">
                Strong secondary or complementary affinities worth thorough exploration
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {closelyAligned.map((item) => (
                <div
                  key={item.stream}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#38BDF8]/40 transition-all flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-black text-white print:text-[#172B2A]">
                        {item.stream}
                      </h4>
                      <span className="text-xs font-mono font-bold text-[#38BDF8] print:text-[#0284C7]">
                        {item.displayPercentage}%
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-[#C5D6D3] pt-1 print:text-[#415654]">
                      <p>
                        <strong>Subjects:</strong>{" "}
                        {STREAM_DETAILS[item.stream]?.subjects.join(", ")}
                      </p>
                      <p className="text-[#9FB3B0] print:text-[#526866]">
                        {STREAM_DETAILS[item.stream]?.decisionFactor}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#38BDF8] font-semibold print:border-[#E3ECEA]">
                    Consider as primary or interdisciplinary combination.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIER 3: LOWER RELATIVE ALIGNMENT */}
        {lowerRelative.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 bg-white/5 px-3 py-0.5 rounded-full border border-white/10 print:text-[#688582]">
                Lower Relative Alignment
              </span>
              <span className="text-xs text-white/40 print:text-[#688582]">
                Requires deliberate review of academic readiness and interest commitment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lowerRelative.map((item) => (
                <div
                  key={item.stream}
                  className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-white/70 print:bg-white print:border-[#E3ECEA] print:text-[#526866]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white/90 print:text-[#172B2A]">
                      {item.stream}
                    </h4>
                    <span className="text-xs font-mono text-white/50 print:text-[#688582]">
                      {item.displayPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-[#9FB3B0] leading-snug print:text-[#526866]">
                    Lower spontaneous response affinity. If choosing this stream, discuss subject prerequisites with a school counsellor.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
