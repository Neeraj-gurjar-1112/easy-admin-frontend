import CoreAPIService from "./CoreAPIService";
import type { DeliveryAgentApi } from "./DeliveryAgentService.types";
import { API_ENDPOINTS, getQueries } from "@/utils/api-integration";
import { mockDeliveryAgentApi } from "@/mocks/delivery-agents.mock";
import { IS_MOCK } from "@/utils/env";
import type {
  DeliveryAgent,
  DeliveryAgentDetails,
  DeliveryAgentListParams,
  DeliveryAgentListResponse,
  DeliveryAgentPayload,
  DeliveryAgentSummary,
} from "@/types/delivery-agent";

const {
  DELIVERY_AGENTS,
  DELIVERY_AGENTS_SUMMARY,
  DELIVERY_AGENT_BY_ID,
  DELIVERY_AGENT_APPROVE,
  DELIVERY_AGENT_REJECT,
} = API_ENDPOINTS.PRIVATE;

// Layer 2 of 3: one method per Easy admin endpoint, typed request and response, no UI logic.
// Response shapes follow Easy-Backend-v2/src/admin/routes/delivery-agents/DeliveryAgentsController.js.
class DeliveryAgentService implements DeliveryAgentApi {
  private readonly api = new CoreAPIService();

  getList(params: DeliveryAgentListParams): Promise<DeliveryAgentListResponse> {
    return this.api.get<DeliveryAgentListResponse>(`${DELIVERY_AGENTS}?${getQueries(params)}`);
  }

  getSummary(): Promise<DeliveryAgentSummary> {
    return this.api.get<DeliveryAgentSummary>(DELIVERY_AGENTS_SUMMARY);
  }

  getById(id: string): Promise<DeliveryAgentDetails> {
    return this.api.get<DeliveryAgentDetails>(DELIVERY_AGENT_BY_ID(id));
  }

  async create(payload: DeliveryAgentPayload): Promise<DeliveryAgent> {
    const res = await this.api.post<{ agent: DeliveryAgent }, DeliveryAgentPayload>(DELIVERY_AGENTS, payload);
    return res.agent;
  }

  update(id: string, patch: Partial<DeliveryAgentPayload>): Promise<DeliveryAgent> {
    return this.api.patch<DeliveryAgent, Partial<DeliveryAgentPayload>>(DELIVERY_AGENT_BY_ID(id), patch);
  }

  async approve(id: string): Promise<DeliveryAgent> {
    const res = await this.api.patch<{ message: string; agent: DeliveryAgent }>(DELIVERY_AGENT_APPROVE(id));
    return res.agent;
  }

  async reject(id: string): Promise<DeliveryAgent> {
    const res = await this.api.patch<{ message: string; agent: DeliveryAgent }>(DELIVERY_AGENT_REJECT(id));
    return res.agent;
  }

  async remove(id: string): Promise<void> {
    await this.api.delete<{ message: string }>(DELIVERY_AGENT_BY_ID(id));
  }
}

// HW1 demo runs on the in-memory mock (NEXT_PUBLIC_USE_MOCK=1, or no API URL configured).
// With an API URL and the flag off, every call goes to Easy-Backend-v2.
const deliveryAgentService: DeliveryAgentApi = IS_MOCK ? mockDeliveryAgentApi : new DeliveryAgentService();

export default deliveryAgentService;
