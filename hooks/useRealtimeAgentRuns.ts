"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AgentRunDto } from "@/types/dtos";
import { mapAgentRun } from "@/lib/utils/mappers";
import type { Database } from "@/types/database";

type AgentRunRow = Database["public"]["Tables"]["agent_runs"]["Row"];

/**
 * Subscribes to agent_runs INSERT and UPDATE events for the given org.
 * Optionally filtered to a specific conversation.
 *
 * Usage:
 *   const { runs, latestRun } = useRealtimeAgentRuns(orgId, conversationId);
 */
export function useRealtimeAgentRuns(
  organizationId: string | null,
  conversationId?: string | null
) {
  const [runs, setRuns] = useState<AgentRunDto[]>([]);

  useEffect(() => {
    if (!organizationId) return;

    const supabase = createClient();
    const channelKey = conversationId
      ? `agent_runs:${organizationId}:${conversationId}`
      : `agent_runs:${organizationId}`;

    const channel = supabase
      .channel(channelKey)
      .on<AgentRunRow>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "agent_runs",
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          const row = payload.new as AgentRunRow;
          if (!row?.id) return;
          // If filtering by conversation, skip unrelated runs
          if (conversationId && row.conversation_id !== conversationId) return;
          const updated = mapAgentRun(row);
          setRuns((prev) => {
            const without = prev.filter((r) => r.id !== updated.id);
            return [updated, ...without].slice(0, 50);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, conversationId]);

  const latestRun = runs[0] ?? null;

  return { runs, latestRun };
}
