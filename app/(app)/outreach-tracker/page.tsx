"use client";
import { useState, useMemo } from "react";
import { useToastsStore } from "@/store/toasts.store";

const SEQUENCES = [
  {
    id: "seq-001",
    name: "Skincare Founders — Cold Intro",
    tool: "Instantly",
    status: "active",
    leadList: "Skincare Founders — Q1 2026",
    icpProfile: "Skincare Founders",
    startDate: "Mar 10, 2026",
    totalEnrolled: 142,
    sent: 118,
    opened: 71,
    clicked: 23,
    replied: 14,
    bounced: 4,
    unsubscribed: 2,
    meetings: 7,
    steps: [
      { day: 1, type: "Email", subject: "Quick question about [Company]'s growth", sent: 118, opened: 71, replied: 14 },
      { day: 3, type: "LinkedIn", subject: "Connection request", sent: 89, opened: 0, replied: 31 },
      { day: 7, type: "Email", subject: "Following up — [specific pain point]", sent: 62, opened: 38, replied: 6 },
      { day: 14, type: "Email", subject: "Last touch — resources for you", sent: 21, opened: 11, replied: 2 },
    ],
  },
  {
    id: "seq-002",
    name: "UK Brands — Partnership Pitch",
    tool: "Instantly",
    status: "active",
    leadList: "UK Skincare Brands — Series A",
    icpProfile: "Skincare Founders",
    startDate: "Mar 5, 2026",
    totalEnrolled: 56,
    sent: 56,
    opened: 38,
    clicked: 12,
    replied: 9,
    bounced: 1,
    unsubscribed: 0,
    meetings: 4,
    steps: [
      { day: 1, type: "Email", subject: "Helping UK skincare brands scale — thought of [Company]", sent: 56, opened: 38, replied: 9 },
      { day: 5, type: "Email", subject: "Case study: 3x outreach response rate", sent: 34, opened: 22, replied: 4 },
      { day: 12, type: "Email", subject: "One last idea for [Company]", sent: 12, opened: 7, replied: 1 },
    ],
  },
  {
    id: "seq-003",
    name: "DTC Buyers — Intro Sequence",
    tool: "HeyReach",
    status: "paused",
    leadList: "DTC Beauty Buyers — Retail",
    icpProfile: "DTC Beauty Buyers",
    startDate: "Feb 20, 2026",
    totalEnrolled: 87,
    sent: 74,
    opened: 41,
    clicked: 8,
    replied: 6,
    bounced: 3,
    unsubscribed: 1,
    meetings: 3,
    steps: [
      { day: 1, type: "LinkedIn", subject: "Connection request + note", sent: 74, opened: 0, replied: 41 },
      { day: 3, type: "Email", subject: "Following up from LinkedIn", sent: 49, opened: 31, replied: 6 },
      { day: 10, type: "Email", subject: "New brand spotlight — relevant for [Company]", sent: 18, opened: 10, replied: 2 },
    ],
  },
  {
    id: "seq-004",
    name: "Wellness CPG — Warm Outreach",
    tool: "Instantly",
    status: "draft",
    leadList: "Wellness CPG — Emerging Brands",
    icpProfile: "Skincare Founders",
    startDate: "—",
    totalEnrolled: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    bounced: 0,
    unsubscribed: 0,
    meetings: 0,
    steps: [
      { day: 1, type: "Email", subject: "Congrats on the [recent launch]", sent: 0, opened: 0, replied: 0 },
      { day: 4, type: "LinkedIn", subject: "Follow + comment on post", sent: 0, opened: 0, replied: 0 },
      { day: 8, type: "Email", subject: "Personalized offer — [name] specifically", sent: 0, opened: 0, replied: 0 },
    ],
  },
];

// ─── Contacts per sequence ─────────────────────────────────────────────────────

type SeqContact = {
  id: string;
  seqId: string;
  name: string;
  company: string;
  email: string;
  step: number;
  totalSteps: number;
  status: "active" | "replied" | "bounced" | "unsubscribed" | "booked";
  opens: number;
  lastActivity: string;
};

