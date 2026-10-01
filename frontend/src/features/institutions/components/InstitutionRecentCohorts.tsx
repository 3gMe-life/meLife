"use client";

import React from "react";
import Link from "next/link";
import { School, Users, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import { InstitutionClass } from "../types/institution.types";

interface InstitutionRecentCohortsProps {
  classes: InstitutionClass[];
  onOpenCreateClass: () => void;
}

export const InstitutionRecentCohorts: React.FC<InstitutionRecentCohortsProps> = ({
  classes,
  onOpenCreateClass,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Active Classes / Cohorts
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Recent batches registered for psychometric tracking
              </p>
            </div>
          </div>
          <Link
            href="/institution/classes"
            className="flex items-center gap-1 text-xs font-bold text-[#00BFA5] hover:text-[#008F83] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {classes.length === 0 ? (
          <div className="py-8 text-center bg-[#F7FAF9] dark:bg-[#172B2A] rounded-2xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6">
            <School className="w-10 h-10 text-[#728B88] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              No classes created yet
            </p>
            <p className="text-[11px] text-[#728B88] mb-4">
              Set up your first grade section or student cohort.
            </p>
            <button
              onClick={onOpenCreateClass}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#00BFA5] text-[#0A1A18] hover:bg-[#00A892] transition-colors shadow-xs"
            >
              <span>Create First Cohort</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] hover:border-[#00BFA5]/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#728B88] uppercase leading-none">
                      {cls.division.slice(0, 3)}
                    </span>
                    <span className="text-xs font-black text-[#172B2A] dark:text-[#F7FAF9] leading-tight">
                      {cls.gradeLevel.replace("Grade ", "")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors line-clamp-1">
                      {cls.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
                      <span>{cls.academicYear}</span>
                      {cls.coordinatorName && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[140px]">
                            Coord: {cls.coordinatorName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{cls.studentCount} Students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] flex justify-between items-center text-xs text-[#728B88]">
        <span>Total Cohorts: {classes.length}</span>
        <button
          onClick={onOpenCreateClass}
          className="font-bold text-[#00BFA5] hover:underline"
        >
          + Add New Class
        </button>
      </div>
    </div>
  );
};
