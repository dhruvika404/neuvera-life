"use client";
import { useState } from "react";
import { useToastsStore } from "@/store/toasts.store";

const CONTACTS = [
  { id: "hs-001", name: "Sarah Chen",      company: "Luminary Health",    title: "Founder & CEO",      email: "s.chen@luminaryhealth.co",    phone: "+1 415 882 4421", stage: "demo_scheduled", dealValue: 28000, lastActivity: "2 hours ago",   source: "Apollo",   owner: "Dipak S.", notes: "Very interested. Wants live demo of campaign analytics. Warm intro via Jake at Apex." },
  { id: "hs-002", name: "David Kim",       company: "HealthFirst Labs",   title: "Founder",            email: "d.kim@healthfirstlabs.com",   phone: "+1 312 994 7731", stage: "proposal_sent",  dealValue: 52000, lastActivity: "Yesterday",     source: "LinkedIn", owner: "Dipak S.", notes: "Proposal reviewed. Finance reviewing contract. Decision by Apr 10." },
  { id: "hs-003", name: "Emma Walsh",      company: "PureVita Brands",    title: "CEO",                email: "emma@purevita.com",           phone: "+1 646 221 5890", stage: "qualified",      dealValue: 18500, lastActivity: "3 days ago",    source: "Apollo",   owner: "Dipak S.", notes: "Qualified via discovery call. Evaluating us vs. in-house team. Follow up Mar 31." },
  { id: "hs-004", name: "James Rivera",    company: "Apex Wellness",      title: "Co-Founder",         email: "james@apexwellness.io",       phone: "+1 737 340 2819", stage: "contacted",      dealValue: 0,     lastActivity: "5 days ago",    source: "Apollo",   owner: "Dipak S.", notes: "Opened email 3x, no reply yet. Try LinkedIn voice note." },
  { id: "hs-005", name: "Mia Chen",        company: "ElementalSkin",      title: "Founder",            email: "mia@elementalskin.com",       phone: "+44 7890 334 221",stage: "new",            dealValue: 0,     lastActivity: "1 week ago",    source: "Clay",     owner: "Dipak S.", notes: "Just enriched. Not yet contacted." },
  { id: "hs-006", name: "Priya Sharma",    company: "NovaBio",            title: "Co-Founder & COO",   email: "priya@novabio.co",            phone: "+1 628 443 9910", stage: "contacted",      dealValue: 0,     lastActivity: "4 days ago",    source: "Apollo",   owner: "Dipak S.", notes: "Email opened. LinkedIn connected. Sending follow-up today." },
  { id: "hs-007", name: "Marcus Webb",     company: "VivaGlow",           title: "CEO",                email: "m.webb@vivaglow.co.uk",       phone: "+44 7712 881 003",stage: "closed_won",     dealValue: 36000, lastActivity: "Mar 20, 2026",  source: "LinkedIn", owner: "Dipak S.", notes: "Contract signed. Onboarding scheduled for Apr 2. 12-mo deal." },
  { id: "hs-008", name: "Anya Petrov",     company: "RenewLab",           title: "Founder & CSO",      email: "anya@renewlab.io",            phone: "+1 917 552 4480", stage: "closed_lost",    dealValue: 0,     lastActivity: "Mar 10, 2026",  source: "Apollo",   owner: "Dipak S.", notes: "Chose competitor. Budget constraint. Re-engage in Q3." },
  { id: "hs-009", name: "Charlotte Davies",company: "Botaniq UK",         title: "Founder",            email: "c.davies@botaniq.co.uk",      phone: "+44 7700 192 443",stage: "qualified",      dealValue: 22000, lastActivity: "2 days ago",    source: "Apollo",   owner: "Dipak S.", notes: "Strong fit. Evaluating budget for Q2. Follow up Apr 1." },
  { id: "hs-010", name: "Sadia Islam",     company: "AuraUK",             title: "CEO",                email: "sadia@aurauk.co.uk",          phone: "+44 7811 334 902",stage: "demo_scheduled", dealValue: 31000, lastActivity: "Today",         source: "LinkedIn", owner: "Dipak S.", notes: "Booked via LinkedIn DM. Very high intent — Series A just closed." },
  { id: "hs-011", name: "Lauren Kim",      company: "VerdeSkin",          title: "CEO",                email: "l.kim@verdeskin.io",          phone: "+1 857 220 4481", stage: "contacted",      dealValue: 0,     lastActivity: "3 days ago",    source: "Apollo",   owner: "Dipak S.", notes: "Replied to step 1. Scheduling discovery call this week." },
  { id: "hs-012", name: "Niamh O'Brien",   company: "PureCelticBeauty",   title: "Co-Founder",         email: "niamh@purceltic.ie",          phone: "+353 85 112 4490",stage: "proposal_sent",  dealValue: 19500, lastActivity: "Yesterday",     source: "Apollo",   owner: "Dipak S.", notes: "Proposal sent. Reviewing with co-founder. Decision by Apr 5." },
  { id: "hs-013", name: "Oliver Hughes",   company: "SkintellectUK",      title: "CEO",                email: "o.hughes@skintellect.co.uk",  phone: "+44 7841 227 881",stage: "new",            dealValue: 0,     lastActivity: "4 days ago",    source: "Clay",     owner: "Dipak S.", notes: "Enriched via Clay. Not yet contacted. High ICP score — prioritize." },
  { id: "hs-014", name: "Jane Wu",         company: "AuraSkin",           title: "CEO & Founder",      email: "jane@auraskin.com",           phone: "+1 206 881 3390", stage: "closed_won",     dealValue: 18000, lastActivity: "Mar 15, 2026",  source: "Apollo",   owner: "Dipak S.", notes: "6-month pilot signed. Upsell to annual at renewal in Sep." },
  { id: "hs-015", name: "Isabelle Moreau", company: "LaRosée Beauté",     title: "Founder",            email: "i.moreau@larosee.fr",         phone: "+33 6 12 34 56 78",stage: "contacted",     dealValue: 0,     lastActivity: "6 days ago",    source: "Apollo",   owner: "Dipak S.", notes: "Paris-based. Opened email twice. French market expansion opportunity." },
];

