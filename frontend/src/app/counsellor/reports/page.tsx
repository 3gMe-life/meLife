"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Brain,
  Sparkles,
} from "lucide-react";
import { CounsellorLayout } from "@/features/counsellors/components/shell/CounsellorLayout";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { DashboardCard } from "@/features/dashboard/components/common/DashboardCard";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";
import { useAssignedStudents } from "@/features/counsellors/hooks/useCounsellorQueries";
import { StudentPsychometricSummaryModal } from "@/features/counsellors/components/StudentPsychometricSummaryModal";

export default function CounsellorReportsPage() {
  const { data: students = [], isLoading } = useAssignedStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const assessedStudents = students.filter((s) => s.is_assessed);
  const filteredStudents = assessedStudents.filter((s) =>
    s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.school_name && s.school_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <CounsellorLayout>
      <div className="space-y-6 select-none">
        {/* Page Header */}
        <PageHeader
          title="Student Assessment & Career Reports"
          subtitle="Access verified psychometric evaluations, career compatibility summaries, and guidance dossiers for enrolled students."
          badge={`${assessedStudents.length} Reports Available`}
          badgeColor="emerald"
        />

        {/* Search and Filters */}
        <DashboardCard
          title="Mentored Students Dossier Index"
          subtitle="All students who have completed psychometric assessments with active data sharing consent"
          headerAction={
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs focus-within:border-[#00BFA5]">
              <Search className="w-3.5 h-3.5 text-[#728B88]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or school..."
                className="bg-transparent border-none outline-none text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder:text-[#728B88]"
              />
            </div>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No matching student reports" : "No assessment reports yet"}
              description={
                searchQuery
                  ? "Try searching for a different student name or clear your search query."
                  : "When your assigned students complete their 3G MeLife assessments, their verified reports will be indexed here."
              }
              icon={<FileText className="w-6 h-6 text-[#00BFA5]" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((stu) => (
                <div
                  key={stu.student_id}
                  className="p-5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border border-[#00C896]/30">
                        Assessment Completed
                      </span>
                      <span className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                        {stu.grade_level ? `Grade ${stu.grade_level}` : "Grade N/A"}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                      {stu.student_name}
                    </h4>

                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                      {stu.school_name || "Enrolled Institution"} • {stu.session_count} Completed Guidance Session(s)
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#008F83] dark:text-[#00C896] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Consent Verified</span>
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedStudent({
                          id: stu.student_id,
                          name: stu.student_name,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Open Dossier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Modal */}
        <StudentPsychometricSummaryModal
          studentId={selectedStudent?.id || null}
          studentName={selectedStudent?.name}
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
        />
      </div>
    </CounsellorLayout>
  );
}
