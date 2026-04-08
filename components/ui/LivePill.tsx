"use client";

export function LivePill() {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: "var(--color-green-bg)",
        color: "var(--color-green)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ background: "var(--color-green)" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: "var(--color-green)" }}
        />
      </span>
      Live
    </div>
  );
}
