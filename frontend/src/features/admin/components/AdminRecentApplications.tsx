"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, ArrowRight, ChevronRight } from "lucide-react";
import type { RecentApplicationDTO } from "../types/admin.types";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

interface AdminRecentApplicationsProps {
  applications: RecentApplicationDTO[];
  pendingCount?: number;
  className?: string;
}

function getStatusBadge(status?: string) {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "ACTIVE":
    case "APPROVED":
      return {
        label: normalized === "APPROVED" ? "Approved" : "Active",
        className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        dotColor: "bg-emerald-500",
      };
    case "PENDING":
    case "PENDING_VERIFICATION":
      return {
        label: "Pending",
        className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        dotColor: "bg-amber-500",
      };
    case "REJECTED":
    case "SUSPENDED":
      return {
        label: normalized === "REJECTED" ? "Rejected" : "Suspended",
        className: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        dotColor: "bg-rose-500",
      };
    default:
      return {
        label: status || "Unknown",
        className: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
        dotColor: "bg-slate-400",
      };
  }
}

export const AdminRecentApplications: React.FC<AdminRecentApplicationsProps> = ({
  applications,
  pendingCount = 0,
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
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Recent Counsellor Applications
            </h3>
            <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
              Verification requests requiring credential review
            </p>
          </div>
        </div>
        <Link
          href="/admin/counsellors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline"
        >
          <span>Review Queue</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {applications.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No Applications Pending"
              description="All counsellor applications have been reviewed or no applications submitted."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3ECEA]/50 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                  <th className="pb-2.5 pl-2">Applicant</th>
                  <th className="pb-2.5 px-2">Qualifications</th>
                  <th className="pb-2.5 px-2">Status</th>
                  <th className="pb-2.5 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                {applications.map((app) => {
                  const statusBadge = getStatusBadge(app.status);

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 pl-2 max-w-[160px]">
                        <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                          {app.applicantName || "Counsellor Applicant"}
                        </div>
                        <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate">
                          {app.applicantEmail}
                        </div>
                      </td>
                      <td className="py-3 px-2 max-w-[150px]">
                        <div className="text-xs text-[#172B2A] dark:text-[#F7FAF9] font-medium truncate">
                          {app.qualification || "Credentials Submitted"}
                        </div>
                        {app.organization && (
                          <div className="text-[10px] text-[#728B88] dark:text-[#7D9491] truncate">
                            {app.organization}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`}
                          />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right whitespace-nowrap">
                        <Link
                          href="/admin/counsellors"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#00BFA5]/15 hover:bg-[#00BFA5]/25 text-[#008F83] dark:text-[#00BFA5] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-[#F4F8F7]/60 dark:bg-white/5 border-t border-[#E3ECEA]/50 dark:border-white/5 text-[11px] text-[#728B88] dark:text-[#7D9491] flex items-center justify-between">
        <span>
          {pendingCount} pending verification in queue
        </span>
        <Link
          href="/admin/counsellors"
          className="font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline"
        >
          Open verification portal →
        </Link>
      </div>
    </div>
  );
};
