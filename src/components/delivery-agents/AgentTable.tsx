"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableStateEvent } from "primereact/datatable";
import Avatar from "@/components/Avatar";
import { ApprovalBadge, PresenceBadge, VehicleBadge } from "./AgentBadges";
import type { AgentAction } from "./AgentActions";
import type { AgentSortField, DeliveryAgent, SortDirection } from "@/types/delivery-agent";
import { formatDate, formatNumber, formatRating, shortId } from "@/utils/formatters";

interface AgentTableProps {
  agents: DeliveryAgent[];
  sort: AgentSortField;
  order: SortDirection;
  onSort: (sort: AgentSortField, order: SortDirection) => void;
  onAction: (action: AgentAction, agent: DeliveryAgent) => void;
  /** Dim the rows while the next page / filter result is loading. */
  busy?: boolean;
}

// Lazy (server-sorted) PrimeReact DataTable. Column bodies only format; no data logic here.
export default function AgentTable({ agents, sort, order, onSort, onAction, busy = false }: AgentTableProps) {
  const handleSort = (event: DataTableStateEvent) => {
    onSort(event.sortField as AgentSortField, event.sortOrder === 1 ? "asc" : "desc");
  };

  // Agent: avatar + name + short id
  const agentBody = (row: DeliveryAgent) => (
    <div className="agent-cell">
      <Avatar name={row.name} />
      <div className="agent-cell-text">
        <span className="cell-primary">{row.name}</span>
        <span className="cell-secondary cell-mono">{shortId(row._id)}</span>
      </div>
    </div>
  );

  // Contact: phone + email
  const contactBody = (row: DeliveryAgent) => (
    <div className="agent-cell-text">
      <span className="cell-primary">{row.phone}</span>
      <span className="cell-secondary">{row.email}</span>
    </div>
  );

  const actionsBody = (row: DeliveryAgent) => (
    <div className="cell-actions">
      <Button type="button" icon="pi pi-eye" text rounded severity="secondary" aria-label={`View ${row.name}`} tooltip="View" tooltipOptions={{ position: "top" }} onClick={() => onAction("view", row)} />
      {row.approved ? (
        <Button type="button" icon="pi pi-ban" text rounded severity="danger" aria-label={`Suspend ${row.name}`} tooltip="Suspend" tooltipOptions={{ position: "top" }} onClick={() => onAction("suspend", row)} />
      ) : (
        <Button type="button" icon="pi pi-check" text rounded severity="success" aria-label={`Approve ${row.name}`} tooltip="Approve" tooltipOptions={{ position: "top" }} onClick={() => onAction("approve", row)} />
      )}
      <Button type="button" icon="pi pi-trash" text rounded severity="secondary" aria-label={`Delete ${row.name}`} tooltip="Delete" tooltipOptions={{ position: "top" }} onClick={() => onAction("delete", row)} />
    </div>
  );

  return (
    <div className={busy ? "table-scroll-box table-scroll-box-busy" : "table-scroll-box"} aria-busy={busy}>
      <DataTable value={agents} dataKey="_id" lazy sortField={sort} sortOrder={order === "asc" ? 1 : -1} onSort={handleSort} rowHover>
        <Column field="name" header="Agent" body={agentBody} sortable />
        <Column header="Contact" body={contactBody} />
        <Column header="Vehicle" body={(row: DeliveryAgent) => <VehicleBadge type={row.vehicle_type} />} />
        <Column header="Approval" body={(row: DeliveryAgent) => <ApprovalBadge approved={row.approved} />} />
        <Column header="Status" body={(row: DeliveryAgent) => <PresenceBadge agent={row} />} />
        <Column field="assigned_orders" header="Assigned" body={(row: DeliveryAgent) => formatNumber(row.assigned_orders)} className="cell-number" sortable />
        <Column field="completed_orders" header="Completed" body={(row: DeliveryAgent) => formatNumber(row.completed_orders)} className="cell-number" sortable />
        <Column
          field="rating"
          header="Rating"
          body={(row: DeliveryAgent) => (
            <span className="cell-rating">
              {row.rating > 0 && <i className="pi pi-star-fill" aria-hidden="true" />}
              {formatRating(row.rating)}
            </span>
          )}
          className="cell-number"
          sortable
        />
        <Column field="created_at" header="Joined" body={(row: DeliveryAgent) => formatDate(row.created_at)} sortable />
        <Column header="" body={actionsBody} className="cell-actions-col" />
      </DataTable>
    </div>
  );
}
