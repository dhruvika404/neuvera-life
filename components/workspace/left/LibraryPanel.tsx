"use client";
import { useState, useMemo } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

type FolderItem = {
  id: string; type: "folder";
  icon: string; name: string; meta: string;
  color: string; bc: string;
};
type FileItem = {
  id: string; type: "icp" | "leadlist" | "campaign" | "enrich" | "crm";
  icon: string; name: string; meta: string;
  badge?: string; bc2?: "active" | "draft";
};
type LibItem = FolderItem | FileItem;

const LIB_TREE: Record<string, Record<string, LibItem[] | "LEAD_LISTS">> = {
  prospecting: {
    root: [
      { id: "icp-folder",   type: "folder", icon: "🎯", name: "ICP Profiles", meta: "3 profiles", color: "#FDF3E3", bc: "#E8C88A" },
      { id: "lists-folder", type: "folder", icon: "📋", name: "Lead Lists",   meta: "5 lists",   color: "#E8F5EF", bc: "#B8DFD0" },
    ] as LibItem[],
    "icp-folder": [
      { id: "icp-1", type: "icp", icon: "🎯", name: "Skincare Founders",  meta: "1,284 leads · 58% open", badge: "Active", bc2: "active" },
      { id: "icp-2", type: "icp", icon: "🎯", name: "DTC Beauty Buyers",  meta: "612 leads · 42% open",   badge: "Draft",  bc2: "draft"  },
      { id: "icp-3", type: "icp", icon: "🎯", name: "Peptide Wholesale",  meta: "188 leads · 33% open",   badge: "Draft",  bc2: "draft"  },
    ] as LibItem[],
    "lists-folder": "LEAD_LISTS",
  },
  engagement: {
    root: [
      { id: "camps-folder", type: "folder", icon: "✉",  name: "Campaigns",      meta: "4 active",      color: "#EBF1FB", bc: "#BDD0EF" },
      { id: "clay-folder",  type: "folder", icon: "⚡",  name: "Clay Enrichment", meta: "4 batches",    color: "#E6F4F4", bc: "#A8D8D8" },
      { id: "hub-folder",   type: "folder", icon: "↗",  name: "HubSpot CRM",     meta: "196 contacts", color: "#FDF3E3", bc: "#E8C88A" },
    ] as LibItem[],
    "camps-folder": [
      { id: "c1", type: "campaign", icon: "✉", name: "Skincare Founders · US Wave 1",  meta: "840 sent · 58% open · 9.2% reply",  badge: "Active", bc2: "active" },
      { id: "c2", type: "campaign", icon: "✉", name: "DTC Beauty · LinkedIn",          meta: "612 sent · 42% open · 7.1% reply",  badge: "Active", bc2: "active" },
      { id: "c3", type: "campaign", icon: "✉", name: "Influencer Collab Outreach",     meta: "290 sent · 71% open · 11.4% reply", badge: "Done",   bc2: "active" },
      { id: "c4", type: "campaign", icon: "✉", name: "Peptide Wholesale Partners",     meta: "188 sent · 33% open · 4.8% reply",  badge: "Draft",  bc2: "draft"  },
    ] as LibItem[],
    "clay-folder": [
      { id: "cl1", type: "enrich", icon: "⚡", name: "Skincare Founders Batch",    meta: "204/204 enriched · Score 91%" },
      { id: "cl2", type: "enrich", icon: "⚡", name: "DTC Beauty Buyers Batch",    meta: "490/612 enriched · Score 88%" },
      { id: "cl3", type: "enrich", icon: "⚡", name: "Wave 1 Follow-up Openers",   meta: "0/12 enriched · Queued"        },
      { id: "cl4", type: "enrich", icon: "⚡", name: "Series A Skincare SaaS",     meta: "0/206 enriched · New"          },
    ] as LibItem[],
    "hub-folder": [
      { id: "hs1", type: "crm", icon: "↗", name: "Qualified",    meta: "47 contacts · Ready for outreach" },
      { id: "hs2", type: "crm", icon: "↗", name: "In Sequence",  meta: "112 contacts · Active outreach"  },
      { id: "hs3", type: "crm", icon: "↗", name: "Replied",      meta: "28 contacts · Awaiting follow-up" },
      { id: "hs4", type: "crm", icon: "↗", name: "Booked",       meta: "6 contacts · Demo scheduled"     },
      { id: "hs5", type: "crm", icon: "↗", name: "Closed",       meta: "3 contacts · Won deals"           },
    ] as LibItem[],
  },
};

