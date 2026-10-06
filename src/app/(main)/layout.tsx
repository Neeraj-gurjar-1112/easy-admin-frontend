import type { ReactNode } from "react";
import { AppShell } from "@/components";
import AuthGate from "@/providers/AuthGate";

// Every screen under (main) is admin-only and gets the admin chrome (sidebar + top bar).
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
