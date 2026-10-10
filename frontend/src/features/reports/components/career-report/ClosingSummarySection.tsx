import React from "react";
import { Compass, Calendar, ArrowRight, Sparkles, BookOpen, FlaskConical, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface ClosingSummarySectionProps {
  studentName: string;
  reportId: string;
  templateVersion?: string;
  evaluationDate?: string;
  assessmentVersion?: string;
}

export const ClosingSummarySection: React.FC<ClosingSummarySectionProps> = ({
  studentName,
  reportId,
  templateVersion = "v1.1-comprehensive",
  evaluationDate,
  assessmentVersion = "3G-ME-v2.4",
}) => {
  return (
    <div id="section-closing" className="space-y-6">
      {/* Inspirational Closing Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-950/80 via-slate-900 to-[#0A1A18] p-8 md:p-10 text-white shadow-xl text-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Exploration Philosophy
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            &ldquo;Your journey is about exploration, not limitation.&rdquo;
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
            Use this report as a dynamic guidance compass for discovering your authentic interests, selecting subject pathways, and building real-world competencies without anxiety.
          </p>
        </div>
      </div>

      {/* 4-Pillar Action Framework */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
          Action Plan
        </div>
        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
          Your Immediate 4-Step Action Framework
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Recommended immediate milestones to translate discoveries into reality
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Explore */}
          <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white font-black text-xs">
                  01
                </span>
                <Compass className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Explore</h4>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Research your recommended career pathways online, read industry publications, and observe day-in-the-life case studies.
              </p>
            </div>
          </div>

          {/* Pillar 2: Learn */}
          <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white font-black text-xs">
                  02
                </span>
                <BookOpen className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </div>
              <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Learn</h4>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Align your upcoming academic subject choices with foundational logic, math, science, and computing curricula.
              </p>
            </div>
          </div>

          {/* Pillar 3: Experiment */}
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white font-black text-xs">
                  03
                </span>
                <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Experiment</h4>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Join school innovation clubs, enter hackathons or essay debates, and build tangible creative or technical projects.
              </p>
            </div>
          </div>

          {/* Pillar 4: Discuss */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
                  04
                </span>
                <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Discuss</h4>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review these discoveries with family mentors and schedule a 1-on-1 advisory session with a guidance counsellor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connect with Counsellor Call-to-Action Card */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0F2926] via-[#133833] to-[#0A1A18] p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
              <Calendar className="h-4 w-4 text-teal-400" /> Next Step Guidance
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Connect with a 3G MeLife Guidance Counsellor
            </h3>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              Transform these assessment discoveries into an individualized educational roadmap. Our career counsellors offer tailored guidance on subject stream selection, university admission requirements, and career milestone planning.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/participant/counsellors"
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-6 py-3.5 text-sm font-black text-slate-950 hover:bg-teal-300 transition-all shadow-lg hover:shadow-teal-500/20 cursor-pointer"
            >
              <span>Book 1-on-1 Session</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Official 3G MeLife Assessment Record & Verification Details */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-5 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Official 3G MeLife Assessment Record &amp; Verification Details
        </div>
        <p className="max-w-2xl mx-auto text-[11px] leading-relaxed">
          Candidate: {studentName} • Evaluation ID: {reportId ? `${reportId.slice(0, 16)}...` : "MELIFE-2026"} • Version: {templateVersion}
          {evaluationDate ? ` • Evaluation Date: ${evaluationDate}` : ""}
          {assessmentVersion ? ` • Assessment Model: ${assessmentVersion}` : ""}
          <br />
          Formulated using the 3G MeLife multidimensional developmental framework. Intended for educational guidance and exploratory planning.
        </p>
        <p className="text-[10px] text-slate-400 italic">
          Confidential educational guidance report. Intended for the student, parent/guardian and authorized guidance professionals.
        </p>
      </div>
    </div>
  );
};
