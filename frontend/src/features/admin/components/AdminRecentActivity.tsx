"use client";

import React from "react";
import { Activity, Bell, Calendar, Award } from "lucide-react";
import type { RecentActivityItemDTO } from "../types/admin.types";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

interface AdminRecentActivityProps {
  activities?: RecentActivityItemDTO[];
  className?: string;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } catch {
    return "N/A";
  }
}

function getActivityIcon(type?: string) {
  switch (type) {
    case "BOOKING_CONFIRMED":
    case "SESSION_CONFIRMED":
      return {
        icon: Calendar,
        bg: "bg-emerald-50 dark:bg-emerald-950/60",
        color: "text-emerald-600 dark:text-emerald-400",
      };
    case "SESSION_REQUEST":
      return {
        icon: Bell,
        bg: "bg-amber-50 dark:bg-amber-950/60",
        color: "text-amber-600 dark:text-amber-400",
      };
    case "ASSESSMENT_COMPLETED":
      return {
        icon: Award,
        bg: "bg-purple-50 dark:bg-purple-950/60",
        color: "text-purple-600 dark:text-purple-400",
      };
    default:
      return {
        icon: Activity,
        bg: "bg-teal-50 dark:bg-teal-950/60",
        color: "text-[#008F83] dark:text-[#00BFA5]",
      };
  }
}

export const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({
  activities = [],
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex flex-col overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E3ECEA]/60 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Recent System Activity
            </h3>
            <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
              Audited event triggers & platform notifications
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {activities.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No Recent System Activities"
              description="Platform audit trails and notifications will appear here in real time."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => {
              const { icon: Icon, bg, color } = getActivityIcon(act.type);

              return (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-[#F4F8F7]/70 dark:bg-white/5 border border-[#E3ECEA]/50 dark:border-white/5 flex items-start gap-3 hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-[#728B88] dark:text-[#7D9491] whitespace-nowrap shrink-0">
                        {formatDate(act.createdAt)}
                      </span>
                    </div>
                    {act.message && (
                      <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-0.5 line-clamp-2 leading-relaxed">
                        {act.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
