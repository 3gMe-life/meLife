/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Search,
  Save,
  Loader2,
  Mail,
  User,
  LayoutGrid,
  KeyRound,
  Info,
} from "lucide-react";
import {
  useAdminCounsellorAccess,
  useUpdateRoleDashboardFeatures,
  useUpdateRolePermissions,
} from "../hooks/useAdminQueries";
import type { CounsellorApplicationItemDTO } from "../types/admin.types";

interface AdminCounsellorAccessModalProps {
  application: CounsellorApplicationItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AdminCounsellorAccessModal: React.FC<AdminCounsellorAccessModalProps> = ({
  application,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8">
        <AdminCounsellorAccessModalContent
          key={application.id}
          application={application}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface ModalContentProps {
  application: CounsellorApplicationItemDTO;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

function AdminCounsellorAccessModalContent({
  application,
  onClose,
  onSuccess,
}: ModalContentProps) {
  const {
    data: accessData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCounsellorAccess(application.id || application.userId);

  const updateFeaturesMutation = useUpdateRoleDashboardFeatures();
  const updatePermissionsMutation = useUpdateRolePermissions();

  const [activeTab, setActiveTab] = useState<"features" | "permissions">("features");
  const [searchQuery, setSearchQuery] = useState("");
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({});
  const [assignedPermissions, setAssignedPermissions] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Sync accessData into local state on load
  useEffect(() => {
    if (accessData) {
      const fMap: Record<string, boolean> = {};
      accessData.features.forEach((f) => {
        fMap[f.key] = f.isEnabled;
      });
      setFeatureToggles(fMap);

      const pSet = new Set<string>();
      accessData.permissions.forEach((p) => {
        if (p.isAssigned) pSet.add(p.name);
      });
      setAssignedPermissions(pSet);
      setIsDirty(false);
    }
  }, [accessData]);

  // Handle toggling a dashboard feature
  const handleToggleFeature = (key: string) => {
    setFeatureToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setIsDirty(true);
      return next;
    });
  };

  // Handle toggling a permission
  const handleTogglePermission = (name: string) => {
    setAssignedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      setIsDirty(true);
      return next;
    });
  };

  // Calculate live summary metrics
  const summary = useMemo(() => {
    if (!accessData) {
      return {
        enabledFeatures: 0,
        totalFeatures: 0,
        assignedPerms: 0,
        totalPerms: 0,
        missingDeps: [] as { featureName: string; requiredPerm: string }[],
      };
    }

    const enabledCount = Object.values(featureToggles).filter(Boolean).length;
    const missing: { featureName: string; requiredPerm: string }[] = [];

    accessData.features.forEach((f) => {
      const isEnabled = featureToggles[f.key] ?? f.isEnabled;
      if (isEnabled && f.requiredPermission) {
        const hasPerm = assignedPermissions.has(f.requiredPermission);
        if (!hasPerm) {
          missing.push({
            featureName: f.name,
            requiredPerm: f.requiredPermission,
          });
        }
      }
    });

    return {
      enabledFeatures: enabledCount,
      totalFeatures: accessData.features.length,
      assignedPerms: assignedPermissions.size,
      totalPerms: accessData.permissions.length,
      missingDeps: missing,
    };
  }, [accessData, featureToggles, assignedPermissions]);

  // Grouped Features by category
  const groupedFeatures = useMemo(() => {
    if (!accessData) return {};
    const filtered = accessData.features.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, typeof accessData.features> = {};
    filtered.forEach((f) => {
      const cat = f.category || "GENERAL";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f);
    });
    return groups;
  }, [accessData, searchQuery]);