const SEQ_CONTACTS: SeqContact[] = [
  // seq-001
  { id:"sc001", seqId:"seq-001", name:"Sarah Chen",      company:"Luminary Health",    email:"s.chen@luminaryhealth.co",    step:3, totalSteps:4, status:"replied",      opens:4, lastActivity:"Mar 21, 2026" },
  { id:"sc002", seqId:"seq-001", name:"Emma Walsh",      company:"PureVita Brands",    email:"emma@purevita.com",           step:2, totalSteps:4, status:"active",       opens:2, lastActivity:"Mar 19, 2026" },
  { id:"sc003", seqId:"seq-001", name:"Mia Chen",        company:"ElementalSkin",      email:"mia@elementalskin.co",        step:1, totalSteps:4, status:"active",       opens:1, lastActivity:"Mar 17, 2026" },
  { id:"sc004", seqId:"seq-001", name:"Jane Wu",         company:"AuraSkin",           email:"jane@auraskin.com",           step:4, totalSteps:4, status:"booked",       opens:6, lastActivity:"Mar 22, 2026" },
  { id:"sc005", seqId:"seq-001", name:"Priya Nair",      company:"GlowNaturals",       email:"priya@glownaturals.co",       step:2, totalSteps:4, status:"active",       opens:2, lastActivity:"Mar 18, 2026" },
  { id:"sc006", seqId:"seq-001", name:"Lauren Kim",      company:"VerdeSkin",          email:"l.kim@verdeskin.io",          step:3, totalSteps:4, status:"replied",      opens:5, lastActivity:"Mar 20, 2026" },
  { id:"sc007", seqId:"seq-001", name:"Rachel Nguyen",   company:"TerraGlow",          email:"rachel@terraglow.co",         step:1, totalSteps:4, status:"active",       opens:1, lastActivity:"Mar 16, 2026" },
  { id:"sc008", seqId:"seq-001", name:"Claudia Ross",    company:"AlchemySkin",        email:"c.ross@alchemyskin.com",      step:1, totalSteps:4, status:"bounced",      opens:0, lastActivity:"Mar 15, 2026" },
  { id:"sc009", seqId:"seq-001", name:"Isabelle Moreau", company:"LaRosée Beauté",     email:"i.moreau@larosee.fr",         step:2, totalSteps:4, status:"active",       opens:2, lastActivity:"Mar 17, 2026" },
  { id:"sc010", seqId:"seq-001", name:"Akemi Tanaka",    company:"KiSkin Japan",       email:"akemi@kiskin.jp",             step:1, totalSteps:4, status:"unsubscribed", opens:1, lastActivity:"Mar 14, 2026" },
  { id:"sc011", seqId:"seq-001", name:"Sofia Martinez",  company:"BotanicaBeauty",     email:"sofia@botanicabeauty.com",    step:2, totalSteps:4, status:"active",       opens:3, lastActivity:"Mar 18, 2026" },
  { id:"sc012", seqId:"seq-001", name:"Anya Petrov",     company:"RenewLab",           email:"anya@renewlab.io",            step:3, totalSteps:4, status:"replied",      opens:4, lastActivity:"Mar 19, 2026" },
  // seq-002
  { id:"sc013", seqId:"seq-002", name:"Charlotte Davies",company:"Botaniq UK",         email:"c.davies@botaniq.co.uk",      step:2, totalSteps:3, status:"replied",      opens:4, lastActivity:"Mar 12, 2026" },
  { id:"sc014", seqId:"seq-002", name:"Oliver Hughes",   company:"SkintellectUK",      email:"o.hughes@skintellect.co.uk",  step:2, totalSteps:3, status:"active",       opens:3, lastActivity:"Mar 11, 2026" },
  { id:"sc015", seqId:"seq-002", name:"Niamh O'Brien",   company:"PureCelticBeauty",   email:"niamh@purceltic.ie",          step:3, totalSteps:3, status:"booked",       opens:5, lastActivity:"Mar 14, 2026" },
  { id:"sc016", seqId:"seq-002", name:"Harriet Stone",   company:"NaturallyLondon",    email:"h.stone@naturallylondon.com", step:1, totalSteps:3, status:"active",       opens:1, lastActivity:"Mar 8, 2026"  },
  { id:"sc017", seqId:"seq-002", name:"Sadia Islam",     company:"AuraUK",             email:"sadia@aurauk.co.uk",          step:3, totalSteps:3, status:"replied",      opens:4, lastActivity:"Mar 13, 2026" },
  { id:"sc018", seqId:"seq-002", name:"Freya Jensen",    company:"ScandoSkin UK",      email:"f.jensen@scandoskin.co.uk",   step:2, totalSteps:3, status:"active",       opens:2, lastActivity:"Mar 10, 2026" },
  { id:"sc019", seqId:"seq-002", name:"Marcus Webb",     company:"VivaGlow UK",        email:"m.webb@vivaglow.co.uk",       step:1, totalSteps:3, status:"bounced",      opens:0, lastActivity:"Mar 6, 2026"  },
  // seq-003
  { id:"sc020", seqId:"seq-003", name:"Marcus Webb",     company:"VivaGlow",           email:"m.webb@vivaglow.com",         step:2, totalSteps:3, status:"replied",      opens:3, lastActivity:"Mar 5, 2026"  },
  { id:"sc021", seqId:"seq-003", name:"David Kim",       company:"HealthFirst Labs",   email:"d.kim@healthfirstlabs.com",   step:3, totalSteps:3, status:"booked",       opens:5, lastActivity:"Mar 7, 2026"  },
  { id:"sc022", seqId:"seq-003", name:"Natalie Brooks",  company:"BeautyHaven Retail", email:"n.brooks@beautyhaven.com",    step:2, totalSteps:3, status:"active",       opens:2, lastActivity:"Mar 4, 2026"  },
  { id:"sc023", seqId:"seq-003", name:"Tom Haley",       company:"GlossBox",           email:"t.haley@glossbox.co",         step:1, totalSteps:3, status:"active",       opens:1, lastActivity:"Mar 1, 2026"  },
  { id:"sc024", seqId:"seq-003", name:"Anna Schreiber",  company:"DM Drogeriemarkt",   email:"a.schreiber@dm.de",           step:1, totalSteps:3, status:"bounced",      opens:0, lastActivity:"Feb 28, 2026" },
  { id:"sc025", seqId:"seq-003", name:"James Rivera",    company:"Apex Wellness",      email:"james@apexwellness.io",       step:2, totalSteps:3, status:"replied",      opens:3, lastActivity:"Mar 3, 2026"  },
  // seq-004 (draft — 0 sent, pre-loaded)
  { id:"sc026", seqId:"seq-004", name:"Jake Morrison",   company:"WellRoots Co.",      email:"jake@wellroots.co",           step:0, totalSteps:3, status:"active",       opens:0, lastActivity:"—"            },
  { id:"sc027", seqId:"seq-004", name:"Mara Diaz",       company:"VidaWell",           email:"mara@vidawell.mx",            step:0, totalSteps:3, status:"active",       opens:0, lastActivity:"—"            },
  { id:"sc028", seqId:"seq-004", name:"Ben Clarke",      company:"PureRoots CPG",      email:"ben@pureroots.com",           step:0, totalSteps:3, status:"active",       opens:0, lastActivity:"—"            },
  { id:"sc029", seqId:"seq-004", name:"Gia Romano",      company:"BelloCPG",           email:"gia@bellocpg.it",             step:0, totalSteps:3, status:"active",       opens:0, lastActivity:"—"            },
];

