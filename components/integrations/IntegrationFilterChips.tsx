"use client";

// Matches HTML filter chips exactly
const CATEGORIES = [
  "All",
  "Infrastructure",
  "Sales & Outreach",
  "Data & Enrichment",
  "Ops & Finance",
  "Connected",
];

interface IntegrationFilterChipsProps {
  active: string;
  onChange: (cat: string) => void;
  total: number;
}

export function IntegrationFilterChips({ active, onChange, total }: IntegrationFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        const label = cat === "All" ? `All (${total})` : cat === "Connected" ? "Connected only" : cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              padding: "5px 14px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 500,
              border: `0.5px solid ${isActive ? "var(--color-ink)" : "var(--color-border)"}`,
              background: isActive ? "var(--color-ink)" : "var(--color-surface)",
              color: isActive ? "#fff" : "var(--color-ink2)",
              cursor: "pointer",
              transition: "all .15s",
              fontFamily: "var(--font-sans)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
