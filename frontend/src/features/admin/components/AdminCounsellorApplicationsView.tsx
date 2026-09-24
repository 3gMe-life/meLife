"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  UserCheck,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  GraduationCap,
  Building,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shield,
} from "lucide-react";
import type { CounsellorApplicationItemDTO } from "../types/admin.types";
import {
  useAdminCounsellorApplications,
  useSuspendCounsellor,
  useReactivateCounsellor,
  useDeleteCounsellor,
} from "../hooks/useAdminQueries";
import { CounsellorApplicationReviewModal } from "./CounsellorApplicationReviewModal";
import { AdminCounsellorActionMenu } from "./AdminCounsellorActionMenu";
import { AdminCounsellorAccessModal } from "./AdminCounsellorAccessModal";
import { AdminCounsellorEditProfileModal } from "./AdminCounsellorEditProfileModal";
import {
  AdminCounsellorConfirmDialog,
  CounsellorConfirmActionType,
} from "./AdminCounsellorConfirmDialog";
import { ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

type StatusTab = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

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

function getStatusBadge(status?: string) {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "APPROVED":
      return {
        label: "Approved",
        className:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        dotColor: "bg-emerald-500",
        icon: CheckCircle2,
      };
    case "PENDING":
      return {
        label: "Pending Review",
        className:
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        dotColor: "bg-amber-500",
        icon: Clock,
      };
    case "REJECTED":
      return {
        label: "Rejected",
        className:
          "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        dotColor: "bg-rose-500",
        icon: XCircle,
      };
    default:
      return {
        label: status || "Unknown",
        className:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
        dotColor: "bg-slate-400",
        icon: Clock,
      };
  }
}

