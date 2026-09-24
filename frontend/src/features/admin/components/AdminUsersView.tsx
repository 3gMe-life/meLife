"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
  ShieldCheck,
  UserCheck,
  Check,
  UserX,
  AlertTriangle,
  Loader2,
  Edit3,
  Trash2,
} from "lucide-react";
import type { AdminUserListItemDTO } from "../types/admin.types";
import {
  useAdminUsers,
  useUpdateUserStatus,
  useBulkUpdateUserStatus,
} from "../hooks/useAdminQueries";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { AdminUserDetailModal } from "./AdminUserDetailModal";
import { AdminUserEditRoleModal } from "./AdminUserEditRoleModal";
import { AdminUserEditProfileModal } from "./AdminUserEditProfileModal";
import { AdminUserDeleteModal } from "./AdminUserDeleteModal";
import { AdminUserBulkDeleteModal } from "./AdminUserBulkDeleteModal";
import { ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

type StatusTab = "ALL" | "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DISABLED";

function formatDate(dateString?: string | null): string {
  if (!dateString) return "Never";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "Never";
  }
}

function getRoleBadge(role?: string) {
  const normalized = (role || "").toUpperCase();
  switch (normalized) {
    case "SUPER_ADMIN":
      return {
        label: "Super Admin",
        className:
          "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
      };
    case "PLATFORM_ADMIN":
      return {
        label: "Platform Admin",
        className:
          "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      };
    case "COMPANY_ADMIN":
      return {
        label: "Company Admin",
        className:
          "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      };
    case "CAREER_COUNSELLOR":
      return {
        label: "Counsellor",
        className:
          "bg-teal-500/15 text-[#008F83] dark:text-teal-300 border-teal-500/30",
      };
    case "PARTICIPANT":
      return {
        label: "Student",
        className:
          "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
      };
    case "PARENT_GUARDIAN":
      return {
        label: "Parent",
        className:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      };
    case "INSTITUTION_ADMIN":
      return {
        label: "Institution",
        className:
          "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      };
    default:
      return {
        label: role || "User",
        className:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
      };
  }
}

function getStatusBadge(status?: string) {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "ACTIVE":
      return {
        label: "Active",
        className:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        dotColor: "bg-emerald-500",
      };
    case "PENDING_VERIFICATION":
      return {
        label: "Pending Verification",
        className:
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        dotColor: "bg-amber-500",
      };
    case "SUSPENDED":
      return {
        label: "Suspended",
        className:
          "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        dotColor: "bg-rose-500",
      };
    case "DISABLED":
      return {
        label: "Disabled",
        className:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
        dotColor: "bg-slate-400",
      };
    default:
      return {
        label: status || "Unknown",
        className:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
        dotColor: "bg-slate-400",
      };
  }
}

export interface AdminUsersViewProps {
  initialRole?: string;
  title?: string;
  subtitle?: string;
  breadcrumbLabel?: string;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  initialRole = "ALL",
  title = "User Accounts & Roles Management",
  subtitle = "Supervise all platform personas, modify security roles, and manage active account statuses.",
  breadcrumbLabel = "User Accounts",
}) => {
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [selectedUserForDetail, setSelectedUserForDetail] =
    useState<AdminUserListItemDTO | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] =
    useState<AdminUserListItemDTO | null>(null);
  const [selectedUserForEditProfile, setSelectedUserForEditProfile] =
    useState<AdminUserListItemDTO | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<AdminUserListItemDTO | null>(null);
  const [userToConfirmStatus, setUserToConfirmStatus] = useState<{
    user: AdminUserListItemDTO;
    nextStatus: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk Selection & Operations State
  const [selectedUsers, setSelectedUsers] = useState<Map<string, AdminUserListItemDTO>>(new Map());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkStatusToConfirm, setBulkStatusToConfirm] = useState<"ACTIVE" | "SUSPENDED" | null>(null);

  const { data: currentUserData } = useCurrentUserQuery();
  const currentAdminUserId = currentUserData?.data?.user?.id;

  const updateStatusMutation = useUpdateUserStatus();
  const bulkStatusMutation = useBulkUpdateUserStatus();

  // Query paginated users
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminUsers({
    page: currentPage,
    limit: pageSize,
    search: searchQuery.trim() || undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    status: activeTab !== "ALL" ? activeTab : undefined,
    sortBy,
    sortOrder,
  });

  const users = data?.users || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  React.useEffect(() => {
    if (pagination.totalPages > 0 && currentPage > pagination.totalPages) {
      setCurrentPage(pagination.totalPages);
    }
  }, [pagination.totalPages, currentPage]);

  // Selection calculations
  const visibleUserIds = React.useMemo(() => users.map((u) => u.id), [users]);
  const isAllVisibleSelected =
    visibleUserIds.length > 0 && visibleUserIds.every((id) => selectedUsers.has(id));
  const isSomeVisibleSelected =
    visibleUserIds.some((id) => selectedUsers.has(id)) && !isAllVisibleSelected;

  const toggleUserSelection = (user: AdminUserListItemDTO) => {
    setSelectedUsers((prev) => {
      const next = new Map(prev);
      if (next.has(user.id)) {
        next.delete(user.id);
      } else {
        next.set(user.id, user);
      }
      return next;
    });
  };

  const toggleSelectAllVisible = (checked: boolean) => {
    setSelectedUsers((prev) => {
      const next = new Map(prev);
      if (checked) {
        for (const u of users) {
          next.set(u.id, u);
        }
      } else {
        for (const u of users) {
          next.delete(u.id);
        }
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedUsers(new Map());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePromptStatusToggle = (user: AdminUserListItemDTO) => {
    const isCurrentlyActive = user.status === "ACTIVE";
    const nextStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";
    setUserToConfirmStatus({ user, nextStatus });
  };

  const handleConfirmStatusToggle = async () => {
    if (!userToConfirmStatus) return;
    const { user, nextStatus } = userToConfirmStatus;

    try {
      const res = await updateStatusMutation.mutateAsync({
        userId: user.id,
        status: nextStatus,
      });

      showToast(
        `User ${user.fullName} status updated to ${res.status}.`
      );
      setUserToConfirmStatus(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update account status.";
      showToast(`Error: ${errorMsg}`);
    }
  };

  const handleConfirmBulkStatus = async () => {
    if (!bulkStatusToConfirm || selectedUsers.size === 0) return;
    try {
      const userIds = Array.from(selectedUsers.keys());
      const res = await bulkStatusMutation.mutateAsync({
        userIds,
        status: bulkStatusToConfirm,
      });
      showToast(res.message);
      setSelectedUsers(new Map());
      setBulkStatusToConfirm(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update account statuses.";
      showToast(`Error: ${msg}`);
    }
  };

  if (isLoading && !data) {
    return <UsersListSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to retrieve platform user accounts. Please try again."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* 1. Page Header & Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E3ECEA] dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#00BFA5] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
            <span className="text-xs text-[#728B88] dark:text-[#7D9491]">/</span>
            <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
              {breadcrumbLabel}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh user accounts from database"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 text-[#00BFA5] ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            <span>{isFetching ? "Refreshing..." : "Sync Directory"}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Total Users
            </span>
            <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {pagination.totalItems.toLocaleString()}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Registered system accounts
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ACTIVE");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "ACTIVE"
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Active Accounts
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Active
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Normal operational state
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("PENDING_VERIFICATION");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "PENDING_VERIFICATION"
              ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Pending Verification
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Pending
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Awaiting email or credentials
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("SUSPENDED");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "SUSPENDED"
              ? "bg-rose-500/10 border-rose-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-rose-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Suspended
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Suspended
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Restricted access
          </p>
        </button>
      </div>

      {/* 3. Search, Role Dropdown, Status Tabs Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
        {/* Status Filter Tabs */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 overflow-x-auto max-w-full">
          {(
            [
              { id: "ALL", label: "All Users" },
              { id: "ACTIVE", label: "Active" },
              { id: "PENDING_VERIFICATION", label: "Pending" },
              { id: "SUSPENDED", label: "Suspended" },
              { id: "DISABLED", label: "Disabled" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Role Select Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter Dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-2xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5] cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="PARTICIPANT">Student / Participant</option>
              <option value="CAREER_COUNSELLOR">Career Counsellor</option>
              <option value="PARENT_GUARDIAN">Parent / Guardian</option>
              <option value="INSTITUTION_ADMIN">Institution Admin</option>
              <option value="COMPANY_ADMIN">Company Admin</option>
              <option value="PLATFORM_ADMIN">Platform Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("_");
                setSortBy(sb);
                setSortOrder(so as "ASC" | "DESC");
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-2xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5] cursor-pointer"
            >
              <option value="created_at_DESC">Newest First</option>
              <option value="created_at_ASC">Oldest First</option>
              <option value="first_name_ASC">Name (A-Z)</option>
              <option value="first_name_DESC">Name (Z-A)</option>
              <option value="last_login_at_DESC">Recent Login</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#728B88] dark:text-[#7D9491] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] dark:placeholder-[#7D9491] focus:outline-none focus:border-[#00BFA5] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#728B88] hover:text-[#172B2A] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Users Table */}
      <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs overflow-hidden flex flex-col">
        {users.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={
                searchQuery
                  ? `No user accounts matching "${searchQuery}"`
                  : "No User Accounts Found"
              }
              description={
                searchQuery
                  ? "Try adjusting your search terms or clearing active role/status filters."
                  : "No registered user records match the selected criteria."
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop Dense Data Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3ECEA]/60 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] bg-[#F4F8F7]/50 dark:bg-white/5">
                    <th className="py-3 pl-6 pr-2 w-10">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          ref={(el) => {
                            if (el) {
                              el.indeterminate = isSomeVisibleSelected;
                            }
                          }}
                          checked={isAllVisibleSelected}
                          onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                          aria-label="Select all visible users"
                          className="w-4 h-4 rounded-md border-[#728B88] text-[#00BFA5] accent-[#00BFA5] focus:ring-[#00BFA5] focus:ring-offset-0 dark:bg-[#112423] cursor-pointer"
                        />
                      </div>
                    </th>
                    <th className="py-3 pl-2 pr-3">Name / Contact</th>
                    <th className="py-3 px-3">Role Persona</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Created</th>
                    <th className="py-3 px-3">Last Login</th>
                    <th className="py-3 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                  {users.map((u) => {
                    const roleBadge = getRoleBadge(u.role);
                    const statusBadge = getStatusBadge(u.status);
                    const isActive = u.status === "ACTIVE";
                    const isSelected = selectedUsers.has(u.id);

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors ${
                          isSelected ? "bg-[#00BFA5]/5 dark:bg-[#00BFA5]/10" : ""
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-3.5 pl-6 pr-2 w-10">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleUserSelection(u)}
                              aria-label={`Select user ${u.fullName || u.email}`}
                              className="w-4 h-4 rounded-md border-[#728B88] text-[#00BFA5] accent-[#00BFA5] focus:ring-[#00BFA5] focus:ring-offset-0 dark:bg-[#112423] cursor-pointer"
                            />
                          </div>
                        </td>

                        {/* Column 1: Name & Email */}
                        <td className="py-3.5 pl-2 pr-3 max-w-[220px]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00B8D4]/15 to-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black text-xs flex items-center justify-center shrink-0 border border-[#00BFA5]/25">
                              {(u.firstName?.[0] || u.email?.[0] || "U").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                                {u.fullName || "Unnamed User"}
                              </div>
                              <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span>{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Role Persona */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleBadge.className}`}
                          >
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Column 3: Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusBadge.className}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`}
                            />
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Column 4: Created Date */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-[#526866] dark:text-[#9FB3B0]">
                          <span className="font-medium">{formatDate(u.createdAt)}</span>
                        </td>

                        {/* Column 5: Last Login */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-[#728B88] dark:text-[#7D9491]">
                          <span>{formatDate(u.lastLoginAt)}</span>
                        </td>

                        {/* Column 6: Actions */}
                        <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForDetail(u)}
                              className="p-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                              title="View user details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Profile Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForEditProfile(u)}
                              className="p-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:text-[#00BFA5] dark:hover:text-[#00BFA5] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                              title="Edit user profile"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Role Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForRole(u)}
                              className="p-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                              title="Edit user role"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Activate / Deactivate Toggle Button */}
                            {isActive ? (
                              <button
                                type="button"
                                onClick={() => handlePromptStatusToggle(u)}
                                disabled={updateStatusMutation.isPending}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] font-bold border border-rose-500/25 transition-colors cursor-pointer disabled:opacity-50"
                                title="Suspend user access"
                              >
                                <UserX className="w-3 h-3" />
                                <span>Suspend</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handlePromptStatusToggle(u)}
                                disabled={updateStatusMutation.isPending}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/25 transition-colors cursor-pointer disabled:opacity-50"
                                title="Activate user account"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Activate</span>
                              </button>
                            )}

                            {/* Delete User Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForDelete(u)}
                              className="p-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete user account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked User Cards View */}
            <div className="md:hidden divide-y divide-[#E3ECEA]/50 dark:divide-white/5">
              {users.map((u) => {
                const roleBadge = getRoleBadge(u.role);
                const statusBadge = getStatusBadge(u.status);
                const isActive = u.status === "ACTIVE";
                const isSelected = selectedUsers.has(u.id);

                return (
                  <div
                    key={u.id}
                    className={`p-4 space-y-3 hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors ${
                      isSelected ? "bg-[#00BFA5]/5 dark:bg-[#00BFA5]/10" : ""
                    }`}
                  >
                    {/* Top Row: Checkbox, User Avatar, Name, Email, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleUserSelection(u)}
                          aria-label={`Select user ${u.fullName || u.email}`}
                          className="w-4 h-4 rounded-md border-[#728B88] text-[#00BFA5] accent-[#00BFA5] focus:ring-[#00BFA5] cursor-pointer shrink-0 mt-0.5"
                        />
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B8D4]/15 to-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black text-sm flex items-center justify-center shrink-0 border border-[#00BFA5]/25">
                          {(u.firstName?.[0] || u.email?.[0] || "U").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-sm truncate">
                            {u.fullName || "Unnamed User"}
                          </div>
                          <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusBadge.className}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Middle Row: Role Persona & Dates */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-2xl bg-[#F4F8F7]/70 dark:bg-white/5 border border-[#E3ECEA]/40 dark:border-white/5">
                      <div>
                        <span className="text-[#728B88] dark:text-[#7D9491] block text-[10px] font-bold uppercase">
                          Role Persona
                        </span>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${roleBadge.className}`}>
                          {roleBadge.label}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#728B88] dark:text-[#7D9491] block text-[10px] font-bold uppercase">
                          Joined / Login
                        </span>
                        <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] block mt-0.5">
                          {formatDate(u.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex items-center justify-end flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedUserForDetail(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUserForEditProfile(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#00BFA5] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUserForRole(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Edit Role</span>
                      </button>

                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => handlePromptStatusToggle(u)}
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/25 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePromptStatusToggle(u)}
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/25 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Activate</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedUserForDelete(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/25 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* 5. Pagination Footer */}
        {pagination.totalItems > 0 && (
          <div className="px-6 py-3.5 bg-[#F4F8F7]/60 dark:bg-white/5 border-t border-[#E3ECEA]/50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#728B88] dark:text-[#7D9491]">
            <div className="flex items-center gap-2">
              <span>
                Showing{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                  {(currentPage - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                  {Math.min(currentPage * pageSize, pagination.totalItems)}
                </strong>{" "}
                of{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                  {pagination.totalItems.toLocaleString()}
                </strong>{" "}
                users
              </span>

              <span className="hidden sm:inline">•</span>

              <div className="hidden sm:flex items-center gap-1">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 rounded-lg px-2 py-0.5 text-xs text-[#172B2A] dark:text-[#F7FAF9]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="p-1.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#EBF2F0] dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={!pagination.hasNextPage}
                  className="p-1.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#EBF2F0] dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bulk-Action Toolbar */}
      {selectedUsers.size > 0 && (
        <div className="sticky bottom-6 z-30 mx-auto w-full max-w-2xl px-4 py-3 sm:px-5 sm:py-3.5 rounded-3xl bg-[#172B2A] dark:bg-[#0E1E1D] text-white shadow-2xl border border-[#00BFA5]/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#00BFA5]/20 text-[#00BFA5] flex items-center justify-center font-black text-xs shrink-0 border border-[#00BFA5]/40">
              ✓
            </div>
            <span className="text-xs font-bold text-[#F7FAF9]">
              <strong className="text-[#00BFA5]">{selectedUsers.size}</strong> user{selectedUsers.size === 1 ? "" : "s"} selected
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setBulkStatusToConfirm("SUSPENDED")}
              disabled={bulkStatusMutation.isPending}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7FAF9] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Suspend
            </button>
            <button
              type="button"
              onClick={() => setBulkStatusToConfirm("ACTIVE")}
              disabled={bulkStatusMutation.isPending}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Activate
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              disabled={bulkStatusMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete / Remove</span>
            </button>
            <button
              type="button"
              onClick={handleClearSelection}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#9FB3B0] hover:text-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 6. Modals */}
      <AdminUserDetailModal
        user={selectedUserForDetail}
        isOpen={Boolean(selectedUserForDetail)}
        onClose={() => setSelectedUserForDetail(null)}
      />

      <AdminUserEditProfileModal
        user={selectedUserForEditProfile}
        isOpen={Boolean(selectedUserForEditProfile)}
        onClose={() => setSelectedUserForEditProfile(null)}
        onSuccess={showToast}
      />

      <AdminUserEditRoleModal
        user={selectedUserForRole}
        isOpen={Boolean(selectedUserForRole)}
        onClose={() => setSelectedUserForRole(null)}
        onSuccess={showToast}
      />

      <AdminUserDeleteModal
        user={selectedUserForDelete}
        isOpen={Boolean(selectedUserForDelete)}
        onClose={() => setSelectedUserForDelete(null)}
        onSuccess={showToast}
      />

      {/* Bulk Delete Confirmation Modal */}
      <AdminUserBulkDeleteModal
        users={Array.from(selectedUsers.values())}
        isOpen={isBulkDeleteModalOpen}
        currentAdminUserId={currentAdminUserId}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          setSelectedUsers(new Map());
        }}
      />

      {/* 7. Sensitive Status Mutation Confirmation Dialog (Single User) */}
      {userToConfirmStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setUserToConfirmStatus(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                userToConfirmStatus.nextStatus === "SUSPENDED"
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  {userToConfirmStatus.nextStatus === "SUSPENDED"
                    ? "Confirm Account Suspension"
                    : "Confirm Account Activation"}
                </h3>
                <p className="text-xs text-[#728B88] dark:text-[#7D9491] mt-0.5">
                  Administrative Access Control
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              Are you sure you want to set the account status of{" "}
              <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                {userToConfirmStatus.user.fullName} ({userToConfirmStatus.user.email})
              </strong>{" "}
              to{" "}
              <strong className={userToConfirmStatus.nextStatus === "SUSPENDED" ? "text-rose-600" : "text-emerald-600"}>
                {userToConfirmStatus.nextStatus}
              </strong>
              ?
              {userToConfirmStatus.nextStatus === "SUSPENDED" && (
                <span className="block mt-1 text-rose-600 dark:text-rose-400">
                  The user will be immediately barred from logging in or conducting sessions.
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECEA]/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setUserToConfirmStatus(null)}
                className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusToggle}
                disabled={updateStatusMutation.isPending}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                  userToConfirmStatus.nextStatus === "SUSPENDED"
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25"
                    : "bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] shadow-md shadow-[#00BFA5]/25"
                }`}
              >
                {updateStatusMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>
                  {userToConfirmStatus.nextStatus === "SUSPENDED"
                    ? "Confirm Suspend"
                    : "Confirm Activate"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Bulk Status Mutation Confirmation Dialog */}
      {bulkStatusToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setBulkStatusToConfirm(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                bulkStatusToConfirm === "SUSPENDED"
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  {bulkStatusToConfirm === "SUSPENDED"
                    ? `Confirm Bulk Suspension (${selectedUsers.size} Users)`
                    : `Confirm Bulk Activation (${selectedUsers.size} Users)`}
                </h3>
                <p className="text-xs text-[#728B88] dark:text-[#7D9491] mt-0.5">
                  Bulk Administrative Access Control
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              Are you sure you want to set the account status of{" "}
              <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                {selectedUsers.size} selected user{selectedUsers.size === 1 ? "" : "s"}
              </strong>{" "}
              to{" "}
              <strong className={bulkStatusToConfirm === "SUSPENDED" ? "text-rose-600" : "text-emerald-600"}>
                {bulkStatusToConfirm}
              </strong>
              ?
              {bulkStatusToConfirm === "SUSPENDED" && (
                <span className="block mt-1 text-rose-600 dark:text-rose-400">
                  Suspended accounts will have active sessions terminated and be immediately barred from logging in.
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECEA]/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBulkStatusToConfirm(null)}
                className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkStatus}
                disabled={bulkStatusMutation.isPending}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                  bulkStatusToConfirm === "SUSPENDED"
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25"
                    : "bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] shadow-md shadow-[#00BFA5]/25"
                }`}
              >
                {bulkStatusMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>
                  {bulkStatusToConfirm === "SUSPENDED"
                    ? "Confirm Bulk Suspend"
                    : "Confirm Bulk Activate"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton Loader matching Users Table Layout
 */
function UsersListSkeleton() {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5" />

      {/* 4 Metric cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-4"
          />
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="h-10 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5" />

      {/* Table skeleton */}
      <div className="h-96 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 p-6" />
    </div>
  );
}
