"use client";
import { useState } from "react";
import { useToastsStore } from "@/store/toasts.store";
import { LeadsDataTable, getLeadsForList } from "@/components/ui/LeadsDataTable";

const BATCH_LIST_MAP: Record<string, string> = {
  "enr-001": "ll-001",
  "enr-002": "ll-004",
  "enr-003": "ll-003",
  "enr-004": "ll-002",
};

const BATCHES = [
  {
    id: "enr-001",
    name: "Skincare Founders — Q1 2026",
    leadList: "Skincare Founders — Q1 2026",
    status: "complete",
    totalLeads: 142,
    enriched: 128,
    failed: 14,
    startedAt: "Mar 14, 2026 · 09:41",
    completedAt: "Mar 14, 2026 · 11:08",
    duration: "87 min",
    fields: ["LinkedIn URL", "Email (verified)", "Phone", "Company HQ", "Funding Round", "Headcount", "Technologies", "Revenue Est."],
    completenessBreakdown: {
      "Email (verified)": 128,
      "LinkedIn URL": 119,
      "Company HQ": 142,
      "Funding Round": 98,
      "Headcount": 135,
      "Technologies": 87,
      "Revenue Est.": 64,
      "Phone": 41,
    },
    cost: "$18.42",
    topSources: ["Apollo.io", "LinkedIn", "Clearbit", "Hunter.io"],
  },
  {
    id: "enr-002",
    name: "UK Skincare Brands — Series A",
    leadList: "UK Skincare Brands — Series A",
    status: "complete",
    totalLeads: 56,
    enriched: 56,
    failed: 0,
    startedAt: "Mar 6, 2026 · 14:22",
    completedAt: "Mar 6, 2026 · 14:59",
    duration: "37 min",
    fields: ["LinkedIn URL", "Email (verified)", "Company HQ", "Funding Round", "Headcount", "Revenue Est.", "Crunchbase"],
    completenessBreakdown: {
      "Email (verified)": 56,
      "LinkedIn URL": 54,
      "Company HQ": 56,
      "Funding Round": 52,
      "Headcount": 56,
      "Revenue Est.": 43,
      "Crunchbase": 38,
      "Phone": 21,
    },
    cost: "$8.12",
    topSources: ["Apollo.io", "LinkedIn", "Crunchbase"],
  },
  {
    id: "enr-003",
    name: "Peptide Formulators — Global",
    leadList: "Peptide Formulators — Global",
    status: "running",
    totalLeads: 31,
    enriched: 18,
    failed: 1,
    startedAt: "Mar 28, 2026 · 16:05",
    completedAt: "In progress",
    duration: "Running...",
    fields: ["Email (verified)", "LinkedIn URL", "Company HQ", "Headcount", "Industry SIC Code"],
    completenessBreakdown: {
      "Email (verified)": 16,
      "LinkedIn URL": 14,
      "Company HQ": 18,
      "Headcount": 15,
      "Industry SIC Code": 18,
    },
    cost: "$3.10",
    topSources: ["Apollo.io", "LinkedIn"],
  },
  {
    id: "enr-004",
    name: "DTC Buyers — Retail",
    leadList: "DTC Beauty Buyers — Retail",
    status: "failed",
    totalLeads: 87,
    enriched: 31,
    failed: 56,
    startedAt: "Mar 1, 2026 · 10:00",
    completedAt: "Mar 1, 2026 · 10:17",
    duration: "17 min",
    fields: ["Email (verified)", "LinkedIn URL", "Company HQ"],
    completenessBreakdown: {
      "Email (verified)": 28,
      "LinkedIn URL": 31,
      "Company HQ": 31,
    },
    cost: "$4.50",
    topSources: ["Apollo.io"],
  },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  complete: { bg: "var(--color-green-bg)", color: "var(--color-green)", dot: "var(--color-green)" },
  running:  { bg: "var(--color-amber-bg)", color: "var(--color-amber)", dot: "var(--color-amber)" },
  failed:   { bg: "var(--color-red-bg)", color: "var(--color-red)", dot: "var(--color-red)" },
  queued:   { bg: "var(--color-blue-bg)", color: "var(--color-blue)", dot: "var(--color-blue)" },
};

