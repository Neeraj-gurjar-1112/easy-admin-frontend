"use client";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Avatar from "@/components/Avatar";
import { ApprovalBadge, PresenceBadge, VehicleBadge } from "./AgentBadges";
import type { AgentAction } from "./AgentActions";
import type { AgentSortField, DeliveryAgent, SortDirection } from "@/types/delivery-agent";
import { AGENT_SORT_OPTIONS } from "@/utils/constants";
import { formatDate, formatNumber, formatRating, shortId } from "@/utils/formatters";

interface AgentCardsProps {
  agents: DeliveryAgent[];
  sort: AgentSortField;
  order: SortDirection;
  onSort: (sort: AgentSortField, order: SortDirection) => void;
  onAction: (action: AgentAction, agent: DeliveryAgent) => void;
  busy?: boolean;
}

// Phone layout of the list (shown below 768px by CSS, the table is hidden there).
// One agent per card: identity, the three badges, full contact, key numbers and labelled actions.
// Same props and callbacks as AgentTable, so the page wires both once.
export default function AgentCards({ agents, sort, order, onSort, onAction, busy = false }: AgentCardsProps) {
  const sortValue = `${sort}:${order}`;

  return (
    <>
      <div className="agent-cards-toolbar">
        <label className="agent-cards-toolbar-label" htmlFor="agent-cards-sort">
          Sort by
        </label>
        <Dropdown
          inputId="agent-cards-sort"
          value={sortValue}
          options={[...AGENT_SORT_OPTIONS]}
          onChange={(e) => {
            const [field, dir] = String(e.value).split(":");
            onSort(field as AgentSortField, dir as SortDirection);
          }}
        />
      </div>
      <ul className={busy ? "agent-cards agent-cards-busy" : "agent-cards"} aria-label="Delivery agents" aria-busy={busy}>
        {agents.map((agent) => (
          <li key={agent._id} className="agent-card">
            <div className="agent-cell">
              <Avatar name={agent.name} />
              <div className="agent-cell-text">
                <span className="cell-primary">{agent.name}</span>
                <span className="cell-secondary cell-mono">{shortId(agent._id)}</span>
              </div>
            </div>

            <div className="agent-card-badges">
              <VehicleBadge type={agent.vehicle_type} />
              <ApprovalBadge approved={agent.approved} />
              <PresenceBadge agent={agent} />
            </div>

            <div className="agent-card-contact">
              <span className="cell-primary">{agent.phone}</span>
              <span className="cell-secondary">{agent.email}</span>
            </div>

            <dl className="agent-card-stats">
              <div>
                <dt>Completed</dt>
                <dd>{formatNumber(agent.completed_orders)}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>{formatRating(agent.rating)}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{formatDate(agent.created_at)}</dd>
              </div>
            </dl>

            <div className="agent-card-actions">
              <Button type="button" label="View" icon="pi pi-eye" outlined aria-label={`View ${agent.name}`} onClick={() => onAction("view", agent)} />
              {agent.approved ? (
                <Button type="button" label="Suspend" icon="pi pi-ban" text severity="danger" aria-label={`Suspend ${agent.name}`} onClick={() => onAction("suspend", agent)} />
              ) : (
                <Button type="button" label="Approve" icon="pi pi-check" text severity="success" aria-label={`Approve ${agent.name}`} onClick={() => onAction("approve", agent)} />
              )}
              <Button type="button" label="Delete" icon="pi pi-trash" text severity="secondary" aria-label={`Delete ${agent.name}`} onClick={() => onAction("delete", agent)} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
