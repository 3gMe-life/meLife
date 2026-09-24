"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  AlertCircle,
  Mail,
} from "lucide-react";
import { useBulkDeleteUsers } from "../hooks/useAdminQueries";
import type { AdminUserListItemDTO } from "../types/admin.types";

interface AdminUserBulkDeleteModalProps {
  users: AdminUserListItemDTO[];
  isOpen: boolean;
  currentAdminUserId?: string;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AdminUserBulkDeleteModal: React.FC<AdminUserBulkDeleteModalProps> = ({
  users,
  isOpen,
  currentAdminUserId,
  onClose,
  onSuccess,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bulkDeleteMutation = useBulkDeleteUsers();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !bulkDeleteMutation.isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, bulkDeleteMutation.isPending, onClose]);

  const { eligibleUsers, protectedUsers } = useMemo(() => {
    const eligible: AdminUserListItemDTO[] = [];
    const protectedList: { user: AdminUserListItemDTO; reason: string }[] = [];

    for (const u of users) {
      if (currentAdminUserId && u.id === currentAdminUserId) {
        protectedList.push({
          user: u,
          reason: "Your own logged-in administrator account cannot be deleted.",
        });
      } else {
        eligible.push(u);
      }
    }

    return { eligibleUsers: eligible, protectedUsers: protectedList };
  }, [users, currentAdminUserId]);

  if (!isOpen || users.length === 0) return null;

  const handleConfirm = async () => {
    setErrorMsg(null);
    if (eligibleUsers.length === 0) {
      setErrorMsg("No eligible user accounts selected for deletion.");
      return;
    }

    try {
      const userIds = eligibleUsers.map((u) => u.id);
      const res = await bulkDeleteMutation.mutateAsync(userIds);

      if (onSuccess) {
        onSuccess(res.message);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute bulk deletion.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => !bulkDeleteMutation.isPending && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] z-10 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between shrink-0 pb-3 border-b border-[#E3ECEA]/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
                  Delete Multiple User Accounts
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                  {users.length} Selected
                </span>
              </div>
              <p className="text-xs text-[#728B88] dark:text-[#7D9491] mt-0.5">
                Bulk Administrative Account Removal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={bulkDeleteMutation.isPending}
            className="p-1.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-semibold">{errorMsg}</div>
            </div>
          )}

          {/* Protected Accounts Warning if applicable */}
          {protectedUsers.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Protected Account Safeguard</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {protectedUsers.length === 1
                  ? "1 selected account is protected (your current administrative session) and will automatically be skipped."
                  : `${protectedUsers.length} selected accounts are protected and will automatically be skipped.`}
              </p>
            </div>
          )}

          {/* Confirmation Prompt */}
          <div className="space-y-2">
            <p className="text-[#526866] dark:text-[#9FB3B0]">
              Are you sure you want to remove access for{" "}
              <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                {eligibleUsers.length} user account{eligibleUsers.length === 1 ? "" : "s"}
              </strong>
              ?
            </p>
          </div>

          {/* Selected Users List Preview */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] block">
              Selected Accounts ({users.length}):
            </span>
            <div className="max-h-48 overflow-y-auto rounded-2xl border border-[#E3ECEA] dark:border-white/10 bg-[#F4F8F7]/50 dark:bg-white/5 divide-y divide-[#E3ECEA]/40 dark:divide-white/5 p-1">
              {users.map((u) => {
                const isCurrent = currentAdminUserId && u.id === currentAdminUserId;
                const isSuperAdmin = u.role === "SUPER_ADMIN";

                return (
                  <div
                    key={u.id}
                    className="p-2.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black text-[11px] flex items-center justify-center shrink-0 border border-[#00BFA5]/25">
                        {(u.firstName?.[0] || u.email?.[0] || "U").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                          {u.fullName || "Unnamed User"}
                        </div>
                        <div className="text-[10px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" />
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Current Account
                        </span>
                      ) : isSuperAdmin ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                          Super Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EBF2F0] dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0]">
                          {u.role || "User"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safeguarded Deletion Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-[#F4F8F7]/90 dark:bg-white/5 border border-[#E3ECEA]/80 dark:border-white/10 space-y-1.5 text-[11px] text-[#526866] dark:text-[#9FB3B0]">
            <div className="flex items-center gap-1.5 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Safeguarded Deletion Policy:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-[#728B88] dark:text-[#7D9491]">
              <li>
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">Historical Records Protection:</strong> Accounts with completed assessments, counselling sessions, or clinical notes are safely deactivated to protect audit trails.
              </li>
              <li>
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">Clean Records:</strong> Accounts without dependent activity records are permanently purged from database tables.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECEA]/60 dark:border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={bulkDeleteMutation.isPending}
            className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={bulkDeleteMutation.isPending || eligibleUsers.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md shadow-rose-600/25 cursor-pointer disabled:opacity-50"
          >
            {bulkDeleteMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>
              {bulkDeleteMutation.isPending
                ? "Processing Deletion..."
                : `Delete ${eligibleUsers.length} User${eligibleUsers.length === 1 ? "" : "s"}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