const LEAD_LISTS: FileItem[] = [
  { id: "ll-1", type: "leadlist", icon: "📋", name: "Skincare Founders — Q1 2026",  meta: "142 contacts · Ready",     badge: "Ready",  bc2: "active" },
  { id: "ll-2", type: "leadlist", icon: "📋", name: "DTC Beauty Buyers — Retail",   meta: "87 contacts · Ready",      badge: "Ready",  bc2: "active" },
  { id: "ll-3", type: "leadlist", icon: "📋", name: "Peptide Formulators — Global", meta: "31 contacts · Enriching",  badge: "Active", bc2: "active" },
  { id: "ll-4", type: "leadlist", icon: "📋", name: "UK Skincare Brands — Series A",meta: "56 contacts · Ready",      badge: "Ready",  bc2: "active" },
  { id: "ll-5", type: "leadlist", icon: "📋", name: "Wellness CPG — Emerging",      meta: "24 contacts · Draft",      badge: "Draft",  bc2: "draft"  },
];

// ─── Icon colours (matching HTML) ────────────────────────────────────────────

const ICON_STYLE: Record<string, React.CSSProperties> = {
  leadlist: { background: "var(--color-green-bg)",               border: "0.5px solid var(--color-green-b, #B8DFD0)" },
  icp:      { background: "var(--color-amber-bg)",               border: "0.5px solid #E8C88A" },
  campaign: { background: "var(--color-blue-bg)",                border: "0.5px solid #BDD0EF" },
  enrich:   { background: "var(--color-teal-bg, #E6F4F4)",       border: "0.5px solid #A8D8D8" },
  crm:      { background: "var(--color-purple-bg)",              border: "0.5px solid #C8B8E8" },
};

// ─── Component ───────────────────────────────────────────────────────────────

type Crumb = { id: string; label: string };

