"use client";

import React from "react";
import { ReportPsychometricProfileData } from "../../types/career-report.types";
import { Brain, Hammer, Search, Palette, HeartHandshake, TrendingUp, Layers, Sparkles, Compass } from "lucide-react";
import { RiasecRadarMap } from "../visual/RiasecRadarMap";

interface PsychometricProfileSectionProps {
  data: ReportPsychometricProfileData;
}

const CLUSTER_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; badge: string; border: string; bg: string; bar: string }
> = {
  builder: {
    icon: <Hammer className="h-4 w-4" />,
    color: "text-teal-600 dark:text-teal-400",
    badge: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    border: "border-teal-200 dark:border-teal-900/60",
    bg: "bg-teal-50/40 dark:bg-teal-950/20",
    bar: "bg-teal-500",
  },
  explorer: {
    icon: <Search className="h-4 w-4" />,
    color: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    border: "border-sky-200 dark:border-sky-900/60",
    bg: "bg-sky-50/40 dark:bg-sky-950/20",
    bar: "bg-sky-500",
  },
  creator: {
    icon: <Palette className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    border: "border-purple-200 dark:border-purple-900/60",
    bg: "bg-purple-50/40 dark:bg-purple-950/20",
    bar: "bg-purple-500",
  },
  helper: {
    icon: <HeartHandshake className="h-4 w-4" />,
    color: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    border: "border-rose-200 dark:border-rose-900/60",
    bg: "bg-rose-50/40 dark:bg-rose-950/20",
    bar: "bg-rose-500",
  },
  leader: {
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    border: "border-amber-200 dark:border-amber-900/60",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
    bar: "bg-amber-500",
  },
  organizer: {
    icon: <Layers className="h-4 w-4" />,
    color: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    border: "border-emerald-200 dark:border-emerald-900/60",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
    bar: "bg-emerald-500",
  },
};

export const PsychometricProfileSection: React.FC<PsychometricProfileSectionProps> = ({ data }) => {
  return (
    <div id="section-psychometrics" className="space-y-6">
      {/* Interactive Hexagon Radar Map */}
      <RiasecRadarMap
        clusters={data.interestClusters || []}
        primaryOrientation={data.primaryOrientation}
        secondaryOrientation={data.secondaryOrientation}
        summary={data.summary}
      />
    </div>
  );
};
