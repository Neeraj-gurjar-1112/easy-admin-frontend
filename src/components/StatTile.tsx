import { Skeleton } from "primereact/skeleton";
import type { BadgeTone } from "./StatusBadge";

interface StatTileProps {
  label: string;
  /** Already formatted (formatNumber / formatRating). `undefined` renders a skeleton. */
  value?: string;
  hint?: string;
  icon: string;
  tone?: BadgeTone;
}

// KPI card above a list: label, big number, optional hint, icon on the right.
export default function StatTile({ label, value, hint, icon, tone = "primary" }: StatTileProps) {
  return (
    <div className="stat-tile">
      <div className="stat-tile-text">
        <p className="stat-tile-label">{label}</p>
        {value === undefined ? (
          <Skeleton className="stat-tile-skeleton" />
        ) : (
          <p className="stat-tile-value">{value}</p>
        )}
        {hint && <p className="stat-tile-hint">{hint}</p>}
      </div>
      <span className={`stat-tile-icon stat-tile-icon-${tone}`} aria-hidden="true">
        <i className={icon} />
      </span>
    </div>
  );
}
