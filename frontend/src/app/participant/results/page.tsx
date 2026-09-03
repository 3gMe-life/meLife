"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { BrainCircuit, Sparkles, Download } from "lucide-react";

export default function ParticipantResultsPage() {
  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <div className="space-y-6">
        <PageHeader
          title="Psychometric Results & Analytics"
          subtitle="In-depth analysis of your cognitive aptitude, Big Five behavioral dimensions, and vocational interests."
          badge="Calibrated"
          badgeColor="emerald"
          actionElement={
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/20 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-[#00B8D4]" />
              <span>Export Full PDF Report</span>
            </button>
          }
        />

        {/* Primary Archetype Spotlight Card */}
        <div className="rounded-3xl bg-gradient-to-r from-white via-[#F7FAF9] to-[#EBF2F0] dark:from-[#172B2A] dark:via-[#172B2A]/95 dark:to-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-8 relative overflow-hidden shadow-xs dark:shadow-none transition-colors duration-200">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#00BFA5]/10 dark:from-[#00BFA5]/20 via-[#00B8D4]/10 dark:via-[#00B8D4]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
                Primary Psychometric Archetype
              </span>
              <h2 className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                The Analytical Strategist
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Individuals with this profile exhibit high analytical precision, structured problem formulation, and exceptional logical reasoning. You thrive in computational, scientific, and quantitative decision-making environments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-center shrink-0 min-w-[160px] shadow-xs">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D4] to-[#00BFA5]">
                92nd
              </span>
              <span className="block text-[11px] font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Cognitive Percentile
              </span>
              <span className="block text-[10px] text-[#008F83] dark:text-[#00C896] font-semibold mt-0.5">
                Top Tier Logic & Math
              </span>
            </div>
          </div>
        </div>

        {/* Dimension Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 space-y-4 shadow-xs dark:shadow-none transition-colors duration-200">
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#00B8D4]" />
              <span>Cognitive Dimension Scores</span>
            </h3>

            <div className="space-y-4 pt-1">
              {[
                { label: "Quantitative Reasoning", score: 94, category: "Exceptional" },
                { label: "Abstract Logic & Patterns", score: 91, category: "Exceptional" },
                { label: "Spatial Visualization", score: 85, category: "Strong" },
                { label: "Verbal Precision & Fluency", score: 82, category: "Proficient" },
                { label: "Processing Speed & Focus", score: 88, category: "Strong" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">{item.label}</span>
                    <span className="font-mono font-bold text-[#008F83] dark:text-[#00BFA5]">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 space-y-4 shadow-xs dark:shadow-none transition-colors duration-200">
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00BFA5]" />
              <span>Behavioral & Work Style Traits</span>
            </h3>

            <div className="space-y-4 pt-1">
              {[
                { label: "Conscientiousness & Discipline", score: 89, category: "High" },
                { label: "Openness to Novel Ideas", score: 87, category: "High" },
                { label: "Emotional Resilience & Calm", score: 84, category: "Strong" },
                { label: "Collaborative Team Synergy", score: 78, category: "Proficient" },
                { label: "Autonomy & Independent Drive", score: 92, category: "Exceptional" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">{item.label}</span>
                    <span className="font-mono font-bold text-[#008F83] dark:text-[#00BFA5]">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00BFA5] to-[#008F83]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
