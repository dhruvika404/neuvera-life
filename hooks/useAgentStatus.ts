"use client";
import useSWR from "swr";
import type { AgentRun } from "@/types/agent";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface AgentStatusData {
  runs: AgentRun[];
  prospectingStatus: "idle" | "running" | "queued" | "error";
  engagementStatus: "idle" | "running" | "queued" | "error";
}

export function useAgentStatus() {
  const { data, error, isLoading } = useSWR<AgentStatusData>(
    "/api/agents/status",
    fetcher,
    {
      // Poll every 3s; SWR automatically stops when component unmounts
      refreshInterval: 3000,
      revalidateOnFocus: false,
    }
  );

  const hasRunning =
    data?.prospectingStatus === "running" ||
    data?.engagementStatus === "running";

  return {
    runs: data?.runs ?? [],
    prospectingStatus: data?.prospectingStatus ?? "idle",
    engagementStatus: data?.engagementStatus ?? "idle",
    hasRunning,
    isLoading,
    error,
  };
}
