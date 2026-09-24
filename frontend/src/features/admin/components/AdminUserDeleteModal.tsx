"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import { useDeleteUser } from "../hooks/useAdminQueries";
import type { AdminUserListItemDTO } from "../types/admin.types";

interface AdminUserDeleteModalProps {
  user: AdminUserListItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AdminUserDeleteModal: React.FC<AdminUserDeleteModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !deleteUserMutation.isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, deleteUserMutation.isPending, onClose]);

  if (!isOpen || !user) return null;

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const handleConfirm = async () => {
    setErrorMsg(null);
    try {
      const res = await deleteUserMutation.mutateAsync(user.id);
      if (onSuccess) {
        onSuccess(
          res.actionTaken === "SOFT_DEACTIVATED"
            ? `User ${user.fullName} has historical records and was safely deactivated.`
            : `User ${user.fullName} was permanently deleted.`
        );
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={() => !deleteUserMutation.isPending && onClose()}
      />
      <div className="relative w-full max-w-md rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Delete User Account
              </h3>
              <p className="text-xs text-[#728B88] dark:text-[#7D9491]">
                Administrative Account Removal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={deleteUserMutation.isPending}
            className="p-1.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuperAdmin ? (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>SUPER_ADMIN Protected</span>
            </div>
            <p>
              Super Administrator accounts cannot be deleted directly to prevent accidental platform lockout.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            <p>
              Are you sure you want to delete the user account for{" "}
              <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                {user.fullName} ({user.email})
              </strong>
              ?
            </p>

            <div className="p-3 rounded-2xl bg-[#F4F8F7]/80 dark:bg-white/5 border border-[#E3ECEA]/60 dark:border-white/5 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Safeguarded Deletion Policy:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[#728B88] dark:text-[#7D9491]">
                <li>If the user has associated sessions or assessment records, the account will be safely deactivated to protect audit trails.</li>
                <li>Clean records without dependent data will be permanently purged.</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECEA]/60 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteUserMutation.isPending}
            className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          {!isSuperAdmin && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleteUserMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/25 cursor-pointer disabled:opacity-50"
            >
              {deleteUserMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Confirm Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
