import type {
  DeliveryAgent,
  DeliveryAgentDetails,
  DeliveryAgentListParams,
  DeliveryAgentListResponse,
  DeliveryAgentPayload,
  DeliveryAgentSummary,
} from "@/types/delivery-agent";
import { presenceOf } from "@/types/delivery-agent";
import type { DeliveryAgentApi } from "@/api-services/DeliveryAgentService.types";
import { ApiError } from "@/types/api";

// HW1 only. In-memory copy of the Easy admin API for delivery agents, with the same
// contract as the real service (search, filters, sort, paging, summary, mutations, delays)
// so the screen code does not change in HW2 — only NEXT_PUBLIC_USE_MOCK flips.

const DELAY_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Deterministic Mongo-looking id from an index (24 hex chars). */
const mockId = (n: number) => `6703b2f1a9c4d1e5f0a1${String(n).padStart(4, "0")}`;

type Seed = [
  name: string,
  email: string,
  phone: string,
  vehicle: DeliveryAgent["vehicle_type"],
  approved: boolean,
  active: boolean,
  available: boolean,
  assigned: number,
  completed: number,
  rating: number,
  createdAt: string,
  license?: string,
];

const SEEDS: Seed[] = [
  ["Rahul Verma", "rahul.verma@example.com", "+91 98765 43210", "bike", true, true, true, 1, 412, 4.8, "2025-03-12T09:10:00Z", "MH12 20250001"],
  ["Priya Sharma", "priya.sharma@example.com", "+91 98201 11223", "scooter", true, true, false, 2, 388, 4.7, "2025-04-02T08:00:00Z", "MH14 20250044"],
  ["Amit Patel", "amit.patel@example.com", "+91 99876 55443", "bike", true, false, true, 0, 275, 4.5, "2025-05-19T11:30:00Z", "GJ01 20250120"],
  ["Sneha Iyer", "sneha.iyer@example.com", "+91 90000 12345", "bicycle", true, true, true, 0, 96, 4.9, "2025-06-01T07:45:00Z"],
  ["Mohammed Khan", "mohammed.khan@example.com", "+91 98111 22334", "car", true, true, false, 3, 1120, 4.6, "2024-11-23T10:20:00Z", "DL3C 20240912"],
  ["Deepak Nair", "deepak.nair@example.com", "+91 97444 55667", "scooter", false, true, true, 0, 0, 0, "2026-10-01T06:15:00Z", "KL07 20260001"],
  ["Anjali Gupta", "anjali.gupta@example.com", "+91 98989 89898", "bike", true, true, true, 1, 540, 4.4, "2025-01-15T12:00:00Z", "UP32 20250211"],
  ["Vikram Singh", "vikram.singh@example.com", "+91 99111 00011", "bike", true, false, false, 0, 1534, 4.2, "2024-08-05T09:00:00Z", "RJ14 20240333"],
  ["Kavya Reddy", "kavya.reddy@example.com", "+91 96000 77889", "scooter", true, true, true, 2, 212, 4.7, "2025-09-09T10:10:00Z", "TS09 20250901"],
  ["Arjun Menon", "arjun.menon@example.com", "+91 95555 44332", "car", false, true, true, 0, 0, 0, "2026-10-03T13:40:00Z", "KL01 20261003"],
  ["Neha Joshi", "neha.joshi@example.com", "+91 98000 11122", "bicycle", true, true, false, 1, 150, 4.3, "2025-07-21T08:30:00Z"],
  ["Rohan Das", "rohan.das@example.com", "+91 97777 66655", "bike", true, true, true, 0, 830, 4.8, "2024-12-12T14:00:00Z", "WB20 20241212"],
  ["Pooja Mehta", "pooja.mehta@example.com", "+91 94444 33322", "scooter", true, false, true, 0, 61, 3.9, "2025-10-30T09:05:00Z", "GJ05 20251030"],
  ["Sanjay Kumar", "sanjay.kumar@example.com", "+91 93333 22211", "bike", true, true, true, 2, 702, 4.1, "2025-02-27T07:00:00Z", "BR01 20250227"],
  ["Divya Krishnan", "divya.krishnan@example.com", "+91 92222 11100", "car", true, true, false, 4, 968, 4.9, "2024-10-18T11:11:00Z", "TN07 20241018"],
  ["Imran Shaikh", "imran.shaikh@example.com", "+91 91111 00099", "bike", false, true, true, 0, 0, 0, "2026-10-05T05:50:00Z", "MH02 20261005"],
  ["Meera Pillai", "meera.pillai@example.com", "+91 90909 09090", "scooter", true, true, true, 1, 334, 4.6, "2025-08-14T10:40:00Z", "KL11 20250814"],
  ["Karan Malhotra", "karan.malhotra@example.com", "+91 98765 00001", "bike", true, false, false, 0, 1207, 4.0, "2024-09-30T12:25:00Z", "PB10 20240930"],
  ["Lakshmi Rao", "lakshmi.rao@example.com", "+91 98765 00002", "bicycle", true, true, true, 0, 45, 4.5, "2026-03-03T08:20:00Z"],
  ["Aditya Bose", "aditya.bose@example.com", "+91 98765 00003", "scooter", true, true, false, 2, 489, 4.4, "2025-05-05T09:35:00Z", "WB06 20250505"],
  ["Farhan Ali", "farhan.ali@example.com", "+91 98765 00004", "bike", true, true, true, 1, 622, 4.7, "2025-01-29T13:15:00Z", "UP16 20250129"],
  ["Ritu Agarwal", "ritu.agarwal@example.com", "+91 98765 00005", "car", true, false, true, 0, 310, 4.2, "2025-06-18T10:00:00Z", "DL8C 20250618"],
  ["Suresh Babu", "suresh.babu@example.com", "+91 98765 00006", "bike", true, true, true, 3, 1455, 4.8, "2024-07-07T07:07:00Z", "KA03 20240707"],
  ["Tanvi Desai", "tanvi.desai@example.com", "+91 98765 00007", "scooter", false, true, true, 0, 0, 0, "2026-10-04T09:30:00Z", "GJ18 20261004"],
  ["Nikhil Chauhan", "nikhil.chauhan@example.com", "+91 98765 00008", "bike", true, true, false, 1, 277, 4.3, "2025-11-11T11:11:00Z", "HR26 20251111"],
  ["Ayesha Siddiqui", "ayesha.siddiqui@example.com", "+91 98765 00009", "bicycle", true, true, true, 0, 88, 4.6, "2026-01-20T08:00:00Z"],
  ["Manoj Yadav", "manoj.yadav@example.com", "+91 98765 00010", "bike", true, false, true, 0, 915, 4.1, "2024-12-01T10:30:00Z", "UP70 20241201"],
  ["Shreya Kulkarni", "shreya.kulkarni@example.com", "+91 98765 00011", "scooter", true, true, true, 2, 503, 4.9, "2025-04-25T12:45:00Z", "MH12 20250425"],
  ["Gaurav Saxena", "gaurav.saxena@example.com", "+91 98765 00012", "car", true, true, false, 5, 1310, 4.5, "2024-06-15T09:00:00Z", "MP09 20240615"],
  ["Harini Venkatesh", "harini.v@example.com", "+91 98765 00013", "bike", false, true, true, 0, 0, 0, "2026-10-06T04:10:00Z", "TN22 20261006"],
  ["Yash Thakur", "yash.thakur@example.com", "+91 98765 00014", "bike", true, true, true, 1, 199, 4.4, "2026-02-02T10:00:00Z", "HP01 20260202"],
  ["Ishita Roy", "ishita.roy@example.com", "+91 98765 00015", "scooter", true, false, false, 0, 740, 3.8, "2025-03-30T08:50:00Z", "WB02 20250330"],
];

