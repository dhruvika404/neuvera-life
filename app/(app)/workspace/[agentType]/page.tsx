"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkspaceStore } from "@/store/workspace.store";
import { WorkspaceOverlay } from "@/components/workspace/WorkspaceOverlay";

export default function AgentWorkspacePage() {
  const params = useParams();
  const { openWorkspace } = useWorkspaceStore();
  const agentType = params.agentType as string;

  // Sync the store with the URL param
  useEffect(() => {
    if (agentType === "prospecting" || agentType === "engagement") {
      openWorkspace(agentType);
    }
  }, [agentType, openWorkspace]);

  return <WorkspaceOverlay />;
}
