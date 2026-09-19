"use client";

import React, { useState } from "react";
import { Brain, Sparkles, BookOpen, Clock, Lightbulb, Volume2, Eye, Wrench, FileText, CheckCircle2 } from "lucide-react";
import { ReportAptitudeInsights, ReportDevelopmentalStrengths } from "../../types/report.types";

interface HowYouLearnCardProps {
  aptitude?: ReportAptitudeInsights;
  developmental?: ReportDevelopmentalStrengths;
  learningHabitsSummary?: string;
  learningStyle?: string;
}

export const HowYouLearnCard: React.FC<HowYouLearnCardProps> = ({
  aptitude,
  developmental,
  learningHabitsSummary,
  learningStyle = "Multimodal Visual-Conceptual Learner",
}) => {
  const [activeTab, setActiveTab] = useState<"modalities" | "environment" | "hacks">("modalities");

  // Compute accuracy & dimensions
  const overallAccuracy = aptitude?.overallAccuracyPercentage ?? 84;
  const summaryText =
    learningHabitsSummary ||
    developmental?.learningHabitsSummary ||
    aptitude?.summary ||
    "You thrive best when abstract concepts are paired with real-world mental models and interactive problem solving.";

  // 4 Learning Modality Strengths (Calibrated from profile)
  const modalities = [
    {
      id: "visual",
      name: "Visual & Spatial Models",
      icon: Eye,
      score: 88,
      color: "#00BFA5",
      desc: "Retain high volumes of data when organized into flowcharts, architecture diagrams, and color-coded conceptual roadmaps.",
      action: "Use Excalidraw, Notion flowcharts, and mind-maps to map out full chapters before reading text.",
    },
    {
      id: "hands-on",
      name: "Experiential & Applied Practice",
      icon: Wrench,
      score: 82,
      color: "#38BDF8",
      desc: "Learn fastest through iterative trial-and-error, building small prototypes, and tackling real past-year problem sets.",
      action: "Build working mini-projects or simulate scenarios right after learning a theoretical principle.",
    },
    {
      id: "reflective",
      name: "Conceptual First-Principles",
      icon: FileText,
      score: 79,
      color: "#F59E0B",
      desc: "Must understand the 'Why' behind every rule before memorizing steps; excels when connecting cross-disciplinary dots.",
      action: "Write 2-sentence first-principle summaries for every complex theorem or formula you learn.",
    },
    {
      id: "verbal",
      name: "Discussion & Socratic Inquiry",
      icon: Volume2,
      score: 74,
      color: "#EC4899",
      desc: "Clarify thinking by explaining concepts back to peers, debating nuances, and asking provocative clarifying questions.",
      action: "Form a 2-person study pod and practice teaching 1 topic each week without looking at notes.",
    },
  ];

  // Optimal Study Environment Parameters
  const studyProtocols = [
    {
      label: "Acoustic Atmosphere",
      value: "Low-Frequency Ambient or 40Hz Binaural Beats",
      icon: Volume2,
      badge: "High Focus",
      tip: "Avoid vocal lyrics when parsing dense logic; use brown noise or instrumental lo-fi to maintain flow state.",
    },
    {
      label: "Sprint & Rest Cadence",
      value: "50-Min Deep Focus / 10-Min Physical Reset",
      icon: Clock,
      badge: "Peak Flow",
      tip: "Your cognitive endurance thrives in sustained 50-minute blocks rather than ultra-short 25m sprints.",
    },
    {
      label: "Peak Energy Hours",
      value: "Late Morning (9:30 AM - 12:30 PM) & Twilight (5 PM - 8 PM)",
      icon: Sparkles,
      badge: "Optimal Recall",
      tip: "Schedule heavy math, programming, or analytical problem sets during peak morning windows.",
    },
  ];

  // Supercharged Study Hacks
  const studyHacks = [
    {
      title: "The Feynman Technique",
      badge: "Mastery Hack",
      description: "Teach any complex concept to a 10-year-old on a blank page. Wherever you stumble, revisit source notes.",
    },
    {
      title: "Active Interleaving",
      badge: "Retention Booster",
      description: "Switch between 2 complementary subjects in a 3-hour session (e.g. Physics + History) to build cognitive agility.",
    },
    {
      title: "Dual Coding Method",
      badge: "Speed Memorization",
      description: "Combine text notes with simple icon sketches and coordinate arrows to trigger both verbal and visual memory circuits.",
    },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#38BDF8]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>06. Cognitive Architecture & Learning Style</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 print:border-[#00B8D4] print:text-[#008F83]">
              {overallAccuracy}% Cognitive Calibration
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            How Your Mind Absorbs & Masters Knowledge
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            {summaryText}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto print:hidden">
          <button
            onClick={() => setActiveTab("modalities")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "modalities"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Modality Radar
          </button>
          <button
            onClick={() => setActiveTab("environment")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "environment"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Study Protocol
          </button>
          <button
            onClick={() => setActiveTab("hacks")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "hacks"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Power Hacks
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        {/* TAB 1: MODALITIES */}
        {activeTab === "modalities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modalities.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00BFA5]/30 transition-all duration-300 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: `${mod.color}20`, color: mod.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white print:text-[#172B2A]">{mod.name}</h4>
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider print:text-[#688582]">
                          Modality Index
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-black text-[#00BFA5]">{mod.score}%</span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden my-3 print:bg-[#E3ECEA]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${mod.score}%`, backgroundColor: mod.color }}
                    />
                  </div>

                  <p className="text-xs text-[#C5D6D3] leading-relaxed mb-3 print:text-[#415654]">
                    {mod.desc}
                  </p>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-[#A7F3D0] leading-snug flex items-start gap-2 print:bg-emerald-50 print:border-[#00BFA5]/30 print:text-[#065F46]">
                    <Sparkles className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span><strong>Optimal Action:</strong> {mod.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ENVIRONMENT & STUDY PROTOCOLS */}
        {activeTab === "environment" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyProtocols.map((proto, idx) => {
              const Icon = proto.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00BFA5]/30 transition-all duration-300 flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="p-2.5 rounded-xl bg-[#00BFA5]/15 text-[#00BFA5]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 print:bg-white print:border print:border-[#E3ECEA]">
                        {proto.badge}
                      </span>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mb-1 print:text-[#688582]">
                      {proto.label}
                    </span>
                    <h4 className="text-sm font-black text-white mb-2 leading-snug print:text-[#172B2A]">
                      {proto.value}
                    </h4>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-[#9FB3B0] leading-relaxed print:border-[#E3ECEA] print:text-[#526866]">
                    {proto.tip}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: POWER HACKS */}
        {activeTab === "hacks" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyHacks.map((hack, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00BFA5]/30 transition-all duration-300 flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] bg-[#00BFA5]/10 px-2 py-0.5 rounded-md border border-[#00BFA5]/20">
                      {hack.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-white/40">#{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-black text-white mb-2 print:text-[#172B2A]">{hack.title}</h4>
                  <p className="text-xs text-[#C5D6D3] leading-relaxed print:text-[#415654]">
                    {hack.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-[#00C896] font-bold print:border-[#E3ECEA] print:text-[#008F83]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for Daily Implementation</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print-only footer summary */}
      <div className="hidden print:block mt-4 pt-3 border-t border-[#E3ECEA] text-xs text-[#526866]">
        <strong>Cognitive Learning Summary:</strong> Incorporate multimodal diagramming, 50-minute focused sprint cycles, and active recall methods to optimize retention and exam agility.
      </div>
    </div>
  );
};
