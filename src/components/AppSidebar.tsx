"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/utils/constants";

interface AppSidebarProps {
  /** Called after a link is clicked so the phone drawer can close. */
  onNavigate?: () => void;
}

// Left navigation. Groups follow Easy's EJS admin panel (routes/panel/nav.js); only the pages
// that exist in this app are listed — one feature, one entry.
export default function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar" aria-label="Sidebar">
      <div className="app-sidebar-brand">
        <span className="app-sidebar-logo" aria-hidden="true">
          E
        </span>
        <span className="app-sidebar-title">Easy Admin</span>
      </div>

      <nav className="app-nav">
        {NAV_GROUPS.map(({ group, items }) => (
          <div className="app-nav-group" key={group}>
            <p className="app-nav-group-title">{group}</p>
            {items.map((item) => {
              const isActive = pathname.startsWith(item.path.replace(/\/list$/, ""));
              return (
                <Link
                  href={item.path}
                  key={item.key}
                  className={isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onNavigate}
                >
                  <i className={item.icon} aria-hidden="true" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