export function LibraryPanel({
  agentType,
  onSelect,
  activeFileId,
}: {
  agentType: "prospecting" | "engagement";
  onSelect?: (folderId: string, fileId?: string) => void;
  activeFileId?: string;
}) {
  const [path, setPath] = useState<Crumb[]>([{ id: "root", label: "Library" }]);
  const [query, setQuery] = useState("");

  const currentId = path[path.length - 1].id;
  const tree = LIB_TREE[agentType] ?? LIB_TREE.prospecting;

  const rawItems: LibItem[] = useMemo(() => {
    const val = tree[currentId];
    if (!val) return [];
    if (val === "LEAD_LISTS") return LEAD_LISTS;
    return val as LibItem[];
  }, [tree, currentId]);

  const items = useMemo(() => {
    if (!query) return rawItems;
    const q = query.toLowerCase();
    return rawItems.filter((i) => i.name.toLowerCase().includes(q) || i.meta.toLowerCase().includes(q));
  }, [rawItems, query]);

  const folders = items.filter((i): i is FolderItem => i.type === "folder");
  const files   = items.filter((i): i is FileItem   => i.type !== "folder");

  function enter(folder: FolderItem) {
    setPath((p) => [...p, { id: folder.id, label: folder.name }]);
    setQuery("");
    onSelect?.(folder.id);
  }

  function goTo(idx: number) {
    setPath((p) => p.slice(0, idx + 1));
    setQuery("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Breadcrumb */}
      <div
        style={{
          display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2,
          padding: "7px 10px 6px", borderBottom: "0.5px solid var(--color-border)",
          flexShrink: 0, minHeight: 34,
        }}
      >
        {path.map((seg, i) => {
          const isLast = i === path.length - 1;
          return (
            <span key={seg.id} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {i > 0 && <span style={{ fontSize: 9, color: "var(--color-ink4)" }}>›</span>}
              <button
                onClick={() => !isLast && goTo(i)}
                style={{
                  fontSize: 10.5,
                  fontWeight: isLast ? 500 : 400,
                  color: isLast ? "var(--color-ink)" : "var(--color-ink3)",
                  background: "none", border: "none",
                  cursor: isLast ? "default" : "pointer",
                  padding: "1px 3px", borderRadius: 3,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {seg.label}
              </button>
            </span>
          );
        })}
      </div>

      {/* Search + New */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 8px 4px", borderBottom: "0.5px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          style={{
            flex: 1, fontSize: 11, padding: "4px 8px",
            background: "var(--color-s3)", border: "0.5px solid var(--color-border)",
            borderRadius: "var(--radius)", color: "var(--color-ink)",
            fontFamily: "var(--font-sans)", outline: "none",
          }}
        />
        <button
          style={{
            fontSize: 10.5, fontWeight: 600, padding: "3px 8px",
            background: "var(--color-gold)", color: "#fff",
            border: "none", borderRadius: "var(--radius)",
            cursor: "pointer", fontFamily: "var(--font-sans)", flexShrink: 0,
          }}
        >
          + New
        </button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "7px 7px 10px" }}>

        {/* Folders */}
        {folders.length > 0 && (
          <>
            {files.length > 0 && (
              <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink4)", padding: "2px 3px 5px" }}>
                Folders
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 6 }}>
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => enter(f)}
                  style={{
                    display: "flex", flexDirection: "column", gap: 5, padding: "9px 10px",
                    background: "var(--color-surface)", border: "0.5px solid var(--color-border)",
                    borderRadius: "var(--radius)", cursor: "pointer", textAlign: "left",
                    transition: "border-color .15s",
                    fontFamily: "var(--font-sans)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-gold-l, #E8D5B0)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                >
                  {/* Folder SVG icon */}
                  <div style={{ width: 28, height: 22, position: "relative", flexShrink: 0 }}>
                    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                      <rect x="0" y="5" width="28" height="17" rx="2" fill={f.color} stroke={f.bc} strokeWidth="0.8"/>
                      <path d="M0 8h10l2-3h16" stroke={f.bc} strokeWidth="0.8" fill="none"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-ink)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>
                    {f.meta}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Files */}
        {files.length > 0 && (
          <>
            {folders.length > 0 && (
              <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink4)", padding: "4px 3px 5px" }}>
                Files
              </div>
            )}
            {files.map((f) => {
              const iconStyle = ICON_STYLE[f.type] ?? {};
              return (
                <button
                  key={f.id}
                  onClick={() => onSelect?.(currentId === "root" ? (f.id) : currentId, f.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 7px", borderRadius: "var(--radius)",
                    cursor: "pointer", width: "100%", textAlign: "left",
                    background: activeFileId === f.id ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent",
                    border: "none", marginBottom: 2,
                    transition: "background .12s", fontFamily: "var(--font-sans)",
                  }}
                  onMouseEnter={(e) => { if (activeFileId !== f.id) e.currentTarget.style.background = "var(--color-s3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeFileId === f.id ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent"; }}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: 5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontSize: 12,
                      ...iconStyle,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: "var(--color-ink4)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                      {f.meta}
                    </div>
                  </div>
                  {f.badge && (
                    <span
                      style={{
                        fontSize: 8.5, fontFamily: "var(--font-mono)", padding: "1px 6px",
                        borderRadius: 3, flexShrink: 0,
                        ...(f.bc2 === "active"
                          ? { background: "var(--color-green-bg)", color: "var(--color-green)", border: "0.5px solid var(--color-green-b, #B8DFD0)" }
                          : { background: "var(--color-s2)", color: "var(--color-ink4)", border: "0.5px solid var(--color-border)" }),
                      }}
                    >
                      {f.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </>
        )}

        {items.length === 0 && (
          <div style={{ padding: "24px 10px", textAlign: "center", color: "var(--color-ink4)", fontSize: 12 }}>
            {query ? "No results" : "Empty folder"}
          </div>
        )}
      </div>
    </div>
  );
}
