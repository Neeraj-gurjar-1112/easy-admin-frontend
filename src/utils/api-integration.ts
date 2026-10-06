// Single source of truth for endpoint paths and TanStack Query keys.
// Layer 1 of 3: api-integration (path) → api-services (axios call) → hooks/API (screen hook).
// Base URL = NEXT_PUBLIC_API_BASE_URL, e.g. http://localhost:8080/api/admin

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login", // POST { email, password } → { success, token, admin }
  },
  PRIVATE: {
    DELIVERY_AGENTS: "/delivery-agents",
    DELIVERY_AGENTS_PENDING: "/delivery-agents/pending",
    DELIVERY_AGENTS_SUMMARY: "/delivery-agents/summary", // HW2 backend addition
    DELIVERY_AGENT_BY_ID: (id: string) => `/delivery-agents/${id}`,
    DELIVERY_AGENT_APPROVE: (id: string) => `/delivery-agents/${id}/approve`,
    DELIVERY_AGENT_REJECT: (id: string) => `/delivery-agents/${id}/reject`,
  },
} as const;

export const QUERIES = {
  DELIVERY_AGENTS: "deliveryAgents",
  DELIVERY_AGENT_DETAILS: "deliveryAgentDetails",
  DELIVERY_AGENT_SUMMARY: "deliveryAgentSummary",
} as const;

/**
 * Builds a query string from an object, skipping undefined / null / empty-string values
 * so "no filter" never reaches the backend as `vehicle_type=`.
 */
export function getQueries<T extends object>(params: T): string {
  const search = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });
  return search.toString();
}
