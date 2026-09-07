"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LongitudinalComparisonResult } from "../../types/assessment.types";
import { GrowthComparisonCard } from "./GrowthComparisonCard";
import { DimensionGrowthChart } from "./DimensionGrowthChart";
import { GrowthInsightsCard } from "./GrowthInsightsCard";
import {
  Compass,
  Activity,
  Brain,
  Target,
  Printer,
  ArrowRight,
  TrendingUp,
  History,
} from "lucide-react";

interface AssessmentComparisonViewProps {
  comparison: LongitudinalComparisonResult;
  assessmentCode?: string;
}

type ComparisonSectionTab = "all" | "interests" | "skills" | "aptitude" | "strengths";

export function AssessmentComparisonView({
  comparison,
  assessmentCode = "skill-finder",
}: AssessmentComparisonViewProps) {
  const [activeSection, setActiveSection] = useState<ComparisonSectionTab>("all");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 print:p-0 print:space-y-6">
      {/* 1. Executive Synthesis Card */}
      <GrowthComparisonCard comparison={comparison} />

      {/* 2. Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <Link
            href={`/participant/results/${comparison.oldResultId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#00B8D4]" />
            <span>View Previous Attempt Report</span>
          </Link>
          <Link
            href={`/participant/results/${comparison.newResultId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00BFA5]/10 hover:bg-[#00BFA5]/20 border border-[#00BFA5]/30 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] transition-all"
          >
            <span>View Latest Attempt Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#172B2A] hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-[#728B88]" />
          <span>Print Comparison Report</span>
        </button>
      </div>

      {/* 3. Top Gains & Psychological Insights */}
      <GrowthInsightsCard
        topGains={comparison.topGains}
        narrativeInsights={comparison.narrativeInsights}
      />

      {/* 4. Section Filter Tabs (Screen Only) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] print:hidden">
        <button
          type="button"
          onClick={() => setActiveSection("all")}
          className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "all"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5"
          }`}
        >
          All Construct Layers
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("interests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "interests"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Interests (RIASEC)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("skills")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "skills"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Skill Behaviours</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("aptitude")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "aptitude"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Cognitive Aptitude</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("strengths")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "strengths"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5"
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Developmental Habits</span>
        </button>
      </div>

      {/* 5. Construct Layer Charts */}
      <div className="space-y-6">
        {(activeSection === "all" || activeSection === "interests") && (
          <DimensionGrowthChart
            title="Section A: RIASEC Interest Orientation"
            subtitle="Comparing vocational interest alignments across the 6 Holland domains"
            dimensions={comparison.interestComparison}
          />
        )}

        {(activeSection === "all" || activeSection === "skills") && (
          <DimensionGrowthChart
            title="Section B: Skill Behaviours & Natural Instincts"
            subtitle="Evaluating growth across practical execution, diagnostic inquiry, and collaboration"
            dimensions={comparison.skillsComparison}
          />
        )}

        {(activeSection === "all" || activeSection === "aptitude") && (
          <DimensionGrowthChart
            title="Section C: Demonstrated Cognitive Aptitude"
            subtitle="Longitudinal performance across spatial, numerical, verbal, and mechanical reasoning"
            dimensions={comparison.aptitudeComparison}
          />
        )}

        {(activeSection === "all" || activeSection === "strengths") && (
          <DimensionGrowthChart
            title="Section D: Developmental Strengths & Learning Habits"
            subtitle="Changes in goal orientation, self-directed exploration, and resilience"
            dimensions={comparison.strengthsComparison}
          />
        )}
      </div>

      {/* 6. Career Guidance Exploration Next Steps Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1E1D] to-slate-900 border border-[#00BFA5]/30 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00BFA5]/20 px-3 py-1 text-xs font-bold text-[#00BFA5] border border-[#00BFA5]/40">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Developmental Pathway Alignment</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Apply Your Growth Insights to Career Pathways
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your latest assessment updates your career matching algorithms and recommended focus pathways.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <Link
            href="/participant/career-reports"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs md:text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>View Updated Career Report</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/participant/counsellor"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Consult Counsellor</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
