export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  /** Small coloured dot before the label (presence badges). */
  dot?: boolean;
  /** PrimeIcons class, e.g. "pi pi-check". */
  icon?: string;
}

// Pill badge. One colour pair per tone lives in _status-badge.scss; no colours here.
export default function StatusBadge({ label, tone, dot = false, icon }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge-${tone}`}>
      {dot && <span className="status-badge-dot" aria-hidden="true" />}
      {icon && <i className={`status-badge-icon ${icon}`} aria-hidden="true" />}
      {label}
    </span>
  );
}
