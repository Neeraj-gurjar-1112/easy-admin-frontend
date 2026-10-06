"use client";

import { useState, type ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

// Admin chrome: sidebar (drawer below 1024px) + top bar + page container.
// The only state here is whether the phone drawer is open — screen-only state, so useState.
export default function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className={navOpen ? "app-shell app-shell-nav-open" : "app-shell"}>
      <AppSidebar onNavigate={() => setNavOpen(false)} />
      {/* Dimmed backdrop behind the drawer; tapping it closes the menu */}
      <button type="button" className="app-nav-overlay" aria-label="Close navigation" onClick={() => setNavOpen(false)} />
      <div className="app-main">
        <AppTopbar onMenuClick={() => setNavOpen(true)} />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
