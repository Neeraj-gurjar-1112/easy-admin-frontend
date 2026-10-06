"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { Avatar, EmptyState, PageHeader, StatTile, StateWrapper, StatusBadge, type BadgeTone } from "@/components";
import { ApprovalBadge, PresenceBadge, VehicleBadge } from "@/components/delivery-agents/AgentBadges";
import { useAgentActions } from "@/components/delivery-agents/AgentActions";
import { useGetDeliveryAgentDetails } from "@/hooks";
import type { DeliveryAgentDetails } from "@/types/delivery-agent";
import { formatDate, formatDateTime, formatInr, formatNumber, formatRating } from "@/utils/formatters";

type RecentOrder = DeliveryAgentDetails["recent_orders"][number];

const ORDER_STATUS_TONE: Record<string, BadgeTone> = {
  delivered: "success",
  cancelled: "danger",
  failed: "danger",
  pending: "warning",
};

// One delivery agent: identity + actions, profile, performance, recent orders.
export default function DeliveryAgentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const { agent, isLoading, isError, error, refetch } = useGetDeliveryAgentDetails(id);
  const actions = useAgentActions({ afterDelete: "/delivery-agents/list" });

  return (
    <div className="agent-details">
      <PageHeader
        title="Delivery agent"
        description="Profile, approval and performance of one delivery partner."
        actions={<Button type="button" label="Back to list" icon="pi pi-arrow-left" text onClick={() => router.push("/delivery-agents/list")} />}
      />

      <StateWrapper
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
        isEmpty={!agent}
        emptyTitle="Agent not found"
        emptyDescription="It may have been deleted. Go back to the list."
        emptyAction={<Button type="button" label="Back to list" outlined onClick={() => router.push("/delivery-agents/list")} />}
        loadingFallback={<Skeleton className="hero-skeleton" />}
      >
        {agent && (
          <>
            {/* Identity + actions */}
            <section className="agent-hero" aria-label="Agent">
              <div className="agent-hero-identity">
                <Avatar name={agent.name} size="lg" />
                <div className="agent-hero-text">
                  <h2 className="agent-hero-name">{agent.name}</h2>
                  <div className="agent-hero-meta">
                    <ApprovalBadge approved={agent.approved} />
                    <PresenceBadge agent={agent} />
                    <VehicleBadge type={agent.vehicle_type} />
                    <span className="cell-secondary">Joined {formatDate(agent.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="agent-hero-actions">
                <Button type="button" label="Edit" icon="pi pi-pencil" outlined onClick={() => actions.run("edit", agent)} disabled={actions.busy} />
                {agent.approved ? (
                  <Button type="button" label="Suspend" icon="pi pi-ban" outlined severity="danger" onClick={() => actions.run("suspend", agent)} disabled={actions.busy} />
                ) : (
                  <Button type="button" label="Approve" icon="pi pi-check" severity="success" onClick={() => actions.run("approve", agent)} disabled={actions.busy} />
                )}
                <Button type="button" label="Delete" icon="pi pi-trash" text severity="danger" onClick={() => actions.run("delete", agent)} disabled={actions.busy} />
              </div>
            </section>

            <div className="agent-grid">
              {/* Profile */}
              <section className="info-card" aria-labelledby="profile-title">
                <h3 className="info-card-title" id="profile-title">
                  Profile
                </h3>
                <dl className="kv-list">
                  <dt>Email</dt>
                  <dd>{agent.email}</dd>
                  <dt>Phone</dt>
                  <dd>{agent.phone}</dd>
                  <dt>License</dt>
                  <dd>{agent.license_number || "-"}</dd>
                  <dt>Working hours</dt>
                  <dd>{agent.working_hours ? `${agent.working_hours.start} – ${agent.working_hours.end}` : "-"}</dd>
                  <dt>Last location</dt>
                  <dd>
                    {agent.current_location?.lat !== undefined && agent.current_location?.lng !== undefined
                      ? `${agent.current_location.lat}, ${agent.current_location.lng} · ${formatDateTime(agent.current_location.updated_at)}`
                      : "Unknown"}
                  </dd>
                  <dt>Id</dt>
                  <dd className="cell-mono">{agent._id}</dd>
                </dl>
              </section>

              {/* Performance */}
              <section className="info-card" aria-labelledby="performance-title">
                <h3 className="info-card-title" id="performance-title">
                  Performance
                </h3>
                <div className="stat-tiles">
                  <StatTile label="Assigned now" value={formatNumber(agent.assigned_orders)} icon="pi pi-inbox" tone="primary" />
                  <StatTile label="Completed" value={formatNumber(agent.completed_orders)} icon="pi pi-check-circle" tone="success" />
                  <StatTile label="Rating" value={formatRating(agent.rating)} hint={`${formatNumber(agent.total_ratings ?? 0)} ratings`} icon="pi pi-star" tone="warning" />
                  <StatTile
                    label="Deliveries by status"
                    value={formatNumber(agent.deliveryStats.reduce((sum, s) => sum + s.count, 0))}
                    hint={agent.deliveryStats.length ? agent.deliveryStats.map((s) => `${s._id ?? "unknown"} ${formatNumber(s.count)}`).join(" · ") : "No orders recorded yet"}
                    icon="pi pi-chart-bar"
                    tone="info"
                  />
                </div>
              </section>

              {/* Recent orders */}
              <section className="info-card agent-grid-full" aria-labelledby="orders-title">
                <h3 className="info-card-title" id="orders-title">
                  Recent orders
                </h3>
                {agent.recent_orders.length === 0 ? (
                  <EmptyState icon="pi pi-shopping-bag" title="No deliveries yet" description="Orders assigned to this agent will show up here." />
                ) : (
                  <div className="table-scroll-box">
                    <DataTable value={agent.recent_orders} dataKey="_id" rowHover>
                      <Column header="Order" body={(row: RecentOrder) => <span className="cell-mono">{row._id}</span>} />
                      <Column header="Status" body={(row: RecentOrder) => <StatusBadge label={row.status} tone={ORDER_STATUS_TONE[row.status] ?? "neutral"} />} />
                      <Column header="Items" body={(row: RecentOrder) => formatInr(row.items_total)} className="cell-number" />
                      <Column header="Delivery" body={(row: RecentOrder) => formatInr(row.delivery_charge)} className="cell-number" />
                      <Column header="Total" body={(row: RecentOrder) => <strong>{formatInr(row.total)}</strong>} className="cell-number" />
                    </DataTable>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </StateWrapper>
    </div>
  );
}
