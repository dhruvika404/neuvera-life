import { StatusDot } from "@/components/ui/StatusDot";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { AgentStatus } from "@/types/agent";

interface AgentActivityRowProps {
  name: string;
  status: AgentStatus;
  task?: string;
  progress?: number;
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  running: "Running",
  queued: "Queued",
  idle: "Idle",
  error: "Error",
};

const STATUS_STYLES: Record<AgentStatus, { bg: string; color: string }> = {
  running: { bg: "var(--color-green-bg)", color: "var(--color-green)" },
  queued: { bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  idle: { bg: "var(--color-s2)", color: "var(--color-ink3)" },
  error: { bg: "var(--color-red-bg)", color: "var(--color-red)" },
};

export function AgentActivityRow({
  name,
  status,
  task,
  progress,
}: AgentActivityRowProps) {
  const style = STATUS_STYLES[status];

  return (
    <div
      className="flex items-start gap-3 py-3.5 border-b last:border-0"
      style={{ borderColor: "var(--color-border)" }}
    >
      <StatusDot variant={status} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className="text-[13px] font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            {name}
          </span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ background: style.bg, color: style.color }}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
        {task && (
          <p
            className="text-[12px] truncate"
            style={{ color: "var(--color-ink3)" }}
          >
            {task}
          </p>
        )}
        {progress !== undefined && status === "running" && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[10px]"
                style={{
                  color: "var(--color-ink4)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {progress}% complete
              </span>
            </div>
            <ProgressBar value={progress} color="green" />
          </div>
        )}
      </div>
    </div>
  );
}
