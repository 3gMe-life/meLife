import React from "react";
import { ReportCoverData } from "../../types/career-report.types";
import { Sparkles, Calendar, School, GraduationCap, Award, Compass, ShieldCheck, UserCheck, Lightbulb } from "lucide-react";

interface CoverSectionProps {
  data: ReportCoverData;
  reportId: string;
}

export const CoverSection: React.FC<CoverSectionProps> = ({ data, reportId }) => {
  return (
    <div id="section-cover" className="space-y-6">
      {/* Hero Cover Card - Dark Modern Aesthetic with Geometric Accents */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-[#0B1B19] via-[#112D29] to-[#0A1615] p-6 md:p-10 text-white shadow-2xl">
        {/* Abstract Vector Glow Geometry */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-2xl" />

        {/* Top Branding & Reference Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-lg shadow-teal-500/20">
              <Compass className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-widest text-teal-400 text-[11px] uppercase">
                  3G MeLife Psychometrics
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-teal-300 border border-teal-500/30">
                  <ShieldCheck className="h-3 w-3" /> Official Exploration Benchmark
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-0.5">
                {data.reportTitle}
              </h1>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Evaluation Ref</div>
            <div className="font-mono text-xs font-bold text-teal-300">
              {reportId ? `${reportId.slice(0, 13)}...` : "MELIFE-2026-REP"}
            </div>
          </div>
        </div>

        {/* Main Student Identification & Archetype Banner */}
        <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Student Details */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-teal-400 font-bold">
                <UserCheck className="h-3.5 w-3.5" /> Student Participant
              </div>
              <div className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
                {data.studentName}
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed font-normal">
                {data.reportSubtitle || "Discovering Your Strengths, Interests & Future Possibilities"}
              </p>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <GraduationCap className="h-4 w-4 text-teal-400" />
                  <span>Academic Stage</span>
                </div>
                <div className="mt-1 font-bold text-sm text-white truncate">
                  {data.gradeLevel || data.educationStage}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <School className="h-4 w-4 text-teal-400" />
                  <span>Institution</span>
                </div>
                <div className="mt-1 font-bold text-sm text-white truncate" title={data.schoolName}>
                  {data.schoolName}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Calendar className="h-4 w-4 text-teal-400" />
                  <span>Assessment Date</span>
                </div>
                <div className="mt-1 font-bold text-sm text-white truncate">
                  {data.assessmentDate}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Archetype Hero Card */}
          <div className="lg:col-span-5 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/90 via-emerald-950/50 to-slate-900/90 p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-teal-400" /> Profile Archetype
              </span>
              <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-teal-200 border border-teal-500/30">
                RIASEC Synthesized
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400 shrink-0" />
                {data.profileArchetype}
              </h3>
              <p className="mt-2.5 text-xs italic text-teal-200 leading-relaxed border-l-2 border-teal-400/60 pl-3">
                &ldquo;{data.archetypeTagline}&rdquo;
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Orientation: <strong className="text-teal-300">Exploration Focus</strong></span>
              {data.age && <span>Age: <strong className="text-slate-200">{data.age} yrs</strong></span>}
            </div>
          </div>
        </div>
      </div>

      {/* "What this archetype means" Explanation Card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5 md:p-6">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              What the &ldquo;{data.profileArchetype}&rdquo; Archetype Means
            </h4>
            <p className="mt-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Students embodying this archetype combine methodical deduction with tangible problem-solving drive. You thrive when investigating how complex systems operate and applying creative logic to formulate real-world solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
