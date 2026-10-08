"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import ThemeToggle from "./ThemeToggle";
import authService from "@/api-services/AuthService";
import { resetMockData } from "@/mocks/delivery-agents.mock";
import { IS_MOCK } from "@/utils/env";

interface AppTopbarProps {
  onMenuClick: () => void;
}

// Sticky top bar: menu button (phones/tablets only), theme toggle, signed-in admin, sign out.
// In demo mode (no API) it shows a "Reset demo data" button instead of the account.
export default function AppTopbar({ onMenuClick }: AppTopbarProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  // Read the token after mount so server and client render the same markup
  useEffect(() => {
    setEmail(IS_MOCK ? "Demo mode — data stays in this browser" : authService.currentEmail());
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.replace("/login");
  };

  const handleReset = () => {
    resetMockData();
    window.location.reload();
  };

  return (
    <header className="app-topbar">
      <div className="app-topbar-start">
        <Button type="button" icon="pi pi-bars" text rounded className="app-topbar-menu" aria-label="Open navigation" onClick={onMenuClick} />
        <span className="app-topbar-env">Admin panel</span>
      </div>
      <div className="app-topbar-actions">
        <ThemeToggle />
        <span className="app-topbar-user" title={email ?? undefined}>
          <i className={IS_MOCK ? "pi pi-database" : "pi pi-user"} aria-hidden="true" />
          <span>{email ?? "…"}</span>
        </span>
        {IS_MOCK ? (
          <Button type="button" icon="pi pi-refresh" text rounded severity="secondary" aria-label="Reset demo data" tooltip="Reset demo data" tooltipOptions={{ position: "bottom" }} onClick={handleReset} />
        ) : (
          <Button type="button" icon="pi pi-sign-out" text rounded severity="secondary" aria-label="Sign out" tooltip="Sign out" tooltipOptions={{ position: "bottom" }} onClick={handleLogout} />
        )}
      </div>
    </header>
  );
}
