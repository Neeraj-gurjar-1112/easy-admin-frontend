import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  /** Optional call to action, e.g. a "Clear filters" or "Add branch" button. */
  action?: ReactNode;
  icon?: string;
}

// Shown when a list has no rows (first use, or filters matched nothing).
export default function EmptyState({
  title = "No results",
  description = "Try a different search or clear the filters.",
  action,
  icon = "pi pi-inbox",
}: EmptyStateProps) {
  return (
    <div className="state-box state-box-empty" role="status">
      <i className={`state-box-icon ${icon}`} aria-hidden="true" />
      <h2 className="state-box-title">{title}</h2>
      <p className="state-box-description">{description}</p>
      {action && <div className="state-box-action">{action}</div>}
    </div>
  );
}
