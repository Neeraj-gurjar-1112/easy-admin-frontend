"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { PageHeader, StateWrapper, ListPagination } from "@/components";
import AgentStats from "@/components/delivery-agents/AgentStats";
import AgentFilters, { EMPTY_FILTERS, hasActiveFilters, type AgentFilterValues } from "@/components/delivery-agents/AgentFilters";
import AgentTable from "@/components/delivery-agents/AgentTable";
import { useAgentActions } from "@/components/delivery-agents/AgentActions";
import { useDebounce, useGetDeliveryAgentList } from "@/hooks";
import type { AgentSortField, DeliveryAgentListParams, SortDirection } from "@/types/delivery-agent";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/utils/constants";

// Delivery agents — list screen.
// Screen-only state (filters, page, sort) lives here in useState; server data comes from the
// hook; row actions (view / approve / suspend / delete) come from useAgentActions.
export default function DeliveryAgentListPage() {
  const router = useRouter();

  // ---- screen state -----------------------------------------------------------------
  const [filters, setFilters] = useState<AgentFilterValues>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<AgentSortField>("created_at");
  const [order, setOrder] = useState<SortDirection>("desc");
  const debouncedQuery = useDebounce(filters.q, SEARCH_DEBOUNCE_MS);

  // Everything the API needs, in one object → one query key
  const params = useMemo<DeliveryAgentListParams>(
    () => ({
      page,
      limit,
      q: debouncedQuery.trim(),
      vehicle_type: filters.vehicle_type,
      approval: filters.approval,
      presence: filters.presence,
      sort,
      order,
    }),
    [page, limit, debouncedQuery, filters.vehicle_type, filters.approval, filters.presence, sort, order],
  );

  // ---- server data -------------------------------------------------------------------
  const { agents, pagination, summary, isLoading, isFetching, isError, error, refetch } = useGetDeliveryAgentList(params);
  const actions = useAgentActions();

  // ---- handlers ----------------------------------------------------------------------
  const handleFilters = (next: AgentFilterValues) => {
    setFilters(next);
    setPage(1); // a new filter always starts from page 1
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const handleSort = (nextSort: AgentSortField, nextOrder: SortDirection) => {
    setSort(nextSort);
    setOrder(nextOrder);
    setPage(1);
  };

  const handlePage = (next: { page: number; limit: number }) => {
    setPage(next.page);
    setLimit(next.limit);
  };

  const filtering = hasActiveFilters(filters);

  return (
    <div className="agents-list">
      {/* Title + primary action */}
      <PageHeader
        title="Delivery agents"
        description="Everyone who delivers for Easy: approval, availability and performance at a glance."
        actions={<Button type="button" label="Add agent" icon="pi pi-plus" onClick={() => router.push("/delivery-agents/create")} />}
      />

      {/* KPI tiles */}
      <AgentStats summary={summary} />

      {/* Search + filters */}
      <AgentFilters values={filters} onChange={handleFilters} onReset={handleReset} />

      {/* Table card: loading → error → empty → rows, then the footer with paging */}
      <section className="table-card" aria-label="Delivery agents">
        <StateWrapper
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          onRetry={() => void refetch()}
          isEmpty={agents.length === 0}
          emptyTitle={filtering ? "No agents match these filters" : "No delivery agents yet"}
          emptyDescription={
            filtering ? "Try a different name, phone or email, or clear the filters." : "Add the first agent, or wait for sign-ups from the partner app."
          }
          emptyAction={
            filtering ? (
              <Button type="button" label="Clear filters" icon="pi pi-filter-slash" outlined onClick={handleReset} />
            ) : (
              <Button type="button" label="Add agent" icon="pi pi-plus" onClick={() => router.push("/delivery-agents/create")} />
            )
          }
        >
          <AgentTable agents={agents} sort={sort} order={order} onSort={handleSort} onAction={actions.run} busy={isFetching || actions.busy} />
          <ListPagination page={pagination.page} limit={limit} totalRecords={pagination.total} onChange={handlePage} />
        </StateWrapper>
      </section>
    </div>
  );
}
