"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parentConnectApi } from "../api/parent-connect.api";
import { PARENT_CONNECT_QUERY_KEYS } from "./useParentConnectQueries";
import type { RedeemInvitationPayload } from "../types/parent-connect.types";

export function useCreateInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => parentConnectApi.createInvitation(),
    onSuccess: (res) => {
      if (res?.data) {
        queryClient.setQueryData(PARENT_CONNECT_QUERY_KEYS.activeInvitation, {
          success: true,
          data: res.data,
        });
      }
      queryClient.invalidateQueries({ queryKey: PARENT_CONNECT_QUERY_KEYS.activeInvitation });
    },
  });
}

export function useRevokeInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteCode: string) => parentConnectApi.revokeInvitation(inviteCode),
    onSuccess: () => {
      queryClient.setQueryData(PARENT_CONNECT_QUERY_KEYS.activeInvitation, {
        success: true,
        data: null,
      });
      queryClient.invalidateQueries({ queryKey: PARENT_CONNECT_QUERY_KEYS.activeInvitation });
    },
  });
}

export function useVerifyInvitationMutation() {
  return useMutation({
    mutationFn: (inviteCode: string) => parentConnectApi.verifyInvitation(inviteCode),
  });
}

export function useRedeemInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RedeemInvitationPayload) => parentConnectApi.redeemInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENT_CONNECT_QUERY_KEYS.connectedChildren });
    },
  });
}

export function useRevokeLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => parentConnectApi.revokeLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENT_CONNECT_QUERY_KEYS.linkedParents });
      queryClient.invalidateQueries({ queryKey: PARENT_CONNECT_QUERY_KEYS.connectedChildren });
    },
  });
}
