"use client";

import { InputText } from "primereact/inputtext";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Screen-reader label; the visible placeholder is not enough for a11y. */
  ariaLabel?: string;
}

// Text search with a leading icon. Debounce belongs in the screen (useDebounce), not here.
export default function SearchInput({ value, onChange, placeholder = "Search", ariaLabel = "Search" }: SearchInputProps) {
  return (
    <span className="search-input p-input-icon-left">
      <i className="pi pi-search" aria-hidden="true" />
      <InputText
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        type="search"
      />
    </span>
  );
}
