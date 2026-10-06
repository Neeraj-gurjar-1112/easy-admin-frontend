import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  /** Trailing actions, e.g. a Reset button. */
  end?: ReactNode;
}

// Row of filter controls above a list. Wraps on tablets, stacks on phones (SCSS).
export default function FilterBar({ children, end }: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Filters">
      {children}
      {end && <div className="filter-bar-end">{end}</div>}
    </section>
  );
}

interface FilterBarItemProps {
  children: ReactNode;
  /** The search box gets more room than a dropdown. */
  search?: boolean;
}

// One control inside the FilterBar. Sizing comes from SCSS, never inline.
export function FilterBarItem({ children, search = false }: FilterBarItemProps) {
  return <div className={search ? "filter-bar-item filter-bar-item-search" : "filter-bar-item"}>{children}</div>;
}
