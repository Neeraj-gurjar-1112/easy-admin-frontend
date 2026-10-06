"use client";

import { useRouter } from "next/navigation";
import { confirmDialog } from "primereact/confirmdialog";
import { useDeliveryAgentMutations } from "@/hooks";
import { useToast } from "@/providers/ToastProvider";
import type { DeliveryAgent } from "@/types/delivery-agent";
import { ApiError } from "@/types/api";

export type AgentAction = "view" | "edit" | "approve" | "suspend" | "delete";

interface Options {
  /** Where to go after a delete (details page → list). */
  afterDelete?: string;
}

// The row / header actions of a delivery agent, shared by the list and the details page.
// Approve is immediate; suspend and delete ask first; errors show the API's own message.
export function useAgentActions({ afterDelete }: Options = {}) {
  const router = useRouter();
  const toast = useToast();
  const { approveAgent, rejectAgent, deleteAgent } = useDeliveryAgentMutations();

  const fail = (title: string, err: unknown) => toast.error(title, err instanceof ApiError ? err.message : "Please try again.");

  const run = (action: AgentAction, agent: DeliveryAgent) => {
    switch (action) {
      case "view":
        router.push(`/delivery-agents/details/${agent._id}`);
        return;
      case "edit":
        router.push(`/delivery-agents/edit/${agent._id}`);
        return;
      case "approve":
        approveAgent.mutate(agent._id, {
          onSuccess: () => toast.success("Agent approved", `${agent.name} can now accept orders.`),
          onError: (err) => fail("Could not approve", err),
        });
        return;
      case "suspend":
        confirmDialog({
          header: "Suspend agent",
          message: `Suspend ${agent.name}? They will be marked not approved and inactive.`,
          icon: "pi pi-ban",
          acceptLabel: "Suspend",
          acceptClassName: "p-button-danger",
          rejectLabel: "Cancel",
          accept: () =>
            rejectAgent.mutate(agent._id, {
              onSuccess: () => toast.success("Agent suspended", `${agent.name} is no longer approved.`),
              onError: (err) => fail("Could not suspend", err),
            }),
        });
        return;
      case "delete":
        confirmDialog({
          header: "Delete agent",
          message: `Delete ${agent.name}? Their device tokens are removed and orders referencing them are unlinked. This cannot be undone.`,
          icon: "pi pi-trash",
          acceptLabel: "Delete",
          acceptClassName: "p-button-danger",
          rejectLabel: "Cancel",
          accept: () =>
            deleteAgent.mutate(agent._id, {
              onSuccess: () => {
                toast.success("Agent deleted", `${agent.name} was removed.`);
                if (afterDelete) router.push(afterDelete);
              },
              onError: (err) => fail("Could not delete", err),
            }),
        });
        return;
    }
  };

  return { run, busy: approveAgent.isPending || rejectAgent.isPending || deleteAgent.isPending };
}