const PIPELINE_STAGES = [
  { id: "new", label: "New", color: "var(--color-ink3)" },
  { id: "contacted", label: "Contacted", color: "var(--color-blue)" },
  { id: "qualified", label: "Qualified", color: "var(--color-amber)" },
  { id: "demo_scheduled", label: "Demo Scheduled", color: "var(--color-purple)" },
  { id: "proposal_sent", label: "Proposal Sent", color: "var(--color-gold)" },
  { id: "closed_won", label: "Closed Won", color: "var(--color-green)" },
  { id: "closed_lost", label: "Closed Lost", color: "var(--color-red)" },
];

const STAGE_MAP: Record<string, { label: string; bg: string; color: string }> = {
  new:            { label: "New",            bg: "var(--color-s3)", color: "var(--color-ink3)" },
  contacted:      { label: "Contacted",      bg: "var(--color-blue-bg)", color: "var(--color-blue)" },
  qualified:      { label: "Qualified",      bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  demo_scheduled: { label: "Demo Scheduled", bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
  proposal_sent:  { label: "Proposal Sent",  bg: "rgba(200,169,122,0.15)", color: "var(--color-gold)" },
  closed_won:     { label: "Closed Won",     bg: "var(--color-green-bg)", color: "var(--color-green)" },
  closed_lost:    { label: "Closed Lost",    bg: "var(--color-red-bg)", color: "var(--color-red)" },
};

export default function HubspotCrmPage() {
  const { addToast } = useToastsStore();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState("all");
  const [view, setView] = useState<"list" | "pipeline">("list");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const PAGE_SIZE = 6;

  const filtered = (() => {
    let list = stageFilter === "all" ? CONTACTS : CONTACTS.filter((c) => c.stage === stageFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return list;
  })();
  const totalDealValue = CONTACTS.filter((c) => c.stage === "closed_won").reduce((a, c) => a + c.dealValue, 0);
  const pipelineValue = CONTACTS.filter((c) => !["closed_won", "closed_lost", "new"].includes(c.stage)).reduce((a, c) => a + c.dealValue, 0);
  const selected = CONTACTS.find((c) => c.id === selectedContact);

  return (
    <div className="px-6 py-5 space-y-4">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: "var(--color-ink)", marginBottom: 2 }}>HubSpot CRM</h1>
          <p style={{ fontSize: 12.5, color: "var(--color-ink3)" }}>
            {CONTACTS.length} contacts · synced via Engagement Agent
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setView(view === "list" ? "pipeline" : "list")}
            style={secondaryBtn}
          >
            {view === "list" ? "Pipeline View" : "List View"}
          </button>
          <button
            onClick={() => addToast({ title: "HubSpot synced successfully", type: "success" })}
            style={secondaryBtn}
          >
            Sync Now
          </button>
          <button
            onClick={() => addToast({ title: "Contact added to HubSpot", type: "success" })}
            style={primaryBtn}
          >
            + Add Contact
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { label: "Total Contacts", value: CONTACTS.length, color: "var(--color-ink)" },
          { label: "Pipeline Value", value: `$${pipelineValue.toLocaleString()}`, color: "var(--color-amber)" },
          { label: "Won Revenue", value: `$${totalDealValue.toLocaleString()}`, color: "var(--color-green)" },
          { label: "Win Rate", value: `${Math.round((CONTACTS.filter((c) => c.stage === "closed_won").length / Math.max(1, CONTACTS.filter((c) => ["closed_won", "closed_lost"].includes(c.stage)).length)) * 100)}%`, color: "var(--color-blue)" },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "11px 14px" }}>
            <div style={{ fontSize: 10.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontFamily: "var(--font-serif)", color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {view === "pipeline" ? (
        // Pipeline kanban view
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 12, minWidth: 900 }}>
            {PIPELINE_STAGES.filter((s) => !["closed_lost"].includes(s.id)).map((stage) => {
              const stageContacts = CONTACTS.filter((c) => c.stage === stage.id);
              const stageValue = stageContacts.reduce((a, c) => a + c.dealValue, 0);
              return (
                <div key={stage.id} style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ padding: "8px 10px", borderRadius: "var(--radius) var(--radius) 0 0", background: "var(--color-s2)", borderBottom: `2px solid ${stage.color}`, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{stage.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-ink3)", marginTop: 2 }}>
                      {stageContacts.length} · {stageValue > 0 ? `$${stageValue.toLocaleString()}` : "—"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {stageContacts.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedContact(selectedContact === c.id ? null : c.id)}
                        style={{
                          background: "var(--color-surface)",
                          border: `0.5px solid ${selectedContact === c.id ? "var(--color-gold)" : "var(--color-border)"}`,
                          borderRadius: "var(--radius)",
                          padding: "9px 11px",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink)", marginBottom: 2 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--color-ink3)", marginBottom: 4 }}>{c.company}</div>
                        {c.dealValue > 0 && (
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
                            ${c.dealValue.toLocaleString()}
                          </div>
                        )}
                        <div style={{ fontSize: 10.5, color: "var(--color-ink4)", marginTop: 4 }}>{c.lastActivity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // List view
        <div>
          {/* Stage filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            <FilterChip label="All" count={CONTACTS.length} active={stageFilter === "all"} onClick={() => setStageFilter("all")} />
            {PIPELINE_STAGES.map((s) => {
              const cnt = CONTACTS.filter((c) => c.stage === s.id).length;
              return <FilterChip key={s.id} label={s.label} count={cnt} active={stageFilter === s.id} onClick={() => setStageFilter(s.id)} color={s.color} />;
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 280, marginBottom: 10 }}>
            <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--color-ink4)" }} width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7.5 7.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search contacts..." style={{ width: "100%", paddingLeft: 26, paddingRight: 10, paddingTop: 6, paddingBottom: 6, fontSize: 12, background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", color: "var(--color-ink)", fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            {/* Table */}
            <div style={{ flex: 1 }}>
            <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--color-s2)", borderBottom: "0.5px solid var(--color-border)" }}>
                    {["Contact", "Company", "Stage", "Deal Value", "Source", "Last Activity", ""].map((h) => (
                      <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
                    const safePage = Math.min(page, totalPages);
                    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
                    return paginated.map((c) => {
                      const s = STAGE_MAP[c.stage];
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedContact(selectedContact === c.id ? null : c.id)}
                          style={{
                            borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)",
                            cursor: "pointer",
                            background: selectedContact === c.id ? "var(--color-gold-d, rgba(200,169,122,0.08))" : "transparent",
                          }}
                        >
                          <td style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-s3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--color-ink2)", flexShrink: 0 }}>
                                {c.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div>
                                <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--color-ink)" }}>{c.name}</div>
                                <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{c.title}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "10px 14px", color: "var(--color-ink2)" }}>{c.company}</td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</span>
                          </td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600, color: c.dealValue > 0 ? "var(--color-amber)" : "var(--color-ink4)" }}>
                            {c.dealValue > 0 ? `$${c.dealValue.toLocaleString()}` : "—"}
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: c.source === "Apollo" ? "var(--color-blue-bg)" : c.source === "LinkedIn" ? "var(--color-purple-bg)" : "var(--color-teal-bg, #E6F4F4)", color: c.source === "Apollo" ? "var(--color-blue)" : c.source === "LinkedIn" ? "var(--color-purple)" : "var(--color-teal, #2A7A7A)" }}>
                              {c.source}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "var(--color-ink3)", fontSize: 11.5 }}>{c.lastActivity}</td>
                          <td style={{ padding: "10px 14px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setSelectedContact(c.id); }} style={{ fontSize: 10.5, color: "var(--color-gold)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>View</button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>
                    {filtered.length === 0 ? "0" : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)}`} of {filtered.length} contacts
                  </span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[{ label: "«", fn: () => setPage(1), dis: safePage === 1 }, { label: "‹", fn: () => setPage((p) => Math.max(1, p - 1)), dis: safePage === 1 }].map((b) => (
                      <CrmPagBtn key={b.label} onClick={b.fn} disabled={b.dis}>{b.label}</CrmPagBtn>
                    ))}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                      const p = start + i;
                      return <CrmPagBtn key={p} onClick={() => setPage(p)} active={p === safePage}>{p}</CrmPagBtn>;
                    })}
                    {[{ label: "›", fn: () => setPage((p) => Math.min(totalPages, p + 1)), dis: safePage === totalPages }, { label: "»", fn: () => setPage(totalPages), dis: safePage === totalPages }].map((b) => (
                      <CrmPagBtn key={b.label} onClick={b.fn} disabled={b.dis}>{b.label}</CrmPagBtn>
                    ))}
                  </div>
                </div>
              );
            })()}
            </div>

            {/* Side panel */}
            {selected && (
              <div style={{ width: 280, background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "16px", flexShrink: 0, overflowY: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>Contact Detail</span>
                  <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "var(--color-ink3)", lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-s3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--color-ink2)", flexShrink: 0 }}>
                    {selected.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{selected.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>{selected.title}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  {[
                    { label: "Company", value: selected.company },
                    { label: "Email", value: selected.email },
                    { label: "Phone", value: selected.phone },
                    { label: "Stage", value: STAGE_MAP[selected.stage].label },
                    { label: "Owner", value: selected.owner },
                    { label: "Source", value: selected.source },
                    ...(selected.dealValue > 0 ? [{ label: "Deal Value", value: `$${selected.dealValue.toLocaleString()}` }] : []),
                    { label: "Last Activity", value: selected.lastActivity },
                  ].map((r) => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 5, marginBottom: 5, borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)" }}>
                      <span style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>{r.label}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--color-ink)", textAlign: "right", maxWidth: "55%" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                {selected.notes && (
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Notes</div>
                    <p style={{ fontSize: 12, color: "var(--color-ink2)", lineHeight: 1.5 }}>{selected.notes}</p>
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                  <button onClick={() => addToast({ title: `Email drafted for ${selected.name}`, type: "info" })} style={{ ...secondaryBtn, flex: 1, fontSize: 11.5, padding: "6px 0" }}>Email</button>
                  <button onClick={() => addToast({ title: `${selected.name} stage updated`, type: "success" })} style={{ ...primaryBtn, flex: 1, fontSize: 11.5, padding: "6px 0" }}>Update Stage</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, count, active, onClick, color }: { label: string; count: number; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: 99,
        fontSize: 11.5,
        fontWeight: 500,
        border: `0.5px solid ${active ? (color ?? "var(--color-ink)") : "var(--color-border)"}`,
        background: active ? (color ? `${color}22` : "var(--color-ink)") : "var(--color-surface)",
        color: active ? (color ?? "#fff") : "var(--color-ink2)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
      }}
    >
      {label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
    </button>
  );
}

function CrmPagBtn({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "var(--font-mono)", borderRadius: 5, cursor: disabled ? "default" : "pointer", background: active ? "var(--color-gold)" : "var(--color-surface)", color: active ? "#fff" : disabled ? "var(--color-ink4)" : "var(--color-ink2)", border: "0.5px solid var(--color-border)", opacity: disabled ? 0.4 : 1 }}>
      {children}
    </button>
  );
}

const primaryBtn: React.CSSProperties = { padding: "7px 14px", background: "var(--color-ink)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" };
const secondaryBtn: React.CSSProperties = { padding: "7px 14px", background: "var(--color-surface)", color: "var(--color-ink2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" };
