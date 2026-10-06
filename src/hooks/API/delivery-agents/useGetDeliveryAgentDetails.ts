"use client";

import { useQuery } from "@tanstack/react-query";
import deliveryAgentService from "@/api-services/DeliveryAgentService";
import { QUERIES } from "@/utils/api-integration";
import type { DeliveryAgentDetails } from "@/types/delivery-agent";
import type { ApiError } from "@/types/api";

// Details / edit screens (HW2). `id` is null while the route param is not ready yet.
const useGetDeliveryAgentDetails = (id: string | null) => {
  const query = useQuery<DeliveryAgentDetails, ApiError>({
    queryKey: [QUERIES.DELIVERY_AGENT_DETAILS, id],
    queryFn: () => deliveryAgentService.getById(id as string),
    enabled: Boolean(id),
  });

  return {
    agent: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useGetDeliveryAgentDetails;
