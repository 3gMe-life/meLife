"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Stable QueryClient initialization per client session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes cache freshness
            gcTime: 15 * 60 * 1000, // 15 minutes garbage collection retention
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Do not retry 4xx errors
              if (error instanceof Error && error.message.includes("40")) {
                return false;
              }
              return failureCount < 1;
            },
          },
          mutations: {
            retry: false, // Never auto-retry state-modifying mutations
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
