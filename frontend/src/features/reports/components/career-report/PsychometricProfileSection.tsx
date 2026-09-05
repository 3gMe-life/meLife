import React from "react";
import { ReportPsychometricProfileData } from "../../types/career-report.types";
import { Brain, Hammer, Search, Palette, HeartHandshake, TrendingUp, Layers, Sparkles, Compass } from "lucide-react";

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
    <div id="section-psychometrics" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Section 03
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Psychometric Interest Architecture (RIASEC)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multidimensional occupational interest scores across 6 core domains
          </p>
        </div>
      </div>

      {/* Dominant Orientations Callout Banner */}
      <div className="mt-6 rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-500/10 via-sky-500/5 to-transparent p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <Sparkles className="h-3.5 w-3.5" /> Dominant Occupational Orientations
          </div>
          <div className="text-base md:text-xl font-black text-slate-900 dark:text-white">
            Primary: <span className="text-teal-600 dark:text-teal-400">{data.primaryOrientation}</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Secondary Complement: <span className="font-bold text-slate-800 dark:text-slate-200">{data.secondaryOrientation}</span>
          </div>
        </div>

        <div className="max-w-md text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-teal-500/30 pl-3">
          {data.summary}
        </div>
      </div>

      {/* 6 RIASEC Dimensional Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data.interestClusters || []).map((cluster) => {
          const cfg = CLUSTER_CONFIG[cluster.key] || CLUSTER_CONFIG.builder;

          return (
            <div
              key={cluster.key}
              className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 transition-all hover:shadow-md hover:scale-[1.01] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${cfg.badge}`}>
                      {cfg.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cluster.name}
                      </h3>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">Code: {cluster.code}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {cluster.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                    style={{ width: `${Math.min(100, Math.max(8, cluster.percentage))}%` }}
                  />
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {cluster.clusterTitle}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cluster.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
