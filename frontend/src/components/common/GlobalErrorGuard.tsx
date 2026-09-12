"use client";

import { useEffect } from "react";

/**
 * GlobalErrorGuard
 * Intercepts and suppresses benign third-party/browser-extension unhandled errors
 * (e.g. Chrome DevTools / Web Vitals `reportAllChanges` reading `startTime` on empty entries)
 * to prevent console spam and prevent breaking React Error Boundaries.
 */
export function GlobalErrorGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const errorHandler = (event: ErrorEvent) => {
      const msg = event.message || "";
      const errorObj = event.error;
      const stack = errorObj?.stack || "";

      // Check for Chrome DevTools / Web Vitals extension reportAllChanges issue
      if (
        (msg.includes("startTime") && (msg.includes("reportAllChanges") || stack.includes("reportAllChanges"))) ||
        (msg.includes("Cannot read properties of undefined") && stack.includes("reportAllChanges"))
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const reasonStr = typeof reason === "string" ? reason : reason?.message || reason?.stack || "";

      if (reasonStr.includes("reportAllChanges") && reasonStr.includes("startTime")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    };

    window.addEventListener("error", errorHandler, { capture: true });
    window.addEventListener("unhandledrejection", unhandledRejectionHandler, { capture: true });

    return () => {
      window.removeEventListener("error", errorHandler, { capture: true });
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler, { capture: true });
    };
  }, []);

  return null;
}
