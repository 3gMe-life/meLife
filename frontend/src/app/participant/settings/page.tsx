"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { User, GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { EDUCATION_STAGES } from "@/features/auth/constants/auth.constants";

export default function ParticipantSettingsPage() {
  const { data } = useCurrentUserQuery();
  const user = data?.data?.user;
  const onboarding = data?.data?.onboarding;

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <div className="space-y-6 max-w-3xl">
        <PageHeader
          title="Profile & Calibration Settings"
          subtitle="Manage your personal profile, educational calibration stage, and account security preferences."
        />

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-[#00C896]/40 text-[#008F83] dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C896]" />
            <span>Profile calibration updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info */}
          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 space-y-4 shadow-xs dark:shadow-none transition-colors duration-200">
            <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#00BFA5]" />
              <span>Personal Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.firstName}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-[#172B2A] dark:text-[#F7FAF9] text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.lastName}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-[#172B2A] dark:text-[#F7FAF9] text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0]/60 dark:bg-[#0D1C1B]/60 border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] text-[#728B88] dark:text-[#7D9491] text-xs cursor-not-allowed"
                />
                <ShieldCheck className="w-4 h-4 text-[#008F83] dark:text-[#00C896] absolute right-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Educational Stage */}
          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 space-y-4 shadow-xs dark:shadow-none transition-colors duration-200">
            <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#00B8D4]" />
              <span>Educational Calibration</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                Current Class / Education Stage
              </label>
              <select
                defaultValue={onboarding?.educationStage || "grade_10"}
                className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-[#172B2A] dark:text-[#F7FAF9] text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 cursor-pointer"
              >
                {EDUCATION_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id} className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9]">
                    {stage.label} ({stage.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
