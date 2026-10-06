import StatTile from "@/components/StatTile";
import type { DeliveryAgentSummary } from "@/types/delivery-agent";
import { formatNumber, formatRating } from "@/utils/formatters";

interface AgentStatsProps {
  /** undefined while the first request is in flight → tiles show skeletons */
  summary?: DeliveryAgentSummary;
}

// Four KPI tiles above the agents table.
export default function AgentStats({ summary }: AgentStatsProps) {
  return (
    <section className="stat-tiles" aria-label="Summary">
      <StatTile label="Total agents" value={summary && formatNumber(summary.total)} icon="pi pi-users" tone="primary" />
      <StatTile
        label="Pending approval"
        value={summary && formatNumber(summary.pending)}
        hint={summary && summary.pending > 0 ? "Needs a decision" : undefined}
        icon="pi pi-clock"
        tone="warning"
      />
      <StatTile
        label="Online now"
        value={summary && formatNumber(summary.online)}
        hint={summary && `${formatNumber(summary.busy)} busy · ${formatNumber(summary.offline)} offline`}
        icon="pi pi-bolt"
        tone="success"
      />
      <StatTile
        label="Average rating"
        value={summary && formatRating(summary.avgRating)}
        hint={summary && "Out of 5, rated agents only"}
        icon="pi pi-star"
        tone="info"
      />
    </section>
  );
}
