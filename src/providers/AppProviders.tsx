"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

// Client-side providers for the whole app: TanStack Query, PrimeReact, theme, toast + confirm.
// One QueryClient per browser session (created inside useState so SSR never shares it).

const STALE_TIME_MS = 30_000;

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: STALE_TIME_MS, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider value={{ ripple: false }}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}
