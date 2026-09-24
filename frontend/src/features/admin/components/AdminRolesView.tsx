"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Key,
  Lock,
  Search,
  RefreshCw,
  AlertCircle,
  Info,
  ChevronRight,
  UserCheck,
  GraduationCap,
  HeartHandshake,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useAdminRoles, useAdminPermissions } from "../hooks/useAdminQueries";
import { AdminRoleDetailModal } from "./AdminRoleDetailModal";
import type { AdminRoleListItemDTO } from "../types/admin.types";

export function AdminRolesView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRoleListItemDTO | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "ADMIN" | "PRACTITIONER" | "PARTICIPANT">("ALL");

  const { data: rolesData, isLoading, isError, refetch, isFetching } = useAdminRoles();
  const { data: permissionsData } = useAdminPermissions();

  const roles = useMemo(() => rolesData?.roles || [], [rolesData?.roles]);
  const totalRoles = rolesData?.totalRoles ?? roles.length;
  const totalPermissions = rolesData?.totalPermissions ?? permissionsData?.length ?? 6;
  const totalAssignedUsers = rolesData?.totalAssignedUsers ?? 0;

  const getRoleCategory = (name: string): "ADMIN" | "PRACTITIONER" | "PARTICIPANT" => {
    switch (name.toUpperCase()) {
      case "SUPER_ADMIN":
      case "PLATFORM_ADMIN":
      case "COMPANY_ADMIN":
      case "INSTITUTION_ADMIN":
        return "ADMIN";
      case "CAREER_COUNSELLOR":
        return "PRACTITIONER";
      case "PARTICIPANT":
      case "PARENT_GUARDIAN":
      default:
        return "PARTICIPANT";
    }
  };

  const getRoleVisuals = (name: string) => {
    switch (name.toUpperCase()) {
      case "SUPER_ADMIN":
        return {
          icon: ShieldAlert,
          iconBg: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
          border: "border-purple-200 dark:border-purple-800/40",
          badge: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
          glow: "group-hover:border-purple-400 dark:group-hover:border-purple-600",
        };
      case "PLATFORM_ADMIN":
        return {
          icon: ShieldCheck,
          iconBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
          border: "border-indigo-200 dark:border-indigo-800/40",
          badge: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
          glow: "group-hover:border-indigo-400 dark:group-hover:border-indigo-600",
        };
      case "COMPANY_ADMIN":
      case "INSTITUTION_ADMIN":
        return {
          icon: Shield,
          iconBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800/40",
          badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
          glow: "group-hover:border-blue-400 dark:group-hover:border-blue-600",
        };
      case "CAREER_COUNSELLOR":
        return {
          icon: UserCheck,
          iconBg: "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300",
          border: "border-teal-200 dark:border-teal-800/40",
          badge: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
          glow: "group-hover:border-teal-400 dark:group-hover:border-teal-600",
        };
      case "PARENT_GUARDIAN":
        return {
          icon: HeartHandshake,
          iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-800/40",
          badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
          glow: "group-hover:border-amber-400 dark:group-hover:border-amber-600",
        };
      case "PARTICIPANT":
      default:
        return {
          icon: GraduationCap,
          iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-800/40",
          badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
          glow: "group-hover:border-emerald-400 dark:group-hover:border-emerald-600",
        };
    }
  };

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      // Category filter
      if (categoryFilter !== "ALL") {
        const cat = getRoleCategory(r.name);
        if (cat !== categoryFilter) return false;
      }
      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
      );
    });
  }, [roles, categoryFilter, searchQuery]);

  const handleOpenRoleDetail = (role: AdminRoleListItemDTO) => {
    setSelectedRole(role);
    setIsDetailModalOpen(true);
  };

  const handleNavigateToUser = (userId: string) => {
    router.push(`/admin/users?search=${encodeURIComponent(userId)}`);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
              Roles & RBAC Governance
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
              Read-Only
            </span>
          </div>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            Inspect canonical platform personas, system permission boundaries, and assigned user distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Refresh roles"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#00BFA5]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Roles */}
        <div className="p-5 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              Canonical Roles
            </span>
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {isLoading ? "—" : totalRoles}
            </span>
            <span className="text-[10px] font-bold text-[#008F83] dark:text-[#00BFA5] block">
              Database Enforced
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: System Permissions */}
        <div className="p-5 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              System Permissions
            </span>
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {isLoading ? "—" : totalPermissions}
            </span>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block">
              Across 4 Domains
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Key className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Assigned Users */}
        <div className="p-5 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              Assigned Users
            </span>
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {isLoading ? "—" : totalAssignedUsers}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
              Active Role Holders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Governance Model */}
        <div className="p-5 rounded-[22px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block">
              RBAC Governance
            </span>
            <span className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] block leading-tight">
              Protected Model
            </span>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">
              Anti-Tamper Locked
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Security & Governance Architecture Callout */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#00B8D4]/10 via-[#00BFA5]/10 to-transparent border border-[#00BFA5]/30 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-[#526866] dark:text-[#9FB3B0]">
          <h2 className="font-black text-sm text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
            Architectural Role Immutability Policy
          </h2>
          <p>
            Canonical role definitions (`roles`) and permission matrices (`role_permissions`) are core system assets. To protect against unauthorized privilege escalation and guarantee authorization middleware consistency, role structure is immutable. User-level assignments are managed safely via the{" "}
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="text-[#008F83] dark:text-[#00BFA5] font-bold underline hover:opacity-80 cursor-pointer"
            >
              Users & Accounts
            </button>{" "}
            module with strict Super Admin safeguards.
          </p>
        </div>
      </div>

      {/* 4. Filters & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F4F8F7] dark:bg-white/5 rounded-2xl border border-[#E3ECEA] dark:border-white/10 w-full md:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: "All Roles" },
            { id: "ADMIN", label: "Administrative" },
            { id: "PRACTITIONER", label: "Practitioners" },
            { id: "PARTICIPANT", label: "End-Users" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id as typeof categoryFilter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === tab.id
                  ? "bg-white dark:bg-white/15 text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                  : "text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88] dark:text-[#7D9491]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role by name..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] dark:placeholder-[#7D9491] focus:outline-hidden focus:border-[#00BFA5]"
          />
        </div>
      </div>

      {/* 5. Role Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E3ECEA] dark:bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-28 bg-[#E3ECEA] dark:bg-white/10 rounded-md" />
                  <div className="h-3 w-16 bg-[#E3ECEA] dark:bg-white/10 rounded-md" />
                </div>
              </div>
              <div className="h-10 bg-[#F4F8F7] dark:bg-white/5 rounded-2xl" />
              <div className="h-8 bg-[#E3ECEA] dark:bg-white/10 rounded-xl" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-white dark:bg-[#112423] border border-rose-200 dark:border-rose-900/40 rounded-3xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
            Unable to load platform roles
          </h3>
          <p className="text-xs text-[#728B88] dark:text-[#7D9491] mt-1 max-w-sm mx-auto">
            Failed to connect to the database roles catalog. Please verify your administrator session.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 rounded-3xl space-y-2">
          <Shield className="w-10 h-10 text-[#728B88] dark:text-[#7D9491] mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
            No roles matched your search
          </h3>
          <p className="text-xs text-[#728B88] dark:text-[#7D9491]">
            Try adjusting your search query or switching category tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((r) => {
            const visuals = getRoleVisuals(r.name);
            const Icon = visuals.icon;

            return (
              <div
                key={r.id}
                className={`group relative p-5 rounded-[26px] bg-white dark:bg-[#112423] border ${visuals.border} shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${visuals.glow}`}
              >
                <div>
                  {/* Top Row: Icon & Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl ${visuals.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight truncate">
                          {r.name}
                        </h3>
                        <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                          {getRoleCategory(r.name)} Persona
                        </span>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${visuals.badge}`}>
                      <Lock className="w-2.5 h-2.5" />
                      {r.isProtected ? "Protected" : "Active"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] line-clamp-2 min-h-[32px] mb-4">
                    {r.description || "Core platform permission persona with database enforcement."}
                  </p>

                  {/* Metrics Badge Box */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 mb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block uppercase tracking-wider">
                        Assigned Users
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
                        <span className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                          {r.userCount}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] block uppercase tracking-wider">
                        Permissions
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                          {r.permissionCount} Grants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenRoleDetail(r)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-[#172B2A]/5 dark:bg-white/10 hover:bg-[#00BFA5]/15 text-[#172B2A] dark:text-[#F7FAF9] hover:text-[#008F83] dark:hover:text-[#00BFA5] text-xs font-extrabold transition-all duration-200 cursor-pointer"
                  >
                    <span>Role Details</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRoleDetail(r)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#00BFA5]/15 hover:bg-[#00BFA5] text-[#008F83] dark:text-[#00BFA5] hover:text-[#172B2A] text-xs font-black transition-all duration-200 cursor-pointer"
                    title={`View permissions for ${r.name}`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Permissions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Permissions Catalog Table Overview */}
      {permissionsData && permissionsData.length > 0 && (
        <div className="p-6 rounded-[28px] bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  System Permission Catalog
                </h3>
                <span className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                  Master list of defined platform capabilities
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF2F0] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9]">
              {permissionsData.length} Grants
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {permissionsData.map((perm) => (
              <div
                key={perm.id}
                className="p-3 rounded-2xl bg-[#FAFDFD] dark:bg-[#0E1E1D] border border-[#E3ECEA] dark:border-white/10 flex items-start gap-2.5 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                      {perm.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-[#EBF2F0] dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0]">
                      {perm.category || "General"}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] line-clamp-2 mt-0.5">
                    {perm.description || "System permission grant"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Role Details Modal */}
      <AdminRoleDetailModal
        role={selectedRole}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRole(null);
        }}
        onSelectUser={handleNavigateToUser}
      />
    </div>
  );
}