export const AdminCounsellorApplicationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<CounsellorApplicationItemDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all applications
  const {
    data: applications = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminCounsellorApplications();

  // Sorting state
  const [sortField, setSortField] = useState<"createdAt" | "applicantName">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Summary counts computed across all items
  const counts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter((a) => a.status === "PENDING").length,
      approved: applications.filter((a) => a.status === "APPROVED").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
    };
  }, [applications]);

  // Filtered, searched, and sorted applications
  const processedApplications = useMemo(() => {
    const filtered = applications.filter((app) => {
      // Status filter
      if (activeTab !== "ALL" && app.status !== activeTab) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (app.applicantName || "").toLowerCase();
        const email = (app.applicantEmail || "").toLowerCase();
        const qual = (app.qualification || "").toLowerCase();
        const org = (app.organization || "").toLowerCase();

        return (
          name.includes(q) ||
          email.includes(q) ||
          qual.includes(q) ||
          org.includes(q)
        );
      }

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortField === "createdAt") {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }
      if (sortField === "applicantName") {
        const nameA = (a.applicantName || a.applicantEmail || "").toLowerCase();
        const nameB = (b.applicantName || b.applicantEmail || "").toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });
  }, [applications, activeTab, searchQuery, sortField, sortOrder]);

  // Pagination calculations
  const totalItems = processedApplications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedApplications.slice(startIndex, startIndex + pageSize);
  }, [processedApplications, currentPage, pageSize]);

  const toggleSort = (field: "createdAt" | "applicantName") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "createdAt" ? "desc" : "asc");
    }
    setCurrentPage(1);
  };

  const [selectedApplicationForAccess, setSelectedApplicationForAccess] =
    useState<CounsellorApplicationItemDTO | null>(null);
  const [selectedApplicationForEdit, setSelectedApplicationForEdit] =
    useState<CounsellorApplicationItemDTO | null>(null);
  const [confirmDialogState, setConfirmDialogState] = useState<{
    isOpen: boolean;
    actionType: CounsellorConfirmActionType;
    app: CounsellorApplicationItemDTO | null;
  }>({
    isOpen: false,
    actionType: "DELETE",
    app: null,
  });

  // Mutations for counsellor lifecycle actions
  const suspendMutation = useSuspendCounsellor();
  const reactivateMutation = useReactivateCounsellor();
  const deleteMutation = useDeleteCounsellor();

  const handleOpenReview = (app: CounsellorApplicationItemDTO) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleOpenAccess = (app: CounsellorApplicationItemDTO) => {
    setSelectedApplicationForAccess(app);
  };

  const handleOpenEdit = (app: CounsellorApplicationItemDTO) => {
    setSelectedApplicationForEdit(app);
  };

  const handleOpenSuspend = (app: CounsellorApplicationItemDTO) => {
    setConfirmDialogState({
      isOpen: true,
      actionType: "SUSPEND",
      app,
    });
  };

  const handleOpenReactivate = (app: CounsellorApplicationItemDTO) => {
    setConfirmDialogState({
      isOpen: true,
      actionType: "REACTIVATE",
      app,
    });
  };

  const handleOpenDelete = (app: CounsellorApplicationItemDTO) => {
    setConfirmDialogState({
      isOpen: true,
      actionType: "DELETE",
      app,
    });
  };

  const handleConfirmAction = async () => {
    const { actionType, app } = confirmDialogState;
    if (!app) return;

    try {
      if (actionType === "SUSPEND") {
        await suspendMutation.mutateAsync(app.id || app.userId);
        handleSuccess(`Counsellor account for ${app.applicantName} has been suspended.`);
      } else if (actionType === "REACTIVATE") {
        await reactivateMutation.mutateAsync(app.id || app.userId);
        handleSuccess(`Counsellor account for ${app.applicantName} has been reactivated.`);
      } else if (actionType === "DELETE") {
        const res = await deleteMutation.mutateAsync(app.id || app.userId);
        handleSuccess(res.message || "Action executed successfully.");
      }

      setConfirmDialogState({ isOpen: false, actionType: "DELETE", app: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed to execute.";
      handleSuccess(msg);
    }
  };

  const isConfirmLoading =
    suspendMutation.isPending || reactivateMutation.isPending || deleteMutation.isPending;

  const handleSuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  if (isLoading) {
    return <ApplicationsListSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to retrieve counsellor application queue. Please try again."
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
              Counsellor Applications
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
            Counsellor Applications & Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-0.5">
            Audit professional credentials, approve certified practitioners, and manage practitioner admissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh application records"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 text-[#00BFA5] ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            <span>{isFetching ? "Refreshing..." : "Sync List"}</span>
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
        <button
          type="button"
          onClick={() => {
            setActiveTab("PENDING");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "PENDING"
              ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Pending Queue
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {counts.pending}
            </span>
            {counts.pending > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Action Req.
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Awaiting verification
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("APPROVED");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "APPROVED"
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Approved
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {counts.approved}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Certified practitioners
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("REJECTED");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "REJECTED"
              ? "bg-rose-500/10 border-rose-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-rose-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Rejected
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {counts.rejected}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Unapproved submissions
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ALL");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            activeTab === "ALL"
              ? "bg-[#00BFA5]/10 border-[#00BFA5]/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Total In Queue
            </span>
            <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {counts.all}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            All submitted applications
          </p>
        </button>
      </div>

      {/* 3. Search & Tabs Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
          {(
            [
              { id: "PENDING", label: "Pending", count: counts.pending },
              { id: "APPROVED", label: "Approved", count: counts.approved },
              { id: "REJECTED", label: "Rejected", count: counts.rejected },
              { id: "ALL", label: "All Submissions", count: counts.all },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id
                    ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]"
                    : "bg-slate-200 dark:bg-white/10 text-[#728B88] dark:text-[#7D9491]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#728B88] dark:text-[#7D9491] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, org..."
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] dark:placeholder-[#7D9491] focus:outline-none focus:border-[#00BFA5] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#728B88] hover:text-[#172B2A] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Applications Table */}
      <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs overflow-hidden flex flex-col">
        {paginatedApplications.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={
                searchQuery
                  ? `No applications matching "${searchQuery}"`
                  : activeTab === "PENDING"
                  ? "No Pending Applications"
                  : activeTab === "APPROVED"
                  ? "No Approved Counsellors"
                  : activeTab === "REJECTED"
                  ? "No Rejected Applications"
                  : "No Applications Found"
              }
              description={
                searchQuery
                  ? "Try adjusting your search terms or clearing the filter."
                  : activeTab === "PENDING"
                  ? "All counsellor verification applications have been reviewed."
                  : "No applications found under the selected category."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3ECEA]/60 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] bg-[#F4F8F7]/50 dark:bg-white/5">
                  <th className="py-3 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => toggleSort("applicantName")}
                      className="inline-flex items-center gap-1 hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
                    >
                      <span>Applicant Name / Email</span>
                      {sortField === "applicantName" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-[#00BFA5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-[#00BFA5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Qualification & Institution</th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleSort("createdAt")}
                      className="inline-flex items-center gap-1 hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
                    >
                      <span>Submitted Date</span>
                      {sortField === "createdAt" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-[#00BFA5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-[#00BFA5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Audit Details</th>
                  <th className="py-3 pl-3 pr-6 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                {paginatedApplications.map((app) => {
                  const statusBadge = getStatusBadge(app.status);
                  const isPendingItem = app.status === "PENDING";

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Column 1: Applicant Name & Email */}
                      <td className="py-4 pl-6 pr-3 max-w-[200px]">
                        <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate">
                          {app.applicantName || "Counsellor Applicant"}
                        </div>
                        <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span>{app.applicantEmail}</span>
                        </div>
                      </td>

                      {/* Column 2: Qualification & Institution */}
                      <td className="py-4 px-3 max-w-[220px]">
                        <div className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#00BFA5] shrink-0" />
                          <span>{app.qualification || "Credentials Uploaded"}</span>
                        </div>
                        <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3 h-3 shrink-0" />
                          <span>{app.organization || "Independent Practitioner"}</span>
                        </div>
                      </td>

                      {/* Column 3: Submitted Date */}
                      <td className="py-4 px-3 whitespace-nowrap text-[#526866] dark:text-[#9FB3B0]">
                        <div className="font-medium text-xs">
                          {formatDate(app.createdAt)}
                        </div>
                      </td>

                      {/* Column 4: Status */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusBadge.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`}
                          />
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Column 5: Audit Reviewer Details */}
                      <td className="py-4 px-3 max-w-[160px] text-[11px] text-[#728B88] dark:text-[#7D9491]">
                        {app.reviewerName ? (
                          <div>
                            <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9] block truncate">
                              {app.reviewerName}
                            </span>
                            <span className="text-[10px]">
                              {formatDate(app.reviewedAt)}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-slate-400">Unreviewed</span>
                        )}
                      </td>

                      {/* Column 6: Action */}
                      <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          {isPendingItem ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReview(app)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Review</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenAccess(app)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00BFA5]/10 border border-[#00BFA5]/20 text-[#00897B] dark:text-[#00BFA5] text-xs font-bold hover:bg-[#00BFA5]/20 transition-all cursor-pointer"
                            >
                              <Shield className="w-3.5 h-3.5 text-[#00BFA5]" />
                              <span>Manage Access</span>
                            </button>
                          )}

                          {/* [ ⋮ ] Actions Menu */}
                          <AdminCounsellorActionMenu
                            application={app}
                            onView={() => handleOpenReview(app)}
                            onReview={isPendingItem ? () => handleOpenReview(app) : undefined}
                            onManageAccess={() => handleOpenAccess(app)}
                            onEditProfile={() => handleOpenEdit(app)}
                            onSuspend={() => handleOpenSuspend(app)}
                            onReactivate={() => handleOpenReactivate(app)}
                            onDelete={() => handleOpenDelete(app)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Table Footer & Pagination */}
        {totalItems > 0 && (
          <div className="px-6 py-3.5 bg-[#F4F8F7]/60 dark:bg-white/5 border-t border-[#E3ECEA]/50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#728B88] dark:text-[#7D9491]">
            <div className="flex items-center gap-2">
              <span>
                Showing{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                  {(currentPage - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                  {Math.min(currentPage * pageSize, totalItems)}
                </strong>{" "}
                of{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
                  {totalItems}
                </strong>{" "}
                applications
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

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#EBF2F0] dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
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

      {/* 6. Modals & Dialogs */}
      <CounsellorApplicationReviewModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        onSuccess={handleSuccess}
      />

      <AdminCounsellorAccessModal
        application={selectedApplicationForAccess}
        isOpen={Boolean(selectedApplicationForAccess)}
        onClose={() => setSelectedApplicationForAccess(null)}
        onSuccess={handleSuccess}
      />

      <AdminCounsellorEditProfileModal
        application={selectedApplicationForEdit}
        isOpen={Boolean(selectedApplicationForEdit)}
        onClose={() => setSelectedApplicationForEdit(null)}
        onSuccess={handleSuccess}
      />

      <AdminCounsellorConfirmDialog
        isOpen={confirmDialogState.isOpen}
        actionType={confirmDialogState.actionType}
        counsellorName={confirmDialogState.app?.applicantName || "Counsellor"}
        counsellorEmail={confirmDialogState.app?.applicantEmail}
        isApproved={confirmDialogState.app?.status === "APPROVED"}
        isLoading={isConfirmLoading}
        onConfirm={handleConfirmAction}
        onClose={() =>
          setConfirmDialogState({ isOpen: false, actionType: "DELETE", app: null })
        }
      />
    </div>
  );
};

/**
 * Skeleton Loader matching Counsellor Applications List Layout
 */
function ApplicationsListSkeleton() {
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
