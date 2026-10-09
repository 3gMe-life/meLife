import React from "react";
import { ReportCounsellorInsightsData } from "../../types/career-report.types";
import { ShieldAlert, Table, Eye, MessageSquare, Award } from "lucide-react";

interface CounsellorInsightsSectionProps {
  data?: ReportCounsellorInsightsData;
}

export const CounsellorInsightsSection: React.FC<CounsellorInsightsSectionProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div id="section-counsellor-insights" className="rounded-2xl border-2 border-amber-500/30 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-md transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                9. Certified Counsellor Diagnostic Insights
              </h2>
              <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                PRACTITIONER ACCESS ONLY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Advanced psychometric dimensional distributions and structured guidance notes
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Notice banner */}
        <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Confidential Guidance Notice:</strong> This section contains granular dimensional scoring and professional observations reserved strictly for certified career counsellors to assist in 1-on-1 student advisory sessions.
        </div>

        {/* Dimensional Scores Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Table className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Dimensional Scale Distributions
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Scale Code</th>
                  <th className="px-4 py-2.5 font-semibold">Dimension Name</th>
                  <th className="px-4 py-2.5 font-semibold">Normalized Score (0-100)</th>
                  <th className="px-4 py-2.5 font-semibold">Readiness Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {(data.detailedDimensionScores || []).map((dim, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2.5 font-mono font-bold text-teal-600 dark:text-teal-400">{dim.code}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-200">{dim.name}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{dim.score}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${dim.score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        dim.band === "High"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : dim.band === "Proficient"
                          ? "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        {dim.band}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Column: Observations, Discussion Points, Interventions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Diagnostic Observations */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Diagnostic Observations
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {(data.assessmentObservations || []).map((obs, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-teal-500 font-bold">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Discussion Prompts */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <MessageSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Exploration Prompts
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {(data.suggestedDiscussionPoints || []).map((pt, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Interventions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Actionable Interventions
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {(data.recommendedInterventions || []).map((inv, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{inv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
