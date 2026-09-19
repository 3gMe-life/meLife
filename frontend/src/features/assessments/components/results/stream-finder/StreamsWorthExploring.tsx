"use client";

import React from "react";
import { Compass } from "lucide-react";
import { StreamFinderResult, StreamName } from "../../../types/assessment.types";

interface StreamsWorthExploringProps {
  result: StreamFinderResult;
}

const STREAM_DETAILS: Record<
  StreamName,
  {
    subjects: string[];
    learningEnvironment: string;
    whyExploreIt: string;
  }
> = {
  Science: {
    subjects: ["Physics", "Chemistry", "Mathematics / Biology", "Computer Science"],
    learningEnvironment: "Laboratory experimentation, mathematical derivations, structured algorithmic logic, and empirical proof.",
    whyExploreIt: "Explore if you enjoy investigating physical and biological laws, solving quantitative equations, and technical innovations.",
  },
  Commerce: {
    subjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics / Informatics"],
    learningEnvironment: "Commercial market simulations, financial ledger analysis, enterprise case studies, and managerial strategy.",
    whyExploreIt: "Explore if you enjoy understanding economic systems, business growth, financial analytics, and organizational management.",
  },
  Humanities: {
    subjects: ["History", "Political Science", "Psychology", "Sociology / Economics / Literature"],
    learningEnvironment: "Seminar debates, critical textual analysis, social research field studies, and essay composition.",
    whyExploreIt: "Explore if you enjoy analyzing human behaviour, historical contexts, public policies, legal ethics, and cultural dynamics.",
  },
  "Applied / Technical": {
    subjects: ["Informatics Practices", "Engineering Graphics", "Applied Arts", "Vocational Design & Tech"],
    learningEnvironment: "Makerspaces, digital media labs, functional prototyping, tool troubleshooting, and iterative project builds.",
    whyExploreIt: "Explore if you enjoy active building, craftsmanship, digital design tools, and direct real-world functional problem solving.",
  },
};

