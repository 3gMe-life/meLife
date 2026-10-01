"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  School,
  PlusCircle,
  Search,
  Filter,
  Users,
  GraduationCap,
  ClipboardCheck,
  UserCheck,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useInstitutionClasses } from "../hooks/useInstitutionQueries";
import { CreateClassModal } from "./modals/CreateClassModal";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";

export const InstitutionClassesView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: classes = [], isLoading, isError, refetch } = useInstitutionClasses();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load institution cohorts. Please check your connection."
        onRetry={() => refetch()}
      />
    );
  }

  // Filter cohorts
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.gradeLevel.toLowerCase().includes(search.toLowerCase()) ||
      cls.division.toLowerCase().includes(search.toLowerCase()) ||
      (cls.coordinatorName && cls.coordinatorName.toLowerCase().includes(search.toLowerCase()));

    const matchesGrade = selectedGrade === "ALL" || cls.gradeLevel === selectedGrade;
    const matchesYear = selectedYear === "ALL" || cls.academicYear === selectedYear;

    return matchesSearch && matchesGrade && matchesYear;
  });

  // Extract unique grades and years for filter tabs
  const gradeOptions = Array.from(new Set(classes.map((c) => c.gradeLevel))).sort();
  const yearOptions = Array.from(new Set(classes.map((c) => c.academicYear))).sort();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Classes & Student Cohorts
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Organize students by academic year, grade levels, and sections for batch evaluations
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:from-[#00A892] hover:to-[#00B285] text-[#0A1A18] font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Class / Cohort</span>
        </button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
          <input
            type="text"
            placeholder="Search by cohort name, grade, section, coordinator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
          >
            <option value="ALL">All Grades</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>

          {/* Academic Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
          >
            <option value="ALL">All Academic Years</option>
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Cohorts Grid */}
      {filteredClasses.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
          <School className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
            No cohorts found
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto mb-6">
            {search || selectedGrade !== "ALL" || selectedYear !== "ALL"
              ? "Try adjusting your search criteria or filter tags."
              : "Create your first student cohort to get started."}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFA5] text-[#0A1A18] font-bold text-sm hover:bg-[#00A892] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Cohort</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 hover:border-[#00BFA5]/50 dark:hover:border-[#00BFA5]/40 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Grade Pill & Year */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                    {cls.gradeLevel}
                  </span>
                  <span className="text-xs font-bold text-[#728B88] dark:text-[#7D9491]">
                    {cls.academicYear}
                  </span>
                </div>

                {/* Cohort Name & Division */}
                <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#00BFA5] transition-colors mb-1">
                  {cls.name}
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-4">
                  Division: <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">{cls.division}</span>
                </p>

                {/* Info Pills */}
                <div className="space-y-2.5 mb-5 p-3.5 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#728B88]">Enrolled Students</span>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>{cls.studentCount} Students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#728B88]">Coordinator</span>
                    <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9] truncate max-w-[140px]">
                      {cls.coordinatorName || "Not assigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] flex items-center justify-between">
                <Link
                  href={`/institution/students?classId=${cls.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-[#00BFA5] hover:text-[#008F83] transition-colors"
                >
                  <span>View Roster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/institution/assessments?classId=${cls.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] hover:border-[#00BFA5] transition-colors"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>Assign Test</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Create Cohort Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
