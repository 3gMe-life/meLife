"use client";

import React from "react";
import { Compass, ShieldCheck, User, Calendar, GraduationCap, FileText, CheckCircle2, Layers, BookOpen, Target } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";
import { useParticipantProfileQuery } from "@/features/participants/hooks/useParticipantProfileQuery";
import { formatFullAssessmentDate } from "@/lib/date.utils";

interface StreamCoverPageProps {
  result: StreamFinderResult;
}

const REPORT_SECTIONS = [
  { num: "01", title: "Your Result", desc: "Primary Direction & Secondary Synergy" },
  { num: "02", title: "Stream Profile Comparison", desc: "4-Stream Affinity Spectrum Distribution" },
  { num: "03", title: "Profile Dimensions & Synthesis", desc: "6 Psychometrically Evaluated Constructs" },
  { num: "04", title: "Assessment Response Analysis", desc: "Observed Response Patterns & Signals" },
  { num: "05", title: "Stream Exploration", desc: "Primary, Close & Lower Relative Tiers" },
  { num: "06", title: "Career Exploration", desc: "Visual Continuum & Degree Clusters" },
  { num: "07", title: "Journey & Action Plan", desc: "6-Stage Lifecycle & 5-Step Action Roadmap" },
  { num: "08", title: "Discovery Snapshot & Guide", desc: "Quick Reference & 5-Step User Guide" },
  { num: "09", title: "Technical Appendix", desc: "Raw Scoring Matrix & Psychometric Audit" },
];

