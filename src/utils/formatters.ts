import dayjs from "dayjs";

// WM formats:
//  - Date (English)  → YYYY-MM-DD           (WM | Development - Date format Manual)
//  - Date (Korean)   → YYYY년 M월 D일        (no zero padding on month/day)
//  - Numbers         → three-digit comma     (WM | Three digit coma rule, "in any case")
//  - Money           → Easy is INR; no decimals for whole rupees

const EMPTY = "-";

/** 2026-10-06 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return EMPTY;
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DD") : EMPTY;
}

/** 2026년 10월 6일 */
export function formatDateKo(value: string | Date | null | undefined): string {
  if (!value) return EMPTY;
  const d = dayjs(value);
  return d.isValid() ? `${d.year()}년 ${d.month() + 1}월 ${d.date()}일` : EMPTY;
}

/** 2026-10-06 14:07 */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return EMPTY;
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DD HH:mm") : EMPTY;
}

/** 1234567 → "1,234,567" */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

/** 48600 → "₹48,600" */
export function formatInr(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  return `₹${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}

/** 4.63 → "4.6"; 0 → "-" (no ratings yet) */
export function formatRating(value: number | null | undefined): string {
  if (!value) return EMPTY;
  return value.toFixed(1);
}

/** "…b2f1a9" — last 6 chars of a Mongo id, enough to tell rows apart */
export function shortId(id: string | null | undefined): string {
  if (!id) return EMPTY;
  return `…${id.slice(-6)}`;
}

/** "Priya Sharma" → "PS" for the avatar */
export function initialsOf(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
