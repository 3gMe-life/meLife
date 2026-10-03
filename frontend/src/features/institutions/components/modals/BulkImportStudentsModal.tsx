"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  Users,
  School,
  FileText,
} from "lucide-react";
import { useBulkImportStudents, useInstitutionClasses } from "../../hooks/useInstitutionQueries";
import { BulkImportStudentInvitationRowDTO, BulkImportStudentInvitationsResultDTO } from "../../types/institution.types";

interface BulkImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClassId?: string;
}

interface ParsedPreviewRow extends BulkImportStudentInvitationRowDTO {
  rowNumber: number;
  status: "VALID" | "ERROR" | "DUPLICATE";
  validationError?: string;
}

export const BulkImportStudentsModal: React.FC<BulkImportStudentsModalProps> = ({
  isOpen,
  onClose,
  defaultClassId,
}) => {
  const [selectedClassId, setSelectedClassId] = useState(defaultClassId || "");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [campaignName, setCampaignName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<BulkImportStudentInvitationsResultDTO | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: classes = [] } = useInstitutionClasses();
  const bulkImportMutation = useBulkImportStudents();

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent =
      "First Name,Last Name,Email,Roll Number,Grade,Section,Academic Year\n" +
      "Rahul,Kumar,rahul.kumar@example.com,ST-101,10,A,2026-2027\n" +
      "Priya,Sharma,priya.sharma@example.com,ST-102,10,A,2026-2027\n" +
      "Ananya,Iyer,ananya.iyer@example.com,ST-103,10,B,2026-2027\n" +
      "Arjun,Patel,arjun.patel@example.com,ST-104,11,Science,2026-2027\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "3gmelife_student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (content: string): ParsedPreviewRow[] => {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase().replace(/[\"\'\s_-]/g, ""));

    const fnIdx = headers.findIndex((h) => h.includes("first") || h === "fname" || h === "name");
    const lnIdx = headers.findIndex((h) => h.includes("last") || h === "lname" || h === "surname");
    const emIdx = headers.findIndex((h) => h.includes("email") || h === "mail");
    const rollIdx = headers.findIndex((h) => h.includes("roll") || h.includes("admission") || h.includes("id"));
    const gradeIdx = headers.findIndex((h) => h.includes("grade") || h.includes("class"));
    const divIdx = headers.findIndex((h) => h.includes("section") || h.includes("division"));
    const yearIdx = headers.findIndex((h) => h.includes("year") || h.includes("academic"));

    const parsed: ParsedPreviewRow[] = [];
    const seenEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Handle simple CSV splitting
      const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      const firstName = fnIdx >= 0 ? cols[fnIdx] || "" : cols[0] || "";
      const lastName = lnIdx >= 0 ? cols[lnIdx] || "" : cols[1] || "";
      const email = (emIdx >= 0 ? cols[emIdx] || "" : cols[2] || "").toLowerCase().trim();
      const rollNumber = rollIdx >= 0 ? cols[rollIdx] || null : null;
      const gradeLevel = gradeIdx >= 0 ? cols[gradeIdx] || null : null;
      const division = divIdx >= 0 ? cols[divIdx] || null : null;
      const rowYear = yearIdx >= 0 ? cols[yearIdx] || academicYear : academicYear;

      let status: "VALID" | "ERROR" | "DUPLICATE" = "VALID";
      let validationError: string | undefined;

      if (!email || !firstName || !lastName) {
        status = "ERROR";
        validationError = "Missing first name, last name, or email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status = "ERROR";
        validationError = "Invalid email format.";
      } else if (seenEmails.has(email)) {
        status = "DUPLICATE";
        validationError = "Duplicate email in uploaded file.";
      }

      if (email) seenEmails.add(email);

      parsed.push({
        rowNumber: i,
        firstName,
        lastName,
        email,
        rollNumber,
        gradeLevel,
        division,
        academicYear: rowYear,
        status,
        validationError,
      });
    }

    return parsed;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSV(text);
        setPreviewRows(parsed);
        if (parsed.length === 0) {
          setErrorMessage("No student records found in the uploaded file. Please check template format.");
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the uploaded file.");
    };
    reader.readAsText(selected);
  };

  const handleClearFile = () => {
    setFile(null);
    setPreviewRows([]);
    setErrorMessage(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validRows = previewRows.filter((r) => r.status === "VALID");
  const errorRows = previewRows.filter((r) => r.status === "ERROR");
  const duplicateRows = previewRows.filter((r) => r.status === "DUPLICATE");

  const handleImportSubmit = async () => {
    if (validRows.length === 0) {
      setErrorMessage("No valid student records available to import.");
      return;
    }

    setErrorMessage(null);

    try {
      const result = await bulkImportMutation.mutateAsync({
        campaignName: campaignName.trim() || undefined,
        invitations: validRows.map((r) => ({
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          rollNumber: r.rollNumber,
          gradeLevel: r.gradeLevel,
          division: r.division,
          academicYear: r.academicYear || academicYear,
          classId: selectedClassId || null,
        })),
        defaultClassId: selectedClassId || null,
        defaultAcademicYear: academicYear,
      });

      setImportResult(result);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to process bulk import. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-[#122423] rounded-3xl shadow-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-gradient-to-r from-[#00BFA5]/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Bulk Student Import & Invitations
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Upload CSV spreadsheet to batch validate and onboard learners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs font-medium text-rose-700 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Import Result Screen */}
          {importResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  Bulk Import Processed Successfully
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
                  Invitations with secure single-use access tokens have been dispatched via Resend
                </p>

                <div className="grid grid-cols-3 gap-3 mt-4 max-w-md mx-auto">
                  <div className="p-3 bg-white dark:bg-[#172B2A] rounded-xl border border-emerald-500/20">
                    <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {importResult.importedCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      Imported & Sent
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#172B2A] rounded-xl border border-amber-500/20">
                    <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                      {importResult.skippedCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      Skipped / Duplicates
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#172B2A] rounded-xl border border-rose-500/20">
                    <span className="block text-2xl font-black text-rose-600 dark:text-rose-400">
                      {importResult.failedCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#526866] dark:text-[#9FB3B0]">
                      Failed
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Row Outcomes */}
              <div className="border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] rounded-2xl overflow-hidden">
                <div className="p-3 bg-[#F7FAF9] dark:bg-[#172B2A] font-bold text-xs text-[#172B2A] dark:text-[#F7FAF9]">
                  Import Results Log
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-[#E3ECEA] dark:divide-[rgba(227,236,234,0.06)] text-xs">
                  {importResult.results.map((res, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#728B88]">#{res.row}</span>
                        <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">{res.name}</span>
                        <span className="text-[11px] text-[#728B88]">({res.email})</span>
                      </div>
                      <div>
                        {res.status === "IMPORTED" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            Imported
                          </span>
                        ) : res.status === "ALREADY_ENROLLED" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            Already Enrolled
                          </span>
                        ) : res.status === "ALREADY_INVITED" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            Already Invited
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                            {res.message || "Failed"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Configuration & Template Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Grade 10 Onboarding"
                    className="w-full px-3 py-2 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-white dark:bg-[#122423] text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Default Cohort
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-white dark:bg-[#122423] text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  >
                    <option value="">Map from CSV or Unassigned</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-white dark:bg-[#122423] text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  >
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[#00BFA5]/40 bg-[#00BFA5]/10 hover:bg-[#00BFA5]/20 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Template</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-[#00BFA5]/40 hover:border-[#00BFA5] rounded-3xl bg-white dark:bg-[#172B2A]/40 text-center cursor-pointer transition-all hover:bg-[#00BFA5]/5 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-12 h-12 text-[#00BFA5] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Click to select or drag CSV spreadsheet
                  </h4>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto">
                    Supports columns: First Name, Last Name, Email, Roll Number, Grade, Section, Academic Year
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-[#00BFA5]" />
                    <div>
                      <span className="font-bold text-xs text-[#172B2A] dark:text-[#F7FAF9] block">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-[#728B88]">
                        {(file.size / 1024).toFixed(1)} KB • {previewRows.length} rows parsed
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Validation Preview Table */}
              {previewRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        Validation Preview
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {validRows.length} Valid
                      </span>
                      {duplicateRows.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {duplicateRows.length} Duplicate
                        </span>
                      )}
                      {errorRows.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                          {errorRows.length} Errors
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] rounded-2xl overflow-hidden">
                    <div className="max-h-56 overflow-x-auto overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-[#F7FAF9] dark:bg-[#172B2A] border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] text-[11px] font-bold text-[#728B88]">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Email</th>
                            <th className="py-2.5 px-3">Roll No.</th>
                            <th className="py-2.5 px-3">Grade/Sec</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E3ECEA] dark:divide-[rgba(227,236,234,0.06)]">
                          {previewRows.map((row) => (
                            <tr
                              key={row.rowNumber}
                              className={
                                row.status === "ERROR"
                                  ? "bg-rose-50/50 dark:bg-rose-950/20"
                                  : row.status === "DUPLICATE"
                                  ? "bg-amber-50/50 dark:bg-amber-950/20"
                                  : "hover:bg-[#F7FAF9]/50 dark:hover:bg-white/5"
                              }
                            >
                              <td className="py-2 px-3 font-mono text-[#728B88]">
                                {row.rowNumber}
                              </td>
                              <td className="py-2 px-3 font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                                {row.firstName} {row.lastName}
                              </td>
                              <td className="py-2 px-3 text-[#526866] dark:text-[#9FB3B0]">
                                {row.email}
                              </td>
                              <td className="py-2 px-3 font-mono text-[#728B88]">
                                {row.rollNumber || "—"}
                              </td>
                              <td className="py-2 px-3 text-[#728B88]">
                                {row.gradeLevel ? `${row.gradeLevel}-${row.division || ""}` : "—"}
                              </td>
                              <td className="py-2 px-3">
                                {row.status === "VALID" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Ready</span>
                                  </span>
                                ) : row.status === "DUPLICATE" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Duplicate</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{row.validationError || "Error"}</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-white dark:bg-[#122423]">
          {importResult ? (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-[#172B2A] bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 rounded-xl shadow-md cursor-pointer"
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={validRows.length === 0 || bulkImportMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#172B2A] bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                {bulkImportMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Dispatching...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Import & Send Invitations ({validRows.length})</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
