"use client";
import { useState } from "react";
import { useToastsStore } from "@/store/toasts.store";

const PROFILES = [
  {
    id: "skincare-founders",
    name: "Skincare Founders",
    status: "active",
    description: "Series A–C founders running DTC skincare brands with science-backed positioning and $1M–$20M ARR.",
    industry: "Beauty & Skincare",
    revenueRange: "$1M – $20M ARR",
    fundingStage: "Series A–C",
    regions: ["North America", "UK", "Australia"],
    employeeRange: "10–200",
    criteria: ["DTC brand", "Science-backed", "Influencer-driven", "Female founded 60%+", "Subscription model"],
    apolloFilters: { title: ["Founder", "CEO", "Co-Founder"], industry: "Cosmetics", headcount: "10-200" },
    stats: { totalLeads: 142, qualified: 38, contacted: 61, meetings: 14, converted: 7 },
    lastRun: "2 hours ago",
    createdAt: "Jan 12, 2026",
  },
  {
    id: "dtc-beauty",
    name: "DTC Beauty Buyers",
    status: "paused",
    description: "VP/Director-level buyers at mid-market beauty retail chains and online marketplaces seeking new brand partnerships.",
    industry: "Beauty Retail",
    revenueRange: "$5M – $100M",
    fundingStage: "Growth / PE-backed",
    regions: ["North America"],
    employeeRange: "50–500",
    criteria: ["Retail buyer", "Partnership-ready", "Active social presence", "Multiple brand lines"],
    apolloFilters: { title: ["VP of Buying", "Director of Merchandising", "Category Manager"], industry: "Retail" },
    stats: { totalLeads: 87, qualified: 22, contacted: 34, meetings: 6, converted: 3 },
    lastRun: "3 days ago",
    createdAt: "Feb 3, 2026",
  },
  {
    id: "peptide-wholesale",
    name: "Peptide Wholesale Dist.",
    status: "draft",
    description: "Wholesale distributors and formulators specializing in peptide ingredients for skincare R&D supply chain.",
    industry: "Cosmetic Ingredients",
    revenueRange: "$500K – $10M",
    fundingStage: "Bootstrapped / Seed",
    regions: ["North America", "Europe", "Asia-Pacific"],
    employeeRange: "5–50",
    criteria: ["Ingredient supplier", "Lab-grade quality", "MOQ flexible", "Certified GMP"],
    apolloFilters: { title: ["CEO", "Sales Director", "Business Development"], industry: "Chemical" },
    stats: { totalLeads: 31, qualified: 12, contacted: 8, meetings: 2, converted: 1 },
    lastRun: "Never",
    createdAt: "Mar 18, 2026",
  },
];

const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  active: { bg: "var(--color-green-bg)", color: "var(--color-green)" },
  paused: { bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  draft:  { bg: "var(--color-s3)", color: "var(--color-ink3)" },
};

