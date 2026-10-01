"use client";

import React, { useState } from "react";
import {
  School,
  Building2,
  MapPin,
  Users,
  PlusCircle,
  Calendar,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useInstitutionOverview } from "../hooks/useInstitutionQueries";
import { InstitutionOverviewStats } from "./InstitutionOverviewStats";
import { InstitutionQuickActions } from "./InstitutionQuickActions";
import { InstitutionRecentCohorts } from "./InstitutionRecentCohorts";
import { InstitutionRecentActivity } from "./InstitutionRecentActivity";
import { CreateClassModal } from "./modals/CreateClassModal";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";

export const InstitutionDashboardView: React.FC = () => {
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const { data: overview, isLoading, isError, refetch, isRefetching } = useInstitutionOverview();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !overview) {
    return (
      <ErrorState
        message="Unable to load institution dashboard data. Please check your credentials and network connection."
        onRetry={() => refetch()}
      />
    );
  }

  const { institution, stats, recentActivities, recentClasses } = overview;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome & Institution Identity Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122423] via-[#172B2A] to-[#0A1A18] border border-[#00BFA5]/20 p-6 sm:p-8 text-white shadow-xl">
        {/* Soft Background Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#00BFA5]/20 to-[#00C896]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#00BFA5]/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30">
                {institution.code || "INST"}
              </span>
              <span className="text-xs font-semibold text-[#9FB3B0]">
                {institution.type || "School"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {institution.name || "Educational Institution"}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#9FB3B0]">
              {institution.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>
                    {institution.city}, {institution.state || institution.country}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>
                  {stats?.totalStudents ?? 0} / {institution.studentCapacity || 1500} Capacity
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>{stats?.totalClasses ?? 0} Active Cohorts</span>
              </div>
            </div>
          </div>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#9FB3B0] hover:text-white transition-all disabled:opacity-50"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsCreateClassOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:from-[#00A892] hover:to-[#00B285] text-[#0A1A18] font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Cohort</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 8-KPI Statistical Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#526866] dark:text-[#9FB3B0] uppercase tracking-wider">
            Institutional Performance & Telemetry
          </h2>
          <span className="text-xs text-[#728B88]">Live Synchronized</span>
        </div>
        <InstitutionOverviewStats stats={stats} institution={institution} />
      </div>

      {/* 3. Quick Actions */}
      <InstitutionQuickActions onOpenCreateClass={() => setIsCreateClassOpen(true)} />

      {/* 4. Cohorts Summary & Live Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InstitutionRecentCohorts
          classes={recentClasses}
          onOpenCreateClass={() => setIsCreateClassOpen(true)}
        />
        <InstitutionRecentActivity activities={recentActivities} />
      </div>

      {/* 5. Create Cohort Modal */}
      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
      />
    </div>
  );
};
