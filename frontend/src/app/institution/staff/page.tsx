"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useInstitutionClasses } from "@/features/institutions/hooks/useInstitutionQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { ShieldCheck, UserCheck, School, Mail, PlusCircle } from "lucide-react";

export default function InstitutionStaffPage() {
  const { data: classes = [], isLoading, isError, refetch } = useInstitutionClasses();

  // Extract distinct coordinators from classes
  const coordinators = classes
    .filter((c) => c.coordinatorName)
    .map((c) => ({
      id: c.id,
      name: c.coordinatorName,
      role: "Cohort Coordinator",
      className: c.name,
      academicYear: c.academicYear,
    }));

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Staff & Teacher Directory
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Manage cohort coordinators, teachers, and faculty permissions
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message="Unable to load staff directory." onRetry={() => refetch()} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coordinators.map((coord) => (
                <div
                  key={coord.id}
                  className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                          {coord.name}
                        </h3>
                        <p className="text-[11px] text-[#008F83] dark:text-[#00BFA5] font-semibold">
                          {coord.role}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#728B88]">Assigned Cohort</span>
                        <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">{coord.className}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#728B88]">Academic Year</span>
                        <span className="text-[#728B88]">{coord.academicYear}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] flex justify-between text-xs text-[#728B88]">
                    <span>Status: Active</span>
                    <span className="font-bold text-[#00BFA5]">Verified Staff</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
