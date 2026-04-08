"use client";
import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lead = {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  location: string;
  source: "Apollo" | "Clay" | "Manual";
  icpScore: number;
  stage: "new" | "contacted" | "qualified" | "replied" | "booked";
  enriched: boolean;
  listId: string;
};

// ─── Rich mock data — 30 leads across 5 lists ────────────────────────────────

export const ALL_LEADS: Lead[] = [
  // ll-1 / ll-001 — Skincare Founders Q1 2026 (142 leads, showing 18)
  { id: "l001", listId: "ll-1", name: "Sarah Chen",       company: "Luminary Health",      title: "Founder & CEO",        email: "s.chen@luminaryhealth.co",   location: "New York, US",     source: "Apollo", icpScore: 92, stage: "qualified", enriched: true  },
  { id: "l002", listId: "ll-1", name: "Emma Walsh",       company: "PureVita Brands",       title: "CEO",                  email: "emma@purevita.com",          location: "Los Angeles, US",  source: "Apollo", icpScore: 85, stage: "contacted", enriched: true  },
  { id: "l003", listId: "ll-1", name: "Mia Chen",         company: "ElementalSkin",         title: "Co-Founder",           email: "mia@elementalskin.co",       location: "San Francisco, US",source: "Apollo", icpScore: 88, stage: "qualified", enriched: true  },
  { id: "l004", listId: "ll-1", name: "Anya Petrov",      company: "RenewLab",              title: "Founder",              email: "anya@renewlab.io",           location: "Austin, US",       source: "Apollo", icpScore: 79, stage: "replied",   enriched: true  },
  { id: "l005", listId: "ll-1", name: "Jane Wu",          company: "AuraSkin",              title: "CEO & Founder",        email: "jane@auraskin.com",          location: "Seattle, US",      source: "Apollo", icpScore: 91, stage: "booked",    enriched: true  },
  { id: "l006", listId: "ll-1", name: "Priya Nair",       company: "GlowNaturals",          title: "Founder",              email: "priya@glownaturals.co",      location: "Chicago, US",      source: "Apollo", icpScore: 82, stage: "contacted", enriched: true  },
  { id: "l007", listId: "ll-1", name: "Sofia Martinez",   company: "BotanicaBeauty",        title: "Co-Founder & COO",     email: "sofia@botanicabeauty.com",   location: "Miami, US",        source: "Apollo", icpScore: 76, stage: "new",       enriched: true  },
  { id: "l008", listId: "ll-1", name: "Lauren Kim",       company: "VerdeSkin",             title: "CEO",                  email: "l.kim@verdeskin.io",         location: "Boston, US",       source: "Apollo", icpScore: 94, stage: "qualified", enriched: true  },
  { id: "l009", listId: "ll-1", name: "Rachel Nguyen",    company: "TerraGlow",             title: "Founder & CMO",        email: "rachel@terraglow.co",        location: "Denver, US",       source: "Apollo", icpScore: 80, stage: "contacted", enriched: true  },
  { id: "l010", listId: "ll-1", name: "Claudia Ross",     company: "AlchemySkin",           title: "CEO",                  email: "c.ross@alchemyskin.com",     location: "Portland, US",     source: "Apollo", icpScore: 86, stage: "new",       enriched: false },
  { id: "l011", listId: "ll-1", name: "Isabelle Moreau",  company: "LaRosée Beauté",        title: "Founder",              email: "i.moreau@larosee.fr",        location: "Paris, France",    source: "Apollo", icpScore: 89, stage: "contacted", enriched: true  },
  { id: "l012", listId: "ll-1", name: "Akemi Tanaka",     company: "KiSkin Japan",          title: "Co-Founder",           email: "akemi@kiskin.jp",            location: "Tokyo, Japan",     source: "Apollo", icpScore: 77, stage: "new",       enriched: false },

  // ll-2 / ll-002 — DTC Beauty Buyers (87 leads, showing 8)
  { id: "l013", listId: "ll-2", name: "Marcus Webb",      company: "VivaGlow",              title: "VP of Buying",         email: "m.webb@vivaglow.com",        location: "New York, US",     source: "Apollo", icpScore: 81, stage: "replied",   enriched: true  },
  { id: "l014", listId: "ll-2", name: "David Kim",        company: "HealthFirst Labs",       title: "Director of Purchasing",email:"d.kim@healthfirstlabs.com",  location: "Los Angeles, US",  source: "Apollo", icpScore: 95, stage: "booked",    enriched: true  },
  { id: "l015", listId: "ll-2", name: "James Rivera",     company: "Apex Wellness",          title: "Procurement Lead",     email: "james@apexwellness.io",      location: "Dallas, US",       source: "Apollo", icpScore: 78, stage: "contacted", enriched: true  },
  { id: "l016", listId: "ll-2", name: "Natalie Brooks",   company: "BeautyHaven Retail",     title: "VP Merchandising",     email: "n.brooks@beautyhaven.com",   location: "Chicago, US",      source: "Apollo", icpScore: 83, stage: "qualified", enriched: true  },
  { id: "l017", listId: "ll-2", name: "Tom Haley",        company: "GlossBox",               title: "Head of Brand Ops",    email: "t.haley@glossbox.co",        location: "New York, US",     source: "Apollo", icpScore: 72, stage: "new",       enriched: true  },
  { id: "l018", listId: "ll-2", name: "Anna Schreiber",   company: "DM Drogeriemarkt",       title: "Category Manager",     email: "a.schreiber@dm.de",          location: "Berlin, Germany",  source: "Apollo", icpScore: 69, stage: "new",       enriched: false },

  // ll-3 — Peptide Formulators Global (31 leads, showing 6)
  { id: "l019", listId: "ll-3", name: "Dr. Wei Zhang",    company: "SinoIngredients",        title: "R&D Director",         email: "w.zhang@sinoingredients.cn", location: "Shanghai, China",  source: "Clay",   icpScore: 74, stage: "new",       enriched: true  },
  { id: "l020", listId: "ll-3", name: "Henrik Larsen",    company: "NordPeptide",            title: "CEO",                  email: "h.larsen@nordpeptide.dk",    location: "Copenhagen, DK",   source: "Clay",   icpScore: 68, stage: "new",       enriched: true  },
  { id: "l021", listId: "ll-3", name: "Carlos Fuentes",   company: "BioActive LATAM",        title: "Founder",              email: "cfuentes@bioactive.mx",      location: "Mexico City, MX",  source: "Clay",   icpScore: 71, stage: "new",       enriched: false },
  { id: "l022", listId: "ll-3", name: "Yuki Mori",        company: "PeptideTech Japan",      title: "Head of Operations",   email: "y.mori@peptidetech.jp",      location: "Osaka, Japan",     source: "Clay",   icpScore: 77, stage: "contacted", enriched: true  },

  // ll-4 / ll-004 — UK Skincare Series A (56 leads, showing 6)
  { id: "l023", listId: "ll-4", name: "Charlotte Davies", company: "Botaniq UK",             title: "Founder",              email: "c.davies@botaniq.co.uk",     location: "London, UK",       source: "Apollo", icpScore: 91, stage: "qualified", enriched: true  },
  { id: "l024", listId: "ll-4", name: "Oliver Hughes",    company: "SkintellectUK",          title: "CEO",                  email: "o.hughes@skintellect.co.uk", location: "Manchester, UK",   source: "Apollo", icpScore: 86, stage: "contacted", enriched: true  },
  { id: "l025", listId: "ll-4", name: "Niamh O'Brien",    company: "PureCelticBeauty",       title: "Co-Founder",           email: "niamh@purceltic.ie",         location: "Dublin, Ireland",  source: "Apollo", icpScore: 83, stage: "replied",   enriched: true  },
  { id: "l026", listId: "ll-4", name: "Harriet Stone",    company: "NaturallyLondon",        title: "Founder & CEO",        email: "h.stone@naturallylondon.com",location: "London, UK",       source: "Apollo", icpScore: 78, stage: "new",       enriched: true  },
  { id: "l027", listId: "ll-4", name: "Sadia Islam",      company: "AuraUK",                 title: "CEO",                  email: "sadia@aurauk.co.uk",         location: "Birmingham, UK",   source: "Apollo", icpScore: 93, stage: "booked",    enriched: true  },
  { id: "l028", listId: "ll-4", name: "Freya Jensen",     company: "ScandoSkin UK",          title: "Co-Founder",           email: "f.jensen@scandoskin.co.uk",  location: "Edinburgh, UK",    source: "Apollo", icpScore: 88, stage: "contacted", enriched: true  },

  // ll-5 / ll-005 — Wellness CPG Emerging (24 leads, showing 4)
  { id: "l029", listId: "ll-5", name: "Jake Morrison",    company: "WellRoots Co.",          title: "Founder",              email: "jake@wellroots.co",          location: "Nashville, US",    source: "Manual", icpScore: 65, stage: "new",       enriched: false },
  { id: "l030", listId: "ll-5", name: "Mara Diaz",        company: "VidaWell",               title: "CEO & Founder",        email: "mara@vidawell.mx",           location: "Austin, US",       source: "Manual", icpScore: 70, stage: "new",       enriched: false },
  { id: "l031", listId: "ll-5", name: "Ben Clarke",       company: "PureRoots CPG",          title: "Co-Founder",           email: "ben@pureroots.com",          location: "Portland, US",     source: "Manual", icpScore: 62, stage: "new",       enriched: false },
  { id: "l032", listId: "ll-5", name: "Gia Romano",       company: "BelloCPG",               title: "Founder",              email: "gia@bellocpg.it",            location: "Milan, Italy",     source: "Manual", icpScore: 67, stage: "new",       enriched: false },
];

