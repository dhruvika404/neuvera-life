interface AgentLogFeedProps {
  lines: string[];
}

export function AgentLogFeed({ lines }: AgentLogFeedProps) {
  if (lines.length === 0) {
    return (
      <p className="text-xs py-2" style={{ color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>
        No activity yet...
      </p>
    );
  }
  return (
    <div
      className="rounded-md px-3 py-2 space-y-0.5 max-h-24 overflow-y-auto"
      style={{ background: "var(--color-s2)" }}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-[11px] leading-relaxed truncate"
          style={{ color: "var(--color-ink3)", fontFamily: "var(--font-mono)" }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
