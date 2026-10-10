import React from "react";
import { ReportDevelopmentPlanData, ReportDevelopmentSkillItem } from "../../types/career-report.types";
import { Target, CheckSquare, Activity, Sparkles } from "lucide-react";

interface DevelopmentPlanSectionProps {
  data: ReportDevelopmentPlanData;
}

export const DevelopmentPlanSection: React.FC<DevelopmentPlanSectionProps> = ({ data }) => {
  return (
    <div id="section-development" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Section 07
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Actionable Skill &amp; Competency Development Plan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Personalized growth guidance derived from your point-in-time assessment profile
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Developmental Overview Banner */}
        <div className="rounded-2xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/50 dark:bg-teal-950/20 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1.5">
            <Sparkles className="h-4 w-4 text-teal-600" />
            Developmental Growth Strategy
          </div>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {data.summary}
          </p>
        </div>

        {/* Development Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(data.skillsToStrengthen || []).map((skill: ReportDevelopmentSkillItem, idx: number) => {
            const hasStructuredGuidance = Boolean(skill.suggestedPractice || skill.realWorldActivity);

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                      {skill.skillName}
                    </h3>
                  </div>

                  {/* Level & Evidence Tag */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-[10px] font-bold">
                      {skill.currentLevel}
                      {skill.currentScore !== undefined && ` (${skill.currentScore}/100)`}
                    </span>
                    {skill.evidenceSource && (
                      <span className="rounded-md bg-teal-100/60 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 px-2 py-0.5 text-[9px] font-semibold uppercase">
                        {skill.evidenceSource.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>

                  {/* Why Selected */}
                  {skill.whySelected && (
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 not-italic block mb-0.5 text-[10px] uppercase tracking-wider">Focus Rationale:</span>
                      {skill.whySelected}
                    </div>
                  )}

                  {/* Action Steps / Structured Practice */}
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                      <CheckSquare className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      {hasStructuredGuidance ? "Suggested Practice Routine:" : "Action Steps:"}
                    </div>
                    {skill.suggestedPractice ? (
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {skill.suggestedPractice}
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {(skill.howToImprove || []).map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5">
                            <span className="text-teal-500 font-bold">•</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Real World Activity / Suggested Activities */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                      {hasStructuredGuidance ? "Real-World Application:" : "Suggested Activities:"}
                    </div>
                    {skill.realWorldActivity ? (
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {skill.realWorldActivity}
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {(skill.suggestedActivities || []).map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-1.5">
                            <span className="text-sky-500 font-bold">•</span>
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
