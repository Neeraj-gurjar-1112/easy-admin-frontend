"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import deliveryAgentService from "@/api-services/DeliveryAgentService";
import { QUERIES } from "@/utils/api-integration";
import type { DeliveryAgent, DeliveryAgentPayload } from "@/types/delivery-agent";
import type { ApiError } from "@/types/api";

// Create / update / approve / reject / delete (HW2). Every success invalidates the list and
// the summary (and the details for row-level changes) so screens refresh by themselves.
const useDeliveryAgentMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERIES.DELIVERY_AGENTS] }),
      queryClient.invalidateQueries({ queryKey: [QUERIES.DELIVERY_AGENT_SUMMARY] }),
    ]);
  const invalidateDetails = (id: string) =>
    queryClient.invalidateQueries({ queryKey: [QUERIES.DELIVERY_AGENT_DETAILS, id] });

  const createAgent = useMutation<DeliveryAgent, ApiError, DeliveryAgentPayload>({
    mutationFn: (payload) => deliveryAgentService.create(payload),
    onSuccess: () => invalidateList(),
  });

  const updateAgent = useMutation<DeliveryAgent, ApiError, { id: string; patch: Partial<DeliveryAgentPayload> }>({
    mutationFn: ({ id, patch }) => deliveryAgentService.update(id, patch),
    onSuccess: (_data, { id }) => Promise.all([invalidateList(), invalidateDetails(id)]),
  });

  const approveAgent = useMutation<DeliveryAgent, ApiError, string>({
    mutationFn: (id) => deliveryAgentService.approve(id),
    onSuccess: (_data, id) => Promise.all([invalidateList(), invalidateDetails(id)]),
  });

  const rejectAgent = useMutation<DeliveryAgent, ApiError, string>({
    mutationFn: (id) => deliveryAgentService.reject(id),
    onSuccess: (_data, id) => Promise.all([invalidateList(), invalidateDetails(id)]),
  });

  const deleteAgent = useMutation<void, ApiError, string>({
    mutationFn: (id) => deliveryAgentService.remove(id),
    onSuccess: (_data, id) => Promise.all([invalidateList(), invalidateDetails(id)]),
  });

  return { createAgent, updateAgent, approveAgent, rejectAgent, deleteAgent };
};

export default useDeliveryAgentMutations;
