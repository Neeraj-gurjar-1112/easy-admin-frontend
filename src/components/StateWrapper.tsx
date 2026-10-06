import type { ReactNode } from "react";
import TableSkeleton from "./TableSkeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

interface StateWrapperProps {
  isLoading: boolean;
  isError?: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  /** Replace the default skeleton (e.g. a card skeleton on a details page). */
  loadingFallback?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}

// Decides which of the four states a data block shows: loading → error → empty → filled.
// Every list/details screen wraps its content in this so no state is forgotten.
export default function StateWrapper({
  isLoading,
  isError = false,
  isEmpty,
  errorMessage,
  onRetry,
  loadingFallback,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: StateWrapperProps) {
  if (isLoading) return <>{loadingFallback ?? <TableSkeleton />}</>;
  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />;
  if (isEmpty) return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  return <>{children}</>;
}