// Map standalone page list IDs to canvas IDs
const LIST_ID_MAP: Record<string, string> = {
  "ll-001": "ll-1",
  "ll-002": "ll-2",
  "ll-003": "ll-3",
  "ll-004": "ll-4",
  "ll-005": "ll-5",
};

export function getLeadsForList(listId: string): Lead[] {
  const normalized = LIST_ID_MAP[listId] ?? listId;
  return ALL_LEADS.filter((l) => l.listId === normalized);
}

// ─── Stage + Source style maps ────────────────────────────────────────────────

const STAGE_STYLE: Record<string, { bg: string; color: string }> = {
  new:       { bg: "var(--color-s3)",         color: "var(--color-ink3)" },
  contacted: { bg: "var(--color-blue-bg)",     color: "var(--color-blue)" },
  qualified: { bg: "var(--color-green-bg)",    color: "var(--color-green)" },
  replied:   { bg: "var(--color-amber-bg)",    color: "var(--color-amber)" },
  booked:    { bg: "var(--color-purple-bg)",   color: "var(--color-purple)" },
};

const SOURCE_STYLE: Record<string, { bg: string; color: string }> = {
  Apollo: { bg: "var(--color-blue-bg)",               color: "var(--color-blue)" },
  Clay:   { bg: "var(--color-teal-bg, #E6F4F4)",      color: "var(--color-teal, #2A7A7A)" },
  Manual: { bg: "var(--color-purple-bg)",              color: "var(--color-purple)" },
};

