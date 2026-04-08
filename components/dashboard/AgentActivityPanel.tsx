"use client";
import useSWR from "swr";
import { AgentActivityRow } from "./AgentActivityRow";
import { Bot, ArrowRight } from "lucide-react";
import type { AgentRunDto } from "@/types/dtos";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });

type AgentStatus = {
  runs: AgentRunDto[];
  prospectingStatus: string;
  engagementStatus: string;
};

function statusToRowStatus(s: string): "running" | "queued" | "idle" | "error" {
  if (s === "running") return "running";
  if (s === "queued") return "queued";
  if (s === "error") return "error";
  return "idle";
}

export function AgentActivityPanel() {
  const { data } = useSWR<AgentStatus>("/api/agents/status", fetcher, { refreshInterval: 5000 });

  const agents = [
    {
      name: "Prospecting Agent",
      status: statusToRowStatus(data?.prospectingStatus ?? "idle"),
      task: data?.runs?.find((r) => r.agentType === "prospecting")
        ? "Processing leads via Apollo & Clay pipeline"
        : "No active runs",
      progress: undefined as number | undefined,
    },
    {
      name: "Engagement Agent",
      status: statusToRowStatus(data?.engagementStatus ?? "idle"),
      task: data?.runs?.find((r) => r.agentType === "engagement")
        ? "Processing outreach sequences via Instantly"
        : "No active runs",
    },
  ];

  const activeCount = agents.filter((a) => a.status === "running" || a.status === "queued").length;

  return (
    <div
      className="rounded-xl border overflow-hidden flex flex-col"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "var(--color-s2)" }}
          >
            <Bot size={13} style={{ color: "var(--color-ink2)" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
            Agent Activity
          </span>
        </div>
        <button
          className="flex items-center gap-1 text-[12px] transition-opacity hover:opacity-70"
          style={{ color: "var(--color-gold)" }}
        >
          View all
          <ArrowRight size={11} />
        </button>
      </div>

      {/* Rows */}
      <div className="px-5 flex-1">
        {agents.map((agent) => (
          <AgentActivityRow key={agent.name} {...agent} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-2.5 border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-s2)" }}
      >
        <p className="text-[11px]" style={{ color: "var(--color-ink4)" }}>
          {activeCount > 0 ? `${activeCount} agent${activeCount > 1 ? "s" : ""} active` : "No active agents"} · updated just now
        </p>
      </div>
    </div>
  );
}
