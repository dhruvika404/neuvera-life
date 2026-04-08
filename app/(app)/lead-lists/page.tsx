"use client";
import { useState } from "react";
import { useToastsStore } from "@/store/toasts.store";
import { LeadsDataTable, getLeadsForList } from "@/components/ui/LeadsDataTable";

const LEAD_LISTS = [
  {
    id: "ll-001",
    name: "Skincare Founders — Q1 2026",
    source: "Apollo",
    icpProfile: "Skincare Founders",
    status: "ready",
    leadCount: 142,
    enriched: 128,
    contacted: 61,
    qualified: 38,
    createdAt: "Mar 14, 2026",
    lastUpdated: "2 hours ago",
    description: "Apollo.io pull of DTC skincare founders matching Skincare Founders ICP. Enriched via Clay.",
    tags: ["Q1 2026", "DTC", "Skincare"],
    avgIcpScore: 84,
  },
  {
    id: "ll-002",
    name: "DTC Beauty Buyers — Retail",
    source: "Apollo",
    icpProfile: "DTC Beauty Buyers",
    status: "ready",
    leadCount: 87,
    enriched: 72,
    contacted: 34,
    qualified: 22,
    createdAt: "Feb 28, 2026",
    lastUpdated: "3 days ago",
    description: "VP and Director-level buyers at beauty retail chains identified via Apollo keyword search.",
    tags: ["Retail", "Buyers"],
    avgIcpScore: 76,
  },
  {
    id: "ll-003",
    name: "Peptide Formulators — Global",
    source: "Clay",
    icpProfile: "Peptide Wholesale Dist.",
    status: "enriching",
    leadCount: 31,
    enriched: 18,
    contacted: 0,
    qualified: 0,
    createdAt: "Mar 20, 2026",
    lastUpdated: "6 hours ago",
    description: "Manually sourced ingredient suppliers and formulators being enriched with company data via Clay.",
    tags: ["Ingredients", "B2B"],
    avgIcpScore: 71,
  },
  {
    id: "ll-004",
    name: "UK Skincare Brands — Series A",
    source: "Apollo",
    icpProfile: "Skincare Founders",
    status: "ready",
    leadCount: 56,
    enriched: 56,
    contacted: 12,
    qualified: 9,
    createdAt: "Mar 5, 2026",
    lastUpdated: "1 week ago",
    description: "Series A skincare founders based in UK and Ireland. High-intent verified emails.",
    tags: ["UK", "Series A"],
    avgIcpScore: 89,
  },
  {
    id: "ll-005",
    name: "Wellness CPG — Emerging Brands",
    source: "Manual",
    icpProfile: "Skincare Founders",
    status: "draft",
    leadCount: 24,
    enriched: 0,
    contacted: 0,
    qualified: 0,
    createdAt: "Mar 28, 2026",
    lastUpdated: "Yesterday",
    description: "Manually curated list of emerging wellness CPG founders discovered via Instagram and LinkedIn.",
    tags: ["Wellness", "CPG", "Manual"],
    avgIcpScore: 0,
  },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  ready:     { bg: "var(--color-green-bg)", color: "var(--color-green)" },
  enriching: { bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  draft:     { bg: "var(--color-s3)", color: "var(--color-ink3)" },
};

const SOURCE_STYLE: Record<string, { bg: string; color: string }> = {
  Apollo: { bg: "var(--color-blue-bg)", color: "var(--color-blue)" },
  Clay:   { bg: "var(--color-teal-bg, #E6F4F4)", color: "var(--color-teal, #2A7A7A)" },
  Manual: { bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
};

export default function LeadListsPage() {
  const { addToast } = useToastsStore();
  const [selected, setSelected] = useState<string | null>("ll-001");

  const list = LEAD_LISTS.find((l) => l.id === selected) ?? LEAD_LISTS[0];

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      {/* Left list */}
      <div style={{ width: 310, borderRight: "0.5px solid var(--color-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 16px 10px", borderBottom: "0.5px solid var(--color-border)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginBottom: 2 }}>Lead Lists</div>
          <div style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>
            {LEAD_LISTS.length} lists · {LEAD_LISTS.reduce((s, l) => s + l.leadCount, 0).toLocaleString()} total leads
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {LEAD_LISTS.map((l) => {
            const ss = STATUS_STYLE[l.status];
            const src = SOURCE_STYLE[l.source];
            return (
              <button
                key={l.id}
                onClick={() => setSelected(l.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 14px",
                  borderLeft: selected === l.id ? "2px solid var(--color-gold)" : "2px solid transparent",
                  background: selected === l.id ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent",
                  borderBottom: "0.5px solid var(--color-border)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--color-ink)", lineHeight: 1.3 }}>{l.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99, background: ss.bg, color: ss.color, flexShrink: 0 }}>
                    {l.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: src.bg, color: src.color }}>
                    {l.source}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-ink3)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--color-ink3)" }}>{l.icpProfile}</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <ListStat label="Leads" value={l.leadCount} />
                  <ListStat label="Enriched" value={l.enriched} color={l.enriched === l.leadCount ? "var(--color-green)" : undefined} />
                  <ListStat label="Qualified" value={l.qualified} color="var(--color-blue)" />
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 14px", borderTop: "0.5px solid var(--color-border)" }}>
          <button
            onClick={() => addToast({ title: "New lead list created", type: "success" })}
            style={{
              width: "100%",
              padding: "7px 0",
              background: "var(--color-gold)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            + New List
          </button>
        </div>
      </div>

      {/* Right detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <ListDetail list={list} onExport={() => addToast({ title: `"${list.name}" exported as CSV`, type: "success" })} onEnrich={() => addToast({ title: `Clay enrichment queued for "${list.name}"`, type: "info" })} />
      </div>
    </div>
  );
}

function ListStat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: "var(--color-ink4)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: color ?? "var(--color-ink)", fontFamily: "var(--font-serif)" }}>{value}</div>
    </div>
  );
}

function ListDetail({
  list,
  onExport,
  onEnrich,
}: {
  list: (typeof LEAD_LISTS)[0];
  onExport: () => void;
  onEnrich: () => void;
}) {
  const ss = STATUS_STYLE[list.status];
  const src = SOURCE_STYLE[list.source];
  const enrichPct = list.leadCount > 0 ? Math.round((list.enriched / list.leadCount) * 100) : 0;
  const contactedPct = list.leadCount > 0 ? Math.round((list.contacted / list.leadCount) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>{list.name}</h1>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: ss.bg, color: ss.color }}>{list.status}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-ink3)", lineHeight: 1.5, maxWidth: 560 }}>{list.description}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {list.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, padding: "2px 8px", background: "var(--color-s3)", color: "var(--color-ink2)", borderRadius: 4 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={onEnrich} style={secondaryBtn}>Enrich with Clay</button>
          <button onClick={onExport} style={primaryBtn}>Export CSV</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Leads", value: list.leadCount, color: "var(--color-ink)" },
          { label: "Enriched", value: `${list.enriched} (${enrichPct}%)`, color: "var(--color-teal, #2A7A7A)" },
          { label: "Contacted", value: `${list.contacted} (${contactedPct}%)`, color: "var(--color-amber)" },
          { label: "Qualified", value: list.qualified, color: "var(--color-blue)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Detail cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Section title="List Information">
          <DetailRow label="Source" value={<span style={{ fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 4, background: src.bg, color: src.color }}>{list.source}</span>} />
          <DetailRow label="ICP Profile" value={list.icpProfile} />
          <DetailRow label="Created" value={list.createdAt} />
          <DetailRow label="Last Updated" value={list.lastUpdated} />
          {list.avgIcpScore > 0 && <DetailRow label="Avg ICP Score" value={`${list.avgIcpScore}/100`} />}
        </Section>
        <Section title="Pipeline Progress">
          <Progress label="Enrichment" value={enrichPct} color="var(--color-teal, #2A7A7A)" />
          <Progress label="Contacted" value={contactedPct} color="var(--color-amber)" />
          <Progress label="Qualification" value={list.leadCount > 0 ? Math.round((list.qualified / list.leadCount) * 100) : 0} color="var(--color-blue)" />
        </Section>
      </div>

      {/* Full paginated lead table */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          Leads in this list
        </div>
        <LeadsDataTable leads={getLeadsForList(list.id)} />
      </div>
    </div>
  );
}


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "14px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 5, marginBottom: 5, borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)" }}>
      <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink)" }}>{value}</span>
    </div>
  );
}

function Progress({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: "var(--color-s3)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, transition: "width .4s" }} />
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: "7px 14px",
  background: "var(--color-ink)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

const secondaryBtn: React.CSSProperties = {
  padding: "7px 14px",
  background: "var(--color-surface)",
  color: "var(--color-ink2)",
  border: "0.5px solid var(--color-border)",
  borderRadius: "var(--radius)",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};