export default function IcpProfilesPage() {
  const { addToast } = useToastsStore();
  const [selected, setSelected] = useState<string | null>("skincare-founders");
  const [showNew, setShowNew] = useState(false);

  const profile = PROFILES.find((p) => p.id === selected) ?? PROFILES[0];

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      {/* Left list */}
      <div
        style={{
          width: 300,
          borderRight: "0.5px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "16px 16px 10px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginBottom: 4 }}>
            ICP Profiles
          </div>
          <div style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>
            {PROFILES.length} profiles · {PROFILES.filter((p) => p.status === "active").length} active
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {PROFILES.map((p) => {
            const s = STAGE_COLORS[p.status];
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  borderLeft: selected === p.id ? "2px solid var(--color-gold)" : "2px solid transparent",
                  background: selected === p.id ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent",
                  borderBottom: "0.5px solid var(--color-border)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>{p.name}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "1px 7px",
                      borderRadius: 99,
                      background: s.bg,
                      color: s.color,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--color-ink3)", lineHeight: 1.4 }}>
                  {p.industry} · {p.revenueRange}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <Micro label="Leads" value={p.stats.totalLeads} />
                  <Micro label="Qualified" value={p.stats.qualified} color="var(--color-green)" />
                  <Micro label="Meetings" value={p.stats.meetings} color="var(--color-blue)" />
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 14px", borderTop: "0.5px solid var(--color-border)" }}>
          <button
            onClick={() => setShowNew(true)}
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
            + New ICP Profile
          </button>
        </div>
      </div>

      {/* Right detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <ProfileDetail
          profile={profile}
          onActivate={() => addToast({ title: `"${profile.name}" set as active ICP`, type: "success" })}
          onRunAgent={() => addToast({ title: `Prospecting agent queued for "${profile.name}"`, type: "info" })}
        />
      </div>

      {showNew && (
        <NewIcpModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); addToast({ title: "ICP Profile created", type: "success" }); }} />
      )}
    </div>
  );
}

function Micro({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--color-ink4)", marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-serif)", color: color ?? "var(--color-ink)" }}>
        {value}
      </div>
    </div>
  );
}

function ProfileDetail({
  profile,
  onActivate,
  onRunAgent,
}: {
  profile: (typeof PROFILES)[0];
  onActivate: () => void;
  onRunAgent: () => void;
}) {
  const s = STAGE_COLORS[profile.status];
  const convRate = profile.stats.totalLeads > 0
    ? Math.round((profile.stats.converted / profile.stats.totalLeads) * 100)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>
              {profile.name}
            </h1>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 99,
                background: s.bg,
                color: s.color,
              }}
            >
              {profile.status}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-ink3)", lineHeight: 1.5, maxWidth: 560 }}>
            {profile.description}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {profile.status !== "active" && (
            <button
              onClick={onActivate}
              style={{
                padding: "7px 14px",
                background: "var(--color-green)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Set Active
            </button>
          )}
          <button
            onClick={onRunAgent}
            style={{
              padding: "7px 14px",
              background: "var(--color-ink)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            Run Agent
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Total Leads", value: profile.stats.totalLeads, color: "var(--color-ink)" },
          { label: "Qualified", value: profile.stats.qualified, color: "var(--color-blue)" },
          { label: "Contacted", value: profile.stats.contacted, color: "var(--color-amber)" },
          { label: "Meetings", value: profile.stats.meetings, color: "var(--color-purple)" },
          { label: "Converted", value: profile.stats.converted, color: "var(--color-green)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--color-surface)",
              border: "0.5px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "12px 14px",
            }}
          >
            <div style={{ fontSize: 10.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontFamily: "var(--font-serif)", color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {/* Criteria */}
        <Section title="Target Criteria">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {profile.criteria.map((c) => (
              <span
                key={c}
                style={{
                  padding: "3px 10px",
                  background: "var(--color-blue-bg)",
                  color: "var(--color-blue)",
                  borderRadius: 99,
                  fontSize: 11.5,
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </Section>

        {/* Target profile */}
        <Section title="Target Profile">
          <DetailRow label="Industry" value={profile.industry} />
          <DetailRow label="Revenue" value={profile.revenueRange} />
          <DetailRow label="Funding" value={profile.fundingStage} />
          <DetailRow label="Headcount" value={profile.employeeRange} />
          <DetailRow label="Regions" value={profile.regions.join(", ")} />
        </Section>

        {/* Apollo filters */}
        <Section title="Apollo.io Filters">
          {Object.entries(profile.apolloFilters).map(([k, v]) => (
            <DetailRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={Array.isArray(v) ? v.join(", ") : v} />
          ))}
        </Section>

        {/* Performance */}
        <Section title="Pipeline Performance">
          <DetailRow label="Created" value={profile.createdAt} />
          <DetailRow label="Last Run" value={profile.lastRun} />
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>Qualification Rate</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--color-ink)" }}>
                {profile.stats.totalLeads > 0 ? Math.round((profile.stats.qualified / profile.stats.totalLeads) * 100) : 0}%
              </span>
            </div>
            <ProgressBar value={profile.stats.totalLeads > 0 ? (profile.stats.qualified / profile.stats.totalLeads) * 100 : 0} color="var(--color-blue)" />
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>Conversion Rate</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--color-ink)" }}>{convRate}%</span>
            </div>
            <ProgressBar value={convRate} color="var(--color-green)" />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 5, marginBottom: 5, borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)" }}>
      <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 5, background: "var(--color-s3)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, value)}%`, background: color, borderRadius: 99, transition: "width .4s" }} />
    </div>
  );
}

function NewIcpModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,23,19,.32)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "24px", width: 480, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-ink)", marginBottom: 16 }}>New ICP Profile</div>
        <Field label="Profile Name" placeholder="e.g. Peptide Brand Founders" />
        <Field label="Industry / Vertical" placeholder="e.g. Beauty & Skincare" />
        <Field label="Revenue Range" placeholder="e.g. $1M – $20M ARR" />
        <Field label="Funding Stage" placeholder="e.g. Seed, Series A–C, Bootstrapped" />
        <Field label="Target Regions" placeholder="e.g. North America, UK" />
        <Field label="Target Titles (comma-separated)" placeholder="e.g. Founder, CEO, VP Marketing" />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", fontSize: 12.5, color: "var(--color-ink2)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
          <button onClick={onSave} style={{ padding: "7px 16px", background: "var(--color-gold)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Create Profile</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: "var(--color-ink2)", marginBottom: 5 }}>{label}</div>
      <input
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "7px 10px",
          background: "var(--color-s2)",
          border: "0.5px solid var(--color-border)",
          borderRadius: "var(--radius)",
          fontSize: 12.5,
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
