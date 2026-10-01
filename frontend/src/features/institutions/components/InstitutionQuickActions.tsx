"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, School, Users, FileText, ArrowRight, ShieldCheck, Ticket } from "lucide-react";

interface InstitutionQuickActionsProps {
  onOpenCreateClass: () => void;
}

export const InstitutionQuickActions: React.FC<InstitutionQuickActionsProps> = ({
  onOpenCreateClass,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            Institutional Quick Actions
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Fast shortcuts to manage cohorts, psychometric testing, and guidance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Action 1: Create Cohort */}
        <button
          type="button"
          onClick={onOpenCreateClass}
          className="flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-[#00BFA5]/10 via-[#00BFA5]/5 to-transparent border border-[#00BFA5]/30 hover:border-[#00BFA5] hover:shadow-md transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors">
            Create Class / Cohort
          </span>
          <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-0.5">
            Add section or batch
          </span>
        </button>

        {/* Action 2: View Student Directory */}
        <Link
          href="/institution/students"
          className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] hover:border-[#00BFA5]/50 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors">
            Student Directory
          </span>
          <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-0.5">
            View rosters & status
          </span>
        </Link>

        {/* Action 3: Counsellor Connect */}
        <Link
          href="/institution/counsellors"
          className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] hover:border-[#00BFA5]/50 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors">
            Counsellor Connect
          </span>
          <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-0.5">
            1-on-1 career guidance
          </span>
        </Link>

        {/* Action 4: Assessment Reports */}
        <Link
          href="/institution/reports"
          className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] hover:border-[#00BFA5]/50 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors">
            Cohort Reports
          </span>
          <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-0.5">
            Download analytics
          </span>
        </Link>
      </div>
    </div>
  );
};
