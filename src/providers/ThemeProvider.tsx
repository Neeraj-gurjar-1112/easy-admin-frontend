"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Light / dark switch. Two things change together:
//  1. <html data-theme="light|dark"> → our CSS custom properties (globals.scss)
//  2. <link id="theme-link"> href     → the matching PrimeReact theme (public/themes)
// Choice is remembered per browser in localStorage (a per-viewer convenience only).

export type Theme = "light" | "dark";

const STORAGE_KEY = "easy-admin-theme";
const THEME_LINK_ID = "theme-link";
const PRIME_THEMES: Record<Theme, string> = {
  light: "/themes/lara-light-blue/theme.css",
  dark: "/themes/lara-dark-blue/theme.css",
};

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "light", toggleTheme: () => {} });

function readStoredTheme(): Theme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
  if (link && !link.href.endsWith(PRIME_THEMES[theme])) link.href = PRIME_THEMES[theme];
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage blocked (private mode) — the page still works, the choice just isn't remembered
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Pick up the remembered choice after mount (server render is always light)
  useEffect(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
