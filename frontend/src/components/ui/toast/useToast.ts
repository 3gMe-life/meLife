"use client";

import { useSyncExternalStore, useCallback } from "react";
import { toastStore, toast } from "./toast.store";
import type { ToastItem } from "./toast.types";

const EMPTY_TOASTS: ToastItem[] = [];

const subscribe = (callback: () => void) => toastStore.subscribe(callback);
const getSnapshot = () => toastStore.getSnapshot();
const getServerSnapshot = () => EMPTY_TOASTS;

export function useToast() {
  const toasts = useSyncExternalStore<ToastItem[]>(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const dismiss = useCallback((id?: string) => {
    toastStore.dismiss(id);
  }, []);

  const clear = useCallback(() => {
    toastStore.clear();
  }, []);

  return {
    toasts,
    toast,
    dismiss,
    clear,
  };
}