  // Grouped Permissions by category
  const groupedPermissions = useMemo(() => {
    if (!accessData) return {};
    const filtered = accessData.permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const groups: Record<string, typeof accessData.permissions> = {};
    filtered.forEach((p) => {
      const cat = p.category || "GENERAL";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [accessData, searchQuery]);

  // Save changes handler
  const handleSave = async () => {
    if (!accessData) return;
    setStatusMessage(null);

    try {
      // 1. Update Features
      await updateFeaturesMutation.mutateAsync({
        roleIdOrName: accessData.role.name || "CAREER_COUNSELLOR",
        dto: { features: featureToggles },
      });

      // 2. Update Permissions
      await updatePermissionsMutation.mutateAsync({
        roleIdOrName: accessData.role.name || "CAREER_COUNSELLOR",
        dto: { permissionNames: Array.from(assignedPermissions) },
      });

      setIsDirty(false);
      setStatusMessage({
        type: "success",
        text: "Access privileges and feature switches updated successfully.",
      });

      if (onSuccess) {
        onSuccess("Access privileges updated successfully.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update access privileges.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  const isSaving =
    updateFeaturesMutation.isPending || updatePermissionsMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Loader2 className="w-8 h-8 text-[#00BFA5] animate-spin" />
        <p className="text-sm font-semibold text-[#526866] dark:text-[#9FB3B0]">
          Loading counsellor access privileges and feature matrices...
        </p>
      </div>
    );
  }

  if (isError || !accessData) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
          Failed to load access details
        </h3>
        <p className="text-xs text-[#728B88] dark:text-[#7D9491] max-w-md mx-auto">
          {(error as Error)?.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-[#00BFA5] text-[#172B2A] text-xs font-bold shadow-xs hover:opacity-95 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E3ECEA] dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00B8D4]/20 to-[#00BFA5]/20 border border-[#00BFA5]/30 text-[#00BFA5]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                Manage Counsellor Access
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 text-[#00897B] dark:text-[#00BFA5] border border-teal-500/30">
                {accessData.role.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  accessData.user.status === "ACTIVE"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                }`}
              >
                {accessData.user.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#728B88] dark:text-[#7D9491]">
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00BFA5]" />
                {accessData.user.fullName}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#00BFA5]" />
                {accessData.user.email}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-[#728B88] dark:text-[#7D9491] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Summary KPI Cards & Dependency Warning */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
          <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider">
            Enabled Features
          </div>
          <div className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] mt-1 flex items-baseline gap-1.5">
            <span>{summary.enabledFeatures}</span>
            <span className="text-xs font-semibold text-[#728B88] dark:text-[#7D9491]">
              / {summary.totalFeatures}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
          <div className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider">
            Active Permissions
          </div>
          <div className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] mt-1 flex items-baseline gap-1.5">
            <span>{summary.assignedPerms}</span>
            <span className="text-xs font-semibold text-[#728B88] dark:text-[#7D9491]">
              / {summary.totalPerms}
            </span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border transition-colors ${
            summary.missingDeps.length > 0
              ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            {summary.missingDeps.length > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Permission Gap</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Security Alignment</span>
              </>
            )}
          </div>
          <div className="text-xs font-bold mt-1">
            {summary.missingDeps.length > 0 ? (
              <span>{summary.missingDeps.length} enabled feature(s) lack permissions</span>
            ) : (
              <span>All enabled features have valid permissions</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#F4F8F7] dark:bg-white/5 rounded-2xl border border-[#E3ECEA] dark:border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("features")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "features"
                ? "bg-white dark:bg-[#112423] text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Dashboard Features ({summary.enabledFeatures})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("permissions")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "permissions"
                ? "bg-white dark:bg-[#112423] text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Role Permissions ({summary.assignedPerms})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#728B88] dark:text-[#7D9491]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>
      </div>

      {/* Tab 1: Dashboard Features */}
      {activeTab === "features" && (
        <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
          {Object.keys(groupedFeatures).length === 0 ? (
            <div className="py-8 text-center text-xs text-[#728B88] dark:text-[#7D9491]">
              No features match your search criteria.
            </div>
          ) : (
            Object.entries(groupedFeatures).map(([category, features]) => (
              <div key={category} className="space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#00897B] dark:text-[#00BFA5] flex items-center gap-2">
                  <span>{category}</span>
                  <div className="h-px flex-1 bg-[#E3ECEA] dark:bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature) => {
                    const isEnabled = featureToggles[feature.key] ?? feature.isEnabled;
                    const hasRequiredPerm =
                      !feature.requiredPermission ||
                      assignedPermissions.has(feature.requiredPermission);
                    const isMissingPerm = isEnabled && !hasRequiredPerm;

                    return (
                      <div
                        key={feature.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isEnabled
                            ? "bg-[#F4F8F7] dark:bg-white/5 border-[#00BFA5]/30 shadow-xs"
                            : "bg-white dark:bg-white/5 border-[#E3ECEA] dark:border-white/5 opacity-70"
                        }`}
                      >
                        <div className="space-y-1 pr-2">
                          <div className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                            <span>{feature.name}</span>
                            {feature.route && (
                              <span className="text-[10px] font-mono text-[#728B88] dark:text-[#7D9491]">
                                {feature.route}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] leading-relaxed">
                            {feature.description || "Enables practitioner dashboard module."}
                          </p>

                          {/* Permission dependency badge */}
                          {feature.requiredPermission && (
                            <div className="pt-1">
                              {isMissingPerm ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                  <span>Missing permission: {feature.requiredPermission}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#728B88] dark:text-[#7D9491]">
                                  <Info className="w-3 h-3" />
                                  <span>Requires: {feature.requiredPermission}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(feature.key)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isEnabled ? "bg-[#00BFA5]" : "bg-slate-300 dark:bg-white/20"
                          }`}
                          role="switch"
                          aria-checked={isEnabled}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Role Permissions */}
      {activeTab === "permissions" && (
        <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
          {Object.keys(groupedPermissions).length === 0 ? (
            <div className="py-8 text-center text-xs text-[#728B88] dark:text-[#7D9491]">
              No permissions match your search criteria.
            </div>
          ) : (
            Object.entries(groupedPermissions).map(([category, perms]) => (
              <div key={category} className="space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#00897B] dark:text-[#00BFA5] flex items-center gap-2">
                  <span>{category}</span>
                  <div className="h-px flex-1 bg-[#E3ECEA] dark:bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {perms.map((perm) => {
                    const isGranted = assignedPermissions.has(perm.name);

                    return (
                      <label
                        key={perm.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isGranted
                            ? "bg-[#F4F8F7] dark:bg-white/5 border-[#00BFA5]/40"
                            : "bg-white dark:bg-white/5 border-[#E3ECEA] dark:border-white/5 opacity-70"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isGranted}
                          onChange={() => handleTogglePermission(perm.name)}
                          className="mt-0.5 w-4 h-4 rounded text-[#00BFA5] border-[#E3ECEA] focus:ring-[#00BFA5] cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                            {perm.name}
                          </div>
                          <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                            {perm.description || "Grants capability to execute actions."}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E3ECEA] dark:border-white/10">
        <div className="text-xs text-[#728B88] dark:text-[#7D9491]">
          {isDirty && (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              ● Unsaved access changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Access...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Access Privileges</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
