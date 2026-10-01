"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldCheck,
  GraduationCap,
  School,
  BookOpenCheck,
  FileText,
  LineChart,
  Compass,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  useConnectedChildrenQuery,
  useChildOverviewQuery,
} from "../hooks/useParentConnectQueries";
import { ConnectAnotherChildModal } from "./ConnectAnotherChildModal";
import type { ConnectedChildInfo } from "../types/parent-connect.types";

interface ParentDashboardViewProps {
  user: any;
}

export function ParentDashboardView({ user }: ParentDashboardViewProps) {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const {
    data: childrenData,
    isLoading: isLoadingChildren,
    refetch: refetchChildren,
  } = useConnectedChildrenQuery();

  const childrenList: ConnectedChildInfo[] = childrenData?.data || [];

  // Auto-select first child if none selected
  useEffect(() => {
    if (childrenList.length > 0 && !selectedChildId) {
      setSelectedChildId(childrenList[0].studentId);
    }
  }, [childrenList, selectedChildId]);

  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
  } = useChildOverviewQuery(selectedChildId);

  const overview = overviewData?.data;
  const activeChild = childrenList.find((c) => c.studentId === selectedChildId);

  const handleChildLinkedSuccess = () => {
    refetchChildren();
  };

  if (isLoadingChildren) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0F5B54]" />
        <p className="text-sm font-medium text-gray-500">Loading Parent Portal...</p>
      </div>
    );
  }

  // 1. EMPTY STATE: No connected children yet
  if (childrenList.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5B54] via-[#106F63] to-[#0A413C] p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center text-emerald-200 shadow-inner">
            <Users className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome to the Parent Portal, {user.firstName || "Parent"}!
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Connect with your child using their 12-character invitation code to monitor their psychometric assessment journey, stream recommendations, and career reports.
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white text-[#0F5B54] hover:bg-emerald-50 shadow-lg shadow-black/10 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Connect Your Child Account
            </button>
          </div>
        </div>

        <ConnectAnotherChildModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          onSuccess={handleChildLinkedSuccess}
        />
      </div>
    );
  }

  // 2. ACTIVE PARENT DASHBOARD: 1 or more children connected
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header & Child Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 uppercase tracking-wider">
              Parent Portal
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {childrenList.length} Connected {childrenList.length === 1 ? "Student" : "Students"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            Child Progress & Career Insights
          </h1>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Connect Another Student
        </button>
      </div>

      {/* Child Selector Tabs (if multiple children) */}
      {childrenList.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-[#0E201E] border border-gray-200 dark:border-[#1E3B38] overflow-x-auto">
          {childrenList.map((child) => (
            <button
              key={child.studentId}
              onClick={() => setSelectedChildId(child.studentId)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedChildId === child.studentId
                  ? "bg-white dark:bg-[#132826] text-[#0F5B54] dark:text-teal-300 shadow-sm border border-gray-200 dark:border-[#1E3B38]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-[#0F5B54] dark:text-teal-200 flex items-center justify-center text-[10px] font-bold">
                {child.firstName.charAt(0)}
              </div>
              <span>{child.firstName} {child.lastName}</span>
              <span className="text-[10px] opacity-70">({child.relationshipType})</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected Child Hero Card */}
      {activeChild && (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F5B54] to-[#106F63] text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-[#0F5B54]/20">
                {activeChild.firstName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {activeChild.firstName} {activeChild.lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified {activeChild.relationshipType}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {activeChild.gradeLevel && (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      {activeChild.gradeLevel}
                    </span>
                  )}
                  {activeChild.schoolName && (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <School className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      {activeChild.schoolName}
                    </span>
                  )}
                  {activeChild.curriculumOrBoard && (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      • {activeChild.curriculumOrBoard}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refetchOverview()}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-[#1E3B38] text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-[#0E201E] transition-colors"
                title="Refresh overview"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingOverview ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <span>Assessments Completed</span>
              <BookOpenCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {overview.assessments.filter((a) => a.status === "COMPLETED").length}
              <span className="text-xs text-gray-400 font-normal ml-1.5">
                of {overview.assessments.length} total
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <span>Guidance Reports</span>
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {overview.reports.length}
              <span className="text-xs text-gray-400 font-normal ml-1.5">generated</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <span>Counselling Sessions</span>
              <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {overview.counsellingSessionsCount}
              <span className="text-xs text-gray-400 font-normal ml-1.5">booked</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Section: Assessment Progress & Psychometric Journey */}
      {overview && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Psychometric & Career Battery
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live status of assessments taken by {overview.student.firstName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview.assessments.map((assessment) => (
              <div
                key={assessment.assessmentCode}
                className="p-5 rounded-2xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] space-y-4 hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {assessment.category}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {assessment.title}
                    </h4>
                  </div>

                  {assessment.status === "COMPLETED" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : assessment.status === "IN_PROGRESS" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-[#0E201E] text-gray-500 dark:text-gray-400">
                      Not Started
                    </span>
                  )}
                </div>

                {assessment.status === "COMPLETED" ? (
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-[#1E3B38]">
                    {assessment.summary && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {assessment.summary}
                      </p>
                    )}

                    {assessment.dominantTraits && assessment.dominantTraits.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {assessment.dominantTraits.map((trait) => (
                          <span
                            key={trait}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 dark:bg-teal-950/50 text-[#0F5B54] dark:text-teal-300 border border-teal-200 dark:border-teal-900/60"
                          >
                            {trait.replace(/_/g, " ").toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}

                    {assessment.completedAt && (
                      <p className="text-[11px] text-gray-400">
                        Completed: {new Date(assessment.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-[#1E3B38]">
                    Assessment pending completion by student.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Psychometric & Career Reports Section */}
      {overview && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Psychometric Assessment Reports
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Official psychological reports and career recommendations
                </p>
              </div>
            </div>
          </div>

          {overview.reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {overview.reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#0E201E]/60 border border-gray-200/80 dark:border-[#1E3B38] flex items-center justify-between gap-3 group hover:border-teal-400 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {report.reportTitle}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Generated: {new Date(report.generatedAt).toLocaleDateString()} • Lang: {report.languageCode.toUpperCase()}
                    </p>
                  </div>

                  <Link
                    href={`/participant/reports`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 transition-colors shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">
                No reports generated yet. Reports become available once assessments are submitted.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog */}
      <ConnectAnotherChildModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSuccess={handleChildLinkedSuccess}
      />
    </div>
  );
}
