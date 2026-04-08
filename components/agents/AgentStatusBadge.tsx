type AgentStatus = "running" | "queued" | "idle" | "error";

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

const CONFIG: Record<AgentStatus, { label: string; bg: string; color: string }> = {
  running: { label: "Running", bg: "var(--color-green-bg)", color: "var(--color-green)" },
  queued: { label: "Queued", bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  idle: { label: "Idle", bg: "var(--color-s2)", color: "var(--color-ink3)" },
  error: { label: "Error", bg: "var(--color-red-bg)", color: "var(--color-red)" },
};

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  const { label, bg, color } = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: bg, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, opacity: status === "running" ? 1 : 0.6 }}
      />
      {label}
    </span>
  );
}
