"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { HeartHandshake, ShieldCheck, Users, Mail } from "lucide-react";

export default function InstitutionParentsPage() {
  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Parent Connect & Guardian Linkages
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Monitor verified guardian account pairings and student consent tokens
              </p>
            </div>
          </div>
        </div>

        <div className="py-16 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
          <HeartHandshake className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
            Guardian Linkage Network
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto">
            When parents register and link their accounts to enrolled students, active connections will appear here.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