export default function ClayEnrichmentPage() {
  const { addToast } = useToastsStore();
  const [selected, setSelected] = useState("enr-001");

  const batch = BATCHES.find((b) => b.id === selected) ?? BATCHES[0];
  const ss = STATUS_STYLE[batch.status];
  const completePct = batch.totalLeads > 0 ? Math.round((batch.enriched / batch.totalLeads) * 100) : 0;

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Left */}
      <div style={{ width: 300, borderRight: "0.5px solid var(--color-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 16px 10px", borderBottom: "0.5px solid var(--color-border)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginBottom: 2 }}>Clay Enrichment</div>
          <div style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>
            {BATCHES.length} batches · {BATCHES.reduce((a, b) => a + b.enriched, 0)} leads enriched
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {BATCHES.map((b) => {
            const s = STATUS_STYLE[b.status];
            const pct = b.totalLeads > 0 ? Math.round((b.enriched / b.totalLeads) * 100) : 0;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "11px 14px",
                  borderLeft: selected === b.id ? "2px solid var(--color-gold)" : "2px solid transparent",
                  background: selected === b.id ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent",
                  borderBottom: "0.5px solid var(--color-border)", cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--color-ink)", lineHeight: 1.3 }}>{b.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99, background: s.bg, color: s.color, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    {b.status === "running" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block", animation: "pulse 1.5s infinite" }} />}
                    {b.status}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--color-ink3)", marginBottom: 6 }}>{b.leadList}</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <BatchStat label="Leads" value={b.totalLeads} />
                  <BatchStat label="Enriched" value={b.enriched} color="var(--color-green)" />
                  <BatchStat label="Failed" value={b.failed} color={b.failed > 0 ? "var(--color-red)" : undefined} />
                </div>
                <div style={{ height: 4, background: "var(--color-s3)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: s.dot, borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "var(--color-ink4)" }}>{pct}% complete</span>
                  <span style={{ fontSize: 10, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>{b.cost}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 14px", borderTop: "0.5px solid var(--color-border)" }}>
          <button
            onClick={() => addToast({ title: "Enrichment batch queued", type: "info" })}
            style={{ width: "100%", padding: "7px 0", background: "var(--color-gold)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            + New Enrichment
          </button>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>{batch.name}</h1>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: ss.bg, color: ss.color }}>{batch.status}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-ink3)" }}>Lead list: {batch.leadList}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {batch.status === "failed" && (
              <button onClick={() => addToast({ title: "Enrichment re-queued", type: "info" })} style={secondaryBtn}>Retry Failed</button>
            )}
            <button onClick={() => addToast({ title: "Enrichment data exported", type: "success" })} style={primaryBtn}>Export Data</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Total Leads", value: batch.totalLeads, color: "var(--color-ink)" },
            { label: "Enriched", value: batch.enriched, color: "var(--color-green)" },
            { label: "Failed", value: batch.failed, color: batch.failed > 0 ? "var(--color-red)" : "var(--color-ink3)" },
            { label: "Completeness", value: `${completePct}%`, color: "var(--color-blue)" },
            { label: "Cost", value: batch.cost, color: "var(--color-amber)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Detail grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {/* Run info */}
          <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Run Information</div>
            <DR label="Started" value={batch.startedAt} />
            <DR label="Completed" value={batch.completedAt} />
            <DR label="Duration" value={batch.duration} />
            <DR label="Data Sources" value={batch.topSources.join(", ")} />
            <DR label="Fields Requested" value={`${batch.fields.length} fields`} />
          </div>

          {/* Field completeness */}
          <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Field Completeness</div>
            {Object.entries(batch.completenessBreakdown).map(([field, count]) => {
              const pct = batch.totalLeads > 0 ? Math.round((count / batch.totalLeads) * 100) : 0;
              return (
                <div key={field} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11.5, color: "var(--color-ink2)" }}>{field}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: pct >= 80 ? "var(--color-green)" : pct >= 50 ? "var(--color-amber)" : "var(--color-ink3)" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--color-s3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "var(--color-green)" : pct >= 50 ? "var(--color-amber)" : "var(--color-red)", borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enriched leads table */}
        <div style={{ marginTop: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Enriched Leads
          </div>
          <LeadsDataTable leads={getLeadsForList(BATCH_LIST_MAP[batch.id] ?? "")} />
        </div>
      </div>
    </div>
  );
}

function BatchStat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: "var(--color-ink4)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: color ?? "var(--color-ink)", fontFamily: "var(--font-serif)" }}>{value}</div>
    </div>
  );
}

function DR({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 5, marginBottom: 5, borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)" }}>
      <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

const primaryBtn: React.CSSProperties = { padding: "7px 14px", background: "var(--color-ink)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" };
const secondaryBtn: React.CSSProperties = { padding: "7px 14px", background: "var(--color-surface)", color: "var(--color-ink2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" };