let agents: DeliveryAgent[] = SEEDS.map(
  ([name, email, phone, vehicle_type, approved, active, available, assigned, completed, rating, created_at, license], i) => ({
    _id: mockId(i + 1),
    name,
    email,
    phone,
    vehicle_type,
    license_number: license ?? null,
    approved,
    active,
    available,
    assigned_orders: assigned,
    completed_orders: completed,
    rating,
    total_ratings: completed ? Math.round(completed * 0.6) : 0,
    working_hours: { start: "09:00", end: "21:00" },
    current_location: active ? { lat: 19.076, lng: 72.8777, updated_at: new Date().toISOString() } : null,
    created_at,
  }),
);

function summarise(rows: DeliveryAgent[]): DeliveryAgentSummary {
  const rated = rows.filter((a) => a.rating > 0);
  const avg = rated.length ? rated.reduce((sum, a) => sum + a.rating, 0) / rated.length : 0;
  return {
    total: rows.length,
    pending: rows.filter((a) => !a.approved).length,
    online: rows.filter((a) => presenceOf(a) === "online").length,
    busy: rows.filter((a) => presenceOf(a) === "busy").length,
    offline: rows.filter((a) => presenceOf(a) === "offline").length,
    avgRating: Math.round(avg * 10) / 10,
  };
}

