"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import ThemeToggle from "./ThemeToggle";
import authService from "@/api-services/AuthService";
import { IS_MOCK } from "@/utils/env";

interface AppTopbarProps {
  onMenuClick: () => void;
}

// Sticky top bar: menu button (phones/tablets only), theme toggle, signed-in admin, sign out.
export default function AppTopbar({ onMenuClick }: AppTopbarProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  // Read the token after mount so server and client render the same markup
  useEffect(() => {
    setEmail(IS_MOCK ? "demo (mock data)" : authService.currentEmail());
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.replace("/login");
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
          <i className="pi pi-user" aria-hidden="true" />
          <span>{email ?? "…"}</span>
        </span>
        {!IS_MOCK && <Button type="button" icon="pi pi-sign-out" text rounded severity="secondary" aria-label="Sign out" tooltip="Sign out" tooltipOptions={{ position: "bottom" }} onClick={handleLogout} />}
      </div>
    </header>
  );
}
