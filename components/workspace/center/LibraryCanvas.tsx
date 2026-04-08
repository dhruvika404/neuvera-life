"use client";
import { useState, useMemo } from "react";
import { useToastsStore } from "@/store/toasts.store";
import { LeadsDataTable, getLeadsForList } from "@/components/ui/LeadsDataTable";

// ─── Shared data (mirrors LibraryPanel + dedicated page data) ─────────────────

const ICP_ITEMS = [
  {
    id: "icp-1", name: "Skincare Founders", status: "active",
    description: "Series A–C founders running DTC skincare brands with science-backed positioning.",
    industry: "Beauty & Skincare", revenueRange: "$1M – $20M ARR", fundingStage: "Series A–C",
    regions: ["North America", "UK", "Australia"],
    criteria: ["DTC brand", "Science-backed", "Influencer-driven", "Female founded 60%+", "Subscription model"],
    stats: { totalLeads: 142, qualified: 38, contacted: 61, meetings: 14, converted: 7 },
    badge: "Active", openRate: "58%", replyRate: "9.2%",
  },
  {
    id: "icp-2", name: "DTC Beauty Buyers", status: "draft",
    description: "VP/Director-level buyers at mid-market beauty retail chains seeking new brand partnerships.",
    industry: "Beauty Retail", revenueRange: "$5M – $100M", fundingStage: "Growth / PE-backed",
    regions: ["North America"],
    criteria: ["Retail buyer", "Partnership-ready", "Active social presence"],
    stats: { totalLeads: 87, qualified: 22, contacted: 34, meetings: 6, converted: 3 },
    badge: "Draft", openRate: "42%", replyRate: "7.1%",
  },
  {
    id: "icp-3", name: "Peptide Wholesale", status: "draft",
    description: "Wholesale distributors and formulators specializing in peptide ingredients.",
    industry: "Cosmetic Ingredients", revenueRange: "$500K – $10M", fundingStage: "Bootstrapped",
    regions: ["Global"],
    criteria: ["Ingredient supplier", "GMP certified", "MOQ flexible"],
    stats: { totalLeads: 31, qualified: 12, contacted: 8, meetings: 2, converted: 1 },
    badge: "Draft", openRate: "33%", replyRate: "4.8%",
  },
];

const LEAD_LISTS_DATA = [
  { id: "ll-1", name: "Skincare Founders — Q1 2026", source: "Apollo", icp: "Skincare Founders", status: "ready", leadCount: 142, enriched: 128, qualified: 38, updated: "2 hours ago", avgScore: 84 },
  { id: "ll-2", name: "DTC Beauty Buyers — Retail",   source: "Apollo", icp: "DTC Beauty Buyers", status: "ready", leadCount: 87,  enriched: 72,  qualified: 22, updated: "3 days ago",   avgScore: 76 },
  { id: "ll-3", name: "Peptide Formulators — Global", source: "Clay",   icp: "Peptide Wholesale", status: "enriching", leadCount: 31, enriched: 18, qualified: 0, updated: "6 hours ago", avgScore: 71 },
  { id: "ll-4", name: "UK Skincare Brands — Series A",source: "Apollo", icp: "Skincare Founders", status: "ready", leadCount: 56,  enriched: 56,  qualified: 9,  updated: "1 week ago",  avgScore: 89 },
  { id: "ll-5", name: "Wellness CPG — Emerging Brands",source: "Manual",icp: "Skincare Founders", status: "draft", leadCount: 24,  enriched: 0,   qualified: 0,  updated: "Yesterday",   avgScore: 0  },
];

