// Runtime flags read from NEXT_PUBLIC_* (inlined at build time by Next.js).

/** True when the in-memory mock replaces the API: explicit flag, or no API URL configured. */
export const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1" || !process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
