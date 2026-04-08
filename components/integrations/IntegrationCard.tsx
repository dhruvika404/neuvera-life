import { CheckCircle2, ExternalLink } from "lucide-react";
import type { Integration } from "@/types/integration";

// Matches HTML .int-card styles
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "Infrastructure":    { bg: "var(--color-blue-bg)",   color: "var(--color-blue)"   },
  "Sales & Outreach":  { bg: "var(--color-amber-bg)",  color: "var(--color-amber)"  },
  "Data & Enrichment": { bg: "var(--color-teal-bg, #E6F4F4)", color: "var(--color-teal, #2A7A7A)" },
  "Ops & Finance":     { bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
};

const TIER_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  paid:  { label: "Paid",  bg: "var(--color-ink)",    color: "#fff"                  },
  mixed: { label: "Mixed", bg: "var(--color-s3)",     color: "var(--color-ink2)"     },
  free:  { label: "Free",  bg: "var(--color-green-bg)", color: "var(--color-green)"  },
};

export function IntegrationCard({ integration }: { integration: Integration }) {
  const cat = CATEGORY_COLORS[integration.category] ?? CATEGORY_COLORS["Infrastructure"];
  const tier = TIER_BADGE[integration.tier];
  const isConnected = integration.status === "connected";

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: `0.5px solid ${isConnected ? "var(--color-green-b, #B8DFD0)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 9,
        transition: "all .15s",
      }}
    >
      {/* Top row: logo + name/category + tier badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: cat.bg,
            border: `0.5px solid transparent`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: cat.color,
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {integration.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", lineHeight: 1.2 }}>
            {integration.name}
          </div>
          <div style={{ fontSize: 10.5, color: cat.color, marginTop: 1 }}>
            {integration.category}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 7px",
            background: tier.bg,
            color: tier.color,
            borderRadius: 4,
            flexShrink: 0,
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: "var(--color-ink3)", lineHeight: 1.5 }}>
        {integration.description}
      </p>

      {/* Footer: status + cost + action */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: "0.5px solid var(--color-border)",
        }}
      >
        {/* Status */}
        {isConnected ? (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle2 size={12} style={{ color: "var(--color-green)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-green)" }}>
              Connected
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "1.5px solid var(--color-ink4)",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "var(--color-ink4)" }}>Not connected</span>
          </div>
        )}

        {/* Cost + action */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 10.5,
              color: "var(--color-ink4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {integration.costLabel}
          </span>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 12,
              fontWeight: 500,
              color: isConnected ? "var(--color-ink3)" : "var(--color-gold)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            {isConnected ? "Manage" : "Connect"}
            <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
