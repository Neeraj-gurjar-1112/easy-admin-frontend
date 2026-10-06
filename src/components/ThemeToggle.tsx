"use client";

import { Button } from "primereact/button";
import { useTheme } from "@/providers/ThemeProvider";

// Icon button in the top bar that flips light / dark.
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      icon={isDark ? "pi pi-sun" : "pi pi-moon"}
      rounded
      text
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    />
  );
}