const CAMPAIGNS_DATA = [
  { id: "c1", name: "Skincare Founders · US Wave 1", tool: "Instantly", status: "active", enrolled: 142, sent: 118, opened: 71, replied: 14, meetings: 7 },
  { id: "c2", name: "DTC Beauty · LinkedIn",         tool: "HeyReach", status: "active", enrolled: 87,  sent: 74,  opened: 38, replied: 9,  meetings: 4 },
  { id: "c3", name: "Influencer Collab Outreach",     tool: "Instantly", status: "done",  enrolled: 56,  sent: 56,  opened: 40, replied: 12, meetings: 5 },
  { id: "c4", name: "Peptide Wholesale Partners",     tool: "HeyReach", status: "draft", enrolled: 0,   sent: 0,   opened: 0,  replied: 0,  meetings: 0 },
];

const CLAY_DATA = [
  { id: "cl1", name: "Skincare Founders Batch",    total: 142, enriched: 128, failed: 14, completeness: 90, cost: "$18.42", status: "complete" },
  { id: "cl2", name: "UK Skincare Series A Batch", total: 56,  enriched: 56,  failed: 0,  completeness: 100, cost: "$8.12", status: "complete" },
  { id: "cl3", name: "Peptide Formulators Global", total: 31,  enriched: 18,  failed: 1,  completeness: 58,  cost: "$3.10", status: "running"  },
  { id: "cl4", name: "DTC Buyers — Retail",        total: 87,  enriched: 31,  failed: 56, completeness: 36,  cost: "$4.50", status: "failed"   },
];

const HUBSPOT_DATA = [
  { id: "hs1", stage: "Qualified",    count: 47,  color: "var(--color-blue)",   contacts: ["Sarah Chen · Luminary Health", "Emma Walsh · PureVita Brands", "Mia Chen · ElementalSkin", "+44 more"] },
  { id: "hs2", stage: "In Sequence",  count: 112, color: "var(--color-gold)",   contacts: ["James Rivera · Apex Wellness", "Priya Sharma · NovaBio", "+110 more"] },
  { id: "hs3", stage: "Replied",      count: 28,  color: "var(--color-green)",  contacts: ["David Kim · HealthFirst Labs", "Marcus Webb · VivaGlow", "+26 more"] },
  { id: "hs4", stage: "Booked",       count: 6,   color: "var(--color-purple)", contacts: ["Sarah Chen · Luminary Health", "David Kim · HealthFirst Labs", "+4 more"] },
  { id: "hs5", stage: "Closed Won",   count: 3,   color: "var(--color-green)",  contacts: ["Marcus Webb · VivaGlow ($36K)", "Anya Petrov · RenewLab ($24K)", "Jane Wu · AuraSkin ($18K)"] },
];

// ─── Campaign contacts (per campaign) ─────────────────────────────────────────

const CAMP_CONTACTS: Record<string, Array<{ name: string; company: string; email: string; step: number; totalSteps: number; opens: number; status: "active"|"replied"|"booked"|"bounced" }>> = {
  c1: [
    { name: "Sarah Chen",      company: "Luminary Health",    email: "s.chen@luminaryhealth.co",   step:3, totalSteps:4, opens:4, status:"replied" },
    { name: "Emma Walsh",      company: "PureVita Brands",    email: "emma@purevita.com",           step:2, totalSteps:4, opens:2, status:"active"  },
    { name: "Jane Wu",         company: "AuraSkin",           email: "jane@auraskin.com",           step:4, totalSteps:4, opens:6, status:"booked"  },
    { name: "Lauren Kim",      company: "VerdeSkin",          email: "l.kim@verdeskin.io",          step:3, totalSteps:4, opens:5, status:"replied" },
    { name: "Mia Chen",        company: "ElementalSkin",      email: "mia@elementalskin.co",        step:1, totalSteps:4, opens:1, status:"active"  },
    { name: "Claudia Ross",    company: "AlchemySkin",        email: "c.ross@alchemyskin.com",      step:1, totalSteps:4, opens:0, status:"bounced" },
    { name: "Priya Nair",      company: "GlowNaturals",       email: "priya@glownaturals.co",       step:2, totalSteps:4, opens:2, status:"active"  },
  ],
  c2: [
    { name: "Marcus Webb",     company: "VivaGlow",           email: "m.webb@vivaglow.com",         step:2, totalSteps:3, opens:3, status:"replied" },
    { name: "David Kim",       company: "HealthFirst Labs",   email: "d.kim@healthfirstlabs.com",   step:3, totalSteps:3, opens:5, status:"booked"  },
    { name: "Natalie Brooks",  company: "BeautyHaven Retail", email: "n.brooks@beautyhaven.com",    step:2, totalSteps:3, opens:2, status:"active"  },
    { name: "Tom Haley",       company: "GlossBox",           email: "t.haley@glossbox.co",         step:1, totalSteps:3, opens:1, status:"active"  },
    { name: "James Rivera",    company: "Apex Wellness",      email: "james@apexwellness.io",       step:2, totalSteps:3, opens:3, status:"replied" },
  ],
  c3: [
    { name: "Charlotte Davies",company: "Botaniq UK",         email: "c.davies@botaniq.co.uk",      step:3, totalSteps:3, opens:4, status:"replied" },
    { name: "Sadia Islam",     company: "AuraUK",             email: "sadia@aurauk.co.uk",          step:3, totalSteps:3, opens:5, status:"booked"  },
    { name: "Niamh O'Brien",   company: "PureCelticBeauty",   email: "niamh@purceltic.ie",          step:2, totalSteps:3, opens:3, status:"replied" },
  ],
  c4: [],
};

