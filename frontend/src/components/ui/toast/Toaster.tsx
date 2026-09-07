"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "./useToast";
import { ToastCard } from "./ToastCard";
import type { ToastPosition } from "./toast.types";
import { cn } from "@/lib/utils";

interface ToasterProps {
  position?: ToastPosition;
  className?: string;
}

export function Toaster({
  position = "top-right",
  className,
}: ToasterProps) {
  const { toasts } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Group toasts by position or default to the component's position
  const getPositionClasses = (pos: ToastPosition) => {
    switch (pos) {
      case "top-left":
        return "top-0 left-0 items-start";
      case "top-center":
        return "top-0 left-1/2 -translate-x-1/2 items-center";
      case "top-right":
      default:
        return "top-0 right-0 items-end";
      case "bottom-left":
        return "bottom-0 left-0 items-start";
      case "bottom-center":
        return "bottom-0 left-1/2 -translate-x-1/2 items-center";
      case "bottom-right":
        return "bottom-0 right-0 items-end";
    }
  };

  return (
    <div
      aria-label="Notifications"
      tabIndex={-1}
      className={cn(
        "fixed z-[9999] p-4 sm:p-6 pointer-events-none flex flex-col gap-3 max-h-screen w-full max-w-sm sm:max-w-md overflow-hidden",
        getPositionClasses(position),
        className
      )}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} />
      ))}
    </div>
  );
}
