"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import authService from "@/api-services/AuthService";
import { IS_MOCK } from "@/utils/env";

// Client-side guard for everything under (main): no valid admin token → /login?next=<path>.
// Skipped in mock mode (HW1 demo has no backend to log in to). The API layer also redirects
// on a 401, so an expired token is caught on the first request.
export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(IS_MOCK);

  useEffect(() => {
    if (IS_MOCK) return;
    if (authService.isAuthenticated()) {
      setAllowed(true);
    } else {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  // Nothing is rendered until the check ran, so protected content never flashes
  if (!allowed) return null;
  return <>{children}</>;
}
