import type {
  DeliveryAgent,
  DeliveryAgentDetails,
  DeliveryAgentListParams,
  DeliveryAgentListResponse,
  DeliveryAgentPayload,
  DeliveryAgentSummary,
} from "@/types/delivery-agent";

// The contract both the real service and the HW1 mock implement.
// Hooks and screens only ever see this interface.
export interface DeliveryAgentApi {
  getList(params: DeliveryAgentListParams): Promise<DeliveryAgentListResponse>;
  getSummary(): Promise<DeliveryAgentSummary>;
  getById(id: string): Promise<DeliveryAgentDetails>;
  create(payload: DeliveryAgentPayload): Promise<DeliveryAgent>;
  update(id: string, patch: Partial<DeliveryAgentPayload>): Promise<DeliveryAgent>;
  approve(id: string): Promise<DeliveryAgent>;
  reject(id: string): Promise<DeliveryAgent>;
  remove(id: string): Promise<void>;
}
