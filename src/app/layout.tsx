import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@/styles/globals.scss";
import AppProviders from "@/providers/AppProviders";

// Self-hosted via next/font; exposed as --font-inter for $font-family-base in _variables.scss
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Easy Admin — Delivery agents",
  description: "Admin screens for Easy (hyperlocal grocery + food delivery) — AI Frontend Training homework.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Root layout: font + PrimeReact theme link (swapped by ThemeProvider) + client providers.
// `data-theme` starts as light; ThemeProvider updates it after mount from localStorage.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- PrimeReact theme, href swapped at runtime by ThemeProvider */}
        <link id="theme-link" rel="stylesheet" href="/themes/lara-light-blue/theme.css" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
