"use client";

import React from "react";
import { Search, Filter, Languages, Sparkles } from "lucide-react";
import { CounsellorFilterParams } from "../types/counsellor.types";

interface CounsellorFilterBarProps {
  filters: CounsellorFilterParams;
  onChange: (filters: CounsellorFilterParams) => void;
  isAssessed?: boolean;
}

const SPECIALISATIONS = [
  { value: "ALL", label: "All Specialisations" },
  { value: "STEM & AI Engineering", label: "STEM & AI Engineering" },
  { value: "Business & Management", label: "Business & Management" },
  { value: "Creative Arts & Design", label: "Creative Arts & Design" },
  { value: "Healthcare & Medicine", label: "Healthcare & Medicine" },
  { value: "College & Stream Selection", label: "College & Stream Selection" },
  { value: "Psychometrics & Cognitive Growth", label: "Psychometrics & Cognitive Growth" },
];

const LANGUAGES = [
  { value: "ALL", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Hindi", label: "Hindi" },
  { value: "Arabic", label: "Arabic" },
  { value: "Tamil", label: "Tamil" },
  { value: "Kannada", label: "Kannada" },
];

export const CounsellorFilterBar: React.FC<CounsellorFilterBarProps> = ({
  filters,
  onChange,
  isAssessed,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search counsellors by name, qualification, or domain..."
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-850"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Specialisation Select */}
        <div className="relative min-w-[170px]">
          <select
            value={filters.specialisation || "ALL"}
            onChange={(e) => onChange({ ...filters, specialisation: e.target.value })}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-xs focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {SPECIALISATIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Language Select */}
        <div className="relative min-w-[140px]">
          <select
            value={filters.language || "ALL"}
            onChange={(e) => onChange({ ...filters, language: e.target.value })}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-xs focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <Languages className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Reset / Status Indicator */}
        {isAssessed && (
          <div className="hidden items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 lg:flex">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Ranked</span>
          </div>
        )}
      </div>
    </div>
  );
};
