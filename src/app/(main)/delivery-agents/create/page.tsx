"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { PageHeader } from "@/components";
import AgentForm from "@/components/delivery-agents/AgentForm";
import { useDeliveryAgentMutations } from "@/hooks";
import { useToast } from "@/providers/ToastProvider";
import { ApiError } from "@/types/api";
import type { DeliveryAgentPayload } from "@/types/delivery-agent";

// Create a delivery agent. On success: toast, list refreshes (query invalidation), go to details.
// On API error: message stays on the form, the typed values are kept.
export default function CreateDeliveryAgentPage() {
  const router = useRouter();
  const toast = useToast();
  const { createAgent } = useDeliveryAgentMutations();
  const [serverError, setServerError] = useState<ApiError | null>(null);

  const handleSubmit = async (payload: DeliveryAgentPayload) => {
    setServerError(null);
    try {
      const created = await createAgent.mutateAsync(payload);
      toast.success("Agent created", `${created.name} was added.`);
      router.push(`/delivery-agents/details/${created._id}`);
    } catch (err) {
      setServerError(err instanceof ApiError ? err : new ApiError("Could not create the agent. Please try again.", 0));
    }
  };

  return (
    <div className="agents-list">
      <PageHeader
        title="Add delivery agent"
        description="Create an account for a new delivery partner. They sign in to the partner app with this email and password."
        actions={<Button type="button" label="Back to list" icon="pi pi-arrow-left" text onClick={() => router.push("/delivery-agents/list")} />}
      />
      <AgentForm mode="create" onSubmit={handleSubmit} onCancel={() => router.push("/delivery-agents/list")} serverError={serverError} submitting={createAgent.isPending} />
    </div>
  );
}
