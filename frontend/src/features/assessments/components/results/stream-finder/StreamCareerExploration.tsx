"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, CheckCircle2, Info, Briefcase } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";

interface StreamCareerExplorationProps {
  result: StreamFinderResult;
}

export const StreamCareerExploration: React.FC<StreamCareerExplorationProps> = ({ result }) => {
  const clusters = result.careerClusters || [];
  const primaryStream = result.primaryStream || "Science";

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] flex flex-col justify-between space-y-3.5 print:space-y-2.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>06. Career Exploration</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Where Could This Lead?
          </h3>
          <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Exploratory career families and potential degree pathways connected to your academic profile.
          </p>
        </div>

        <Link
          href="/participant/careers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00BFA5] hover:text-[#00C896] hover:underline self-start sm:self-auto print:hidden"
        >
          <span>Explore All Career Pathways</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Visual Career Pathway Tree */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:p-2.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00C896] block print:text-[#008F83]">
            VISUAL CAREER PATHWAY ARCHITECTURE
          </span>
          <span className="text-[8.5px] font-mono text-white/40 uppercase print:text-[#688582]">
            Exploratory Continuum
          </span>
        </div>

        {/* Pathway Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative">
          {/* Step 1 */}
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5 flex flex-col justify-between print:bg-white print:border-[#E3ECEA]">
            <span className="text-[8px] font-mono font-bold text-[#00BFA5] uppercase block print:text-[#008F83]">01. Profile</span>
            <p className="text-[11.5px] font-black text-white print:text-[#172B2A]">Your Profile</p>
            <span className="text-[8.5px] text-white/50 print:text-[#688582]">Responses & Signals</span>
          </div>

          {/* Step 2 */}
          <div className="p-2 rounded-xl bg-[#00BFA5]/15 border border-[#00BFA5]/40 space-y-0.5 flex flex-col justify-between print:bg-emerald-50 print:border-[#00BFA5]">
            <span className="text-[8px] font-mono font-bold text-[#00C896] uppercase block print:text-[#008F83]">02. Stream</span>
            <p className="text-[11.5px] font-black text-white print:text-[#172B2A]">{primaryStream}</p>
            <span className="text-[8.5px] text-[#A7F3D0] print:text-[#065F46]">Primary Leaning</span>
          </div>

          {/* Step 3 */}
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5 flex flex-col justify-between print:bg-white print:border-[#E3ECEA]">
            <span className="text-[8px] font-mono font-bold text-[#38BDF8] uppercase block print:text-[#0284C7]">03. Subjects</span>
            <p className="text-[11.5px] font-black text-white print:text-[#172B2A]">Subject Areas</p>
            <span className="text-[8.5px] text-white/50 print:text-[#688582]">Class 11–12 Electives</span>
          </div>

          {/* Step 4 */}
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5 flex flex-col justify-between print:bg-white print:border-[#E3ECEA]">
            <span className="text-[8px] font-mono font-bold text-[#F59E0B] uppercase block print:text-[#B45309]">04. Degrees</span>
            <p className="text-[11.5px] font-black text-white print:text-[#172B2A]">Study Fields</p>
            <span className="text-[8.5px] text-white/50 print:text-[#688582]">Undergraduate Majors</span>
          </div>

          {/* Step 5 */}
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5 flex flex-col justify-between print:bg-white print:border-[#E3ECEA]">
            <span className="text-[8px] font-mono font-bold text-[#EC4899] uppercase block print:text-[#BE185D]">05. Careers</span>
            <p className="text-[11.5px] font-black text-white print:text-[#172B2A]">Career Families</p>
            <span className="text-[8.5px] text-white/50 print:text-[#688582]">Aligned Sectors</span>
          </div>

          {/* Step 6 */}
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5 flex flex-col justify-between print:bg-white print:border-[#E3ECEA]">
            <span className="text-[8px] font-mono font-bold text-[#8B5CF6] uppercase block print:text-[#6D28D9]">06. Future</span>
            <p className="text-[11.5px] font-black text-white print:text-[#172B2A]">Further Horizons</p>
            <span className="text-[8.5px] text-white/50 print:text-[#688582]">Ongoing Mentorship</span>
          </div>
        </div>
      </div>

      {/* Career Cluster Cards */}
      <div className="space-y-2.5 relative z-10">
        {clusters.slice(0, 2).map((cluster, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00BFA5]/40 transition-all space-y-2 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-white/5 pb-1.5 print:border-[#E3ECEA]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 print:border-[#00BFA5] print:text-[#008F83]">
                  {cluster.profileKey}
                </span>
                <span className="text-[11px] text-white/50 print:text-[#688582]">
                  Career Cluster #{idx + 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {/* Suggested Career Families */}
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
                  <Briefcase className="w-3 h-3" />
                  <span>Potential Career Families:</span>
                </h5>
                <ul className="space-y-0.5">
                  {cluster.suggestedCareerFamilies.map((fam, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5 text-[11px] text-[#E0EBE8] font-medium print:text-[#2A4442]">
                      <CheckCircle2 className="w-3 h-3 text-[#00BFA5] shrink-0" />
                      <span>{fam}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example Specialization Areas */}
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5 print:text-[#0284C7]">
                  <GraduationCap className="w-3 h-3" />
                  <span>Possible Degree & Study Fields:</span>
                </h5>
                <div className="flex flex-wrap gap-1">
                  {cluster.exampleAreas.map((area, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2 py-0.5 rounded-lg bg-white/5 text-[10.5px] text-white/90 border border-white/10 font-medium print:bg-white print:border-[#E3ECEA] print:text-[#172B2A]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Counselling Note */}
            {cluster.counsellingNote && (
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[10.5px] text-[#C5D6D3] leading-relaxed flex items-start gap-1.5 print:bg-white print:border-[#E3ECEA] print:text-[#415654]">
                <Info className="w-3 h-3 text-[#00BFA5] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-[#172B2A]">Educational Context:</strong>{" "}
                  {cluster.counsellingNote}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