const CONTACT_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:       { bg: "var(--color-blue-bg)",   color: "var(--color-blue)"   },
  replied:      { bg: "var(--color-green-bg)",  color: "var(--color-green)"  },
  booked:       { bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
  bounced:      { bg: "var(--color-red-bg)",    color: "var(--color-red)"    },
  unsubscribed: { bg: "var(--color-s3)",        color: "var(--color-ink4)"   },
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active: { bg: "var(--color-green-bg)", color: "var(--color-green)" },
  paused: { bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  draft:  { bg: "var(--color-s3)", color: "var(--color-ink3)" },
};

const TOOL_STYLE: Record<string, { bg: string; color: string }> = {
  Instantly: { bg: "var(--color-blue-bg)", color: "var(--color-blue)" },
  HeyReach:  { bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
};

export default function OutreachTrackerPage() {
  const { addToast } = useToastsStore();
  const [selected, setSelected] = useState<string>("seq-001");

  const seq = SEQUENCES.find((s) => s.id === selected) ?? SEQUENCES[0];
  const openRate = seq.sent > 0 ? Math.round((seq.opened / seq.sent) * 100) : 0;
  const replyRate = seq.sent > 0 ? Math.round((seq.replied / seq.sent) * 100) : 0;
  const meetingRate = seq.totalEnrolled > 0 ? Math.round((seq.meetings / seq.totalEnrolled) * 100) : 0;

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Left panel */}
      <div style={{ width: 300, borderRight: "0.5px solid var(--color-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 16px 10px", borderBottom: "0.5px solid var(--color-border)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginBottom: 2 }}>Outreach Sequences</div>
          <div style={{ fontSize: 11.5, color: "var(--color-ink3)" }}>
            {SEQUENCES.filter((s) => s.status === "active").length} active · {SEQUENCES.reduce((a, s) => a + s.sent, 0)} emails sent
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {SEQUENCES.map((s) => {
            const ss = STATUS_STYLE[s.status];
            const ts = TOOL_STYLE[s.tool];
            const or = s.sent > 0 ? Math.round((s.opened / s.sent) * 100) : 0;
            const rr = s.sent > 0 ? Math.round((s.replied / s.sent) * 100) : 0;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 14px",
                  borderLeft: selected === s.id ? "2px solid var(--color-gold)" : "2px solid transparent",
                  background: selected === s.id ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent",
                  borderBottom: "0.5px solid var(--color-border)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--color-ink)", lineHeight: 1.3 }}>{s.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99, background: ss.bg, color: ss.color, flexShrink: 0 }}>{s.status}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: ts.bg, color: ts.color }}>{s.tool}</span>
                  <span style={{ fontSize: 11, color: "var(--color-ink3)" }}>· {s.steps.length} steps</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <SeqStat label="Sent" value={s.sent} />
                  <SeqStat label="Open" value={`${or}%`} color={or >= 50 ? "var(--color-green)" : or >= 30 ? "var(--color-amber)" : "var(--color-ink3)"} />
                  <SeqStat label="Reply" value={`${rr}%`} color={rr >= 10 ? "var(--color-blue)" : "var(--color-ink3)"} />
                  <SeqStat label="Meetings" value={s.meetings} color="var(--color-purple)" />
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 14px", borderTop: "0.5px solid var(--color-border)" }}>
          <button
            onClick={() => addToast({ title: "New sequence created", type: "success" })}
            style={{ width: "100%", padding: "7px 0", background: "var(--color-gold)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            + New Sequence
          </button>
        </div>
      </div>

      {/* Right detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>{seq.name}</h1>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: STATUS_STYLE[seq.status].bg, color: STATUS_STYLE[seq.status].color }}>{seq.status}</span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: TOOL_STYLE[seq.tool]?.bg ?? "var(--color-s3)", color: TOOL_STYLE[seq.tool]?.color ?? "var(--color-ink3)" }}>{seq.tool}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-ink3)" }}>
              {seq.leadList} · Started {seq.startDate}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {seq.status === "active" ? (
              <button onClick={() => addToast({ title: `"${seq.name}" paused`, type: "info" })} style={secondaryBtn}>Pause</button>
            ) : seq.status === "paused" ? (
              <button onClick={() => addToast({ title: `"${seq.name}" resumed`, type: "success" })} style={secondaryBtn}>Resume</button>
            ) : (
              <button onClick={() => addToast({ title: `"${seq.name}" launched`, type: "success" })} style={primaryBtn}>Launch</button>
            )}
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Enrolled", value: seq.totalEnrolled, color: "var(--color-ink)" },
            { label: "Sent", value: seq.sent, color: "var(--color-ink2)" },
            { label: "Open Rate", value: `${openRate}%`, color: openRate >= 50 ? "var(--color-green)" : openRate >= 30 ? "var(--color-amber)" : "var(--color-ink3)" },
            { label: "Reply Rate", value: `${replyRate}%`, color: replyRate >= 10 ? "var(--color-blue)" : "var(--color-ink3)" },
            { label: "Meetings", value: seq.meetings, color: "var(--color-purple)" },
            { label: "Meeting Rate", value: `${meetingRate}%`, color: meetingRate >= 5 ? "var(--color-green)" : "var(--color-ink3)" },
          ].map((k) => (
            <div key={k.label} style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", padding: "11px 13px" }}>
              <div style={{ fontSize: 10.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: k.color, lineHeight: 1 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Funnel Breakdown</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            {[
              { label: "Enrolled", value: seq.totalEnrolled, color: "var(--color-ink2)" },
              { label: "Sent", value: seq.sent, color: "var(--color-blue)" },
              { label: "Opened", value: seq.opened, color: "var(--color-amber)" },
              { label: "Clicked", value: seq.clicked, color: "var(--color-purple)" },
              { label: "Replied", value: seq.replied, color: "var(--color-green)" },
              { label: "Meetings", value: seq.meetings, color: "var(--color-gold)" },
            ].map((f) => {
              const pct = seq.totalEnrolled > 0 ? Math.max(4, (f.value / seq.totalEnrolled) * 100) : 4;
              return (
                <div key={f.label} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: f.color, fontFamily: "var(--font-serif)", marginBottom: 4 }}>{f.value}</div>
                  <div style={{ height: `${pct * 1.2}px`, background: f.color, borderRadius: 4, opacity: 0.8, minHeight: 6, transition: "height .4s" }} />
                  <div style={{ fontSize: 10, color: "var(--color-ink4)", marginTop: 5 }}>{f.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps table */}
        <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--color-border)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>Sequence Steps</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--color-border)" }}>
                {["Step", "Type", "Subject / Action", "Sent", "Opened", "Replied"].map((h) => (
                  <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seq.steps.map((step, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)" }}>
                  <td style={{ padding: "9px 14px", color: "var(--color-ink4)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Day {step.day}</td>
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: step.type === "Email" ? "var(--color-blue-bg)" : "var(--color-purple-bg)", color: step.type === "Email" ? "var(--color-blue)" : "var(--color-purple)" }}>{step.type}</span>
                  </td>
                  <td style={{ padding: "9px 14px", color: "var(--color-ink2)" }}>{step.subject}</td>
                  <td style={{ padding: "9px 14px", color: "var(--color-ink)", fontWeight: 500 }}>{step.sent}</td>
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ color: step.type === "LinkedIn" ? "var(--color-ink4)" : "var(--color-amber)", fontWeight: 500 }}>
                      {step.type === "LinkedIn" ? "—" : `${step.opened} (${step.sent > 0 ? Math.round((step.opened / step.sent) * 100) : 0}%)`}
                    </span>
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ color: "var(--color-green)", fontWeight: 500 }}>
                      {step.replied} ({step.sent > 0 ? Math.round((step.replied / step.sent) * 100) : 0}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contacts table */}
        <SequenceContactsTable seqId={seq.id} seqStatus={seq.status} onAction={(msg) => addToast({ title: msg, type: "info" })} />
      </div>
    </div>
  );
}

