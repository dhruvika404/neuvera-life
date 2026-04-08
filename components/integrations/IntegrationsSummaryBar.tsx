// Matches HTML .int-summary layout exactly
interface IntegrationsSummaryBarProps {
  connected: number;
  notConnected: number;
  freeTier: number;
  estimatedCost: number;
  total: number;
}

function Sep() {
  return (
    <div
      style={{
        width: "0.5px",
        alignSelf: "stretch",
        background: "var(--color-border)",
        margin: "0 4px",
      }}
    />
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-ink4)",
          fontWeight: 600,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontFamily: "var(--font-serif)",
          color: color ?? "var(--color-ink)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function IntegrationsSummaryBar({
  connected,
  notConnected,
  freeTier,
  estimatedCost,
  total,
}: IntegrationsSummaryBarProps) {
  const pct = Math.round((connected / total) * 100);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <Stat label="Est. Monthly Cost" value={`~$${estimatedCost.toLocaleString()}`} />
      <Sep />
      <Stat label="Connected" value={connected} color="var(--color-green)" />
      <Stat label="Not Connected" value={notConnected} color="var(--color-ink3)" />
      <Stat label="Free Tier" value={freeTier} color="var(--color-blue)" />

      {/* Right: toggle + progress */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11.5, color: "var(--color-ink4)" }}>Manual tracking</span>
        {/* Toggle (decorative) */}
        <div
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            background: "var(--color-green)",
            display: "flex",
            alignItems: "center",
            padding: 2,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              marginLeft: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}
