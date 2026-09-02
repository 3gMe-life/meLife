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
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#14B8A6]" />
              <span>Export Full PDF Report</span>
            </button>
          }
        />

        {/* Primary Archetype Spotlight Card */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-white/10 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#14B8A6]/20 via-[#2563EB]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                Primary Psychometric Archetype
              </span>
              <h2 className="text-2xl font-black text-white">
                The Analytical Strategist
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Individuals with this profile exhibit high analytical precision, structured problem formulation, and exceptional logical reasoning. You thrive in computational, scientific, and quantitative decision-making environments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0 min-w-[160px]">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">
                92nd
              </span>
              <span className="block text-[11px] font-bold text-slate-300">
                Cognitive Percentile
              </span>
              <span className="block text-[10px] text-emerald-400 font-semibold mt-0.5">
                Top Tier Logic & Math
              </span>
            </div>
          </div>
        </div>

        {/* Dimension Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#2563EB]" />
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
                    <span className="font-semibold text-slate-200">{item.label}</span>
                    <span className="font-mono font-bold text-[#14B8A6]">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#14B8A6]" />
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
                    <span className="font-semibold text-slate-200">{item.label}</span>
                    <span className="font-mono font-bold text-[#2563EB]">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#14B8A6] to-[#2563EB]"
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