// ─── Component ────────────────────────────────────────────────────────────────

const PAGE_SIZES = [8, 15, 25];

export function LeadsDataTable({
  leads,
  compact = false,
}: {
  leads: Lead[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(compact ? 8 : 15);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortCol, setSortCol] = useState<"name" | "icpScore" | "stage">("icpScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = leads;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }
    if (stageFilter !== "all") list = list.filter((l) => l.stage === stageFilter);
    return [...list].sort((a, b) => {
      let diff = 0;
      if (sortCol === "name") diff = a.name.localeCompare(b.name);
      else if (sortCol === "icpScore") diff = a.icpScore - b.icpScore;
      else if (sortCol === "stage") diff = a.stage.localeCompare(b.stage);
      return sortDir === "asc" ? diff : -diff;
    });
  }, [leads, query, stageFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allSelected = paginated.length > 0 && paginated.every((l) => selected.has(l.id));

  function toggleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("desc"); }
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) paginated.forEach((l) => next.delete(l.id));
      else paginated.forEach((l) => next.add(l.id));
      return next;
    });
  }

  const stages = ["all", "new", "contacted", "qualified", "replied", "booked"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: compact ? "8px 0 6px" : "10px 0 8px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--color-ink4)" }} width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7.5 7.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search leads..."
            style={{
              width: "100%", paddingLeft: 26, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
              fontSize: compact ? 11 : 12,
              background: "var(--color-s2)", border: "0.5px solid var(--color-border)",
              borderRadius: "var(--radius)", color: "var(--color-ink)",
              fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Stage chips */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => { setStageFilter(s); setPage(1); }}
              style={{
                padding: "3px 9px", borderRadius: 99, fontSize: 10.5, cursor: "pointer",
                fontFamily: "var(--font-sans)", fontWeight: stageFilter === s ? 600 : 400,
                background: stageFilter === s
                  ? (s === "all" ? "var(--color-ink)" : (STAGE_STYLE[s]?.bg ?? "var(--color-s3)"))
                  : "var(--color-s2)",
                color: stageFilter === s
                  ? (s === "all" ? "#fff" : (STAGE_STYLE[s]?.color ?? "var(--color-ink3)"))
                  : "var(--color-ink3)",
                border: "0.5px solid var(--color-border)",
                transition: "all .12s",
              }}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Bulk action (if selected) */}
        {selected.size > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 11, color: "var(--color-ink3)", fontFamily: "var(--font-mono)" }}>
              {selected.size} selected
            </span>
            <button style={actionBtn}>Enrich</button>
            <button style={actionBtn}>Export</button>
            <button onClick={() => setSelected(new Set())} style={{ ...actionBtn, color: "var(--color-ink4)", background: "transparent" }}>✕</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compact ? 11.5 : 12 }}>
          <thead>
            <tr style={{ background: "var(--color-s2)", borderBottom: "0.5px solid var(--color-border)" }}>
              <th style={{ width: 32, padding: "7px 10px" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ cursor: "pointer", accentColor: "var(--color-gold)" }}
                />
              </th>
              <SortTh label="Name" col="name" sortCol={sortCol} sortDir={sortDir} onSort={toggleSort} />
              <th style={th}>Company</th>
              <th style={th}>Title</th>
              {!compact && <th style={th}>Location</th>}
              <th style={th}>Email</th>
              {!compact && <th style={th}>Source</th>}
              <SortTh label="Score" col="icpScore" sortCol={sortCol} sortDir={sortDir} onSort={toggleSort} />
              <SortTh label="Stage" col="stage" sortCol={sortCol} sortDir={sortDir} onSort={toggleSort} />
              <th style={{ ...th, width: 56 }} />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={compact ? 8 : 10} style={{ textAlign: "center", padding: "28px 0", color: "var(--color-ink4)", fontSize: 12 }}>
                  No leads match your filter
                </td>
              </tr>
            ) : (
              paginated.map((lead) => {
                const stageSt = STAGE_STYLE[lead.stage] ?? STAGE_STYLE.new;
                const srcSt = SOURCE_STYLE[lead.source] ?? SOURCE_STYLE.Apollo;
                const isSelected = selected.has(lead.id);
                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)",
                      background: isSelected ? "rgba(200,169,122,0.06)" : "transparent",
                      transition: "background .1s",
                    }}
                  >
                    <td style={{ padding: "7px 10px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (isSelected) next.delete(lead.id);
                            else next.add(lead.id);
                            return next;
                          });
                        }}
                        style={{ cursor: "pointer", accentColor: "var(--color-gold)" }}
                      />
                    </td>
                    <td style={{ padding: "7px 12px" }}>
                      <div style={{ fontWeight: 500, color: "var(--color-ink)", whiteSpace: "nowrap" }}>{lead.name}</div>
                      {!lead.enriched && (
                        <div style={{ fontSize: 9.5, color: "var(--color-amber)", marginTop: 1, fontFamily: "var(--font-mono)" }}>not enriched</div>
                      )}
                    </td>
                    <td style={{ padding: "7px 12px", color: "var(--color-ink2)", whiteSpace: "nowrap" }}>{lead.company}</td>
                    <td style={{ padding: "7px 12px", color: "var(--color-ink3)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.title}</td>
                    {!compact && (
                      <td style={{ padding: "7px 12px", color: "var(--color-ink4)", whiteSpace: "nowrap", fontSize: 11 }}>{lead.location}</td>
                    )}
                    <td style={{ padding: "7px 12px" }}>
                      <span style={{ color: "var(--color-blue)", fontFamily: "var(--font-mono)", fontSize: 10.5 }}>{lead.email}</span>
                    </td>
                    {!compact && (
                      <td style={{ padding: "7px 12px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: srcSt.bg, color: srcSt.color }}>{lead.source}</span>
                      </td>
                    )}
                    <td style={{ padding: "7px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: lead.icpScore >= 80 ? "var(--color-green)" : "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
                          {lead.icpScore}
                        </span>
                        <div style={{ width: 32, height: 3, background: "var(--color-s3)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${lead.icpScore}%`, background: lead.icpScore >= 80 ? "var(--color-green)" : "var(--color-amber)", borderRadius: 99 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "7px 12px" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: stageSt.bg, color: stageSt.color, whiteSpace: "nowrap" }}>
                        {lead.stage}
                      </span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right" }}>
                      <button style={{ fontSize: 10.5, color: "var(--color-gold)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", padding: "2px 6px", borderRadius: 4 }}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>
            {filtered.length === 0 ? "0" : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)}`} of {filtered.length}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-ink4)" }}>·</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            style={{
              fontSize: 11, background: "var(--color-s2)", border: "0.5px solid var(--color-border)",
              borderRadius: 4, padding: "2px 4px", color: "var(--color-ink3)",
              fontFamily: "var(--font-mono)", cursor: "pointer", outline: "none",
            }}
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <PagBtn onClick={() => setPage(1)} disabled={safePage === 1} title="First">«</PagBtn>
          <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} title="Prev">‹</PagBtn>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
            const p = start + i;
            return (
              <PagBtn key={p} onClick={() => setPage(p)} active={p === safePage}>{p}</PagBtn>
            );
          })}

          <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} title="Next">›</PagBtn>
          <PagBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages} title="Last">»</PagBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Micro components ────────────────────────────────────────────────────────

function SortTh({
  label, col, sortCol, sortDir, onSort,
}: {
  label: string;
  col: "name" | "icpScore" | "stage";
  sortCol: string;
  sortDir: "asc" | "desc";
  onSort: (col: "name" | "icpScore" | "stage") => void;
}) {
  const active = sortCol === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{ ...th, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
        {label}
        <span style={{ fontSize: 9, color: active ? "var(--color-gold)" : "var(--color-ink4)", opacity: active ? 1 : 0.5 }}>
          {active ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
        </span>
      </span>
    </th>
  );
}

function PagBtn({
  children, onClick, disabled, active, title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontFamily: "var(--font-mono)", borderRadius: 5, cursor: disabled ? "default" : "pointer",
        background: active ? "var(--color-gold)" : "var(--color-surface)",
        color: active ? "#fff" : disabled ? "var(--color-ink4)" : "var(--color-ink2)",
        border: "0.5px solid var(--color-border)",
        opacity: disabled ? 0.4 : 1,
        transition: "all .1s",
      }}
    >
      {children}
    </button>
  );
}

const th: React.CSSProperties = {
  padding: "7px 12px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 700,
  color: "var(--color-ink4)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  whiteSpace: "nowrap",
};

const actionBtn: React.CSSProperties = {
  padding: "3px 10px", fontSize: 11, fontWeight: 600,
  background: "var(--color-surface)", border: "0.5px solid var(--color-border)",
  borderRadius: 4, cursor: "pointer", color: "var(--color-ink2)",
  fontFamily: "var(--font-sans)",
};