export const StreamCoverPage: React.FC<StreamCoverPageProps> = ({ result }) => {
  const { data: profileData } = useParticipantProfileQuery();
  const profile = profileData?.data;

  // Student name extraction with graceful fallback
  const studentName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : "Student Participant";

  const gradeLevel = profile?.gradeLevel ? `Class ${profile.gradeLevel}` : "Class 9–10";
  const formattedDate = formatFullAssessmentDate(result.completedAt || (result as any).createdAt);

  return (
    <div className="space-y-4 print:space-y-3">
      {/* 1. Publication Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
        {/* Geometric accent */}
        <div className="pointer-events-none absolute inset-0 opacity-15 overflow-hidden print:hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 260" preserveAspectRatio="none">
            <defs>
              <radialGradient id="coverGlowBanner" cx="80%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00BFA5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="720" cy="50" r="220" fill="url(#coverGlowBanner)" />
            <path d="M 0,140 Q 250,30 500,140 T 1000,140" fill="none" stroke="#00BFA5" strokeWidth="1" strokeDasharray="6 6" />
            <path d="M 0,190 Q 300,70 600,190 T 1200,190" fill="none" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
          </svg>
        </div>

        <div className="relative z-10 space-y-3 print:space-y-2.5">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 print:border-[#E3ECEA] print:pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 flex items-center gap-1.5 print:border-[#00BFA5] print:text-[#008F83] print:bg-emerald-50">
                <Compass className="w-3.5 h-3.5" />
                <span>3G ME LIFE • STREAM FINDER</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 print:border-[#00BFA5] print:text-[#008F83]">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Psychometric Evaluation</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/50 print:text-[#688582]">
              Result ID: {result.resultId?.slice(0, 12) || "SF-2026"}
            </span>
          </div>

          {/* Title & Philosophy */}
          <div className="space-y-1 max-w-3xl">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#00BFA5] print:text-[#008F83]">
              Senior Secondary Academic Discovery Report
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight print:text-[#172B2A]">
              Understanding where your interests, thinking style and learning preferences fit.
            </h1>
            <p className="text-xs text-[#9FB3B0] leading-relaxed print:text-[#526866]">
              A non-prescriptive psychometric discovery framework mapping your natural cognitive inclinations across Senior Secondary (Class 11–12) academic pathways.
            </p>
          </div>

          {/* Student Profile Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <User className="w-3 h-3 text-[#00BFA5]" />
                Student Name
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate print:text-[#172B2A]">
                {studentName}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <GraduationCap className="w-3 h-3 text-[#38BDF8]" />
                Class / Stage
              </span>
              <p className="text-xs sm:text-sm font-black text-white print:text-[#172B2A]">
                {gradeLevel}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <Compass className="w-3 h-3 text-[#F59E0B]" />
                Assessment Scope
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate print:text-[#172B2A]">
                Senior Secondary Exploration
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <Calendar className="w-3 h-3 text-[#00C896]" />
                Evaluation Date
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate print:text-[#172B2A]">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Assessment Framework & Evaluation Scope */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0D2421] via-[#102B28] to-[#0A1615] border border-white/10 p-4 sm:p-5 text-white shadow-lg print:p-3.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5 print:border-[#E3ECEA]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#00C896] flex items-center gap-1.5 print:text-[#008F83]">
            <Layers className="w-3.5 h-3.5" />
            <span>Core Evaluation Framework • 4 Senior Secondary Disciplines</span>
          </span>
          <span className="text-[9px] font-mono text-white/50 print:text-[#688582]">
            80 Discovery Items • 6 Constructs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
            <div className="flex items-center gap-1 text-[#00BFA5] font-bold text-[10.5px]">
              <span>🔬 Science</span>
            </div>
            <p className="text-[10px] text-[#C5D6D3] leading-snug print:text-[#526866]">
              Analytical inquiry, mathematics, physical principles & technical systems.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
            <div className="flex items-center gap-1 text-[#38BDF8] font-bold text-[10.5px]">
              <span>📈 Commerce</span>
            </div>
            <p className="text-[10px] text-[#C5D6D3] leading-snug print:text-[#526866]">
              Enterprise dynamics, market economics, financial logic & strategy.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
            <div className="flex items-center gap-1 text-[#F59E0B] font-bold text-[10.5px]">
              <span>🏛 Humanities</span>
            </div>
            <p className="text-[10px] text-[#C5D6D3] leading-snug print:text-[#526866]">
              Social structures, verbal reasoning, culture, history & public policy.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]">
            <div className="flex items-center gap-1 text-[#EC4899] font-bold text-[10.5px]">
              <span>🛠 Applied / Tech</span>
            </div>
            <p className="text-[10px] text-[#C5D6D3] leading-snug print:text-[#526866]">
              Hands-on building, practical design, functional prototyping & execution.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Report Section Directory / Table of Contents */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1B19] via-[#0E201E] to-[#0A1615] border border-white/10 p-4 sm:p-5 text-white shadow-lg print:p-3.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5 print:border-[#E3ECEA]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
            <FileText className="w-3.5 h-3.5" />
            <span>Report Section Architecture & Document Index</span>
          </span>
          <span className="text-[9px] font-mono text-white/50 print:text-[#688582]">
            9 Core Discovery Sections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {REPORT_SECTIONS.map((sec) => (
            <div
              key={sec.num}
              className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2 print:bg-white print:border-[#E3ECEA]"
            >
              <span className="text-[10px] font-mono font-black text-[#00C896] bg-white/5 px-1.5 py-0.5 rounded shrink-0 print:text-[#008F83] print:bg-emerald-50">
                {sec.num}
              </span>
              <div className="space-y-0.2 min-w-0">
                <h4 className="text-[11px] font-black text-white truncate print:text-[#172B2A]">
                  {sec.title}
                </h4>
                <p className="text-[9.5px] text-[#9FB3B0] truncate print:text-[#526866]">
                  {sec.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Publication Authority Footer */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-[#9FB3B0] leading-snug flex items-center justify-between gap-2 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#526866] print:p-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 print:text-[#008F83]" />
          <span>
            <strong>Publication Standards:</strong> Designed for Class 9–10 educational subject orientation. Strictly non-prescriptive psychometric guidance.
          </span>
        </div>
        <span className="font-mono text-[9px] text-white/40 shrink-0 print:text-[#688582]">
          © {new Date().getFullYear()} 3G MeLife Platform
        </span>
      </div>
    </div>
  );
};
