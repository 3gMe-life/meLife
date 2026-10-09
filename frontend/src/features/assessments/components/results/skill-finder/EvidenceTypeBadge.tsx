"use client";

import React from "react";
import { Compass, Activity, Brain, Target } from "lucide-react";

export type EvidenceType =
  | "INTEREST"
  | "SELF_REPORTED_BEHAVIOUR"
  | "DEMONSTRATED_APTITUDE"
  | "DEVELOPMENTAL_HABIT";

interface EvidenceTypeBadgeProps {
  type: EvidenceType;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const EVIDENCE_CONFIG: Record<
  EvidenceType,
  {
    label: string;
    sublabel: string;
    badgeStyle: string;
    icon: React.ReactNode;
  }
> = {
  INTEREST: {
    label: "Interest Alignment",
    sublabel: "What environments attract you",
    badgeStyle:
      "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30",
    icon: <Compass className="w-3.5 h-3.5 shrink-0" />,
  },
  SELF_REPORTED_BEHAVIOUR: {
    label: "Self-Reported Behaviour",
    sublabel: "How you describe your style",
    badgeStyle:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: <Activity className="w-3.5 h-3.5 shrink-0" />,
  },
  DEMONSTRATED_APTITUDE: {
    label: "Current Task Performance",
    sublabel: "Objective task score in session",
    badgeStyle:
      "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    icon: <Brain className="w-3.5 h-3.5 shrink-0" />,
  },
  DEVELOPMENTAL_HABIT: {
    label: "Developmental Habit Indicator",
    sublabel: "Trainable learning habits",
    badgeStyle:
      "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    icon: <Target className="w-3.5 h-3.5 shrink-0" />,
  },
};

export function EvidenceTypeBadge({
  type,
  size = "sm",
  showIcon = true,
  className = "",
}: EvidenceTypeBadgeProps) {
  const config = EVIDENCE_CONFIG[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold font-mono uppercase tracking-wider ${
        config.badgeStyle
      } ${size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs"} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}

export function getScoreDisplayMeta(evidenceType: EvidenceType, score: number, rawScore?: number, maxScore?: number) {
  switch (evidenceType) {
    case "INTEREST":
      return {
        label: "Interest Scale Score",
        semanticText:
          score >= 75
            ? "High Alignment"
            : score >= 50
            ? "Moderate Alignment"
            : "Emerging Exploration",
        tone: "teal",
      };
    case "SELF_REPORTED_BEHAVIOUR":
      return {
        label: "Self-Reported Indicator",
        semanticText:
          score >= 75
            ? "Strongly Reported Style"
            : score >= 50
            ? "Moderately Reported Style"
            : "Developing Habit",
        tone: "emerald",
      };
    case "DEMONSTRATED_APTITUDE":
      return {
        label: "Current Task Performance",
        pointsText: maxScore && maxScore > 0 ? `${rawScore ?? 0} of ${maxScore} points` : undefined,
        semanticText:
          maxScore === 0
            ? "Not Enough Evidence"
            : score >= 75
            ? "High Session Performance"
            : score >= 50
            ? "Moderate Session Performance"
            : score > 0
            ? "Developing Task Evidence"
            : "More Practice Needed",
        tone: "cyan",
      };
    case "DEVELOPMENTAL_HABIT":
      return {
        label: "Developmental Strength Indicator",
        semanticText:
          score >= 75
            ? "Strong Learning Habit"
            : score >= 50
            ? "Active Learning Habit"
            : "Growth Opportunity",
        tone: "amber",
      };
  }
}
