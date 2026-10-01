"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School,
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
  Layers,
  MapPin,
  Ban,
  UserCheck,
  ExternalLink,
  Plus,
} from "lucide-react";
import type {
  InstitutionApplicationItemDTO,
  AdminInstitutionListItemDTO,
} from "../types/admin.types";
import {
  useAdminInstitutionApplications,
  useAdminInstitutions,
  useAdminInstitutionMetrics,
  useUpdateInstitutionStatus,
  useDeleteInstitutionApplication,
} from "../hooks/useAdminQueries";
import { InstitutionApplicationReviewModal } from "./InstitutionApplicationReviewModal";
import { AdminInstitutionActionMenu } from "./AdminInstitutionActionMenu";
import { ErrorState, LoadingState } from "@/features/dashboard/components/common/LoadingState";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";

type StatusTab = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
type ViewMode = "APPLICATIONS" | "DIRECTORY";

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
    case "ACTIVE":
      return {
        label: "Approved & Active",
        className:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        dotColor: "bg-emerald-500",
        icon: CheckCircle2,
      };
    case "PENDING":
    case "UNDER_REVIEW":
      return {
        label: "Pending Verification",
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
    case "SUSPENDED":
      return {
        label: "Suspended",
        className:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
        dotColor: "bg-slate-400",
        icon: Ban,
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

export const AdminInstitutionApplicationsView: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("APPLICATIONS");
  const [activeTab, setActiveTab] = useState<StatusTab>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<InstitutionApplicationItemDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<"createdAt" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Queries
  const {
    data: applications = [],
    isLoading: isAppsLoading,
    isError: isAppsError,
    error: appsError,
    refetch: refetchApps,
    isFetching: isAppsFetching,
  } = useAdminInstitutionApplications();

  const {
    data: directory = [],
    isLoading: isDirLoading,
    isError: isDirError,
    error: dirError,
    refetch: refetchDir,
    isFetching: isDirFetching,
  } = useAdminInstitutions();

  const { data: metrics } = useAdminInstitutionMetrics();

  // Mutations
  const updateStatusMutation = useUpdateInstitutionStatus();
  const deleteAppMutation = useDeleteInstitutionApplication();

  // Summary counts
  const counts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter(
        (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW"
      ).length,
      approved: applications.filter((a) => a.status === "APPROVED").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
      directoryTotal: directory.length,
    };
  }, [applications, directory]);

  // Filtered applications
  const processedApplications = useMemo(() => {
    const filtered = applications.filter((app) => {
      // Status filter
      if (activeTab === "PENDING") {
        if (app.status !== "PENDING" && app.status !== "UNDER_REVIEW") return false;
      } else if (activeTab !== "ALL" && app.status !== activeTab) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (app.institutionName || "").toLowerCase();
        const email = (app.officialEmail || "").toLowerCase();
        const contact = (app.contactName || "").toLowerCase();
        const reg = (app.registrationNumber || "").toLowerCase();
        const board = (app.affiliationBoard || "").toLowerCase();

        return (
          name.includes(q) ||
          email.includes(q) ||
          contact.includes(q) ||
          reg.includes(q) ||
          board.includes(q)
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
      if (sortField === "name") {
        const nameA = (a.institutionName || "").toLowerCase();
        const nameB = (b.institutionName || "").toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });
  }, [applications, activeTab, searchQuery, sortField, sortOrder]);

  // Filtered directory
  const processedDirectory = useMemo(() => {
    const filtered = directory.filter((inst) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (inst.name || "").toLowerCase();
        const code = (inst.code || "").toLowerCase();
        const email = (inst.contactEmail || "").toLowerCase();
        const city = (inst.city || "").toLowerCase();
        const adminEmail = (inst.adminUser?.email || "").toLowerCase();

        return (
          name.includes(q) ||
          code.includes(q) ||
          email.includes(q) ||
          city.includes(q) ||
          adminEmail.includes(q)
        );
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "createdAt") {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [directory, searchQuery, sortField, sortOrder]);

  // Pagination calculations
  const totalItems =
    viewMode === "APPLICATIONS"
      ? processedApplications.length
      : processedDirectory.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedApplications.slice(startIndex, startIndex + pageSize);
  }, [processedApplications, currentPage, pageSize]);

  const paginatedDirectory = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedDirectory.slice(startIndex, startIndex + pageSize);
  }, [processedDirectory, currentPage, pageSize]);

  const toggleSort = (field: "createdAt" | "name") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "createdAt" ? "desc" : "asc");
    }
    setCurrentPage(1);
  };

  const handleOpenReview = (app: InstitutionApplicationItemDTO) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (inst: AdminInstitutionListItemDTO) => {
    try {
      const nextStatus = !inst.isActive;
      await updateStatusMutation.mutateAsync({
        id: inst.id,
        isActive: nextStatus,
      });
      handleSuccess(
        `Institution ${inst.name} is now ${nextStatus ? "Active" : "Suspended"}.`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status.";
      handleSuccess(msg);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    if (!window.confirm("Are you sure you want to delete this institution application record?")) {
      return;
    }
    try {
      const res = await deleteAppMutation.mutateAsync(appId);
      handleSuccess(res.message || "Application deleted successfully.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete application.";
      handleSuccess(msg);
    }
  };

  const handleSuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const isLoading = isAppsLoading || isDirLoading;
  const isError = isAppsError || isDirError;
  const isFetching = isAppsFetching || isDirFetching;

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          message={
            (appsError || dirError) instanceof Error
              ? (appsError || dirError)?.message || "Error"
              : "Unable to retrieve institution queue. Please try again."
          }
          onRetry={() => {
            refetchApps();
            refetchDir();
          }}
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
              Institutions & Schools
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
            Institution & School Management
          </h1>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-0.5">
            Audit school accreditations, approve partner applications, provision institutional admin portals, and monitor student cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              refetchApps();
              refetchDir();
            }}
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
            setViewMode("APPLICATIONS");
            setActiveTab("PENDING");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            viewMode === "APPLICATIONS" && activeTab === "PENDING"
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
            setViewMode("DIRECTORY");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            viewMode === "DIRECTORY"
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Active Directory
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <School className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
              {counts.directoryTotal}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              Live
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Provisioned institutions
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setViewMode("APPLICATIONS");
            setActiveTab("REJECTED");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            viewMode === "APPLICATIONS" && activeTab === "REJECTED"
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
            Declined submissions
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setViewMode("APPLICATIONS");
            setActiveTab("ALL");
            setCurrentPage(1);
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            viewMode === "APPLICATIONS" && activeTab === "ALL"
              ? "bg-[#00BFA5]/10 border-[#00BFA5]/40 shadow-sm"
              : "bg-white dark:bg-[#112423] border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
              Total Applications
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
        {/* View Mode & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary View Switcher */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setViewMode("APPLICATIONS");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "APPLICATIONS"
                  ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Applications Queue</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("DIRECTORY");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "DIRECTORY"
                  ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs font-extrabold"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Institution Directory ({counts.directoryTotal})</span>
            </button>
          </div>

          {/* Secondary Filter Tabs (Applications Queue Only) */}
          {viewMode === "APPLICATIONS" && (
            <div className="inline-flex items-center p-1 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
              {(
                [
                  { id: "PENDING", label: "Pending", count: counts.pending },
                  { id: "APPROVED", label: "Approved", count: counts.approved },
                  { id: "REJECTED", label: "Rejected", count: counts.rejected },
                  { id: "ALL", label: "All", count: counts.all },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
          )}
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
            placeholder={
              viewMode === "APPLICATIONS"
                ? "Search by school name, contact, email..."
                : "Search by school, code, location..."
            }
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

      {/* 4. Table Container */}
      <div className="rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xs overflow-hidden flex flex-col">
        {viewMode === "APPLICATIONS" ? (
          /* ======================================================== */
          /* APPLICATIONS QUEUE TABLE                                 */
          /* ======================================================== */
          paginatedApplications.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title={
                  searchQuery
                    ? `No applications matching "${searchQuery}"`
                    : activeTab === "PENDING"
                    ? "No Pending Applications"
                    : activeTab === "APPROVED"
                    ? "No Approved Applications"
                    : activeTab === "REJECTED"
                    ? "No Rejected Applications"
                    : "No Applications Found"
                }
                description={
                  searchQuery
                    ? "Try adjusting your search terms or clearing the filter."
                    : activeTab === "PENDING"
                    ? "All institution verification applications have been reviewed."
                    : "No institutional applications found under the selected category."
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
                        onClick={() => toggleSort("name")}
                        className="inline-flex items-center gap-1 hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
                      >
                        <span>Institution Name & Type</span>
                        {sortField === "name" ? (
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
                    <th className="py-3 px-3">Contact Person & Official Email</th>
                    <th className="py-3 px-3">Board & Registration</th>
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
                    const isPendingItem =
                      app.status === "PENDING" || app.status === "UNDER_REVIEW";

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors"
                      >
                        {/* Column 1: Institution Name & Type */}
                        <td className="py-4 pl-6 pr-3 max-w-[220px]">
                          <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate">
                            {app.institutionName}
                          </div>
                          <div className="text-[11px] text-[#008F83] dark:text-[#00BFA5] font-semibold truncate flex items-center gap-1.5 mt-0.5">
                            <School className="w-3 h-3 shrink-0" />
                            <span>{app.institutionType || "School"}</span>
                            {app.district && (
                              <span className="text-[#728B88] dark:text-[#7D9491] font-normal">
                                • {app.district}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 2: Contact Person & Email */}
                        <td className="py-4 px-3 max-w-[220px]">
                          <div className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate">
                            {app.contactName}
                          </div>
                          <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{app.officialEmail}</span>
                          </div>
                        </td>

                        {/* Column 3: Board & Registration */}
                        <td className="py-4 px-3 max-w-[180px]">
                          <div className="font-medium text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate">
                            {app.affiliationBoard || "CBSE / State"}
                          </div>
                          <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate font-mono mt-0.5">
                            {app.registrationNumber || "Reg. Pending"}
                          </div>
                        </td>

                        {/* Column 4: Submitted Date */}
                        <td className="py-4 px-3 whitespace-nowrap text-[#526866] dark:text-[#9FB3B0]">
                          <div className="font-medium text-xs">
                            {formatDate(app.createdAt)}
                          </div>
                        </td>

                        {/* Column 5: Status */}
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

                        {/* Column 6: Audit Reviewer Details */}
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

                        {/* Column 7: Action */}
                        <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            {isPendingItem ? (
                              <button
                                type="button"
                                onClick={() => handleOpenReview(app)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Review & Approve</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenReview(app)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00BFA5]/10 border border-[#00BFA5]/20 text-[#00897B] dark:text-[#00BFA5] text-xs font-bold hover:bg-[#00BFA5]/20 transition-all cursor-pointer"
                              >
                                <School className="w-3.5 h-3.5 text-[#00BFA5]" />
                                <span>View Details</span>
                              </button>
                            )}

                            {/* [ ⋮ ] Actions Menu */}
                            <AdminInstitutionActionMenu
                              application={app}
                              onView={() => handleOpenReview(app)}
                              onReview={isPendingItem ? () => handleOpenReview(app) : undefined}
                              onDelete={() => handleDeleteApp(app.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* ======================================================== */
          /* REGISTERED INSTITUTIONS DIRECTORY TABLE                  */
          /* ======================================================== */
          paginatedDirectory.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title={
                  searchQuery
                    ? `No institutions matching "${searchQuery}"`
                    : "No Registered Institutions Found"
                }
                description={
                  searchQuery
                    ? "Try adjusting your search terms or clearing the filter."
                    : "Approved institutions will appear here with active cohort rosters and student metrics."
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
                        onClick={() => toggleSort("name")}
                        className="inline-flex items-center gap-1 hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
                      >
                        <span>Institution Name & Code</span>
                        {sortField === "name" ? (
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
                    <th className="py-3 px-3">Location & Type</th>
                    <th className="py-3 px-3">Admin Account</th>
                    <th className="py-3 px-3">Cohorts / Classes</th>
                    <th className="py-3 px-3">Enrolled Students</th>
                    <th className="py-3 px-3">Account Status</th>
                    <th className="py-3 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECEA]/40 dark:divide-white/5">
                  {paginatedDirectory.map((inst) => {
                    const statusBadge = getStatusBadge(
                      inst.isActive ? "ACTIVE" : "SUSPENDED"
                    );

                    return (
                      <tr
                        key={inst.id}
                        className="hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/institutions/${inst.id}`)}
                      >
                        {/* Column 1: Institution Name & Code */}
                        <td className="py-4 pl-6 pr-3 max-w-[220px]">
                          <div className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate">
                            {inst.name}
                          </div>
                          <div className="text-[11px] text-[#008F83] dark:text-[#00BFA5] font-mono truncate mt-0.5">
                            {inst.code}
                          </div>
                        </td>

                        {/* Column 2: Location & Type */}
                        <td className="py-4 px-3 max-w-[180px]">
                          <div className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#00BFA5] shrink-0" />
                            <span>{[inst.city, inst.state].filter(Boolean).join(", ") || "India"}</span>
                          </div>
                          <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate mt-0.5">
                            {inst.type}
                          </div>
                        </td>

                        {/* Column 3: Admin Account */}
                        <td className="py-4 px-3 max-w-[200px]">
                          <div className="font-medium text-[#172B2A] dark:text-[#F7FAF9] text-xs truncate">
                            {inst.adminUser?.name || "Institution Admin"}
                          </div>
                          <div className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{inst.adminUser?.email || inst.contactEmail}</span>
                          </div>
                        </td>

                        {/* Column 4: Cohorts */}
                        <td className="py-4 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                            <Layers className="w-3 h-3 text-[#00BFA5]" />
                            <span>{inst.totalClasses} Classes</span>
                          </span>
                        </td>

                        {/* Column 5: Enrolled Students */}
                        <td className="py-4 px-3 whitespace-nowrap">
                          <div className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                            {inst.totalStudents}{" "}
                            <span className="text-[11px] font-normal text-[#728B88] dark:text-[#7D9491]">
                              / {inst.studentCapacity} Capacity
                            </span>
                          </div>
                          <div className="w-24 bg-slate-200 dark:bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div
                              className="bg-[#00BFA5] h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((inst.totalStudents / (inst.studentCapacity || 1)) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </td>

                        {/* Column 6: Account Status */}
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

                        {/* Column 7: Actions */}
                        <td
                          className="py-4 pl-3 pr-6 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/institutions/${inst.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00BFA5]/10 border border-[#00BFA5]/20 text-[#00897B] dark:text-[#00BFA5] text-xs font-bold hover:bg-[#00BFA5]/20 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </Link>

                            {/* [ ⋮ ] Actions Menu */}
                            <AdminInstitutionActionMenu
                              institution={inst}
                              onViewDetails={() => router.push(`/admin/institutions/${inst.id}`)}
                              onToggleStatus={() => handleToggleStatus(inst)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
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
                records
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

      {/* Review Modal */}
      <InstitutionApplicationReviewModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        onSuccess={(msg) => {
          handleSuccess(msg);
          refetchApps();
          refetchDir();
        }}
      />
    </div>
  );
};
