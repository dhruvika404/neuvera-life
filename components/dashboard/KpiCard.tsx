import { TrendIndicator } from "@/components/ui/TrendIndicator";

interface KpiCardProps {
  label: string;
  value: string;
  trend?: number;
  trendSuffix?: string;
  sub?: string;
}

export function KpiCard({ label, value, trend, trendSuffix, sub }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-3 relative overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        borderTopColor: "var(--color-gold)",
        borderTopWidth: "2px",
      }}
    >
      {/* Soft corner glow */}
      <div
        className="absolute -top-3 -right-3 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200,169,122,0.12) 0%, transparent 70%)",
        }}
      />

      <p
        className="text-[11px] font-semibold uppercase tracking-[0.08em] relative"
        style={{ color: "var(--color-ink3)" }}
      >
        {label}
      </p>

      <div className="flex items-end justify-between gap-2 relative">
        <span
          className="leading-none"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink)",
            fontSize: "2rem",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
        {trend !== undefined && (
          <div className="pb-0.5">
            <TrendIndicator value={trend} suffix={trendSuffix ?? "%"} />
          </div>
        )}
      </div>

      {sub && (
        <p className="text-[11px] relative" style={{ color: "var(--color-ink4)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
