"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Download,
  Eye,
  Filter,
  Users,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  School,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  useConnectedChildrenQuery,
  useParentReportsQuery,
} from "../hooks/useParentConnectQueries";
import { parentConnectApi } from "../api/parent-connect.api";
import type { ConnectedChildInfo, ParentReportItem } from "../types/parent-connect.types";

interface ParentReportsViewProps {
  user: any;
}

export function ParentReportsView({ user }: ParentReportsViewProps) {
  const searchParams = useSearchParams();
  const initialStudentId = searchParams.get("studentId") || "all";

  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>(initialStudentId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);

  // 1. Fetch connected children for dropdown
  const { data: childrenData, isLoading: isLoadingChildren } = useConnectedChildrenQuery();
  const childrenList: ConnectedChildInfo[] = childrenData?.data || [];

  // 2. Fetch reports for the selected student (or all)
  const activeStudentId = selectedStudentFilter === "all" ? null : selectedStudentFilter;
  const {
    data: reportsData,
    isLoading: isLoadingReports,
    isError,
    refetch,
  } = useParentReportsQuery(activeStudentId);

  const reportsList: ParentReportItem[] = reportsData?.data || [];

  // Filter reports by search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reportsList;
    const q = searchQuery.toLowerCase();
    return reportsList.filter(
      (r) =>
        r.reportTitle.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        (r.profileArchetype && r.profileArchetype.toLowerCase().includes(q)) ||
        r.assessmentCode.toLowerCase().includes(q)
    );
  }, [reportsList, searchQuery]);

  const handleDownloadPdf = async (report: ParentReportItem) => {
    try {
      setDownloadingReportId(report.id);
      const safeName = report.studentName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const filename = `MeLife_Report_${safeName}_${report.assessmentCode}.pdf`;
      await parentConnectApi.downloadReportPdf(report.id, report.languageCode || "en", filename);
    } catch (err) {
      console.error("Failed to download PDF", err);
      alert("Failed to download report PDF. Please try again or view the report online.");
    } finally {
      setDownloadingReportId(null);
    }
  };

  const isLoading = isLoadingChildren || isLoadingReports;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-14 bg-gray-100 dark:bg-slate-800/60 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 space-y-4"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Unable to Load Reports
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We encountered an error retrieving child assessment reports.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0F5B54] text-white hover:bg-[#0A413C] shadow-md transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 uppercase tracking-wider">
              Parent Portal
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {reportsList.length} Generated {reportsList.length === 1 ? "Report" : "Reports"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            Assessment Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Review detailed psychometric analysis, stream recommendations, and career insights for your children.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Child Selector Dropdown */}
        <div className="relative min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Users className="w-4 h-4" />
          </div>
          <select
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-xs font-bold bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F5B54] appearance-none transition-all cursor-pointer"
          >
            <option value="all">All Connected Children ({childrenList.length})</option>
            {childrenList.map((c) => (
              <option key={c.studentId || c.id} value={c.studentId || c.id}>
                {c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search report title, student name, or archetype..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F5B54] placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      {/* Reports Grid or Empty State */}
      {filteredReports.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/50 text-[#0F5B54] dark:text-teal-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No Assessment Reports Found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "No reports match your current search criteria. Try a different query."
                : "Your connected children haven't completed any assessments yet. Once an assessment is completed, the full psychometric report will appear here."}
            </p>
          </div>
          <Link
            href="/parent/children"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F5B54] text-white hover:bg-[#0A413C] transition-all"
          >
            Check Children Profiles
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const isDownloading = downloadingReportId === report.id;

            return (
              <div
                key={report.id}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top metadata badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed ✓
                    </span>

                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.generatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & Archetype */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#0F5B54] dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {report.reportTitle || "Psychometric Assessment Report"}
                    </h3>
                    {report.profileArchetype && (
                      <p className="text-xs font-semibold text-[#0F5B54] dark:text-teal-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {report.profileArchetype}
                      </p>
                    )}
                  </div>

                  {/* Student Tag */}
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-[#0F5B54] dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                        {report.studentFirstName?.[0] || "S"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                          {report.studentName}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {report.studentGrade || "Student Profile"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 mt-5 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                  <Link
                    href={`/parent/reports/${report.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Report
                  </Link>

                  <button
                    onClick={() => handleDownloadPdf(report)}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-[#0F5B54] dark:hover:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800 transition-all disabled:opacity-50"
                    title="Download Report PDF"
                  >
                    {isDownloading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0F5B54]" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