// Clay batch → lead list mapping
const CLAY_TO_LIST: Record<string, string> = {
  cl1: "ll-001",
  cl2: "ll-004",
  cl3: "ll-003",
  cl4: "ll-002",
};

// HubSpot pipeline contacts
const HUB_CONTACTS: Record<string, Array<{ name: string; company: string; title: string; dealValue: number; lastActivity: string }>> = {
  hs1: [
    { name: "Sarah Chen",      company: "Luminary Health",    title: "Founder & CEO",     dealValue: 28000, lastActivity: "2 hours ago"  },
    { name: "Emma Walsh",      company: "PureVita Brands",    title: "CEO",               dealValue: 18500, lastActivity: "3 days ago"   },
    { name: "Charlotte Davies",company: "Botaniq UK",         title: "Founder",           dealValue: 22000, lastActivity: "2 days ago"   },
    { name: "Sadia Islam",     company: "AuraUK",             title: "CEO",               dealValue: 31000, lastActivity: "Today"        },
  ],
  hs2: [
    { name: "James Rivera",    company: "Apex Wellness",      title: "Co-Founder",        dealValue: 0,     lastActivity: "5 days ago"   },
    { name: "Priya Sharma",    company: "NovaBio",            title: "Co-Founder & COO",  dealValue: 0,     lastActivity: "4 days ago"   },
    { name: "Lauren Kim",      company: "VerdeSkin",          title: "CEO",               dealValue: 0,     lastActivity: "3 days ago"   },
    { name: "Mia Chen",        company: "ElementalSkin",      title: "Founder",           dealValue: 0,     lastActivity: "1 week ago"   },
    { name: "Oliver Hughes",   company: "SkintellectUK",      title: "CEO",               dealValue: 0,     lastActivity: "4 days ago"   },
  ],
  hs3: [
    { name: "David Kim",       company: "HealthFirst Labs",   title: "Founder",           dealValue: 52000, lastActivity: "Yesterday"    },
    { name: "Marcus Webb",     company: "VivaGlow",           title: "CEO",               dealValue: 36000, lastActivity: "Mar 20, 2026" },
    { name: "Niamh O'Brien",   company: "PureCelticBeauty",   title: "Co-Founder",        dealValue: 19500, lastActivity: "Yesterday"    },
  ],
  hs4: [
    { name: "Jane Wu",         company: "AuraSkin",           title: "CEO & Founder",     dealValue: 18000, lastActivity: "Today"        },
    { name: "Sadia Islam",     company: "AuraUK",             title: "CEO",               dealValue: 31000, lastActivity: "Today"        },
  ],
  hs5: [
    { name: "Marcus Webb",     company: "VivaGlow",           title: "CEO",               dealValue: 36000, lastActivity: "Mar 20, 2026" },
    { name: "Jane Wu",         company: "AuraSkin",           title: "CEO & Founder",     dealValue: 18000, lastActivity: "Mar 15, 2026" },
    { name: "Anya Petrov",     company: "RenewLab",           title: "Founder & CSO",     dealValue: 24000, lastActivity: "Mar 10, 2026" },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type CanvasState = { folderId: string; fileId?: string };

// ─── Main canvas component ────────────────────────────────────────────────────

export function LibraryCanvas({ canvas, onBack }: { canvas: CanvasState; onBack: () => void }) {
  const { addToast } = useToastsStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Canvas top bar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
          borderBottom: "0.5px solid var(--color-border)", flexShrink: 0,
          background: "var(--color-surface)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 5, fontSize: 12,
            color: "var(--color-ink3)", background: "none", border: "none",
            cursor: "pointer", fontFamily: "var(--font-sans)", padding: "3px 6px",
            borderRadius: "var(--radius)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-s2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          ← Chat
        </button>
        <div style={{ width: "0.5px", height: 16, background: "var(--color-border)" }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink)", textTransform: "capitalize" }}>
          {FOLDER_LABELS[canvas.folderId] ?? canvas.folderId}
        </span>
      </div>

      {/* Canvas content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {canvas.folderId === "icp-folder"   && <IcpCanvas   fileId={canvas.fileId} addToast={addToast} />}
        {canvas.folderId === "lists-folder" && <LeadsCanvas  fileId={canvas.fileId} addToast={addToast} />}
        {canvas.folderId === "camps-folder" && <CampsCanvas  fileId={canvas.fileId} addToast={addToast} />}
        {canvas.folderId === "clay-folder"  && <ClayCanvas   fileId={canvas.fileId} addToast={addToast} />}
        {canvas.folderId === "hub-folder"   && <HubCanvas    fileId={canvas.fileId} addToast={addToast} />}
      </div>
    </div>
  );
}

const FOLDER_LABELS: Record<string, string> = {
  "icp-folder":   "ICP Profiles",
  "lists-folder": "Lead Lists",
  "camps-folder": "Campaigns",
  "clay-folder":  "Clay Enrichment",
  "hub-folder":   "HubSpot CRM",
};

// ─── ICP Canvas ───────────────────────────────────────────────────────────────

function IcpCanvas({ fileId, addToast }: { fileId?: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const icp = ICP_ITEMS.find((i) => i.id === fileId) ?? ICP_ITEMS[0];
  const pct = icp.stats.totalLeads > 0 ? Math.round((icp.stats.qualified / icp.stats.totalLeads) * 100) : 0;

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontFamily: "var(--font-serif)", color: "var(--color-ink)", marginBottom: 2 }}>{icp.name}</div>
            <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{icp.industry} · {icp.revenueRange}</div>
          </div>
          <button onClick={() => addToast({ title: `Agent queued for "${icp.name}"`, type: "info" })} style={smBtn("var(--color-ink)")}>Run Agent</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: 12 }}>
          {[["Leads", icp.stats.totalLeads, "var(--color-ink)"], ["Qualified", icp.stats.qualified, "var(--color-blue)"], ["Meetings", icp.stats.meetings, "var(--color-purple)"], ["Converted", icp.stats.converted, "var(--color-green)"]].map(([l, v, c]) => (
            <div key={l as string} style={{ background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "8px 10px" }}>
              <div style={{ fontSize: 9.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 18, fontFamily: "var(--font-serif)", color: c as string }}>{v}</div>
            </div>
          ))}
        </div>
        <CanvasSection title="Criteria">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {icp.criteria.map((c) => <span key={c} style={{ fontSize: 10.5, padding: "2px 8px", background: "var(--color-amber-bg)", color: "var(--color-amber)", borderRadius: 99 }}>{c}</span>)}
          </div>
        </CanvasSection>
        <CanvasSection title="Pipeline">
          <CanvasBar label={`Qualification ${pct}%`} value={pct} color="var(--color-blue)" />
          <CanvasBar label={`Open Rate ${icp.openRate}`} value={parseInt(icp.openRate)} color="var(--color-amber)" />
          <CanvasBar label={`Reply Rate ${icp.replyRate}`} value={parseFloat(icp.replyRate) * 5} color="var(--color-green)" />
        </CanvasSection>
      </div>
    </div>
  );
}

// ─── Lead Lists Canvas ────────────────────────────────────────────────────────


function LeadsCanvas({ fileId, addToast }: { fileId?: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const list = LEAD_LISTS_DATA.find((l) => l.id === (fileId ?? "ll-1")) ?? LEAD_LISTS_DATA[0];
  const enrichPct = list.leadCount > 0 ? Math.round((list.enriched / list.leadCount) * 100) : 0;
  const leads = getLeadsForList(fileId ?? "ll-1");

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "14px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontFamily: "var(--font-serif)", color: "var(--color-ink)", marginBottom: 2 }}>{list.name}</div>
            <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{list.icp} · via {list.source}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => addToast({ title: "Clay enrichment queued", type: "info" })} style={smBtn("var(--color-surface)", true)}>Enrich</button>
            <button onClick={() => addToast({ title: "Exported as CSV", type: "success" })} style={smBtn("var(--color-ink)")}>Export</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: 12 }}>
          {[["Total", list.leadCount, "var(--color-ink)"], ["Enriched", list.enriched, "var(--color-teal,#2A7A7A)"], ["Qualified", list.qualified, "var(--color-blue)"], ["Score", list.avgScore > 0 ? list.avgScore : "—", "var(--color-amber)"]].map(([l, v, c]) => (
            <div key={l as string} style={{ background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "8px 10px" }}>
              <div style={{ fontSize: 9.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 18, fontFamily: "var(--font-serif)", color: c as string }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Pipeline bars */}
        <CanvasSection title="Pipeline Progress">
          <CanvasBar label={`Enriched ${enrichPct}%`} value={enrichPct} color="var(--color-teal,#2A7A7A)" />
          <CanvasBar label={`Qualified ${list.leadCount > 0 ? Math.round((list.qualified/list.leadCount)*100) : 0}%`} value={list.leadCount > 0 ? Math.round((list.qualified/list.leadCount)*100) : 0} color="var(--color-blue)" />
        </CanvasSection>

        {/* Leads table */}
        <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
            Leads · {list.name}
          </div>
          {leads.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--color-ink4)", padding: "12px 0" }}>No detailed leads loaded for this list.</p>
          ) : (
            <LeadsDataTable leads={leads} compact />
          )}
        </div>
    </div>
  );
}

