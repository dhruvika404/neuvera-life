import { AgentGrid } from "@/components/agents/AgentGrid";

export default function AgentsPage() {
  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-[1.75rem] leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Agent Monitor
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink3)" }}>
            Real-time status and controls for your AI sales agents
          </p>
        </div>
        <span
          className="text-[11px] px-2.5 py-1 rounded-full border"
          style={{
            background: "var(--color-green-bg)",
            color: "var(--color-green)",
            borderColor: "var(--color-green-bg)",
          }}
        >
          1 running · 1 queued
        </span>
      </div>
      <AgentGrid />
    </div>
  );
}
