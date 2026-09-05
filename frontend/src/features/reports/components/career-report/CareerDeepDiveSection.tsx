"use client";

import React, { useState } from "react";
import { ReportCareerDeepDiveItem } from "../../types/career-report.types";
import { BookMarked, Sparkles, CheckCircle, GraduationCap, MapPin, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CareerDeepDiveSectionProps {
  deepDives: ReportCareerDeepDiveItem[];
}

export const CareerDeepDiveSection: React.FC<CareerDeepDiveSectionProps> = ({ deepDives }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!deepDives || deepDives.length === 0) return null;

  const currentCareer = deepDives[activeTab] || deepDives[0];

  return (
    <div id="section-deepdives" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Section 06
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
              In-Depth Career Exploration Detail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed breakdown of day-to-day responsibilities, learning roadmaps, and subject choices
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for Top Careers */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {deepDives.map((career, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={career.id || idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                isActive ? "bg-white/20 text-white" : "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}>
                0{idx + 1}
              </span>
              <span>{career.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Career Deep Dive Details */}
      <div className="mt-6 space-y-6">
        {/* Header & Overview */}
        <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-sky-500/5 to-transparent p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {currentCareer.category}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {currentCareer.title}
              </h3>
            </div>

            <Link
              href={`/participant/careers/${currentCareer.slug || currentCareer.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-600 px-3.5 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors shadow-2xs"
            >
              Full Pathway Guide <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-3 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
            {currentCareer.overview}
          </p>
        </div>

        {/* 2-Column Grid: What Professionals Do vs Skills & Subjects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* What Professionals Do */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              What Professionals in this Role Do
            </h4>
            <ul className="mt-3.5 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              {(currentCareer.whatProfessionalsDo || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suitable Subjects & Important Skills */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <GraduationCap className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                Recommended High School Subjects
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {(currentCareer.suitableSubjects || []).map((sub, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Core Capabilities & Key Tools
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {(currentCareer.importantSkills || []).map((sk, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Learning & Progression Roadmap */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
            <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            4-Stage Educational & Career Progression Roadmap
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {(currentCareer.learningRoadmap || []).slice(0, 4).map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-4.5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                    <span>Stage 0{idx + 1}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{step.stage}</span>
                  </div>

                  <h5 className="mt-2 font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                    {step.title}
                  </h5>

                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {step.focusAreas && step.focusAreas.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Key Focus:</div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {step.focusAreas.slice(0, 2).join(", ")}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sample Roles & Future Opportunities */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Sample Job Roles: </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {(currentCareer.sampleRoles || []).join("  •  ")}
            </span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            ✦ High long-term industry growth
          </div>
        </div>
      </div>
    </div>
  );
};
