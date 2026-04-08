import { AgentCard } from "./AgentCard";

const AGENT_DATA = [
  {
    type: "prospecting" as const,
    name: "Prospecting Agent",
    description: "ICP-driven lead discovery via Apollo, Clay, and HubSpot",
    status: "running" as const,
    task: "Enriching 47 leads via Clay enrichment pipeline",
    progress: 62,
    stats: [
      { label: "Leads Found", value: "1,247" },
      { label: "ICP Score Avg", value: "82" },
      { label: "Run Count", value: "14" },
    ],
    logLines: [
      "[apollo] Search complete — 186 candidates",
      "[dedup] Removed 31 duplicates",
      "[clay] Enriching batch 3/4...",
    ],
  },
  {
    type: "engagement" as const,
    name: "Engagement Agent",
    description: "Automated email outreach via Instantly.ai campaign management",
    status: "queued" as const,
    task: "Waiting for lead list — Q2 SaaS Founders",
    stats: [
      { label: "Emails Sent", value: "4,830" },
      { label: "Open Rate", value: "31.4%" },
      { label: "Replies", value: "247" },
    ],
    logLines: [
      "[queue] Waiting for prospecting output",
      "[schedule] Next run: on approval",
    ],
  },
];

export function AgentGrid() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {AGENT_DATA.map((agent) => (
        <AgentCard key={agent.type} {...agent} />
      ))}
    </div>
  );
}
