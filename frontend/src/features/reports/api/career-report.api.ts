import { fetchApi } from "@/services/api/client";
import { CareerReportDTO } from "../types/career-report.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const careerReportApi = {
  /**
   * Generates or retrieves a comprehensive career exploration report for the student.
   */
  async generateCareerReport(
    resultId?: string,
    language = "en",
    forceRegenerate = false
  ): Promise<CareerReportDTO> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetchApi<ApiResponse<CareerReportDTO>>(`/career-reports/generate${query}`, {
      method: "POST",
      body: JSON.stringify({
        resultId,
        languageCode: language,
        forceRegenerate,
      }),
    });
    return res.data || (res as unknown as CareerReportDTO);
  },

  /**
   * Retrieves the authenticated student's latest career report.
   */
  async getLatestCareerReport(language = "en"): Promise<CareerReportDTO> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetchApi<ApiResponse<CareerReportDTO>>(`/career-reports/latest${query}`, {
      method: "GET",
    });
    return res.data || (res as unknown as CareerReportDTO);
  },

  /**
   * Retrieves a specific career report by ID.
   */
  async getCareerReportById(reportId: string, language = "en"): Promise<CareerReportDTO> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetchApi<ApiResponse<CareerReportDTO>>(`/career-reports/${reportId}${query}`, {
      method: "GET",
    });
    return res.data || (res as unknown as CareerReportDTO);
  },

  /**
   * Counsellor endpoint: Retrieves a student's career report with Section 10 Counsellor Insights.
   */
  async getStudentCareerReportForCounsellor(studentId: string, language = "en"): Promise<CareerReportDTO> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetchApi<ApiResponse<CareerReportDTO>>(`/career-reports/student/${studentId}${query}`, {
      method: "GET",
    });
    return res.data || (res as unknown as CareerReportDTO);
  },

  /**
   * Streams and downloads the vector PDF version of the Career Report.
   */
  async downloadCareerReportPdf(
    reportId: string,
    language = "en",
    defaultFilename = "3G_MeLife_Career_Exploration_Report.pdf"
  ): Promise<void> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
    const token = typeof window !== "undefined" ? localStorage.getItem("melife_access_token") : null;
    const query = language ? `?language=${encodeURIComponent(language)}` : "";

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/career-reports/${reportId}/pdf${query}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to download Career Report PDF (Status: ${response.status})`);
    }

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
