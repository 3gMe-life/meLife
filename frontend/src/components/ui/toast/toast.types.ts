import React from "react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading" | "custom";

export type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

export interface ToastAction {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  altText?: string;
}

export interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number; // duration in ms, Infinity/0 means persistent
  action?: ToastAction;
  cancel?: ToastAction;
  icon?: React.ReactNode;
  position?: ToastPosition;
  dismissible?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  createdAt: number;
  visible: boolean;
  paused: boolean;
}

export interface PromiseToastOptions<T = unknown> {
  loading: React.ReactNode | { title?: React.ReactNode; description?: React.ReactNode };
  success:
    | React.ReactNode
    | { title?: React.ReactNode; description?: React.ReactNode }
    | ((data: T) => React.ReactNode | { title?: React.ReactNode; description?: React.ReactNode });
  error:
    | React.ReactNode
    | { title?: React.ReactNode; description?: React.ReactNode }
    | ((error: unknown) => React.ReactNode | { title?: React.ReactNode; description?: React.ReactNode });
}
