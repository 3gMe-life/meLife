"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Users,
  Brain,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
  MessageSquare,
} from "lucide-react";
import { useAssignedStudents } from "../hooks/useCounsellorQueries";
import { StudentPsychometricSummaryModal } from "./StudentPsychometricSummaryModal";

export const CounsellorStudentsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [consentFilter, setConsentFilter] = useState<string>("ALL");
  const [assessmentFilter, setAssessmentFilter] = useState<string>("ALL");
  const [selectedStudentForSummary, setSelectedStudentForSummary] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: assignedStudents = [], isLoading } = useAssignedStudents();

  const filteredStudents = useMemo(() => {
    return assignedStudents.filter((stu) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (stu.student_name || "").toLowerCase().includes(q);
        const matchesEmail = (stu.student_email || "").toLowerCase().includes(q);
        const matchesSchool = (stu.school_name || "").toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesSchool) return false;
      }

      // Consent Filter
      if (consentFilter === "ACTIVE" && !stu.has_consent) return false;
      if (consentFilter === "REVOKED" && stu.has_consent) return false;

      // Assessment Filter
      if (assessmentFilter === "ASSESSED" && !stu.is_assessed) return false;
      if (assessmentFilter === "PENDING" && stu.is_assessed) return false;

      return true;
    });
  }, [assignedStudents, searchQuery, consentFilter, assessmentFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Assigned Students Directory
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Search mentored students, verify profile sharing consent, and review psychometric discovery outcomes.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, school, or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={consentFilter}
            onChange={(e) => setConsentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">All Consent Statuses</option>
            <option value="ACTIVE">Consent Active</option>
            <option value="REVOKED">Consent Revoked</option>
          </select>

          <select
            value={assessmentFilter}
            onChange={(e) => setAssessmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">All Assessment Stages</option>
            <option value="ASSESSED">Assessment Completed</option>
            <option value="PENDING">Assessment Pending</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-850" />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            No students found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            No students match your query filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Education / Grade</th>
                <th className="px-5 py-3.5">Assessment Status</th>
                <th className="px-5 py-3.5">Sharing Consent</th>
                <th className="px-5 py-3.5">Sessions</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((stu) => (
                <tr
                  key={stu.student_id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition"
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {stu.student_name}
                    </div>
                    <div className="text-[11px] text-slate-400">{stu.student_email}</div>
                  </td>

                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    <div className="font-semibold">
                      {stu.grade_level ? `Grade ${stu.grade_level}` : "Secondary Stage"}
                    </div>
                    <div className="text-[11px] text-slate-400">{stu.school_name || "Institution"}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        stu.is_assessed
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {stu.is_assessed ? "Assessed" : "Pending"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        stu.has_consent
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                      }`}
                    >
                      {stu.has_consent ? (
                        <>
                          <ShieldCheck className="h-3 w-3" />
                          <span>Consent Active</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3 w-3" />
                          <span>Consent Revoked</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    <div>{stu.session_count} session(s)</div>
                    {stu.latest_session_date && (
                      <div className="text-[11px] text-slate-400">Last: {stu.latest_session_date}</div>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/counsellor/messages?studentId=${stu.student_id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#00BFA5]/15 px-3 py-1.5 text-xs font-bold text-[#172B2A] dark:text-[#00BFA5] hover:bg-[#00BFA5]/25 transition"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Message</span>
                      </Link>

                      <button
                        onClick={() =>
                          setSelectedStudentForSummary({
                            id: stu.student_id,
                            name: stu.student_name,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>Psychometric Profile</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Safe Psychometrics Summary Modal */}
      <StudentPsychometricSummaryModal
        studentId={selectedStudentForSummary?.id || null}
        studentName={selectedStudentForSummary?.name}
        isOpen={Boolean(selectedStudentForSummary)}
        onClose={() => setSelectedStudentForSummary(null)}
      />
    </div>
  );
};
