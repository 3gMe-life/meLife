"use client";

import React, { useEffect } from "react";
import {
  X,
  User,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Key,
  Activity,
  Layers,
} from "lucide-react";
import type { AdminUserListItemDTO } from "../types/admin.types";
import { useAdminUserDetail } from "../hooks/useAdminQueries";

interface AdminUserDetailModalProps {
  user: AdminUserListItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "Never";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Never";
  }
}

export const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { data: userDetail } = useAdminUserDetail(
    user?.id || "",
    isOpen && Boolean(user?.id)
  );

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const displayUser = userDetail || user;
  const isSuspended = displayUser.status === "SUSPENDED" || displayUser.status === "DISABLED";
  const isPending = displayUser.status === "PENDING_VERIFICATION";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#728B88] hover:bg-[#F4F8F7] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:bg-white/10 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#E3ECEA]/70 pb-4 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
            <ShieldCheck className="h-4 w-4" />
            <span>Administrative User Profile</span>
          </div>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B8D4]/20 to-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] font-black text-base flex items-center justify-center border border-[#00BFA5]/30">
                {(displayUser.firstName?.[0] || displayUser.email?.[0] || "U").toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  {displayUser.fullName || "User Account"}
                </h2>
                <div className="text-xs text-[#526866] dark:text-[#9FB3B0] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>{displayUser.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isSuspended
                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                    : isPending
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                }`}
              >
                {isSuspended ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : isPending ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>{displayUser.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="mt-5 space-y-4">
          {/* Account Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
              <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Primary Role Persona</span>
              </div>
              <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-sm">
                {displayUser.role}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
              <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Account Created</span>
              </div>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {formatDate(displayUser.createdAt)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
              <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Last Session Login</span>
              </div>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {formatDate(displayUser.lastLoginAt)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
              <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Email Verification</span>
              </div>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {displayUser.emailVerifiedAt ? "Verified" : "Pending Verification"}
              </span>
            </div>
          </div>

          {/* Assigned Roles List */}
          <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>Assigned Security Roles</span>
            </h4>
            <div className="flex flex-wrap items-center gap-1.5">
              {(displayUser.roles || [displayUser.role]).map((r, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Permissions Granted (if available) */}
          {userDetail?.permissions && userDetail.permissions.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-2 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Granted System Permissions ({userDetail.permissions.length})</span>
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {userDetail.permissions.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-200 dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] font-mono"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked Practitioner Profile (if applicable) */}
          {userDetail?.counsellorProfile && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Practitioner Directory Profile</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                    Qualification
                  </span>
                  <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                    {userDetail.counsellorProfile.qualification}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                    Experience
                  </span>
                  <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                    {userDetail.counsellorProfile.experienceYears} Years
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                    Approval Status
                  </span>
                  <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                    {userDetail.counsellorProfile.approvalStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User UUID */}
          <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] font-mono pt-1">
            System UUID: {displayUser.id}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-5 border-t border-[#E3ECEA]/60 dark:border-white/10 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
