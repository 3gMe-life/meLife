/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Key,
  Lock,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ExternalLink,
  Fingerprint,
  UserCheck,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  Clock,
  FileText,
  Inbox,
  Bell,
  BarChart3,
  Award,
  User,
  Settings,
  Sliders,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  useAdminRoleDetail,
  useAdminRoleDashboardFeatures,
  useUpdateRoleDashboardFeatures,
} from "../hooks/useAdminQueries";
import type { AdminRoleListItemDTO } from "../types/admin.types";

interface AdminRoleDetailModalProps {
  role: AdminRoleListItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (userId: string) => void;
}

type TabType = "users" | "features" | "permissions" | "info";

export function AdminRoleDetailModal({
  role,
  isOpen,
  onClose,
  onSelectUser,
}: AdminRoleDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [userSearch, setUserSearch] = useState("");

  const roleIdentifier = role?.id || role?.name || "";
  const {
    data: roleDetail,
    isLoading: isLoadingRole,
    isError: isErrorRole,
    refetch: refetchRole,
  } = useAdminRoleDetail(roleIdentifier, isOpen && Boolean(roleIdentifier));

  const {
    data: featuresData,
    isLoading: isLoadingFeatures,
    isError: isErrorFeatures,
    refetch: refetchFeatures,
  } = useAdminRoleDashboardFeatures(roleIdentifier, isOpen && Boolean(roleIdentifier));

  const updateFeaturesMutation = useUpdateRoleDashboardFeatures();

  // Local feature toggles state
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Sync feature state with fetched features data
  useEffect(() => {
    if (featuresData?.features) {
      const initial: Record<string, boolean> = {};
      for (const f of featuresData.features) {
        initial[f.key] = f.isEnabled;
      }
      setFeatureToggles(initial);
      setIsDirty(false);
    }
  }, [featuresData]);

  // Clear status notification after 4 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !role) return null;

  const getRoleVisuals = (name: string) => {
    switch (name.toUpperCase()) {
      case "SUPER_ADMIN":
        return {
          badge:
            "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
          glow: "from-purple-500/20 to-indigo-500/20",
          icon: ShieldAlert,
          category: "Root Security Authority",
        };
      case "PLATFORM_ADMIN":
        return {
          badge:
            "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
          glow: "from-indigo-500/20 to-blue-500/20",
          icon: ShieldCheck,
          category: "Operations & Platform Admin",
        };
      case "COMPANY_ADMIN":
        return {
          badge:
            "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
          glow: "from-blue-500/20 to-cyan-500/20",
          icon: Shield,
          category: "Enterprise Organization Admin",
        };
      case "INSTITUTION_ADMIN":
        return {
          badge:
            "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60",
          glow: "from-cyan-500/20 to-teal-500/20",
          icon: Shield,
          category: "Educational Institution Coordinator",
        };
      case "CAREER_COUNSELLOR":
        return {
          badge:
            "bg-teal-100 dark:bg-teal-950/60 text-[#008F83] dark:text-[#00BFA5] border-teal-200 dark:border-teal-800/60",
          glow: "from-teal-500/20 to-cyan-500/20",
          icon: UserCheck,
          category: "Certified Career Practitioner",
        };
      case "PARENT_GUARDIAN":
        return {
          badge:
            "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
          glow: "from-amber-500/20 to-yellow-500/20",
          icon: HeartHandshake,
          category: "Parent & Guardian Guardian",
        };
      case "PARTICIPANT":
      default:
        return {
          badge:
            "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
          glow: "from-emerald-500/20 to-teal-500/20",
          icon: GraduationCap,
          category: "Student & Assessment Candidate",
        };
    }
  };

  const visuals = getRoleVisuals(role.name);
  const IconComponent = visuals.icon;

  const usersList = roleDetail?.users || [];
  const filteredUsers = usersList.filter((u) => {
    if (!userSearch.trim()) return true;
    const s = userSearch.toLowerCase();
    return u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

  // Group permissions by category/domain
  const permissionsList = roleDetail?.permissions || [];
  const permissionsByCategory: Record<string, typeof permissionsList> = {};
  for (const p of permissionsList) {
    const cat = (p.category || "General").toUpperCase();
    if (!permissionsByCategory[cat]) {
      permissionsByCategory[cat] = [];
    }
    permissionsByCategory[cat].push(p);
  }

  // Group features by category
  const featuresList = featuresData?.features || [];
  const featuresByCategory: Record<string, typeof featuresList> = {};
  for (const f of featuresList) {
    const cat = (f.category || "General").toUpperCase();
    if (!featuresByCategory[cat]) {
      featuresByCategory[cat] = [];
    }
    featuresByCategory[cat].push(f);
  }

  const getFeatureIcon = (iconName: string | null) => {
    switch (iconName) {
      case "LayoutDashboard":
        return LayoutDashboard;
      case "Calendar":
        return Calendar;
      case "Clock":
        return Clock;
      case "GraduationCap":
        return GraduationCap;
      case "Users":
        return Users;
      case "HeartHandshake":
        return HeartHandshake;
      case "FileText":
        return FileText;
      case "Inbox":
        return Inbox;
      case "Bell":
        return Bell;
      case "BarChart3":
        return BarChart3;
      case "Award":
        return Award;
      case "User":
        return User;
      case "Settings":
        return Settings;
      default:
        return Sliders;
    }
  };

  const handleToggleFeature = (key: string) => {
    setFeatureToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setIsDirty(true);
      return next;
    });
  };

  const handleBulkToggle = (enableAll: boolean) => {
    const updated: Record<string, boolean> = {};
    for (const f of featuresList) {
      updated[f.key] = enableAll;
    }
    setFeatureToggles(updated);
    setIsDirty(true);
  };

  const handleResetFeatures = () => {
    if (featuresData?.features) {
      const initial: Record<string, boolean> = {};
      for (const f of featuresData.features) {
        initial[f.key] = f.isEnabled;
      }
      setFeatureToggles(initial);
      setIsDirty(false);
    }
  };

  const handleSaveFeatures = async () => {
    try {
      setStatusMessage(null);
      const res = await updateFeaturesMutation.mutateAsync({
        roleIdOrName: roleIdentifier,
        dto: { features: featureToggles },
      });
      setIsDirty(false);
      setStatusMessage({
        type: "success",
        text: res.message || "Dashboard features configuration updated successfully.",
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update dashboard features.";
      setStatusMessage({ type: "error", text: errorMsg });
    }
  };

  const enabledCount = Object.values(featureToggles).filter(Boolean).length;
  const totalFeatures = featuresList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 rounded-[28px] shadow-2xl shadow-[#172B2A]/20 dark:shadow-black/60 overflow-hidden z-10">
        {/* Header Ambient Glow */}
        <div
          className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b ${visuals.glow} pointer-events-none z-0`}
        />

        {/* Modal Header */}
        <div className="relative z-10 shrink-0 px-6 pt-6 pb-4 border-b border-[#E3ECEA] dark:border-white/10 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F8F7] dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 flex items-center justify-center shrink-0 shadow-xs">
              <IconComponent className="w-6 h-6 text-[#008F83] dark:text-[#00BFA5]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                  {role.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${visuals.badge}`}
                >
                  <Lock className="w-3 h-3" />
                  {role.isProtected ? "Protected System Role" : "Canonical Role"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                  Dynamic RBAC
                </span>
              </div>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1 max-w-md">
                {role.description ||
                  "Core platform permission persona with configurable dashboard modules."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:text-[#7D9491] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs: 1. Assigned Users | 2. Dashboard Features | 3. Permissions | 4. Role Information */}
        <div className="relative z-10 shrink-0 px-6 py-2.5 border-b border-[#E3ECEA] dark:border-white/10 flex items-center gap-2 bg-[#FAFDFD] dark:bg-[#0E1E1D] overflow-x-auto">
          {/* Tab 1: Assigned Users */}
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "users"
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black shadow-2xs"
                : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0]/70 dark:hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. Assigned Users</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "users"
                  ? "bg-[#00BFA5]/25 text-[#008F83] dark:text-[#00BFA5]"
                  : "bg-[#EBF2F0] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
              }`}
            >
              {roleDetail?.userCount ?? role.userCount}
            </span>
          </button>

          {/* Tab 2: Dashboard Features */}
          <button
            type="button"
            onClick={() => setActiveTab("features")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "features"
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black shadow-2xs"
                : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0]/70 dark:hover:bg-white/5"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Dashboard Features</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "features"
                  ? "bg-[#00BFA5]/25 text-[#008F83] dark:text-[#00BFA5]"
                  : "bg-[#EBF2F0] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
              }`}
            >
              {totalFeatures > 0 ? `${enabledCount}/${totalFeatures}` : "..."}
            </span>
          </button>

          {/* Tab 3: Permissions */}
          <button
            type="button"
            onClick={() => setActiveTab("permissions")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "permissions"
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black shadow-2xs"
                : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0]/70 dark:hover:bg-white/5"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>3. Permissions</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "permissions"
                  ? "bg-[#00BFA5]/25 text-[#008F83] dark:text-[#00BFA5]"
                  : "bg-[#EBF2F0] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
              }`}
            >
              {roleDetail?.permissionCount ?? role.permissionCount}
            </span>
          </button>

          {/* Tab 4: Role Information */}
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "info"
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black shadow-2xs"
                : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0]/70 dark:hover:bg-white/5"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>4. Role Information</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white dark:bg-[#112423]">
          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span className="flex-1">{statusMessage.text}</span>
            </div>
          )}

          {activeTab === "users" ? (
            /* ============================================================ */
            /* Section 1: Assigned Users                                    */
            /* ============================================================ */
            isLoadingRole ? (
              <div className="space-y-4 py-8">
                <div className="h-6 w-48 bg-[#E3ECEA] dark:bg-white/10 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ) : isErrorRole ? (
              <div className="p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Failed to load role assigned users from server.
                </p>
                <button
                  type="button"
                  onClick={() => refetchRole()}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88] dark:text-[#7D9491]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Filter users assigned to this role..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] dark:placeholder-[#7D9491] focus:outline-hidden focus:border-[#00BFA5]"
                  />
                </div>

                {/* Users List */}
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#728B88] dark:text-[#7D9491]">
                    {userSearch
                      ? "No users matching search criteria."
                      : "No users currently assigned to this role."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491]">
                      Showing {filteredUsers.length} assigned user accounts:
                    </span>
                    <div className="divide-y divide-[#E3ECEA] dark:divide-white/10 border border-[#E3ECEA] dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0E1E1D]">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] to-[#00BFA5] text-[#172B2A] font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {u.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                                  {u.fullName}
                                </span>
                                {u.isPrimary && (
                                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate block">
                                {u.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {u.status}
                            </span>

                            {onSelectUser && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectUser(u.id);
                                }}
                                className="p-1.5 rounded-xl text-[#728B88] hover:text-[#008F83] dark:hover:text-[#00BFA5] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
                                title="View user details in User Accounts"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : activeTab === "features" ? (
            /* ============================================================ */
            /* Section 2: Dashboard Features (Dynamic Feature Registry)     */
            /* ============================================================ */
            isLoadingFeatures ? (
              <div className="space-y-4 py-8">
                <div className="h-6 w-48 bg-[#E3ECEA] dark:bg-white/10 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ) : isErrorFeatures ? (
              <div className="p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Failed to load dashboard features for this role.
                </p>
                <button
                  type="button"
                  onClick={() => refetchFeatures()}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Section Header & Bulk Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
                        Dashboard Features Registry
                      </h3>
                      {isDirty && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse">
                          Unsaved Changes
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                      Control which functional modules appear in this role&apos;s navigation sidebar.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleBulkToggle(true)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1E1D] border border-[#E3ECEA] dark:border-white/10 text-[11px] font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Enable all
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkToggle(false)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1E1D] border border-[#E3ECEA] dark:border-white/10 text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      Disable all
                    </button>
                  </div>
                </div>

                {/* Categorized Feature Sections */}
                {Object.entries(featuresByCategory).map(([category, features]) => (
                  <div key={category} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
                        {category}
                      </span>
                      <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491]">
                        {features.filter((f) => featureToggles[f.key]).length} of {features.length} enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {features.map((feat) => {
                        const isEnabled = Boolean(featureToggles[feat.key]);
                        const FeatIcon = getFeatureIcon(feat.icon);
                        const isMissingPermission =
                          feat.requiredPermission && !feat.isPermissionGranted && isEnabled;

                        return (
                          <div
                            key={feat.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isEnabled
                                ? "bg-white dark:bg-[#0E1E1D] border-[#00BFA5]/40 shadow-2xs"
                                : "bg-[#FAFDFD] dark:bg-white/3 border-[#E3ECEA] dark:border-white/5 opacity-80"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                    isEnabled
                                      ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]"
                                      : "bg-[#EBF2F0] dark:bg-white/10 text-[#728B88] dark:text-[#7D9491]"
                                  }`}
                                >
                                  <FeatIcon className="w-4.5 h-4.5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-[#172B2A] dark:text-[#F7FAF9]">
                                      {feat.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-[#728B88] dark:text-[#7D9491] bg-[#F4F8F7] dark:bg-white/5 px-1.5 py-0.2 rounded-md">
                                      {feat.key}
                                    </span>
                                    {feat.requiredPermission && (
                                      <span
                                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                          feat.isPermissionGranted
                                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                                        }`}
                                      >
                                        Requires {feat.requiredPermission}
                                        {feat.isPermissionGranted ? " ✓" : ""}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                                    {feat.description || "Dashboard functional capability"}
                                  </p>

                                  {/* Missing Permission Warning */}
                                  {isMissingPermission && (
                                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                      <span>
                                        Feature enabled, but required permission{" "}
                                        <code className="font-mono font-bold bg-amber-200/50 dark:bg-amber-900/50 px-1 rounded">
                                          {feat.requiredPermission}
                                        </code>{" "}
                                        is missing in this role&apos;s database grants.
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Interactive Toggle Switch */}
                              <button
                                type="button"
                                role="switch"
                                aria-checked={isEnabled}
                                onClick={() => handleToggleFeature(feat.key)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                  isEnabled
                                    ? "bg-[#00BFA5]"
                                    : "bg-[#E3ECEA] dark:bg-white/20"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    isEnabled ? "translate-x-5" : "translate-x-0"
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

                {/* Save Changes Floating Action Bar */}
                <div className="sticky bottom-0 pt-3 pb-1 bg-white/90 dark:bg-[#112423]/90 backdrop-blur-md border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                    {isDirty ? (
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        ● You have unsaved configuration changes.
                      </span>
                    ) : (
                      <span>Configuration is up to date with server database.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isDirty && (
                      <button
                        type="button"
                        onClick={handleResetFeatures}
                        disabled={updateFeaturesMutation.isPending}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#728B88] dark:text-[#7D9491] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveFeatures}
                      disabled={!isDirty || updateFeaturesMutation.isPending}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {updateFeaturesMutation.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : activeTab === "permissions" ? (
            /* ============================================================ */
            /* Section 3: Permissions                                       */
            /* ============================================================ */
            isLoadingRole ? (
              <div className="space-y-4 py-8">
                <div className="h-6 w-48 bg-[#E3ECEA] dark:bg-white/10 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ) : isErrorRole ? (
              <div className="p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Failed to load role permissions from server.
                </p>
                <button
                  type="button"
                  onClick={() => refetchRole()}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Protection Notice */}
                <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#526866] dark:text-[#9FB3B0] space-y-1">
                    <p className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      Actual Database Permissions for {role.name}
                    </p>
                    <p>
                      Retrieved directly from <code className="font-mono text-[11px] bg-black/5 dark:bg-white/10 px-1 rounded">role_permissions</code> join table.
                    </p>
                  </div>
                </div>

                {/* Permissions Categories */}
                {Object.keys(permissionsByCategory).length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#728B88] dark:text-[#7D9491]">
                    No permissions currently assigned to this role in the database.
                  </div>
                ) : (
                  Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
                          {category} Domain ({perms.length})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {perms.map((p) => (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1E1D] border border-[#E3ECEA] dark:border-white/10 flex items-start gap-3 shadow-2xs hover:border-[#00BFA5]/40 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] block truncate">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] line-clamp-2 mt-0.5">
                                {p.description || "System permission grant"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          ) : (
            /* ============================================================ */
            /* Section 4: Role Information                                  */
            /* ============================================================ */
            <div className="space-y-5">
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
                    Role Identifier (UUID)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] break-all block">
                    {role.id}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Persona Classification
                  </span>
                  <span className="text-xs font-black text-[#172B2A] dark:text-[#F7FAF9] block">
                    {visuals.category}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Assigned User Accounts
                  </span>
                  <span className="text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] block">
                    {roleDetail?.userCount ?? role.userCount} Active Users
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Permission Grants
                  </span>
                  <span className="text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] block">
                    {roleDetail?.permissionCount ?? role.permissionCount} Capabilities
                  </span>
                </div>
              </div>

              {/* Description & Role Scope */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1E1D] border border-[#E3ECEA] dark:border-white/10 space-y-2 shadow-2xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />
                  Role Description & Scope
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                  {role.description ||
                    "Canonical system role persona providing role-based security boundaries and dynamic dashboard feature mapping."}
                </p>
              </div>

              {/* Architectural Notice */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00B8D4]/10 via-[#00BFA5]/10 to-transparent border border-[#00BFA5]/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />
                  <span className="text-xs font-black text-[#172B2A] dark:text-[#F7FAF9]">
                    RBAC Immutability & Audit Guarantee
                  </span>
                </div>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                  This role is backed by the relational schema (<code className="font-mono text-[11px] bg-black/5 dark:bg-white/10 px-1 rounded">roles</code>, <code className="font-mono text-[11px] bg-black/5 dark:bg-white/10 px-1 rounded">role_permissions</code>, and <code className="font-mono text-[11px] bg-black/5 dark:bg-white/10 px-1 rounded">role_dashboard_features</code>). Feature mutations are tracked with structured audit logging to ensure runtime stability and governance.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 shrink-0 px-6 py-4 border-t border-[#E3ECEA] dark:border-white/10 bg-[#FAFDFD] dark:bg-[#0E1E1D] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Registered in Database: {new Date(role.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-2xl bg-[#172B2A] dark:bg-white text-white dark:text-[#172B2A] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

