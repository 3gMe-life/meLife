"use client";

import React from "react";
import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import type { RecentUserDTO } from "../types/admin.types";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

interface AdminRecentUsersProps {
  users: RecentUserDTO[];
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
      year: "numeric",
    }).format(date);
  } catch {
    return "N/A";
  }
}

function getRoleBadge(role?: string) {
  const normalized = (role || "").toUpperCase();
  switch (normalized) {
    case "SUPER_ADMIN":
      return {
        label: "Super Admin",
        className: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
      };
    case "PLATFORM_ADMIN":
    case "ADMIN":
      return {
        label: "Admin",
        className: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      };
    case "CAREER_COUNSELLOR":
    case "COUNSELLOR":
      return {
        label: "Counsellor",
        className: "bg-teal-500/15 text-[#008F83] dark:text-teal-300 border-teal-500/30",
      };
    case "PARTICIPANT":
    case "STUDENT":
      return {
        label: "Student",
        className: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
      };
    case "INSTITUTION":
    case "COMPANY_ADMIN":
    case "INSTITUTION_ADMIN":
      return {
        label: "Institution",
        className: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      };
    case "PARENT":
    case "PARENT_GUARDIAN":
      return {
        label: "Parent",
        className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      };
    default:
      return {
        label: role || "User",
        className: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
      };
  }
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

export const AdminRecentUsers: React.FC<AdminRecentUsersProps> = ({
  users,
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex flex-col overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E3ECEA]/60 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Recent Users
            </h3>
            <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
              Latest registered accounts & personas
            </p>
          </div>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline"
        >
          <span>View Directory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {users.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No Recent Users"
              description="No registered user records were found in the database."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3ECEA]/50 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                  <th className="pb-2.5 pl-2">User / Email</th>
                  <th className="pb-2.5 px-2">Persona</th>
                  <th className="pb-2.5 px-2">Status</th>
                  <th className="pb-2.5 pr-2 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                {users.map((u) => {
                  const roleBadge = getRoleBadge(u.role);
                  const statusBadge = getStatusBadge(u.status);

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 pl-2 max-w-[180px]">
                        <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                          {u.name || "Unnamed User"}
                        </div>
                        <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate">
                          {u.email}
                        </div>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.className}`}
                        >
                          {roleBadge.label}
                        </span>
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
                      <td className="py-3 pr-2 text-right text-[11px] text-[#526866] dark:text-[#9FB3B0] whitespace-nowrap">
                        {formatDate(u.createdAt)}
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
        <span>Showing top {users.length} recent accounts</span>
        <Link
          href="/admin/users"
          className="font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline"
        >
          Manage all users →
        </Link>
      </div>
    </div>
  );
};
