"use client";
import { Play, Pause, RotateCcw, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { AgentStatusBadge } from "./AgentStatusBadge";
import { AgentLogFeed } from "./AgentLogFeed";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { AgentType } from "@/store/workspace.store";

interface AgentCardProps {
  type: AgentType;
  name: string;
  description: string;
  status: "running" | "queued" | "idle" | "error";
  task?: string;
  progress?: number;
  stats: { label: string; value: string }[];
  logLines?: string[];
}

const AGENT_COLORS: Record<AgentType, { accent: string; bg: string }> = {
  prospecting: { accent: "var(--color-gold)", bg: "var(--color-amber-bg)" },
  engagement: { accent: "var(--color-blue)", bg: "var(--color-blue-bg)" },
};

export function AgentCard({
  type,
  name,
  description,
  status,
  task,
  progress,
  stats,
  logLines = [],
}: AgentCardProps) {
  const router = useRouter();
  const colors = AGENT_COLORS[type] ?? AGENT_COLORS.prospecting;

  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Colored header strip */}
      <div
        className="px-5 pt-5 pb-4 border-b relative overflow-hidden"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${colors.bg} 0%, transparent 60%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: colors.accent }}
              />
              <h3
                className="text-[15px] font-semibold"
                style={{
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {name}
              </h3>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--color-ink3)" }}
            >
              {description}
            </p>
          </div>
          <AgentStatusBadge status={status} />
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 divide-x border-b"
        style={{
          borderColor: "var(--color-border)",
          borderBottomColor: "var(--color-border)",
        }}
      >
        {stats.map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <p
              className="text-[10px] uppercase tracking-[0.06em] mb-1"
              style={{
                color: "var(--color-ink4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {label}
            </p>
            <p
              className="text-xl leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Current task + progress */}
        {task && (
          <div>
            <p
              className="text-[12px] mb-1.5"
              style={{ color: "var(--color-ink3)" }}
            >
              {task}
            </p>
            {progress !== undefined && (
              <ProgressBar
                value={progress}
                color={
                  status === "running"
                    ? "green"
                    : status === "error"
                    ? "red"
                    : "gold"
                }
              />
            )}
          </div>
        )}

        {/* Log feed */}
        <AgentLogFeed lines={logLines} />

        {/* Controls */}
        <div
          className="flex items-center gap-2 pt-2 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            onClick={() => router.push(`/workspace/${type}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--color-ink)", color: "#fff" }}
          >
            <ExternalLink size={11} />
            Open Workspace
          </button>
          {status === "running" ? (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-s2"
              style={{ color: "var(--color-ink2)" }}
            >
              <Pause size={11} />
              Pause
            </button>
          ) : (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-s2"
              style={{ color: "var(--color-ink2)" }}
            >
              <Play size={11} />
              Run
            </button>
          )}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-s2 ml-auto"
            style={{ color: "var(--color-ink3)" }}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
