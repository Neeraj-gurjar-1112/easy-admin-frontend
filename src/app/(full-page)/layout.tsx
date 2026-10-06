import type { ReactNode } from "react";

// Screens without the admin chrome (login). Centred card on the page background.
export default function FullPageLayout({ children }: { children: ReactNode }) {
  return <main className="full-page">{children}</main>;
}
