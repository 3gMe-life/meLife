"use client";

import React from "react";
import { Cpu, ShieldCheck, Zap, Sparkles, Compass, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface FutureWorkAiCompassProps {
  archetypeTitle?: string;
  topTraits?: string[];
  primaryOrientation?: string;
}

export const FutureWorkAiCompass: React.FC<FutureWorkAiCompassProps> = ({
  archetypeTitle = "Systems Explorer & Creative Innovator",
  topTraits = ["Analytical Inquiry", "Creative Synthesis", "Strategic Problem Solving"],
  primaryOrientation = "Investigative-Creator",
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#38BDF8]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>09. Future of Work & AI Readiness Compass</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 print:border-[#00B8D4] print:text-[#008F83]">
              Human + AI Synergy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Thriving in the 2030+ AI Era
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            AI automates repetitive routines; human greatness compounds through curiosity, original synthesis, and nuanced judgement. Here is how your {archetypeTitle} profile stays future-proof.
          </p>
        </div>

        {/* AI Ready Badge */}
        <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto print:hidden">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Readiness Factor
          </div>
          <p className="text-xs font-black text-white mt-0.5">High Future-Proof Quotient</p>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {/* Pillar 1: Irreplaceable Human Moats */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#00BFA5]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-[#00BFA5]/15 text-[#00BFA5]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Human Moat
              </span>
            </div>

            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2 print:text-[#172B2A]">
              Irreplaceable Human Traits
            </h3>
            <p className="text-xs text-[#9FB3B0] leading-relaxed mb-4 print:text-[#526866]">
              Qualities that algorithms cannot replicate—your core differentiator in higher education and professional leadership.
            </p>

            <ul className="space-y-2 text-xs text-[#C5D6D3] print:text-[#2A4442]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                <span><strong>Complex Cross-Domain Synthesis:</strong> Connecting disparate ideas into unified breakthroughs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                <span><strong>Nuanced Ethical Judgement:</strong> Weighing human values, empathy, and social impact.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                <span><strong>Empathetic Storytelling:</strong> Inspiring teammates and stakeholders with authentic vision.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#00C896] font-bold print:border-[#E3ECEA] print:text-[#008F83]">
            Strategic Defense Line
          </div>
        </div>

        {/* Pillar 2: AI-Augmented Multipliers */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#38BDF8]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8]">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                10x Velocity
              </span>
            </div>

            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2 print:text-[#172B2A]">
              AI-Augmented Multipliers
            </h3>
            <p className="text-xs text-[#9FB3B0] leading-relaxed mb-4 print:text-[#526866]">
              How to harness AI tools (LLMs, generative models, algorithmic automation) as cognitive copilots.
            </p>

            <ul className="space-y-2 text-xs text-[#C5D6D3] print:text-[#2A4442]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span><strong>Rapid Hypothesis Testing:</strong> Using AI to generate 10 variations in seconds for evaluation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span><strong>Intelligent Data Querying:</strong> Extracting patterns from massive datasets with natural language.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span><strong>Automated Routine Offloading:</strong> Automating formatting, scheduling, and note synthesis.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#38BDF8] font-bold print:border-[#E3ECEA] print:text-[#0284C7]">
            Supercharged Productivity
          </div>
        </div>

        {/* Pillar 3: 2030+ Horizon Careers */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#EC4899]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-[#EC4899]/15 text-[#EC4899]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Emerging Frontiers
              </span>
            </div>

            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2 print:text-[#172B2A]">
              2030+ Emerging Roles
            </h3>
            <p className="text-xs text-[#9FB3B0] leading-relaxed mb-4 print:text-[#526866]">
              Next-generation career titles emerging at the intersection of your psychometric traits and AI tooling.
            </p>

            <ul className="space-y-2 text-xs text-[#C5D6D3] print:text-[#2A4442]">
              <li className="flex items-start gap-2">
                <span className="text-[#EC4899] font-bold">•</span>
                <span><strong>AI Orchestration Architect:</strong> Designing automated workflows connecting humans and AI models.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EC4899] font-bold">•</span>
                <span><strong>Computational Bio/Materials Designer:</strong> Simulating real-world breakthroughs algorithmically.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EC4899] font-bold">•</span>
                <span><strong>Algorithmic Ethics & Governance Lead:</strong> Ensuring fair, transparent AI deployment in society.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#EC4899] font-bold print:border-[#E3ECEA] print:text-[#DB2777]">
            High Growth Horizons
          </div>
        </div>
      </div>
    </div>
  );
};
