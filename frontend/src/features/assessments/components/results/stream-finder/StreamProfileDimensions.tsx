"use client";

import React from "react";
import { Brain, BookOpen, Lightbulb, Target, Wrench, Compass, Sparkles, Network } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";

interface StreamProfileDimensionsProps {
  result: StreamFinderResult;
}

interface DimensionMetadata {
  icon: any;
  emoji: string;
  themeColor: string;
  badgeLabel: string;
  measuredConstruct: string;
  description: string;
  keySignal: string;
  tag: string;
}

const CONSTRUCT_META: Record<string, DimensionMetadata> = {
  ACADEMIC_INTEREST: {
    icon: BookOpen,
    emoji: "📚",
    themeColor: "#00BFA5",
    badgeLabel: "Measured Dimension",
    measuredConstruct: "Academic Interests & Subject Curiosity",
    description: "Spontaneous curiosity, reading habits, and interest across core secondary academic disciplines.",
    keySignal: "Drives elective subject engagement and classroom attention stamina.",
    tag: "Curiosity",
  },
  PROBLEM_SOLVING: {
    icon: Brain,
    emoji: "🧩",
    themeColor: "#38BDF8",
    badgeLabel: "Measured Dimension",
    measuredConstruct: "Problem-Solving & Reasoning Style",
    description: "How you naturally approach multi-step challenges, empirical puzzles, and structured reasoning.",
    keySignal: "Highlights conceptual logic, spatial modeling, or verbal deduction preferences.",
    tag: "Logic & Ideas",
  },
  LEARNING_STYLE: {
    icon: Lightbulb,
    emoji: "💡",
    themeColor: "#F59E0B",
    badgeLabel: "Measured Dimension",
    measuredConstruct: "Learning Preferences & Sensory Environment",
    description: "Preferred sensory mode, pacing, and learning environment for absorbing and retaining complex concepts.",
    keySignal: "Shows whether you learn fastest through diagrams, active building, or deep reflective reading.",
    tag: "Reflection",
  },
  CAREER_ORIENTATION: {
    icon: Target,
    emoji: "🎯",
    themeColor: "#EC4899",
    badgeLabel: "Measured Dimension",
    measuredConstruct: "Career Orientation & Impact Values",
    description: "Long-term work environments, societal contributions, and vocational cultures you find meaningful.",
    keySignal: "Connects classroom subject learning to broader professional cultures and real-world impact.",
    tag: "People & Impact",
  },
  APTITUDE_PREFERENCE: {
    icon: Compass,
    emoji: "🧠",
    themeColor: "#10B981",
    badgeLabel: "Measured Dimension",
    measuredConstruct: "Aptitude Preference & Forced-Choice Inclination",
    description: "Intuitive preferences revealed when forced to prioritize between competing academic tasks.",
    keySignal: "Reveals where your attention gravitates under equal-value choice scenarios.",
    tag: "Aptitude",
  },
  SITUATIONAL_INDICATORS: {
    icon: Wrench,
    emoji: "🛠",
    themeColor: "#8B5CF6",
    badgeLabel: "Measured Dimension",
    measuredConstruct: "Situational Stream & Decision Indicators",
    description: "Applied decision-making patterns in practical team, lab, workshop, and project scenarios.",
    keySignal: "Translates abstract subject inclinations into tangible real-world execution.",
    tag: "Practical Action",
  },
};

