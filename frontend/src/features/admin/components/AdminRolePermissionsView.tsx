"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  Lock,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Layers,
  Loader2,
  X,
} from "lucide-react";
import {
  useAdminRolePermissionsMatrix,
  useUpdateRolePermissions,
} from "../hooks/useAdminQueries";
import type { RolePermissionMatrixItemDTO } from "../types/admin.types";

interface AdminRolePermissionsViewProps {
  roleIdOrName: string;
}

export function AdminRolePermissionsView({ roleIdOrName }: AdminRolePermissionsViewProps) {
  const {
    data: matrixData,
    isLoading,
    isError,
    refetch,
  } = useAdminRolePermissionsMatrix(roleIdOrName);

  const updatePermissionsMutation = useUpdateRolePermissions();

  // Local overrides map: permissionId -> boolean
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Compute effective permission status (override || server data)
  const isPermissionAssigned = useCallback(
    (perm: RolePermissionMatrixItemDTO) => {
      if (overrides[perm.id] !== undefined) {
        return overrides[perm.id];
      }
      return perm.isAssigned;
    },
    [overrides]
  );

  // Determine if there are unsaved changes
  const isDirty = useMemo(() => {
    if (!matrixData?.permissions) return false;
    return matrixData.permissions.some((p) => {
      const overrideVal = overrides[p.id];
      return overrideVal !== undefined && overrideVal !== p.isAssigned;
    });
  }, [matrixData, overrides]);

  // Currently enabled permissions count
  const enabledCount = useMemo(() => {
    if (!matrixData?.permissions) return 0;
    return matrixData.permissions.filter((p) => isPermissionAssigned(p)).length;
  }, [matrixData, isPermissionAssigned]);

  const role = matrixData?.role;
  const isSuperAdmin = role?.name === "SUPER_ADMIN";

  const getDomainLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "admin":
        return "Administration & System Control";
      case "assessment":
        return "Psychometric Assessments";
      case "institution":
        return "Institution & Cohort Management";
      case "result":
        return "Results & Career Reports";
      case "student":
        return "Student Profiles & Users";
      default:
        return `${cat.charAt(0).toUpperCase() + cat.slice(1)} Domain`;
    }
  };

  const getRoleVisuals = (name?: string) => {
    switch (name?.toUpperCase()) {
      case "SUPER_ADMIN":
        return {
          icon: ShieldAlert,
          badge: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
          glow: "from-purple-500/20 to-indigo-500/20",
        };
      case "PLATFORM_ADMIN":
        return {
          icon: ShieldCheck,
          badge: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
          glow: "from-indigo-500/20 to-blue-500/20",
        };
      case "COMPANY_ADMIN":
      case "INSTITUTION_ADMIN":
        return {
          icon: Shield,
          badge: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
          glow: "from-blue-500/20 to-cyan-500/20",
        };
      case "CAREER_COUNSELLOR":
        return {
          icon: ShieldCheck,
          badge: "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
          glow: "from-teal-500/20 to-cyan-500/20",
        };
      case "PARENT_GUARDIAN":
        return {
          icon: Shield,
          badge: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
          glow: "from-amber-500/20 to-yellow-500/20",
        };
      case "PARTICIPANT":
      default:
        return {
          icon: Shield,
          badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
          glow: "from-emerald-500/20 to-teal-500/20",
        };
    }
  };

  const visuals = getRoleVisuals(role?.name);
  const RoleIcon = visuals.icon;

  // Group permissions by category
  const permissionsByCategory = useMemo(() => {
    const map: Record<string, RolePermissionMatrixItemDTO[]> = {};
    if (!matrixData?.permissions) return map;

    for (const p of matrixData.permissions) {
      const cat = p.category || "general";
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    }
    return map;
  }, [matrixData]);

  // Toggle handler
  const handleTogglePermission = (permission: RolePermissionMatrixItemDTO) => {
    // If SUPER_ADMIN and permission is admin.all, prevent disable
    if (isSuperAdmin && permission.name === "admin.all") {
      setToastMessage({
        type: "error",
        text: "Root permission 'admin.all' cannot be disabled for SUPER_ADMIN.",
      });
      return;
    }

    const currentAssigned = isPermissionAssigned(permission);
    setOverrides((prev) => ({
      ...prev,
      [permission.id]: !currentAssigned,
    }));
  };

  const handleDiscardChanges = () => {
    setOverrides({});
  };

  const handleSaveChanges = async () => {
    if (!role || !matrixData) return;

    // Collect all active permission IDs
    const finalPermissionIds = matrixData.permissions
      .filter((p) => isPermissionAssigned(p))
      .map((p) => p.id);

    try {
      const res = await updatePermissionsMutation.mutateAsync({
        roleIdOrName: role.id,
        dto: { permissionIds: finalPermissionIds },
      });

      setToastMessage({
        type: "success",
        text: res.message || "Role permissions updated successfully.",
      });

      // Clear local overrides since server state is now updated
      setOverrides({});
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message || "Failed to save permission matrix.";
      setToastMessage({
        type: "error",
        text: errorMsg,
      });
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300 pb-20">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold border transition-all animate-in slide-in-from-top-2 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#728B88] dark:text-[#7D9491] mb-2">
            <Link
              href="/admin/roles"
              className="hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Roles & RBAC</span>
            </Link>
            <span>/</span>
            <span className="text-[#172B2A] dark:text-[#F7FAF9] font-extrabold truncate max-w-xs">
              {role?.name || roleIdOrName}
            </span>
            <span>/</span>
            <span className="text-[#008F83] dark:text-[#00BFA5]">Permission Matrix</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 flex items-center justify-center shadow-xs">
              <RoleIcon className="w-5 h-5 text-[#008F83] dark:text-[#00BFA5]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
                  {role?.name || roleIdOrName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${visuals.badge}`}
                >
                  <Lock className="w-2.5 h-2.5" />
                  {role?.isProtected ? "Protected System Persona" : "Canonical Role"}
                </span>
              </div>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                {role?.description || "Configure granular capability grants and functional access rights."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/roles"
            className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
          >
            Back to Roles
          </Link>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total System Permissions */}
        <div className="p-4 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              Total Defined
            </span>
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {isLoading ? "—" : matrixData?.totalAvailablePermissions}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block">
              Canonical Grants
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Currently Assigned */}
        <div className="p-4 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              Enabled Grants
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {isLoading ? "—" : enabledCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
              Active for {role?.name || "Role"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Disabled Grants */}
        <div className="p-4 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              Restricted
            </span>
            <span className="text-2xl font-black text-[#728B88] dark:text-[#7D9491]">
              {isLoading
                ? "—"
                : (matrixData?.totalAvailablePermissions || 0) - enabledCount}
            </span>
            <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block">
              Denied Boundary
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        {/* Protection Status */}
        <div className="p-4 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              Integrity Status
            </span>
            <span className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] block leading-tight">
              {role?.isProtected ? "Protected Root" : "Standard Role"}
            </span>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block">
              Transaction Enforced
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Key className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. SUPER_ADMIN Protection Banner */}
      {isSuperAdmin && (
        <div className="p-4 rounded-3xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-purple-900 dark:text-purple-200 space-y-1">
            <p className="font-bold text-sm">
              SUPER_ADMIN Root Permissions Lock
            </p>
            <p className="text-purple-800 dark:text-purple-300">
              The `SUPER_ADMIN` role holds the system master credential (`admin.all`). This permission is permanently enabled and cannot be stripped to prevent catastrophic administrator lockout.
            </p>
          </div>
        </div>
      )}

      {/* 4. Permissions Matrix Grid by Functional Domain */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 space-y-4 animate-pulse"
            >
              <div className="h-5 w-48 bg-[#E3ECEA] dark:bg-white/10 rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="h-20 bg-[#F4F8F7] dark:bg-white/5 rounded-2xl" />
                <div className="h-20 bg-[#F4F8F7] dark:bg-white/5 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-white dark:bg-[#112423] border border-rose-200 dark:border-rose-900/40 rounded-3xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Failed to load role permission matrix
          </h3>
          <p className="text-xs text-[#728B88] dark:text-[#7D9491] mt-1 max-w-sm mx-auto">
            The role &quot;{roleIdOrName}&quot; could not be loaded or you do not have permission to view it.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <div
              key={category}
              className="p-6 rounded-[28px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs space-y-4"
            >
              {/* Domain Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E3ECEA]/70 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                      {getDomainLabel(category)}
                    </h3>
                    <span className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                      {perms.length} permission grant{perms.length > 1 ? "s" : ""} in this category
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F8F7] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0]">
                  Category: {category}
                </span>
              </div>

              {/* Permission Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {perms.map((perm) => {
                  const isChecked = isPermissionAssigned(perm);
                  const isLockedRoot = isSuperAdmin && perm.name === "admin.all";

                  return (
                    <div
                      key={perm.id}
                      onClick={() => !isLockedRoot && handleTogglePermission(perm)}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 cursor-pointer ${
                        isChecked
                          ? "bg-gradient-to-tr from-[#00B8D4]/10 via-[#00BFA5]/10 to-transparent border-[#00BFA5]/50 shadow-xs"
                          : "bg-[#FAFDFD] dark:bg-[#0E1E1D] border-[#E3ECEA] dark:border-white/10 opacity-75 hover:opacity-100 hover:border-[#00BFA5]/30"
                      } ${isLockedRoot ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                            {perm.name}
                          </span>
                          {isLockedRoot && (
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                              Locked Root
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] line-clamp-2">
                          {perm.description || "System permission grant"}
                        </p>
                      </div>

                      {/* Custom Toggle Switch */}
                      <div className="shrink-0 pt-0.5">
                        <button
                          type="button"
                          disabled={isLockedRoot}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLockedRoot) handleTogglePermission(perm);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                            isChecked
                              ? "bg-[#00BFA5]"
                              : "bg-[#CBD5E1] dark:bg-white/20"
                          } ${isLockedRoot ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                          aria-label={`Toggle ${perm.name}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isChecked ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Sticky Save Changes Floating Bar */}
      {isDirty && (
        <div className="fixed bottom-6 inset-x-0 z-40 max-w-xl mx-auto px-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 rounded-3xl bg-[#172B2A] dark:bg-[#0E1E1D] text-white border border-[#00BFA5]/40 shadow-2xl shadow-black/40 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00BFA5] animate-ping" />
              <div className="min-w-0">
                <span className="text-xs font-black block truncate">
                  Unsaved Permission Changes
                </span>
                <span className="text-[10px] text-[#9FB3B0] block truncate">
                  {enabledCount} permissions enabled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={updatePermissionsMutation.isPending}
                className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={updatePermissionsMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] text-xs font-black transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {updatePermissionsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#172B2A]" />
                ) : (
                  <Save className="w-4 h-4 text-[#172B2A]" />
                )}
                <span>Save Matrix</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
