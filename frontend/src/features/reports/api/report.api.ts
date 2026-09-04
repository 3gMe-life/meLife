import { fetchApi } from "@/services/api/client";
import { ReportResponseData } from "../types/report.types";

export const reportApi = {
  /**
   * Generates or retrieves an existing report for an assessment result.
   */
  async generateReport(resultId: string, language = "en"): Promise<ReportResponseData> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    return fetchApi<ReportResponseData>(`/reports/generate/${resultId}${query}`, {
      method: "POST",
    });
  },

  /**
   * Retrieves a report by report ID.
   */
  async getReport(reportId: string, language?: string): Promise<ReportResponseData> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    return fetchApi<ReportResponseData>(`/reports/${reportId}${query}`, {
      method: "GET",
    });
  },

  /**
   * Retrieves a report by result ID.
   */
  async getReportByResult(resultId: string, language = "en"): Promise<ReportResponseData> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    return fetchApi<ReportResponseData>(`/reports/result/${resultId}${query}`, {
      method: "GET",
    });
  },

  /**
   * Retrieves the participant's latest report.
   */
  async getLatestReport(language = "en"): Promise<ReportResponseData> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    return fetchApi<ReportResponseData>(`/reports/participant/latest${query}`, {
      method: "GET",
    });
  },

  /**
   * Downloads report PDF securely by fetching the binary stream with Authorization headers
   * and saving it in the user's browser.
   */
  async downloadReportPdf(reportId: string, language = "en", defaultFilename = "Skill_Finder_Report.pdf"): Promise<void> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
    const token = typeof window !== "undefined" ? localStorage.getItem("melife_access_token") : null;
    const query = language ? `?language=${encodeURIComponent(language)}` : "";

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download${query}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to download report PDF (Status: ${response.status})`);
    }

    // Extract filename from Content-Disposition header if available
    const disposition = response.headers.get("Content-Disposition");
    let filename = defaultFilename;
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
