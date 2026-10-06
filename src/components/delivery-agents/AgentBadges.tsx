import StatusBadge, { type BadgeTone } from "@/components/StatusBadge";
import { presenceOf, type DeliveryAgent, type Presence, type VehicleType } from "@/types/delivery-agent";
import { PRESENCE_LABELS, VEHICLE_LABELS } from "@/utils/constants";

// The three badges a delivery agent row shows. Tone mapping lives here, once.

const PRESENCE_TONE: Record<Presence, BadgeTone> = { online: "success", busy: "warning", offline: "neutral" };

export function PresenceBadge({ agent }: { agent: Pick<DeliveryAgent, "active" | "available"> }) {
  const presence = presenceOf(agent);
  return <StatusBadge label={PRESENCE_LABELS[presence]} tone={PRESENCE_TONE[presence]} dot />;
}

export function ApprovalBadge({ approved }: { approved: boolean }) {
  return approved ? (
    <StatusBadge label="Approved" tone="success" icon="pi pi-check" />
  ) : (
    <StatusBadge label="Pending" tone="warning" icon="pi pi-clock" />
  );
}

export function VehicleBadge({ type }: { type: VehicleType }) {
  return <StatusBadge label={VEHICLE_LABELS[type]} tone="info" />;
}
