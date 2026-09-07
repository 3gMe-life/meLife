import React from "react";
import type { ToastItem, ToastOptions, ToastType, PromiseToastOptions } from "./toast.types";

type Listener = (toasts: ToastItem[]) => void;

class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Set<Listener> = new Set();
  private maxToasts = 5;

  private notify() {
    const copy = [...this.toasts];
    this.listeners.forEach((listener) => listener(copy));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSnapshot(): ToastItem[] {
    return this.toasts;
  }

  public add(type: ToastType, titleOrMessage: React.ReactNode, options?: ToastOptions): string {
    const id = options?.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Calculate default duration
    let defaultDuration = 4000;
    if (type === "error") defaultDuration = 5500;
    if (type === "warning") defaultDuration = 4500;
    if (type === "loading") defaultDuration = Infinity;

    const duration = options?.duration !== undefined ? options.duration : defaultDuration;

    // Separate title & description
    let title = options?.title;
    const description = options?.description;

    if (!title && titleOrMessage) {
      title = titleOrMessage;
    }

    const newToast: ToastItem = {
      id,
      type,
      title,
      description,
      duration,
      action: options?.action,
      cancel: options?.cancel,
      icon: options?.icon,
      position: options?.position || "top-right",
      dismissible: options?.dismissible !== undefined ? options.dismissible : true,
      className: options?.className,
      style: options?.style,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
      createdAt: Date.now(),
      visible: true,
      paused: false,
    };

    // If toast with this id already exists, update it
    const existingIndex = this.toasts.findIndex((t) => t.id === id);
    if (existingIndex > -1) {
      this.toasts[existingIndex] = newToast;
    } else {
      // Limit number of toasts to maxToasts
      if (this.toasts.length >= this.maxToasts) {
        this.toasts = this.toasts.slice(this.toasts.length - this.maxToasts + 1);
      }
      this.toasts.push(newToast);
    }

    this.notify();
    return id;
  }

  public dismiss(id?: string): void {
    if (!id) {
      // Mark all as not visible
      this.toasts = this.toasts.map((t) => ({ ...t, visible: false }));
      this.notify();
      setTimeout(() => {
        this.toasts = [];
        this.notify();
      }, 250);
      return;
    }

    const toastItem = this.toasts.find((t) => t.id === id);
    if (toastItem) {
      toastItem.onDismiss?.(id);
      this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));
      this.notify();

      // Remove from memory after transition duration
      setTimeout(() => {
        this.remove(id);
      }, 250);
    }
  }

  public remove(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public update(id: string, options: Partial<ToastItem>): void {
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, ...options } : t));
    this.notify();
  }

  public setPaused(id: string, paused: boolean): void {
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, paused } : t));
    this.notify();
  }

  public clear(): void {
    this.toasts = [];
    this.notify();
  }
}

export const toastStore = new ToastStore();

// Main Toast API
export function toast(message: React.ReactNode, options?: ToastOptions): string {
  return toastStore.add("info", message, options);
}

toast.success = (message: React.ReactNode, options?: ToastOptions): string => {
  return toastStore.add("success", message, options);
};

toast.error = (message: React.ReactNode, options?: ToastOptions): string => {
  return toastStore.add("error", message, options);
};

toast.warning = (message: React.ReactNode, options?: ToastOptions): string => {
  return toastStore.add("warning", message, options);
};

toast.info = (message: React.ReactNode, options?: ToastOptions): string => {
  return toastStore.add("info", message, options);
};

toast.loading = (message: React.ReactNode, options?: ToastOptions): string => {
  return toastStore.add("loading", message, options);
};

toast.custom = (jsx: React.ReactNode, options?: ToastOptions): string => {
  return toastStore.add("custom", jsx, options);
};

toast.dismiss = (id?: string): void => {
  toastStore.dismiss(id);
};

toast.remove = (id: string): void => {
  toastStore.remove(id);
};

toast.clear = (): void => {
  toastStore.clear();
};

function resolveMessageAndDesc(input: unknown): { title: React.ReactNode; description?: React.ReactNode } {
  if (typeof input === "object" && input !== null && !React.isValidElement(input) && "title" in input) {
    const obj = input as { title?: React.ReactNode; description?: React.ReactNode };
    return { title: obj.title || "", description: obj.description };
  }
  return { title: input as React.ReactNode };
}

toast.promise = async <T,>(
  promise: Promise<T> | (() => Promise<T>),
  options: PromiseToastOptions<T>,
  toastOptions?: ToastOptions
): Promise<T> => {
  const loadingResolved = resolveMessageAndDesc(options.loading);

  const id = toast.loading(loadingResolved.title, {
    ...toastOptions,
    description: loadingResolved.description,
  });

  try {
    const p = typeof promise === "function" ? promise() : promise;
    const result = await p;

    const rawSuccess =
      typeof options.success === "function"
        ? options.success(result)
        : options.success;

    const successResolved = resolveMessageAndDesc(rawSuccess);

    toastStore.add("success", successResolved.title, {
      ...toastOptions,
      id,
      description: successResolved.description,
      duration: 4000,
    });

    return result;
  } catch (error) {
    const rawError =
      typeof options.error === "function"
        ? options.error(error)
        : options.error;

    const errorResolved = resolveMessageAndDesc(rawError);

    toastStore.add("error", errorResolved.title, {
      ...toastOptions,
      id,
      description: errorResolved.description,
      duration: 5500,
    });

    throw error;
  }
};
