"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import type { AdminUserListItemDTO } from "../types/admin.types";
import { useUpdateUserRole } from "../hooks/useAdminQueries";

interface AdminUserEditRoleModalProps {
  user: AdminUserListItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const AVAILABLE_ROLES = [
  { id: "PARTICIPANT", label: "Student / Participant", description: "Learner participating in assessments & career guidance" },
  { id: "CAREER_COUNSELLOR", label: "Career Counsellor", description: "Certified practitioner providing student guidance sessions" },
  { id: "PARENT_GUARDIAN", label: "Parent / Guardian", description: "Parent linked to student reports & guidance" },
  { id: "INSTITUTION_ADMIN", label: "Institution Admin", description: "School / university cohort coordinator" },
  { id: "COMPANY_ADMIN", label: "Company Admin", description: "Corporate organization manager" },
  { id: "PLATFORM_ADMIN", label: "Platform Admin", description: "System operational administrator" },
  { id: "SUPER_ADMIN", label: "Super Admin", description: "Full root access & security supervisor" },
];

export const AdminUserEditRoleModal: React.FC<AdminUserEditRoleModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8">
        <AdminUserEditRoleModalContent
          key={user.id}
          user={user}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface AdminUserEditRoleModalContentProps {
  user: AdminUserListItemDTO;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

function AdminUserEditRoleModalContent({
  user,
  onClose,
  onSuccess,
}: AdminUserEditRoleModalContentProps) {
  const updateRoleMutation = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = useState(user.role || "PARTICIPANT");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCurrentSuperAdmin = user.role === "SUPER_ADMIN";
  const isDemotingSuperAdmin = isCurrentSuperAdmin && selectedRole !== "SUPER_ADMIN";

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      const res = await updateRoleMutation.mutateAsync({
        userId: user.id,
        role: selectedRole,
      });

      onSuccess?.(
        `User ${user.fullName} role successfully updated to ${res.role}.`
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update user role.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-[#728B88] hover:bg-[#F4F8F7] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:bg-white/10 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="border-b border-[#E3ECEA]/70 pb-4 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
          <ShieldCheck className="h-4 w-4" />
          <span>Role Assignment & Security Level</span>
        </div>
        <h2 className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] mt-1">
          Modify User Role
        </h2>
        <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
          Adjust security persona and portal access rights for this user account.
        </p>
      </div>

      {/* User Summary Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9] block">
            {user.fullName}
          </span>
          <span className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
            {user.email}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
          Current: {user.role}
        </span>
      </div>

      {/* Demoting Super Admin Guard Warning */}
      {isDemotingSuperAdmin && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Privileged Account Safeguard</span>
            <span className="text-[11px] leading-relaxed">
              If this is the system&apos;s last active Super Administrator, role removal is blocked by the transactional security engine to prevent lockout.
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mt-3.5 flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Role Selection Form */}
      <form onSubmit={handleSaveRole} className="mt-4 space-y-4 text-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-2">
            Select New Security Persona
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {AVAILABLE_ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#00BFA5]/15 border-[#00BFA5]/50 text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                      : "bg-white dark:bg-[#172B2A] border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/30"
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>{r.label}</span>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#00BFA5] text-[#172B2A]">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] mt-0.5">
                      {r.description}
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-[#00BFA5] bg-[#00BFA5] text-[#172B2A]"
                        : "border-[#E3ECEA] dark:border-white/20"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3ECEA]/60 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateRoleMutation.isPending || selectedRole === user.role}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-md shadow-[#00BFA5]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {updateRoleMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>
              {updateRoleMutation.isPending ? "Updating Role..." : "Assign Role"}
            </span>
          </button>
        </div>
      </form>
    </>
  );
}