// ─── Campaigns Canvas ─────────────────────────────────────────────────────────

function CampsCanvas({ fileId, addToast }: { fileId?: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const camp = CAMPAIGNS_DATA.find((c) => c.id === (fileId ?? "c1")) ?? CAMPAIGNS_DATA[0];
  const openRate = camp.sent > 0 ? Math.round((camp.opened / camp.sent) * 100) : 0;
  const replyRate = camp.sent > 0 ? Math.round((camp.replied / camp.sent) * 100) : 0;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontFamily: "var(--font-serif)", color: "var(--color-ink)", marginBottom: 2 }}>{camp.name}</div>
            <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>via {camp.tool}</div>
          </div>
          {camp.status === "active"
            ? <button onClick={() => addToast({ title: `"${camp.name}" paused`, type: "info" })} style={smBtn("var(--color-surface)", true)}>Pause</button>
            : camp.status === "draft"
            ? <button onClick={() => addToast({ title: `"${camp.name}" launched`, type: "success" })} style={smBtn("var(--color-ink)")}>Launch</button>
            : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: 12 }}>
          {[["Enrolled", camp.enrolled, "var(--color-ink)"], ["Sent", camp.sent, "var(--color-ink2)"], ["Meetings", camp.meetings, "var(--color-purple)"], ["Replied", camp.replied, "var(--color-green)"]].map(([l, v, c]) => (
            <div key={l as string} style={{ background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "8px 10px" }}>
              <div style={{ fontSize: 9.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 18, fontFamily: "var(--font-serif)", color: c as string }}>{v}</div>
            </div>
          ))}
        </div>
        <CanvasSection title="Engagement Rates">
          <CanvasBar label={`Open Rate ${openRate}%`} value={openRate} color="var(--color-amber)" />
          <CanvasBar label={`Reply Rate ${replyRate}%`} value={replyRate * 4} color="var(--color-green)" />
          <CanvasBar label={`Meeting Rate ${camp.enrolled > 0 ? Math.round((camp.meetings/camp.enrolled)*100) : 0}%`} value={camp.enrolled > 0 ? Math.round((camp.meetings/camp.enrolled)*100)*10 : 0} color="var(--color-purple)" />
        </CanvasSection>

        {/* Contacts table */}
        <CampContactsTable campId={camp.id} addToast={addToast} />
    </div>
  );
}

