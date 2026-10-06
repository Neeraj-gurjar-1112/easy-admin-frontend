// Delivery agent — mirrors Easy-Backend-v2/lib/models/schema/DeliveryAgent.js and the
// admin API in src/admin/routes/delivery-agents/.

export const VEHICLE_TYPES = ["bike", "scooter", "bicycle", "car"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

/** Approval filter values (schema field `approved: boolean`). */
export const APPROVAL_FILTERS = ["approved", "pending"] as const;
export type ApprovalFilter = (typeof APPROVAL_FILTERS)[number];

/** Presence is derived from two booleans: active (account on) + available (free for orders). */
export const PRESENCE_VALUES = ["online", "busy", "offline"] as const;
export type Presence = (typeof PRESENCE_VALUES)[number];

export interface DeliveryAgent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_type: VehicleType;
  license_number?: string | null;
  approved: boolean;
  active: boolean;
  available: boolean;
  assigned_orders: number;
  completed_orders: number;
  rating: number; // 0–5
  total_ratings?: number;
  working_hours?: { start: string; end: string };
  current_location?: { lat?: number; lng?: number; updated_at?: string } | null;
  created_at: string; // ISO datetime
}

export type AgentSortField = "created_at" | "name" | "rating" | "completed_orders" | "assigned_orders";
export type SortDirection = "asc" | "desc";

/** Query string of GET /api/admin/delivery-agents. Empty strings mean "no filter". */
export interface DeliveryAgentListParams {
  page: number;
  limit: number;
  q?: string; // name / phone / email
  vehicle_type?: VehicleType | "";
  approval?: ApprovalFilter | "";
  presence?: Presence | "";
  sort?: AgentSortField;
  order?: SortDirection;
}

/** KPI tiles above the table. Served by GET /delivery-agents/summary (HW2 backend addition). */
export interface DeliveryAgentSummary {
  total: number;
  pending: number;
  online: number;
  busy: number;
  offline: number;
  avgRating: number;
}

/** Legacy list shape: `{ agents, pagination }`; `summary` is added by the newer endpoint. */
export interface DeliveryAgentListResponse {
  agents: DeliveryAgent[];
  pagination: { page: number; limit: number; total: number; pages: number };
  summary?: DeliveryAgentSummary;
}

/** GET /delivery-agents/:id adds performance data to the document. */
export interface DeliveryAgentDetails extends DeliveryAgent {
  recent_orders: { _id: string; status: string; total: number; items_total: number; delivery_charge: number }[];
  deliveryStats: { _id: string; count: number }[];
}

/** Body of POST /delivery-agents (HW2) and PATCH /delivery-agents/:id. */
export interface DeliveryAgentPayload {
  name: string;
  email: string;
  phone: string;
  vehicle_type: VehicleType;
  license_number?: string | null;
  approved?: boolean;
  active?: boolean;
  available?: boolean;
  password?: string;
}

/** Online = account on and free; Busy = on a delivery; Offline = account switched off. */
export function presenceOf(agent: Pick<DeliveryAgent, "active" | "available">): Presence {
  if (!agent.active) return "offline";
  return agent.available ? "online" : "busy";
}
