"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { PageHeader, StateWrapper } from "@/components";
import AgentForm from "@/components/delivery-agents/AgentForm";
import { useDeliveryAgentMutations, useGetDeliveryAgentDetails } from "@/hooks";
import { useToast } from "@/providers/ToastProvider";
import { ApiError } from "@/types/api";
import type { DeliveryAgentPayload } from "@/types/delivery-agent";

// Edit a delivery agent: load → prefilled form → PATCH → toast → details.
export default function EditDeliveryAgentPage() {
  const router = useRouter();
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const { agent, isLoading, isError, error, refetch } = useGetDeliveryAgentDetails(id);
  const { updateAgent } = useDeliveryAgentMutations();
  const [serverError, setServerError] = useState<ApiError | null>(null);

  const handleSubmit = async (payload: DeliveryAgentPayload) => {
    if (!id) return;
    setServerError(null);
    try {
      const updated = await updateAgent.mutateAsync({ id, patch: payload });
      toast.success("Changes saved", `${updated.name} was updated.`);
      router.push(`/delivery-agents/details/${id}`);
    } catch (err) {
      setServerError(err instanceof ApiError ? err : new ApiError("Could not save the changes. Please try again.", 0));
    }
  };

  const backToDetails = () => router.push(id ? `/delivery-agents/details/${id}` : "/delivery-agents/list");

  return (
    <div className="agents-list">
      <PageHeader
        title={agent ? `Edit ${agent.name}` : "Edit delivery agent"}
        description="Changes apply immediately in the partner app."
        actions={<Button type="button" label="Back" icon="pi pi-arrow-left" text onClick={backToDetails} />}
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
        loadingFallback={<Skeleton className="form-skeleton" />}
      >
        <AgentForm mode="edit" agent={agent} onSubmit={handleSubmit} onCancel={backToDetails} serverError={serverError} submitting={updateAgent.isPending} />
      </StateWrapper>
    </div>
  );
}
