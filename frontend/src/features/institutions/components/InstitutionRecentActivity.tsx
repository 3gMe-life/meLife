"use client";

import React from "react";
import { Activity, ClipboardCheck, Calendar, Users, HeartHandshake, CheckCircle2 } from "lucide-react";
import { InstitutionActivity } from "../types/institution.types";

interface InstitutionRecentActivityProps {
  activities: InstitutionActivity[];
}

export const InstitutionRecentActivity: React.FC<InstitutionRecentActivityProps> = ({
  activities,
}) => {
  const getActivityIcon = (type: InstitutionActivity["type"]) => {
    switch (type) {
      case "ASSESSMENT":
        return {
          icon: ClipboardCheck,
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "SESSION":
        return {
          icon: Calendar,
          bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
        };
      case "PARENT":
        return {
          icon: HeartHandshake,
          bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        };
      case "ENROLLMENT":
      default:
        return {
          icon: Users,
          bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} days ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Live Activity Stream
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
              Recent student test milestones, sessions, and enrollments
            </p>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="py-8 text-center bg-[#F7FAF9] dark:bg-[#172B2A] rounded-2xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6">
            <Activity className="w-10 h-10 text-[#728B88] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
              No recent activities
            </p>
            <p className="text-[11px] text-[#728B88]">
              Platform events and student actions will populate here.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {activities.map((act) => {
              const { icon: IconComponent, bg } = getActivityIcon(act.type);
              return (
                <div key={act.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${bg}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                        {act.title}
                      </h4>
                      <span className="text-[10px] text-[#728B88] dark:text-[#7D9491] shrink-0 font-medium">
                        {formatTimestamp(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] text-right">
        <span className="text-xs text-[#728B88] font-medium flex items-center justify-end gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5]" />
          Real-time institutional telemetry
        </span>
      </div>
    </div>
  );
};
