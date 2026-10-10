"use client";

import React from "react";
import { ReportMethodologyData } from "../../types/career-report.types";
import { BookOpen, ShieldCheck, Info, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

interface TaxonomyDisplayItem {
  source: string;
  name?: string;
  label?: string;
  description: string;
  reliabilityNote?: string;
}

interface MethodologySectionProps {
  data?: ReportMethodologyData;
  reportId?: string;
  templateVersion?: string;
  studentName?: string;
  generatedDate?: string;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  data,
  reportId,
  templateVersion = "v1.1-comprehensive",
  studentName,
  generatedDate,
}) => {
  const meta = data?.reportMetadata || {
    assessmentVersion: "3G-ME-v2.4",
    scoringVersion: "ME-SCORING-2026.1",
    careerTaxonomyVersion: "ONET-ME-2026",
    reportTemplateVersion: templateVersion,
    generatedAt: generatedDate || new Date().toISOString(),
    studentName,
    reportId,
  };

  const defaultTaxonomy = [
    {
      source: "INTEREST_EVIDENCE",
      name: "Interest Evidence (RIASEC)",
      description: "Self-expressed engagement and curiosity across realistic, investigative, artistic, social, enterprising, and conventional spheres.",
      reliabilityNote: "Reflects preference orientation, not aptitude or innate ceiling.",
    },
    {
      source: "DEMONSTRATED_TASK_PERFORMANCE",
      name: "Demonstrated Task Performance",
      description: "Objective cognitive and analytical task performance captured through standardized problem-solving exercises.",
      reliabilityNote: "Direct point-in-time performance indicator subject to practice effect.",
    },
    {
      source: "SELF_REPORTED_BEHAVIOUR",
      name: "Self-Reported Behaviour",
      description: "Structured self-assessment of collaboration, communication, and interpersonal working styles.",
      reliabilityNote: "Represents perceived working tendencies and self-efficacy.",
    },
    {
      source: "DEVELOPMENTAL_HABIT",
      name: "Developmental Habits",
      description: "Self-assessed study strategies, persistence, time management, and curiosity routines.",
      reliabilityNote: "Dynamic and cultivable through intentional coaching and structured practice.",
    },
  ];

  const taxonomyItems: TaxonomyDisplayItem[] = (
    data?.evidenceTaxonomy && data.evidenceTaxonomy.length > 0
      ? data.evidenceTaxonomy
      : defaultTaxonomy
  ) as TaxonomyDisplayItem[];

  return (
    <div id="section-methodology" className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Section 10
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
              Understanding Your Results & Methodology
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent psychometric principles, multi-source evidence taxonomy, and interpretation guidelines
            </p>
          </div>
        </div>
      </div>

      {/* What This Assessment Measures */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
          <Info className="h-4 w-4" /> Assessment Scope
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
          What This Assessment Measures
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {data?.whatThisMeasures ||
            "The 3G MeLife platform captures a multidimensional developmental snapshot spanning self-reported occupational interests (RIASEC), objective problem-solving task demonstrations, collaborative behavioral indicators, and growth-oriented study habits. It evaluates your current alignment with modern career families to guide informed academic and career exploration."}
        </p>

        {/* Evidence Sources Taxonomy */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Multidimensional Evidence Sources Taxonomy
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxonomyItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200/50 dark:border-teal-900/50">
                    {item.source}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white pt-1">
                  {item.name || item.label || item.source}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                {Boolean(item.reliabilityNote) && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                    Note: {item.reliabilityNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alignment Terminology & What Scores Do Not Mean */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What Career Alignment Means */}
        <div className="rounded-3xl border border-teal-200/60 dark:border-teal-900/40 bg-teal-50/30 dark:bg-teal-950/20 p-6 md:p-7 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            <CheckCircle2 className="h-4 w-4" /> Career Alignment Scores
          </div>
          <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
            What Career Alignment Means
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {data?.whatCareerAlignmentMeans ||
              "Career Alignment Scores indicate relative alignment between the student's current assessment profile and ME LIFE career reference profiles. They are exploratory indicators, not probabilities of future success."}
          </p>
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-teal-200 dark:border-teal-900/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A score of 88/100 reflects strong multi-factor synergy between current interests, aptitude tasks, and career demands—not a guarantee of employment or academic ease.
          </div>
        </div>

        {/* What Scores Do NOT Mean */}
        <div className="rounded-3xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 p-6 md:p-7 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4" /> Critical Boundaries
          </div>
          <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
            What These Scores Do NOT Mean
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {(data?.whatScoresDoNotMean || [
              "Scores are not fixed life verdicts or immutable trait determinations.",
              "They do not define a student's upper limit or ceiling in any academic discipline.",
              "They do not substitute for formal academic grades, teacher observations, or school exam results.",
              "They should never be used to discourage a student from pursuing genuine passions or ambitions.",
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Role of Academic Performance & Real-World Exploration */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">
          Contextual Factors in Longitudinal Development
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Role of Academic Effort
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {data?.roleOfAcademicPerformance ||
                "School performance, study habits, and curriculum rigor are primary drivers of university eligibility. Psychometric guidance informs direction; disciplined academics creates opportunity."}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Real-World Exploration
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {data?.roleOfRealWorldExploration ||
                "Internships, club projects, hackathons, and mentor discussions test real interest better than tests alone. Practical exposure turns paper alignment into lived conviction."}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              When to Review Results Again
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {data?.whenToReviewAgain ||
                "Students develop rapidly between Grades 8 and 12. We recommend recalibrating assessment profiles every 12 to 18 months, or prior to crucial stream/subject selection points."}
            </p>
          </div>
        </div>
      </div>

      {/* Official 3G MeLife Assessment Record & Verification Details */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 p-5 md:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Official 3G MeLife Assessment Record &amp; Verification Details
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Candidate</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{meta.studentName || studentName || "Student"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assessment Model</span>
            <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">{meta.assessmentVersion || "3G-ME-v2.4"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Report Template</span>
            <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">{meta.reportTemplateVersion || templateVersion}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Taxonomy Version</span>
            <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">{meta.careerTaxonomyVersion || "ONET-ME-2026"}</span>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            <span>Report ID: </span>
            <span className="font-mono text-[10px]">{reportId || "MELIFE-CAREER-REPORT"}</span>
          </div>
          <div className="italic text-[10px]">
            Confidential educational guidance report. Intended for student, parent/guardian and authorized guidance professionals.
          </div>
        </div>
      </div>
    </div>
  );
};
