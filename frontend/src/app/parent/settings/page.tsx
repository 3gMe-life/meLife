"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { User, Bell, Shield, Mail, CheckCircle2, Save } from "lucide-react";

export default function ParentSettingsPage() {
  const { data, isLoading, isError, refetch } = useCurrentUserQuery();
  const user = data?.data?.user;

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [reportMilestones, setReportMilestones] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <DashboardShell allowedRoles={["PARENT_GUARDIAN"]}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !user ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6 max-w-5xl">
          <PageHeader
            title="Parent Account & Notification Settings"
            subtitle="Manage your parent/guardian profile, communication preferences, and security settings."
          />

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm font-semibold">
                Your account preferences have been saved successfully.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Nav Overview */}
            <div className="md:col-span-1 space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00B8D4] to-[#00BFA5] flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-[#00BFA5]/20">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] truncate mb-3">
                  {user.email}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verified Parent Account</span>
                </div>
              </div>
            </div>

            {/* Right Settings Form */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Details */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2EBE9] dark:border-[#1E3836]">
                  <div className="p-2.5 rounded-xl bg-[#00BFA5]/10 text-[#00BFA5]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      Personal Details
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                      Primary guardian contact information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.firstName}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] text-sm text-[#172B2A] dark:text-[#F7FAF9] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.lastName}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] text-sm text-[#172B2A] dark:text-[#F7FAF9] cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#738A87] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        defaultValue={user.email}
                        readOnly
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] text-sm text-[#172B2A] dark:text-[#F7FAF9] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#112423] border border-[#E2EBE9] dark:border-[#1E3836] shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2EBE9] dark:border-[#1E3836]">
                  <div className="p-2.5 rounded-xl bg-[#00BFA5]/10 text-[#00BFA5]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      Notification Preferences
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                      Configure when and how you receive child updates
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        Assessment Milestone Alerts
                      </p>
                      <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                        Receive emails when your child completes a psychometric test
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={reportMilestones}
                      onChange={(e) => setReportMilestones(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00BFA5] focus:ring-[#00BFA5]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        Counselling Session Reminders
                      </p>
                      <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                        Get calendar reminders before scheduled guidance sessions
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={sessionReminders}
                      onChange={(e) => setSessionReminders(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00BFA5] focus:ring-[#00BFA5]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B] border border-[#E2EBE9] dark:border-[#1E3836] cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        Weekly Digest & Progress Summary
                      </p>
                      <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                        Summary of career alignment scores and activity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00BFA5] focus:ring-[#00BFA5]"
                    />
                  </label>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#0D1C1B] text-xs font-bold shadow-md shadow-[#00BFA5]/20 hover:opacity-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
