"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import deliveryAgentService from "@/api-services/DeliveryAgentService";
import { QUERIES } from "@/utils/api-integration";
import type { DeliveryAgentListParams, DeliveryAgentListResponse } from "@/types/delivery-agent";
import type { ApiError } from "@/types/api";

// Layer 3 of 3: the hook the list screen calls. Search / filters / sort / page all travel
// inside `params`, so the query key changes and TanStack refetches. Previous rows stay on
// screen while the next page loads (keepPreviousData) — no flicker to the empty state.

const EMPTY_PAGINATION = { page: 1, limit: 10, total: 0, pages: 0 };

const useGetDeliveryAgentList = (params: DeliveryAgentListParams, enabled = true) => {
  const query = useQuery<DeliveryAgentListResponse, ApiError>({
    queryKey: [QUERIES.DELIVERY_AGENTS, params],
    queryFn: () => deliveryAgentService.getList(params),
    placeholderData: keepPreviousData,
    enabled,
  });

  return {
    agents: query.data?.agents ?? [],
    pagination: query.data?.pagination ?? EMPTY_PAGINATION,
    summary: query.data?.summary,
    isLoading: query.isLoading, // first load, nothing on screen yet
    isFetching: query.isFetching, // any (re)fetch, incl. page change
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useGetDeliveryAgentList;
