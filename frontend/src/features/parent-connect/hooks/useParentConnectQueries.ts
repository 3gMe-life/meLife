"use client";

import { useQuery } from "@tanstack/react-query";
import { parentConnectApi } from "../api/parent-connect.api";

export const PARENT_CONNECT_QUERY_KEYS = {
  activeInvitation: ["parentConnect", "activeInvitation"] as const,
  linkedParents: ["parentConnect", "linkedParents"] as const,
  connectedChildren: ["parentConnect", "connectedChildren"] as const,
  childOverview: (studentId: string) => ["parentConnect", "childOverview", studentId] as const,
  parentReports: (studentId?: string | null) => ["parentConnect", "parentReports", studentId || "all"] as const,
  parentReportDetail: (reportId: string) => ["parentConnect", "parentReportDetail", reportId] as const,
  verifyInvitation: (inviteCode: string) => ["parentConnect", "verifyInvitation", inviteCode] as const,
};

export function useActiveInvitationQuery() {
  return useQuery({
    queryKey: PARENT_CONNECT_QUERY_KEYS.activeInvitation,
    queryFn: () => parentConnectApi.getActiveInvitation(),
    staleTime: 60 * 1000,
  });
}

export function useLinkedParentsQuery() {
  return useQuery({
    queryKey: PARENT_CONNECT_QUERY_KEYS.linkedParents,
    queryFn: () => parentConnectApi.getLinkedParents(),
    staleTime: 60 * 1000,
  });
}

export function useConnectedChildrenQuery() {
  return useQuery({
    queryKey: PARENT_CONNECT_QUERY_KEYS.connectedChildren,
    queryFn: () => parentConnectApi.getConnectedChildren(),
    staleTime: 60 * 1000,
  });
}

export function useChildOverviewQuery(studentId: string | null | undefined) {
  return useQuery({
    queryKey: PARENT_CONNECT_QUERY_KEYS.childOverview(studentId || ""),
    queryFn: () => parentConnectApi.getChildOverview(studentId!),
    enabled: Boolean(studentId),
    staleTime: 60 * 1000,
  });
}

export function useParentReportsQuery(studentId?: string | null) {
  return useQuery({
    queryKey: PARENT_CONNECT_QUERY_KEYS.parentReports(studentId),
    queryFn: () => parentConnectApi.getParentReports(studentId),
    staleTime: 60 * 1000,
  });
}

export function useParentReportDetailQuery(reportId: string | null | undefined) {
  return useQuery({
    queryKey: PARENT_CONNECT_QUERY_KEYS.parentReportDetail(reportId || ""),
    queryFn: () => parentConnectApi.getParentReportDetail(reportId!),
    enabled: Boolean(reportId),
    staleTime: 60 * 1000,
  });
}