// ─── Contacts Table ────────────────────────────────────────────────────────────

function SequenceContactsTable({
  seqId,
  seqStatus,
  onAction,
}: {
  seqId: string;
  seqStatus: string;
  onAction: (msg: string) => void;
}) {
  const contacts = SEQ_CONTACTS.filter((c) => c.seqId === seqId);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = contacts;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter);
    return list;
  }, [contacts, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allSel = paginated.length > 0 && paginated.every((c) => selected.has(c.id));

  const statuses = ["all", "active", "replied", "booked", "bounced", "unsubscribed"];

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        Enrolled Contacts · {contacts.length}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--color-ink4)" }} width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7.5 7.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search contacts..."
            style={{ width: "100%", paddingLeft: 26, paddingRight: 10, paddingTop: 5, paddingBottom: 5, fontSize: 12, background: "var(--color-s2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", color: "var(--color-ink)", fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {statuses.map((s) => {
            const ss = CONTACT_STATUS_STYLE[s];
            return (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: "3px 9px", borderRadius: 99, fontSize: 10.5, cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: statusFilter === s ? 600 : 400, background: statusFilter === s ? (s === "all" ? "var(--color-ink)" : ss?.bg) : "var(--color-s2)", color: statusFilter === s ? (s === "all" ? "#fff" : ss?.color) : "var(--color-ink3)", border: "0.5px solid var(--color-border)", transition: "all .12s" }}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
        {selected.size > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 11, color: "var(--color-ink3)", fontFamily: "var(--font-mono)" }}>{selected.size} selected</span>
            <button onClick={() => onAction(`${selected.size} contacts re-enrolled`)} style={actionBtn}>Re-enroll</button>
            <button onClick={() => onAction(`${selected.size} contacts removed`)} style={actionBtn}>Remove</button>
            <button onClick={() => setSelected(new Set())} style={{ ...actionBtn, color: "var(--color-ink4)", background: "transparent" }}>✕</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--color-s2)", borderBottom: "0.5px solid var(--color-border)" }}>
              <th style={{ width: 32, padding: "7px 10px" }}>
                <input type="checkbox" checked={allSel} onChange={() => {
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (allSel) paginated.forEach((c) => next.delete(c.id));
                    else paginated.forEach((c) => next.add(c.id));
                    return next;
                  });
                }} style={{ cursor: "pointer", accentColor: "var(--color-gold)" }} />
              </th>
              {["Contact", "Company", "Email", "Step", "Opens", "Status", "Last Activity", ""].map((h) => (
                <th key={h} style={{ padding: "7px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "28px 0", color: "var(--color-ink4)", fontSize: 12 }}>No contacts match your filter</td></tr>
            ) : paginated.map((c) => {
              const ss = CONTACT_STATUS_STYLE[c.status];
              const isSel = selected.has(c.id);
              return (
                <tr key={c.id} style={{ borderBottom: "0.5px solid var(--color-border-l, #EDE8DF)", background: isSel ? "rgba(200,169,122,0.06)" : "transparent" }}>
                  <td style={{ padding: "7px 10px" }}>
                    <input type="checkbox" checked={isSel} onChange={() => setSelected((prev) => { const next = new Set(prev); if (isSel) next.delete(c.id); else next.add(c.id); return next; })} style={{ cursor: "pointer", accentColor: "var(--color-gold)" }} />
                  </td>
                  <td style={{ padding: "8px 12px", fontWeight: 500, color: "var(--color-ink)", whiteSpace: "nowrap" }}>{c.name}</td>
                  <td style={{ padding: "8px 12px", color: "var(--color-ink2)", whiteSpace: "nowrap" }}>{c.company}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ color: "var(--color-blue)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{c.email}</span>
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    {c.step === 0 ? (
                      <span style={{ fontSize: 10.5, color: "var(--color-ink4)" }}>Not started</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)", fontFamily: "var(--font-mono)" }}>{c.step}/{c.totalSteps}</span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {Array.from({ length: c.totalSteps }).map((_, i) => (
                            <div key={i} style={{ width: 6, height: 6, borderRadius: 2, background: i < c.step ? "var(--color-gold)" : "var(--color-s3)" }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11.5, color: c.opens > 0 ? "var(--color-amber)" : "var(--color-ink4)" }}>{c.opens > 0 ? c.opens : "—"}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: ss.bg, color: ss.color, whiteSpace: "nowrap" }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "8px 12px", color: "var(--color-ink3)", fontSize: 11.5, whiteSpace: "nowrap" }}>{c.lastActivity}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right" }}>
                    <button onClick={() => onAction(`Email drafted for ${c.name}`)} style={{ fontSize: 10.5, color: "var(--color-gold)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", padding: "2px 6px", borderRadius: 4 }}>
                      Email
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 11, color: "var(--color-ink4)", fontFamily: "var(--font-mono)" }}>
          {filtered.length === 0 ? "0" : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)}`} of {filtered.length}
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          {[{ label: "«", fn: () => setPage(1), dis: safePage === 1 }, { label: "‹", fn: () => setPage((p) => Math.max(1, p - 1)), dis: safePage === 1 }].map((b) => (
            <PagBtn key={b.label} onClick={b.fn} disabled={b.dis}>{b.label}</PagBtn>
          ))}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
            const p = start + i;
            return <PagBtn key={p} onClick={() => setPage(p)} active={p === safePage}>{p}</PagBtn>;
          })}
          {[{ label: "›", fn: () => setPage((p) => Math.min(totalPages, p + 1)), dis: safePage === totalPages }, { label: "»", fn: () => setPage(totalPages), dis: safePage === totalPages }].map((b) => (
            <PagBtn key={b.label} onClick={b.fn} disabled={b.dis}>{b.label}</PagBtn>
          ))}
        </div>
      </div>
    </div>
  );
}

function PagBtn({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "var(--font-mono)", borderRadius: 5, cursor: disabled ? "default" : "pointer", background: active ? "var(--color-gold)" : "var(--color-surface)", color: active ? "#fff" : disabled ? "var(--color-ink4)" : "var(--color-ink2)", border: "0.5px solid var(--color-border)", opacity: disabled ? 0.4 : 1 }}>
      {children}
    </button>
  );
}

function SeqStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: "var(--color-ink4)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: color ?? "var(--color-ink)", fontFamily: "var(--font-serif)" }}>{value}</div>
    </div>
  );
}

const actionBtn: React.CSSProperties = { padding: "3px 10px", fontSize: 11, fontWeight: 600, background: "var(--color-surface)", border: "0.5px solid var(--color-border)", borderRadius: 4, cursor: "pointer", color: "var(--color-ink2)", fontFamily: "var(--font-sans)" };
const primaryBtn: React.CSSProperties = { padding: "7px 14px", background: "var(--color-ink)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" };
const secondaryBtn: React.CSSProperties = { padding: "7px 14px", background: "var(--color-surface)", color: "var(--color-ink2)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" };