export const StreamsWorthExploring: React.FC<StreamsWorthExploringProps> = ({ result }) => {
  const sorted = result.sortedStreams || [];
  const primaryItem = sorted[0];
  const primaryScore = primaryItem?.displayPercentage || 0;

  // Categorize streams into 3 distinct non-prescriptive tiers with tie-awareness
  const primaryTier = sorted.filter(
    (s, idx) => idx === 0 || s.displayPercentage === primaryScore
  );

  const closelyAligned = sorted.filter(
    (s) => !primaryTier.includes(s) && Math.abs(primaryScore - s.displayPercentage) <= 10
  );

  const lowerRelative = sorted.filter(
    (s) => !primaryTier.includes(s) && Math.abs(primaryScore - s.displayPercentage) > 10
  );

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] flex flex-col justify-between space-y-3.5 print:space-y-2.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Compass className="w-3.5 h-3.5" />
              <span>05. Stream Exploration</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Streams Worth Exploring
          </h3>
          <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Disciplines categorized by relative alignment to guide syllabus investigation, elective choices, and counsellor discussions.
          </p>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 self-start sm:self-auto print:border-[#E3ECEA] print:text-[#526866]">
          Exploratory Tiers
        </span>
      </div>

      <div className="space-y-3 print:space-y-2.5 relative z-10">
        {/* TIER 1: PRIMARY ALIGNMENT */}
        {primaryTier.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00C896] bg-[#00BFA5]/20 px-2 py-0.5 rounded-full border border-[#00BFA5]/40 print:text-[#008F83] print:bg-emerald-50">
                ★ PRIMARY ALIGNMENT {primaryTier.length > 1 ? "(Tied)" : ""}
              </span>
              <span className="text-[11px] text-white/50 print:text-[#688582]">
                Highest relative response affinity
              </span>
            </div>

            {primaryTier.map((item) => (
              <div
                key={item.stream}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border-2 border-[#00BFA5]/50 shadow-lg shadow-[#00BFA5]/10 print:bg-[#F7FAF9] print:border-[#00BFA5] print:text-[#172B2A] print:p-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 border-b border-white/5 pb-1.5 print:border-[#E3ECEA]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
                      {item.stream}
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#00C896] bg-[#00BFA5]/20 px-2 py-0.5 rounded-lg border border-[#00BFA5]/30 print:text-[#008F83] print:bg-emerald-50">
                      {item.displayPercentage}% Relative Alignment
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wider print:text-[#526866]">
                    {item.alignment}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
                    <span className="font-bold text-[#00BFA5] block text-[10px] uppercase tracking-wider print:text-[#008F83]">
                      Subjects to Review:
                    </span>
                    <p className="text-[#E0EBE8] text-[11px] font-medium print:text-[#2A4442]">
                      {STREAM_DETAILS[item.stream]?.subjects.join(", ")}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
                    <span className="font-bold text-[#38BDF8] block text-[10px] uppercase tracking-wider print:text-[#0284C7]">
                      Learning Environment:
                    </span>
                    <p className="text-[#C5D6D3] text-[10.5px] leading-snug print:text-[#415654]">
                      {STREAM_DETAILS[item.stream]?.learningEnvironment}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
                    <span className="font-bold text-[#F59E0B] block text-[10px] uppercase tracking-wider print:text-[#B45309]">
                      Why Explore It:
                    </span>
                    <p className="text-[#C5D6D3] text-[10.5px] leading-snug print:text-[#415654]">
                      {STREAM_DETAILS[item.stream]?.whyExploreIt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TIER 2: CLOSE ALIGNMENT */}
        {closelyAligned.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8] bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30 print:text-[#0284C7] print:bg-sky-50">
                ✦ CLOSE ALIGNMENT
              </span>
              <span className="text-[11px] text-white/50 print:text-[#688582]">
                Strong secondary affinities worth thorough exploration
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {closelyAligned.map((item) => (
                <div
                  key={item.stream}
                  className="p-3 rounded-2xl bg-white/[0.03] border border-sky-500/30 hover:border-sky-400/50 transition-all flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1 print:border-[#E3ECEA]">
                      <h4 className="text-xs sm:text-sm font-black text-white print:text-[#172B2A]">
                        {item.stream}
                      </h4>
                      <span className="text-xs font-mono font-bold text-[#38BDF8] print:text-[#0284C7]">
                        {item.displayPercentage}% ({item.alignment})
                      </span>
                    </div>

                    <div className="space-y-0.5 text-[10.5px] text-[#C5D6D3] print:text-[#415654]">
                      <p>
                        <strong className="text-[#38BDF8] print:text-[#0284C7]">Subjects:</strong>{" "}
                        {STREAM_DETAILS[item.stream]?.subjects.join(", ")}
                      </p>
                      <p className="text-[#9FB3B0] leading-snug print:text-[#526866]">
                        {STREAM_DETAILS[item.stream]?.whyExploreIt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-1 border-t border-white/5 text-[9.5px] text-[#38BDF8] font-semibold print:border-[#E3ECEA] print:text-[#0284C7]">
                    ✓ Consider as a viable primary track or interdisciplinary subject elective.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIER 3: LOWER RELATIVE ALIGNMENT */}
        {lowerRelative.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 print:text-[#688582]">
                LOWER RELATIVE ALIGNMENT
              </span>
              <span className="text-[11px] text-white/40 print:text-[#688582]">
                Requires deliberate review of prerequisite foundation and personal interest
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lowerRelative.map((item) => (
                <div
                  key={item.stream}
                  className="p-2.5 rounded-2xl bg-white/[0.01] border border-white/5 text-white/70 print:bg-white print:border-[#E3ECEA] print:text-[#526866] print:p-2"
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-white/90 print:text-[#172B2A]">
                      {item.stream}
                    </h4>
                    <span className="text-[11px] font-mono text-white/50 print:text-[#688582]">
                      {item.displayPercentage}% ({item.alignment})
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9FB3B0] leading-snug print:text-[#526866]">
                    Lower spontaneous response affinity. If choosing this stream based on career aspirations, review prerequisite subject marks with your school mentor.
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
