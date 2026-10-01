import { fetchApi } from "@/services/api/client";
import type {
  CreateInvitationResponse,
  InvitationSafeVerification,
  ConnectedChildInfo,
  LinkedParentInfo,
  ChildOverviewDTO,
  ParentInvitation,
  RedeemInvitationPayload,
  ParentReportItem,
  ParentReportDetail,
} from "../types/parent-connect.types";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export const parentConnectApi = {
  /**
   * Student generates a new MLP-XXXX-XXXX invitation code.
   */
  async createInvitation(): Promise<ApiResponse<CreateInvitationResponse>> {
    return fetchApi<ApiResponse<CreateInvitationResponse>>("/parent/invitations/create", {
      method: "POST",
    });
  },

  /**
   * Student fetches their active unexpired invitation.
   */
  async getActiveInvitation(): Promise<ApiResponse<ParentInvitation | null>> {
    return fetchApi<ApiResponse<ParentInvitation | null>>("/parent/invitations/active", {
      method: "GET",
    });
  },

  /**
   * Student revokes an active invitation.
   */
  async revokeInvitation(inviteCode: string): Promise<ApiResponse<void>> {
    return fetchApi<ApiResponse<void>>("/parent/invitations/revoke", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    });
  },

  /**
   * Public preview & validation of invitation code before redemption.
   */
  async verifyInvitation(inviteCode: string): Promise<ApiResponse<InvitationSafeVerification>> {
    return fetchApi<ApiResponse<InvitationSafeVerification>>("/parent/invitations/verify", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    });
  },

  /**
   * Parent redeems an invitation code to link student account.
   */
  async redeemInvitation(
    payload: RedeemInvitationPayload
  ): Promise<ApiResponse<{ link: any; student: any }>> {
    return fetchApi<ApiResponse<{ link: any; student: any }>>("/parent/invitations/redeem", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Parent fetches list of their connected children.
   */
  async getConnectedChildren(): Promise<ApiResponse<ConnectedChildInfo[]>> {
    return fetchApi<ApiResponse<ConnectedChildInfo[]>>("/parent/children", {
      method: "GET",
    });
  },

  /**
   * Parent fetches consolidated child progress overview.
   */
  async getChildOverview(studentId: string): Promise<ApiResponse<ChildOverviewDTO>> {
    return fetchApi<ApiResponse<ChildOverviewDTO>>(`/parent/children/${studentId}/overview`, {
      method: "GET",
    });
  },

  /**
   * Parent fetches list of reports across connected children (or filtered by studentId).
   */
  async getParentReports(studentId?: string | null): Promise<ApiResponse<ParentReportItem[]>> {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
    return fetchApi<ApiResponse<ParentReportItem[]>>(`/parent/reports${query}`, {
      method: "GET",
    });
  },

  /**
   * Parent fetches full report detail for a child.
   */
  async getParentReportDetail(reportId: string): Promise<ApiResponse<ParentReportDetail>> {
    return fetchApi<ApiResponse<ParentReportDetail>>(`/parent/reports/${reportId}`, {
      method: "GET",
    });
  },

  /**
   * Downloads report PDF securely for a parent.
   */
  async downloadReportPdf(reportId: string, language = "en", defaultFilename = "Child_Assessment_Report.pdf"): Promise<void> {
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

  /**
   * Student fetches list of parents/guardians linked to their account.
   */
  async getLinkedParents(): Promise<ApiResponse<LinkedParentInfo[]>> {
    return fetchApi<ApiResponse<LinkedParentInfo[]>>("/parent/linked-parents", {
      method: "GET",
    });
  },

  /**
   * Revoke an active parent-student link (student or parent).
   */
  async revokeLink(linkId: string): Promise<ApiResponse<void>> {
    return fetchApi<ApiResponse<void>>(`/parent/links/${linkId}/revoke`, {
      method: "POST",
    });
  },
};

