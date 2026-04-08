type StatusDotVariant = "running" | "queued" | "idle" | "error" | "connected" | "disconnected";

interface StatusDotProps {
  variant: StatusDotVariant;
  className?: string;
}

const COLOR_MAP: Record<StatusDotVariant, string> = {
  running: "var(--color-green)",
  connected: "var(--color-green)",
  queued: "var(--color-amber)",
  idle: "var(--color-ink4)",
  error: "var(--color-red)",
  disconnected: "var(--color-ink4)",
};

export function StatusDot({ variant, className }: StatusDotProps) {
  const color = COLOR_MAP[variant];
  const isPulsing = variant === "running";

  return (
    <span className={`relative inline-flex h-2 w-2 ${className ?? ""}`}>
      {isPulsing && (
        <span
          className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ background: color }}
        />
      )}
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ background: color }}
      />
    </span>
  );
}
