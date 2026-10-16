"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  Brain,
  Search,
  Users,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import {
  useCounsellorSessions,
  useUpdateSessionStatus,
} from "../hooks/useCounsellorQueries";
import {
  CounsellingSessionDTO,
  SessionStatus,
  AssessmentStatus,
  ReportStatus,
} from "../types/counsellor.types";
import { StudentPsychometricSummaryModal } from "./StudentPsychometricSummaryModal";
import { SessionNotesModal } from "./SessionNotesModal";

export const CounsellorSessionsView: React.FC = () => {
  // Filter and Search states
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [assessmentFilter, setAssessmentFilter] = useState<string>("ALL");
  const [reportFilter, setReportFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "student" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Modals state
  const [selectedStudentForSummary, setSelectedStudentForSummary] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedSessionForNotes, setSelectedSessionForNotes] =
    useState<CounsellingSessionDTO | null>(null);

  // Data queries & mutations
  const {
    data: allSessions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCounsellorSessions();

  const updateStatusMutation = useUpdateSessionStatus();

  const handleUpdateStatus = async (
    sessionId: string,
    status: SessionStatus,
    meetingLink?: string
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        sessionId,
        status,
        meetingLink,
      });
    } catch (err) {
      console.error("Failed to update session status:", err);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
    setDateFilter("ALL");
    setAssessmentFilter("ALL");
    setReportFilter("ALL");
    setSortBy("date");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "ALL") count++;
    if (searchQuery.trim()) count++;
    if (dateFilter !== "ALL") count++;
    if (assessmentFilter !== "ALL") count++;
    if (reportFilter !== "ALL") count++;
    return count;
  }, [statusFilter, searchQuery, dateFilter, assessmentFilter, reportFilter]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredSessions = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(now);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0];
    const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonthPrefix = `${year}-${month}`;

    return allSessions
      .filter((session) => {
        // Status filter
        if (statusFilter === "TODAY") {
          if (session.sessionDate !== todayStr) return false;
        } else if (statusFilter === "UPCOMING") {
          if (session.status !== "CONFIRMED" || session.sessionDate < todayStr) return false;
        } else if (statusFilter !== "ALL") {
          if (session.status !== statusFilter) return false;
        }

        // Date filter
        if (dateFilter === "TODAY") {
          if (session.sessionDate !== todayStr) return false;
        } else if (dateFilter === "THIS_WEEK") {
          if (session.sessionDate < startOfWeekStr || session.sessionDate > endOfWeekStr)
            return false;
        } else if (dateFilter === "THIS_MONTH") {
          if (!session.sessionDate.startsWith(currentMonthPrefix)) return false;
        } else if (dateFilter === "UPCOMING") {
          if (session.sessionDate < todayStr) return false;
        } else if (dateFilter === "PAST") {
          if (session.sessionDate >= todayStr) return false;
        }

        // Assessment filter
        if (assessmentFilter !== "ALL") {
          const currentAssessment = session.assessmentStatus || "NOT_STARTED";
          if (currentAssessment !== assessmentFilter) return false;
        }

        // Report filter
        if (reportFilter !== "ALL") {
          const currentReport = session.reportStatus || "NOT_AVAILABLE";
          if (currentReport !== reportFilter) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesStudent = (session.studentName || "").toLowerCase().includes(q);
          const matchesEmail = (session.studentEmail || "").toLowerCase().includes(q);
          const matchesType = (session.sessionType || "").toLowerCase().includes(q);
          const matchesNotes = (session.studentNotes || "").toLowerCase().includes(q);
          if (!matchesStudent && !matchesEmail && !matchesType && !matchesNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "date") {
          const dtA = `${a.sessionDate} ${a.sessionTime || "00:00"}`;
          const dtB = `${b.sessionDate} ${b.sessionTime || "00:00"}`;
          comp = dtA.localeCompare(dtB);
        } else if (sortBy === "student") {
          const nameA = a.studentName || "";
          const nameB = b.studentName || "";
          comp = nameA.localeCompare(nameB);
        } else if (sortBy === "status") {
          comp = (a.status || "").localeCompare(b.status || "");
        }
        return sortOrder === "asc" ? comp : -comp;
      });
  }, [
    allSessions,
    statusFilter,
    dateFilter,
    assessmentFilter,
    reportFilter,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage));
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSessions.slice(start, start + itemsPerPage);
  }, [filteredSessions, currentPage, itemsPerPage]);

  const renderAssessmentBadge = (status?: AssessmentStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Assessed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> In Progress
          </span>
        );
      case "NOT_STARTED":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            ○ Not Started
          </span>
        );
    }
  };

  const renderReportBadge = (status?: ReportStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <FileText className="h-3 w-3" /> Report Ready
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="h-3 w-3" /> Generating
          </span>
        );
      case "NOT_AVAILABLE":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            — No Report
          </span>
        );
    }
  };

  const renderSessionStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            CONFIRMED
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            PENDING APPROVAL
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
            COMPLETED
          </span>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatSessionType = (type: string) => {
    switch (type) {
      case "FREE_INTRO":
        return "15-min Intro Call";
      case "CAREER_GUIDANCE":
        return "45-min Career Guidance";
      case "DETAILED_PROFILE":
        return "60-min Comprehensive Advisory";
      default:
        return type.replace(/_/g, " ");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Student Sessions & Consultations
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Track, manage, and conduct all career guidance appointments with psychometric insights and session notes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <p className="text-xs font-medium">
              {(error as Error)?.message || "Failed to load session appointments. Please try again."}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Top Filter Bar: Search & Status Pills */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, email, or notes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: "ALL", label: "All Sessions" },
              { id: "TODAY", label: "Today" },
              { id: "UPCOMING", label: "Upcoming" },
              { id: "PENDING", label: "Pending" },
              { id: "CONFIRMED", label: "Confirmed" },
              { id: "COMPLETED", label: "Completed" },
              { id: "CANCELLED", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
            <span>Filters:</span>
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">All Dates</option>
            <option value="TODAY">Today Only</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="UPCOMING">Upcoming Dates</option>
            <option value="PAST">Past Dates</option>
          </select>

          {/* Assessment Filter */}
          <select
            value={assessmentFilter}
            onChange={(e) => {
              setAssessmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">All Assessment Statuses</option>
            <option value="COMPLETED">Assessed (Completed)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>

          {/* Report Filter */}
          <select
            value={reportFilter}
            onChange={(e) => {
              setReportFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">All Report Statuses</option>
            <option value="AVAILABLE">Report Ready</option>
            <option value="PENDING">Generating</option>
            <option value="NOT_AVAILABLE">No Report</option>
          </select>

          {/* Sorting */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "student" | "status")}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="date">Date & Time</option>
              <option value="student">Student Name</option>
              <option value="status">Session Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              title="Toggle sort direction"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                <X className="h-3 w-3" /> Reset ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sessions Content */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-850" />
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-20 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-850" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            No session appointments match your criteria
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {activeFiltersCount > 0
              ? "Try broadening your filter criteria or resetting active filters."
              : "You currently have no scheduled student sessions assigned."}
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table Layout */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850/60 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-4 py-3.5">Assessment & Report</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                    <th className="px-4 py-3.5">Session Type</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedSessions.map((session) => {
                    const isPending = session.status === "PENDING";
                    const isConfirmed = session.status === "CONFIRMED";
                    const isCompleted = session.status === "COMPLETED";

                    return (
                      <tr
                        key={session.id}
                        className="transition hover:bg-slate-50/80 dark:hover:bg-slate-850/40"
                      >
                        {/* Student Column */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-xs">
                              {(session.studentName || "S").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <Link
                                href={`/counsellor/sessions/${session.id}`}
                                className="font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                              >
                                {session.studentName || "Student"}
                              </Link>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                                {session.studentEmail || "Student Candidate"}
                              </div>
                              {session.hasConsent && (
                                <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <ShieldCheck className="h-3 w-3" /> Consent Active
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Assessment & Report Status */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div>{renderAssessmentBadge(session.assessmentStatus)}</div>
                            <div>{renderReportBadge(session.reportStatus)}</div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                            <span>{session.sessionDate}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{session.sessionTime}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formatSessionType(session.sessionType)}
                          </span>
                          <div className="text-[11px] text-slate-400">
                            {session.durationMinutes} minutes
                          </div>
                        </td>

                        {/* Session Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderSessionStatusBadge(session.status)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Psychometrics */}
                            <button
                              onClick={() =>
                                setSelectedStudentForSummary({
                                  id: session.studentId,
                                  name: session.studentName || "Student",
                                })
                              }
                              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                              title="View Student Psychometric Dossier"
                            >
                              <Brain className="h-4 w-4" />
                            </button>

                            {/* Session Notes */}
                            <button
                              onClick={() => setSelectedSessionForNotes(session)}
                              className={`rounded-xl p-2 transition ${
                                session.notesAdded
                                  ? "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/60"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                              }`}
                              title={session.notesAdded ? "Edit Guidance Notes" : "Add Guidance Notes"}
                            >
                              <FileText className="h-4 w-4" />
                            </button>

                            {/* Pending Actions */}
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(session.id, "REJECTED")}
                                  className="rounded-xl border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-800 dark:text-rose-400"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      session.id,
                                      "CONFIRMED",
                                      `https://meet.3gmelife.com/session-${session.id.slice(0, 8)}`
                                    )
                                  }
                                  className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
                                >
                                  Accept
                                </button>
                              </>
                            )}

                            {/* Confirmed / Completed Messaging */}
                            {(isConfirmed || isCompleted) && (
                              <Link
                                href={`/counsellor/messages?studentId=${session.studentId}`}
                                className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                                title="Message Student"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>Message</span>
                              </Link>
                            )}

                            {/* Confirmed Actions */}
                            {isConfirmed && (
                              <>
                                {session.meetingLink ? (
                                  <a
                                    href={session.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                                  >
                                    <Video className="h-3.5 w-3.5" />
                                    <span>Join</span>
                                  </a>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        session.id,
                                        "CONFIRMED",
                                        `https://meet.3gmelife.com/session-${session.id.slice(0, 8)}`
                                      )
                                    }
                                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                                  >
                                    Set Link
                                  </button>
                                )}
                                <button
                                  onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                                  className="rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                                >
                                  Complete
                                </button>
                              </>
                            )}

                            {/* View Detail Link */}
                            <Link
                              href={`/counsellor/sessions/${session.id}`}
                              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                              title="View Full Session Dossier"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {paginatedSessions.map((session) => {
              const isPending = session.status === "PENDING";
              const isConfirmed = session.status === "CONFIRMED";

              return (
                <div
                  key={session.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {renderSessionStatusBadge(session.status)}
                        <span className="text-[11px] font-semibold text-slate-500">
                          {session.durationMinutes} min
                        </span>
                      </div>
                      <Link
                        href={`/counsellor/sessions/${session.id}`}
                        className="mt-2 block text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-white"
                      >
                        {session.studentName || "Student Candidate"}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {formatSessionType(session.sessionType)}
                      </div>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {renderAssessmentBadge(session.assessmentStatus)}
                    {renderReportBadge(session.reportStatus)}
                    {session.hasConsent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <ShieldCheck className="h-2.5 w-2.5" /> Consent Active
                      </span>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{session.sessionDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{session.sessionTime}</span>
                    </div>
                  </div>

                  {/* Student Notes */}
                  {session.studentNotes && (
                    <p className="mt-2.5 rounded-xl bg-slate-50 p-2.5 text-xs italic text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      &quot;{session.studentNotes}&quot;
                    </p>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setSelectedStudentForSummary({
                            id: session.studentId,
                            name: session.studentName || "Student",
                          })
                        }
                        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        title="Psychometrics"
                      >
                        <Brain className="h-4 w-4 text-indigo-500" />
                      </button>

                      <button
                        onClick={() => setSelectedSessionForNotes(session)}
                        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        title="Notes"
                      >
                        <FileText className="h-4 w-4 text-indigo-500" />
                      </button>

                      <Link
                        href={`/counsellor/sessions/${session.id}`}
                        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        title="Details"
                      >
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(session.id, "REJECTED")}
                            className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                session.id,
                                "CONFIRMED",
                                `https://meet.3gmelife.com/session-${session.id.slice(0, 8)}`
                              )
                            }
                            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                          >
                            Accept
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <>
                          <Link
                            href={`/counsellor/messages?studentId=${session.studentId}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Message</span>
                          </Link>
                          {session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                            >
                              <Video className="h-3.5 w-3.5" />
                              <span>Join</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                            className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {Math.min(currentPage * itemsPerPage, filteredSessions.length)}
                </span>{" "}
                of <span className="font-bold text-slate-900 dark:text-white">{filteredSessions.length}</span> sessions
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {currentPage} / {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safe Psychometrics Summary Modal */}
      <StudentPsychometricSummaryModal
        studentId={selectedStudentForSummary?.id || null}
        studentName={selectedStudentForSummary?.name}
        isOpen={Boolean(selectedStudentForSummary)}
        onClose={() => setSelectedStudentForSummary(null)}
      />

      {/* Guidance Notes Modal */}
      <SessionNotesModal
        session={selectedSessionForNotes}
        isOpen={Boolean(selectedSessionForNotes)}
        onClose={() => setSelectedSessionForNotes(null)}
        isCounsellorView={true}
      />
    </div>
  );
};