export const StreamProfileDimensions: React.FC<StreamProfileDimensionsProps> = ({ result }) => {
  const sections = result.sectionBreakdown || [];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] flex flex-col justify-between space-y-3.5 print:space-y-2.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Brain className="w-3.5 h-3.5" />
              <span>03. Profile Dimensions & Synthesis</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Your Profile at a Glance
          </h3>
          <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Detailed breakdown of the 6 psychometrically evaluated dimensions forming the evidence foundation of your stream alignment.
          </p>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto print:border-[#00B8D4] print:text-[#008F83]">
          6 Evaluated Constructs
        </span>
      </div>

      {/* Profile Constellation Visual */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden print:bg-[#F7FAF9] print:border-[#E3ECEA] print:p-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#00C896] flex items-center gap-1.5 print:text-[#008F83]">
                <Network className="w-3 h-3" />
                <span>Derived Profile Signals</span>
              </span>
              <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70 print:border-[#E3ECEA] print:text-[#688582]">
                Integrated Network
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-white print:text-[#172B2A]">
              Synergistic Cognitive Map
            </h4>
            <p className="text-[11px] text-[#9FB3B0] leading-snug print:text-[#526866]">
              Your stream alignment emerges from the synergy across curiosity, problem-solving habits, learning preferences, and vocational values.
            </p>
          </div>

          {/* SVG Constellation Chart */}
          <div className="w-full max-w-[240px] h-[110px] flex items-center justify-center relative">
            <svg viewBox="0 0 280 140" className="w-full h-full">
              {/* Connecting orbit lines */}
              <line x1="140" y1="18" x2="230" y2="48" stroke="#00BFA5" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="230" y1="48" x2="210" y2="115" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="210" y1="115" x2="70" y2="115" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="70" y1="115" x2="50" y2="48" stroke="#EC4899" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="50" y1="48" x2="140" y2="18" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />

              {/* Radial spokes to center */}
              <line x1="140" y1="70" x2="140" y2="18" stroke="#00BFA5" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="140" y1="70" x2="230" y2="48" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="140" y1="70" x2="210" y2="115" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="140" y1="70" x2="70" y2="115" stroke="#EC4899" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="140" y1="70" x2="50" y2="48" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />

              {/* Center Profile Hub */}
              <circle cx="140" cy="70" r="20" fill="#0B1B19" stroke="#00BFA5" strokeWidth="2" />
              <text x="140" y="68" textAnchor="middle" fill="#00C896" fontSize="7" fontWeight="bold">YOUR</text>
              <text x="140" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">PROFILE</text>

              {/* Nodes */}
              <circle cx="140" cy="18" r="6" fill="#00BFA5" />
              <text x="140" y="10" textAnchor="middle" fill="#00C896" fontSize="6" fontWeight="bold">CURIOSITY</text>

              <circle cx="230" cy="48" r="6" fill="#38BDF8" />
              <text x="235" y="60" textAnchor="middle" fill="#38BDF8" fontSize="6" fontWeight="bold">LOGIC</text>

              <circle cx="210" cy="115" r="6" fill="#F59E0B" />
              <text x="215" y="130" textAnchor="middle" fill="#F59E0B" fontSize="6" fontWeight="bold">LEARNING</text>

              <circle cx="70" cy="115" r="6" fill="#EC4899" />
              <text x="65" y="130" textAnchor="middle" fill="#EC4899" fontSize="6" fontWeight="bold">VALUES</text>

              <circle cx="50" cy="48" r="6" fill="#10B981" />
              <text x="45" y="60" textAnchor="middle" fill="#10B981" fontSize="6" fontWeight="bold">ACTION</text>
            </svg>
          </div>
        </div>
      </div>

      {/* 6 Dimension Cards Grid (2 columns on desktop/print for balanced vertical height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 relative z-10">
        {sections.map((sec, idx) => {
          const meta = CONSTRUCT_META[sec.sectionCode] || {
            icon: Sparkles,
            emoji: "✨",
            themeColor: "#00BFA5",
            badgeLabel: "Dimension",
            measuredConstruct: sec.sectionName,
            description: "Evaluates your response patterns and learning inclinations.",
            keySignal: "Informs your holistic profile synthesis.",
            tag: "Insight",
          };
          const Icon = meta.icon;

          return (
            <div
              key={sec.sectionCode || idx}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00BFA5]/40 transition-all flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{meta.emoji}</span>
                    <div
                      className="p-1 rounded-lg"
                      style={{ backgroundColor: `${meta.themeColor}20`, color: meta.themeColor }}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <span className="text-[8.5px] font-mono text-white/40 uppercase tracking-wider print:text-[#688582]">
                    Dimension 0{idx + 1}
                  </span>
                </div>

                <h4 className="text-[11.5px] font-black text-white mb-0.5 print:text-[#172B2A]">
                  {meta.measuredConstruct}
                </h4>
                <p className="text-[10px] text-[#C5D6D3] leading-snug mb-1.5 print:text-[#415654]">
                  {meta.description}
                </p>
              </div>

              <div className="pt-1 border-t border-white/5 text-[9.5px] text-[#00C896] font-medium leading-tight flex items-start gap-1 print:border-[#E3ECEA] print:text-[#008F83]">
                <span>💡</span>
                <span>{meta.keySignal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