function find(id: string): DeliveryAgent {
  const agent = agents.find((a) => a._id === id);
  if (!agent) throw new ApiError("Delivery agent not found", 404);
  return agent;
}

export const mockDeliveryAgentApi: DeliveryAgentApi = {
  async getList(params: DeliveryAgentListParams): Promise<DeliveryAgentListResponse> {
    await wait(DELAY_MS);
    const { page, limit, q = "", vehicle_type = "", approval = "", presence = "", sort = "created_at", order = "desc" } = params;
    const term = q.trim().toLowerCase();

    // Filter
    let rows = agents.filter((a) => {
      const matchesSearch =
        !term ||
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.phone.replace(/\s/g, "").includes(term.replace(/\s/g, ""));
      const matchesVehicle = !vehicle_type || a.vehicle_type === vehicle_type;
      const matchesApproval = !approval || (approval === "approved" ? a.approved : !a.approved);
      const matchesPresence = !presence || presenceOf(a) === presence;
      return matchesSearch && matchesVehicle && matchesApproval && matchesPresence;
    });

    // Sort
    rows = [...rows].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return order === "asc" ? cmp : -cmp;
    });

    // Page
    const total = rows.length;
    const start = (page - 1) * limit;
    return {
      agents: rows.slice(start, start + limit),
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
      summary: summarise(agents),
    };
  },

  async getSummary(): Promise<DeliveryAgentSummary> {
    await wait(DELAY_MS / 2);
    return summarise(agents);
  },

  async getById(id: string): Promise<DeliveryAgentDetails> {
    await wait(DELAY_MS);
    const agent = find(id);
    return {
      ...agent,
      recent_orders: [],
      deliveryStats: [{ _id: "delivered", count: agent.completed_orders }],
    };
  },

  async create(payload: DeliveryAgentPayload): Promise<DeliveryAgent> {
    await wait(DELAY_MS);
    if (agents.some((a) => a.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new ApiError("Email is already registered", 400);
    }
    const created: DeliveryAgent = {
      _id: mockId(agents.length + 1),
      name: payload.name,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      vehicle_type: payload.vehicle_type,
      license_number: payload.license_number ?? null,
      approved: payload.approved ?? false,
      active: payload.active ?? true,
      available: payload.available ?? true,
      assigned_orders: 0,
      completed_orders: 0,
      rating: 0,
      total_ratings: 0,
      working_hours: { start: "09:00", end: "21:00" },
      current_location: null,
      created_at: new Date().toISOString(),
    };
    agents = [created, ...agents];
    return created;
  },

  async update(id: string, patch: Partial<DeliveryAgentPayload>): Promise<DeliveryAgent> {
    await wait(DELAY_MS);
    const agent = find(id);
    const { password: _password, ...rest } = patch;
    void _password; // never stored on the client
    Object.assign(agent, rest);
    return agent;
  },

  async approve(id: string): Promise<DeliveryAgent> {
    await wait(DELAY_MS / 2);
    const agent = find(id);
    agent.approved = true;
    return agent;
  },

  async reject(id: string): Promise<DeliveryAgent> {
    await wait(DELAY_MS / 2);
    const agent = find(id);
    agent.approved = false;
    agent.active = false;
    return agent;
  },

  async remove(id: string): Promise<void> {
    await wait(DELAY_MS / 2);
    find(id);
    agents = agents.filter((a) => a._id !== id);
  },
};
