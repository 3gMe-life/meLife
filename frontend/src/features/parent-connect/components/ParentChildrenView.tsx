"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  GraduationCap,
  School,
  BookOpenCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Clock,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useConnectedChildrenQuery } from "../hooks/useParentConnectQueries";
import { ConnectAnotherChildModal } from "./ConnectAnotherChildModal";
import type { ConnectedChildInfo } from "../types/parent-connect.types";

interface ParentChildrenViewProps {
  user: any;
}

export function ParentChildrenView({ user }: ParentChildrenViewProps) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const {
    data: childrenData,
    isLoading,
    isError,
    refetch,
  } = useConnectedChildrenQuery();

  const childrenList: ConnectedChildInfo[] = childrenData?.data || [];

  const handleChildLinkedSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 space-y-4 animate-pulse shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="h-20 bg-gray-100 dark:bg-slate-800/50 rounded-2xl" />
              <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mx-auto">
          <RefreshCw className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Unable to Load Children Profiles
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We encountered an error retrieving your linked student profiles.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 1. EMPTY STATE
  if (childrenList.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5B54] via-[#106F63] to-[#0A413C] p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center text-emerald-200 shadow-inner">
            <Users className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Children Profiles
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              No students are currently linked to your parent account. Use your child&apos;s 12-character invitation code to connect and track their academic & psychometric journey.
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

  // 2. ACTIVE CHILDREN ROSTER
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
              {childrenList.length} Connected {childrenList.length === 1 ? "Child" : "Children"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            Children Profiles
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your connected children and review their comprehensive academic and psychometric profiles.
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all self-start sm:self-auto active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Connect Another Student
        </button>
      </div>

      {/* Children Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {childrenList.map((child) => {
          const studentId = child.studentId || child.id;
          const fullName = child.name || `${child.firstName || ""} ${child.lastName || ""}`.trim() || "Student";
          const initials = `${child.firstName?.[0] || ""}${child.lastName?.[0] || ""}`.toUpperCase() || "ST";
          const ageDisplay = child.age ? `${child.age} Years` : "Age not specified";
          const gradeDisplay = child.grade || child.gradeLevel || "Grade not set";
          const schoolDisplay = child.school || child.schoolName || "3G MeLife Learning Academy";
          const relationshipDisplay = child.relationship || child.relationshipType || "Guardian";
          const completedCount = child.assessmentProgress?.completed ?? 0;
          const totalCount = child.assessmentProgress?.total ?? 6;
          const progressPercent = Math.round((completedCount / totalCount) * 100);

          return (
            <div
              key={child.linkId || studentId}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800/60 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Top / Avatar + Meta */}
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Student Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F5B54] to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#0F5B54] dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                        {fullName}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Age: {ageDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>

                {/* Academic & Relationship Chips */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800/80">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Grade / Class
                    </span>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                      {gradeDisplay}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Relationship
                    </span>
                    <p className="text-xs font-bold text-[#0F5B54] dark:text-teal-400 flex items-center gap-1">
                      {relationshipDisplay} ✓
                    </p>
                  </div>

                  <div className="col-span-2 pt-1 border-t border-gray-200/60 dark:border-slate-700/60 space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <School className="w-3 h-3" />
                      School / Institution
                    </span>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                      {schoolDisplay}
                    </p>
                  </div>
                </div>

                {/* Assessment Progress */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100/80 dark:border-teal-900/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <BookOpenCheck className="w-3.5 h-3.5 text-[#0F5B54] dark:text-teal-400" />
                      Assessment Progress
                    </span>
                    <span className="font-bold text-[#0F5B54] dark:text-teal-300">
                      {completedCount} / {totalCount} Completed
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-teal-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0F5B54] to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(progressPercent, 4)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                <Link
                  href={`/parent/children/${studentId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all active:scale-95"
                >
                  View Profile
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/parent/reports?studentId=${studentId}`}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-[#0F5B54] dark:hover:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800 transition-all"
                  title="View Reports for this student"
                >
                  <FileText className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Modal */}
      <ConnectAnotherChildModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSuccess={handleChildLinkedSuccess}
      />
    </div>
  );
}
