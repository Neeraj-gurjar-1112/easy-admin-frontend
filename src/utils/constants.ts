import type { ApprovalFilter, Presence, VehicleType } from "@/types/delivery-agent";

// Labels, option lists and limits shared by the list filters, badges and forms.

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  bike: "Bike",
  scooter: "Scooter",
  bicycle: "Bicycle",
  car: "Car",
};

export const APPROVAL_LABELS: Record<ApprovalFilter, string> = {
  approved: "Approved",
  pending: "Pending approval",
};

export const PRESENCE_LABELS: Record<Presence, string> = {
  online: "Online",
  busy: "Busy",
  offline: "Offline",
};

export const VEHICLE_OPTIONS: SelectOption<VehicleType>[] = (Object.keys(VEHICLE_LABELS) as VehicleType[]).map(
  (value) => ({ value, label: VEHICLE_LABELS[value] }),
);

export const APPROVAL_OPTIONS: SelectOption<ApprovalFilter>[] = (
  Object.keys(APPROVAL_LABELS) as ApprovalFilter[]
).map((value) => ({ value, label: APPROVAL_LABELS[value] }));

export const PRESENCE_OPTIONS: SelectOption<Presence>[] = (Object.keys(PRESENCE_LABELS) as Presence[]).map(
  (value) => ({ value, label: PRESENCE_LABELS[value] }),
);

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

/** Debounce for the search box so we don't query on every keystroke. */
export const SEARCH_DEBOUNCE_MS = 400;

/** Browser storage key for the admin JWT (HW2 login). */
export const ADMIN_TOKEN_KEY = "easy_admin_token";

// Validation limits — identical to the Mongoose schema (DeliveryAgent.js)
export const AGENT_RULES = {
  name: { minLength: 2, maxLength: 100 },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^[\d\s\-+()]+$/, minDigits: 10, example: "+91 98765 43210" },
  rating: { min: 0, max: 5 },
  password: { minLength: 8 },
} as const;

/** Sidebar registry — only the pages that exist in this app (one feature → one entry). */
export interface NavItem {
  key: string;
  title: string;
  path: string;
  icon: string;
}

export const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Operations",
    items: [{ key: "delivery-agents", title: "Delivery agents", path: "/delivery-agents/list", icon: "pi pi-truck" }],
  },
];
