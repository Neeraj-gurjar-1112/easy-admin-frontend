"use client";

import { useEffect, useState } from "react";

/** Returns `value` only after it has stopped changing for `delayMs`. Used by the search box. */
export default function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
