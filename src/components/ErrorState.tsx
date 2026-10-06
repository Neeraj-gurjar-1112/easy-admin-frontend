"use client";

import { Button } from "primereact/button";

interface ErrorStateProps {
  /** The API's own message — shown as-is (WM: never swallow server errors). */
  message?: string;
  onRetry?: () => void;
}

// Shown when a request failed. Keeps the server message visible and offers a retry.
export default function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <div className="state-box state-box-error" role="alert">
      <i className="state-box-icon pi pi-exclamation-triangle" aria-hidden="true" />
      <h2 className="state-box-title">Could not load data</h2>
      <p className="state-box-description">{message}</p>
      {onRetry && (
        <div className="state-box-action">
          <Button label="Try again" icon="pi pi-refresh" outlined onClick={onRetry} />
        </div>
      )}
    </div>
  );
}