// ─── Campaign contacts mini-table ─────────────────────────────────────────────

function CampContactsTable({ campId, addToast }: { campId: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const contacts = CAMP_CONTACTS[campId] ?? [];
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useMemo(() => {
    if (!query) return contacts;
    const q = query.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
  }, [contacts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (contacts.length === 0) return null;

  const STATUS_C: Record<string, {bg:string;color:string}> = {
    active:  { bg:"var(--color-blue-bg)",   color:"var(--color-blue)"   },
    replied: { bg:"var(--color-green-bg)",  color:"var(--color-green)"  },
    booked:  { bg:"var(--color-purple-bg)", color:"var(--color-purple)" },
    bounced: { bg:"var(--color-red-bg)",    color:"var(--color-red)"    },
  };

  return (
    <div style={{ background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", flex: 1 }}>
          Enrolled Contacts · {contacts.length}
        </div>
        <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search..." style={{ fontSize: 10.5, padding: "3px 8px", background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: 4, color: "var(--color-ink)", fontFamily: "var(--font-sans)", outline: "none", width: 110 }} />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: "0.5px solid var(--color-border)" }}>
            {["Contact", "Step", "Opens", "Status"].map((h) => (
              <th key={h} style={{ padding: "4px 8px", textAlign: "left", fontSize: 9.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: "12px 8px", color: "var(--color-ink4)", fontSize: 11, textAlign: "center" }}>No contacts</td></tr>
          ) : paginated.map((c, i) => {
            const ss = STATUS_C[c.status];
            return (
              <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-l,#EDE8DF)" }}>
                <td style={{ padding: "6px 8px" }}>
                  <div style={{ fontWeight: 500, color: "var(--color-ink)", fontSize: 11 }}>{c.name}</div>
                  <div style={{ fontSize: 9.5, color: "var(--color-ink4)" }}>{c.company}</div>
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ink)", fontFamily: "var(--font-mono)" }}>{c.step}/{c.totalSteps}</span>
                    <div style={{ display: "flex", gap: 1.5 }}>
                      {Array.from({ length: c.totalSteps }).map((_, idx) => (
                        <div key={idx} style={{ width: 5, height: 5, borderRadius: 1.5, background: idx < c.step ? "var(--color-gold)" : "var(--color-s3)" }} />
                      ))}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: c.opens > 0 ? "var(--color-amber)" : "var(--color-ink4)" }}>{c.opens || "—"}</td>
                <td style={{ padding: "6px 8px" }}>
                  <span style={{ fontSize: 9.5, fontWeight: 600, padding: "1px 6px", borderRadius: 99, background: ss.bg, color: ss.color }}>{c.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 10, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>{(safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length}</span>
          <div style={{ display: "flex", gap: 2 }}>
            {[{l:"‹",fn:()=>setPage((p)=>Math.max(1,p-1)),d:safePage===1},{l:"›",fn:()=>setPage((p)=>Math.min(totalPages,p+1)),d:safePage===totalPages}].map((b)=>(
              <button key={b.l} onClick={b.fn} disabled={b.d} style={{ width:20,height:20,fontSize:11,fontFamily:"var(--font-mono)",borderRadius:4,cursor:b.d?"default":"pointer",background:"var(--color-surface)",color:b.d?"var(--color-ink4)":"var(--color-ink2)",border:"0.5px solid var(--color-border)",opacity:b.d?0.4:1 }}>{b.l}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Clay Canvas ──────────────────────────────────────────────────────────────

function ClayCanvas({ fileId, addToast }: { fileId?: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const batch = CLAY_DATA.find((c) => c.id === (fileId ?? "cl1")) ?? CLAY_DATA[0];
  const STATUS_C: Record<string, string> = { complete: "var(--color-green)", running: "var(--color-amber)", failed: "var(--color-red)" };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontFamily: "var(--font-serif)", color: "var(--color-ink)", marginBottom: 2 }}>{batch.name}</div>
            <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>Enrichment batch · {batch.cost}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {batch.status === "failed" && <button onClick={() => addToast({ title: "Batch re-queued", type: "info" })} style={smBtn("var(--color-surface)", true)}>Retry</button>}
            <button onClick={() => addToast({ title: "Data exported", type: "success" })} style={smBtn("var(--color-ink)")}>Export</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: 12 }}>
          {[["Total", batch.total, "var(--color-ink)"], ["Enriched", batch.enriched, "var(--color-green)"], ["Failed", batch.failed, batch.failed > 0 ? "var(--color-red)" : "var(--color-ink3)"], ["Score", `${batch.completeness}%`, "var(--color-blue)"]].map(([l, v, c]) => (
            <div key={l as string} style={{ background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "8px 10px" }}>
              <div style={{ fontSize: 9.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 18, fontFamily: "var(--font-serif)", color: c as string }}>{v}</div>
            </div>
          ))}
        </div>
        <CanvasSection title="Completeness">
          <CanvasBar label={`Overall ${batch.completeness}%`} value={batch.completeness} color={STATUS_C[batch.status] ?? "var(--color-ink3)"} />
          <CanvasBar label="Email (verified)" value={batch.status === "complete" ? 90 : 60} color="var(--color-green)" />
          <CanvasBar label="LinkedIn URL" value={batch.status === "complete" ? 84 : 50} color="var(--color-blue)" />
          <CanvasBar label="Company HQ" value={batch.status === "complete" ? 100 : 70} color="var(--color-amber)" />
        </CanvasSection>

        {/* Enriched leads table */}
        {(() => {
          const leads = getLeadsForList(CLAY_TO_LIST[batch.id] ?? "");
          if (leads.length === 0) return null;
          return (
            <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                Enriched Leads
              </div>
              <LeadsDataTable leads={leads} compact />
            </div>
          );
        })()}
    </div>
  );
}

// ─── HubSpot Canvas ───────────────────────────────────────────────────────────

function HubCanvas({ fileId, addToast }: { fileId?: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const stage = HUBSPOT_DATA.find((h) => h.id === (fileId ?? "hs1")) ?? HUBSPOT_DATA[0];
  const total = HUBSPOT_DATA.reduce((a, h) => a + h.count, 0);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
            <div style={{ fontSize: 15, fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>{stage.stage}</div>
          </div>
          <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{stage.count} contacts in this stage</div>
        </div>
        <button onClick={() => addToast({ title: `${stage.stage} contacts exported`, type: "success" })} style={smBtn("var(--color-ink)")}>Export</button>
      </div>

      {/* Pipeline overview */}
      <div style={{ display: "flex", gap: 0, height: 8, borderRadius: 99, overflow: "hidden", marginBottom: 14 }}>
        {HUBSPOT_DATA.map((h) => (
          <div key={h.id} style={{ width: `${Math.round((h.count/total)*100)}%`, background: h.color, opacity: h.id === stage.id ? 1 : 0.3 }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {HUBSPOT_DATA.map((h) => (
          <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: h.color }} />
            <span style={{ fontSize: 10, color: "var(--color-ink3)" }}>{h.stage} ({h.count})</span>
          </div>
        ))}
      </div>

      <HubContactsTable stageId={stage.id} stageColor={stage.color} addToast={addToast} />
    </div>
  );
}

// ─── HubSpot contacts mini-table ──────────────────────────────────────────────

function HubContactsTable({ stageId, stageColor, addToast }: { stageId: string; stageColor: string; addToast: (t: {title:string;type:"success"|"error"|"info"|"warning"}) => void }) {
  const contacts = HUB_CONTACTS[stageId] ?? [];
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(contacts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = contacts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <CanvasSection title={`Contacts in Stage · ${contacts.length}`}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: "0.5px solid var(--color-border)" }}>
            {["Contact", "Deal", "Last Activity", ""].map((h) => (
              <th key={h} style={{ padding: "4px 8px", textAlign: "left", fontSize: 9.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: "12px 8px", color: "var(--color-ink4)", fontSize: 11, textAlign: "center" }}>No contacts in this stage</td></tr>
          ) : paginated.map((c, i) => (
            <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-l,#EDE8DF)" }}>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${stageColor}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: stageColor, flexShrink: 0 }}>
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-ink)" }}>{c.name}</div>
                    <div style={{ fontSize: 9.5, color: "var(--color-ink4)" }}>{c.title}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, color: c.dealValue > 0 ? "var(--color-amber)" : "var(--color-ink4)" }}>
                {c.dealValue > 0 ? `$${c.dealValue.toLocaleString()}` : "—"}
              </td>
              <td style={{ padding: "6px 8px", fontSize: 10.5, color: "var(--color-ink3)" }}>{c.lastActivity}</td>
              <td style={{ padding: "6px 8px" }}>
                <button onClick={() => addToast({ title: `Opening ${c.name} in HubSpot`, type: "info" })} style={{ fontSize: 10, color: "var(--color-gold)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>View →</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 10, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>{(safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE,contacts.length)} of {contacts.length}</span>
          <div style={{ display: "flex", gap: 2 }}>
            {[{l:"‹",fn:()=>setPage((p)=>Math.max(1,p-1)),d:safePage===1},{l:"›",fn:()=>setPage((p)=>Math.min(totalPages,p+1)),d:safePage===totalPages}].map((b)=>(
              <button key={b.l} onClick={b.fn} disabled={b.d} style={{ width:20,height:20,fontSize:11,fontFamily:"var(--font-mono)",borderRadius:4,cursor:b.d?"default":"pointer",background:"var(--color-surface)",color:b.d?"var(--color-ink4)":"var(--color-ink2)",border:"0.5px solid var(--color-border)",opacity:b.d?0.4:1 }}>{b.l}</button>
            ))}
          </div>
        </div>
      )}
    </CanvasSection>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function CanvasSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function CanvasBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "var(--color-ink3)" }}>{label}</span>
      </div>
      <div style={{ height: 5, background: "var(--color-surface)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, value))}%`, background: color, borderRadius: 99, transition: "width .4s" }} />
      </div>
    </div>
  );
}

function CDR({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 5, marginBottom: 5, borderBottom: "0.5px solid var(--color-border-l,#EDE8DF)" }}>
      <span style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>{label}</span>
      <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--color-ink)" }}>{value}</span>
    </div>
  );
}

function smBtn(bg: string, bordered = false): React.CSSProperties {
  return {
    padding: "5px 11px", background: bg, color: bg === "var(--color-ink)" ? "#fff" : "var(--color-ink2)",
    border: bordered ? "0.5px solid var(--color-border)" : "none",
    borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600,
    cursor: "pointer", fontFamily: "var(--font-sans)", flexShrink: 0,
  };
}
