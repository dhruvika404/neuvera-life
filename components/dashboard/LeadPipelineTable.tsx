"use client";
import { useState } from "react";
import useSWR from "swr";
import { Search, Filter, Plus, X, Mail, Phone, MapPin, ExternalLink, Copy, Building2, Globe, Users, TrendingUp, Zap, Download } from "lucide-react";
import { Modal, Fg, TwoFg, FieldInput, FieldSelect, BtnPrimary, BtnGhost } from "@/components/ui/Modal";
import { useToastsStore } from "@/store/toasts.store";
import type { LeadDto } from "@/types/dtos";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function mapDtoToLead(dto: LeadDto) {
  const enrichment = dto.enrichmentData ?? {};
  const displayName = dto.name ?? ([dto.firstName, dto.lastName].filter(Boolean).join(" ") || "Unknown");
  return {
    id: dto.id,
    co: dto.company ?? "—",
    dom: (dto.enrichmentData as Record<string, string> | null)?.domain ?? "",
    init: getInitials(displayName),
    contact: displayName,
    role: dto.title ?? "—",
    loc: (enrichment as Record<string, string>).location ?? "—",
    src: dto.source ? dto.source.charAt(0).toUpperCase() + dto.source.slice(1) : "Manual",
    st: dto.stage ?? "new",
    act: dto.updatedAt ? new Date(dto.updatedAt).toLocaleDateString() : "—",
    score: dto.icpFit ?? 0,
    email: dto.email ?? "",
    phone: (enrichment as Record<string, string>).phone ?? "",
    li: dto.linkedinUrl ?? "",
    employees: (enrichment as Record<string, string>).company_size ?? "",
    rev: (enrichment as Record<string, string>).annual_revenue ?? "",
    funding: (enrichment as Record<string, string>).funding_stage ?? "",
    founded: (enrichment as Record<string, string>).founded ?? "",
    notes: "",
  };
}

type Lead = ReturnType<typeof mapDtoToLead>;

// ─── Stage config ──────────────────────────────────────────────────────────
const STAGE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: "New", bg: "var(--color-blue-bg)", color: "var(--color-blue)" },
  contacted: { label: "Contacted", bg: "var(--color-amber-bg)", color: "var(--color-amber)" },
  qualified: { label: "Qualified", bg: "var(--color-green-bg)", color: "var(--color-green)" },
  meeting: { label: "Meeting", bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
  closed: { label: "Closed", bg: "var(--color-s2)", color: "var(--color-ink2)" },
};

const SRC_CONFIG: Record<string, { bg: string; color: string }> = {
  Apollo: { bg: "var(--color-blue-bg)", color: "var(--color-blue)" },
  Clay: { bg: "var(--color-teal-bg, #E6F4F4)", color: "var(--color-teal, #2A7A7A)" },
};

function scoreColor(s: number) {
  return s >= 85 ? "var(--color-green)" : s >= 70 ? "var(--color-amber)" : "var(--color-ink3)";
}
function scoreBg(s: number) {
  return s >= 85 ? "var(--color-green-bg)" : s >= 70 ? "var(--color-amber-bg)" : "var(--color-s2)";
}

// ─── Lead Detail Slide-in Panel ────────────────────────────────────────────
function LeadDetailPanel({
  lead,
  onClose,
}: {
  lead: Lead | null;
  onClose: () => void;
}) {
  const { addToast } = useToastsStore();

  return (
    <div
      style={{
        position: "fixed",
        top: "var(--topbar-h)",
        right: 0,
        bottom: 0,
        width: 380,
        background: "var(--color-surface)",
        borderLeft: "0.5px solid var(--color-border)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        transform: lead ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s ease",
        boxShadow: "-8px 0 32px rgba(26,23,19,.08)",
      }}
    >
      {lead && (
        <>
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "0.5px solid var(--color-border)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--color-s3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-ink2)",
                flexShrink: 0,
              }}
            >
              {lead.init}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-ink)", lineHeight: 1.2 }}>
                {lead.contact}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-ink3)", marginTop: 1 }}>
                {lead.role} · {lead.co}
              </div>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 4,
                  padding: "1px 8px",
                  borderRadius: 99,
                  fontSize: 10.5,
                  fontWeight: 500,
                  background: STAGE_CONFIG[lead.st]?.bg,
                  color: STAGE_CONFIG[lead.st]?.color,
                }}
              >
                {STAGE_CONFIG[lead.st]?.label ?? lead.st}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: "0.5px solid var(--color-border)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-ink3)",
                flexShrink: 0,
              }}
            >
              <X size={13} />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* ICP Match Score */}
            <div
              style={{
                padding: "14px 16px",
                background: "var(--color-s2)",
                borderRadius: 8,
                border: "0.5px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--color-ink3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                ICP Match Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: 28,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    color: scoreColor(lead.score),
                    lineHeight: 1,
                  }}
                >
                  {lead.score}
                </span>
                <span style={{ fontSize: 12, color: "var(--color-ink4)" }}>/ 100</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 4,
                  background: "var(--color-s3)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${lead.score}%`,
                    background: scoreColor(lead.score),
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--color-ink3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Contact
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <LdField icon={<Mail size={12} />} value={lead.email} />
                <LdField icon={<Phone size={12} />} value={lead.phone} />
                <LdField icon={<MapPin size={12} />} value={lead.loc} />
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <a
                  href={`https://${lead.li}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: "var(--color-blue-bg)",
                    color: "var(--color-blue)",
                    borderRadius: 5,
                    fontSize: 11.5,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={11} />
                  LinkedIn
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lead.email);
                    addToast({ title: "Email copied", type: "success" });
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: "var(--color-s2)",
                    color: "var(--color-ink2)",
                    border: "0.5px solid var(--color-border)",
                    borderRadius: 5,
                    fontSize: 11.5,
                    cursor: "pointer",
                  }}
                >
                  <Copy size={11} />
                  Copy Email
                </button>
              </div>
            </div>

            {/* Company */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--color-ink3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Company
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 12px",
                }}
              >
                <LdCoField icon={<Building2 size={11} />} label="Company" value={lead.co} />
                <LdCoField icon={<Globe size={11} />} label="Domain" value={lead.dom} />
                <LdCoField icon={<Users size={11} />} label="Employees" value={lead.employees} />
                <LdCoField icon={<TrendingUp size={11} />} label="Revenue" value={lead.rev} />
                <LdCoField icon={<Zap size={11} />} label="Funding" value={lead.funding} />
                <LdCoField icon={<Building2 size={11} />} label="Founded" value={lead.founded} />
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--color-ink3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Notes
                </div>
                <p style={{ fontSize: 12.5, color: "var(--color-ink2)", lineHeight: 1.5 }}>
                  {lead.notes}
                </p>
              </div>
            )}

            {/* Activity */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--color-ink3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Activity
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { event: `Added to Lead Pipeline via ${lead.src}`, time: lead.act },
                  { event: "ICP scoring completed", time: "automated" },
                  { event: "Enrichment queued", time: "automated" },
                ].map((ev, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--color-gold)",
                        flexShrink: 0,
                        marginTop: 5,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 12.5, color: "var(--color-ink2)" }}>{ev.event}</div>
                      <div style={{ fontSize: 11, color: "var(--color-ink4)", marginTop: 1 }}>{ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "0.5px solid var(--color-border)",
              display: "flex",
              gap: 6,
            }}
          >
            <button
              onClick={() => addToast({ title: "Outreach started", type: "success" })}
              style={{
                flex: 1,
                padding: "7px 0",
                background: "var(--color-gold)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Start Outreach
            </button>
            <button
              onClick={() => addToast({ title: "Enrichment queued", type: "info" })}
              style={{
                flex: 1,
                padding: "7px 0",
                background: "var(--color-s2)",
                color: "var(--color-ink2)",
                border: "0.5px solid var(--color-border)",
                borderRadius: "var(--radius)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Enrich
            </button>
            <button
              onClick={() => addToast({ title: "Exported", type: "success" })}
              style={{
                padding: "7px 12px",
                background: "var(--color-s2)",
                color: "var(--color-ink2)",
                border: "0.5px solid var(--color-border)",
                borderRadius: "var(--radius)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Download size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function LdField({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: "var(--color-ink4)", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12.5, color: "var(--color-ink2)" }}>{value}</span>
    </div>
  );
}

function LdCoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
        <span style={{ color: "var(--color-ink4)" }}>{icon}</span>
        <span style={{ fontSize: 10.5, color: "var(--color-ink4)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--color-ink2)", paddingLeft: 15 }}>{value}</div>
    </div>
  );
}

// ─── Add Lead Modal ────────────────────────────────────────────────────────
function AddLeadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addToast } = useToastsStore();
  const [form, setForm] = useState({
    company: "",
    domain: "",
    contact: "",
    role: "",
    source: "Apollo",
    status: "new",
  });

  function handleSave() {
    if (!form.company || !form.contact) return;
    addToast({ title: `Lead "${form.contact}" added`, type: "success" });
    onClose();
    setForm({ company: "", domain: "", contact: "", role: "", source: "Apollo", status: "new" });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Lead"
      subtitle="Manually add a contact to the pipeline"
      footer={
        <>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary onClick={handleSave}>Add Lead</BtnPrimary>
        </>
      }
    >
      <TwoFg>
        <Fg label="Company">
          <FieldInput
            placeholder="Luminary Health"
            value={form.company}
            onChange={set("company")}
          />
        </Fg>
        <Fg label="Domain">
          <FieldInput
            placeholder="luminaryhealth.com"
            value={form.domain}
            onChange={set("domain")}
          />
        </Fg>
      </TwoFg>
      <TwoFg>
        <Fg label="Contact Name">
          <FieldInput
            placeholder="Sarah Chen"
            value={form.contact}
            onChange={set("contact")}
          />
        </Fg>
        <Fg label="Role">
          <FieldInput
            placeholder="VP Marketing"
            value={form.role}
            onChange={set("role")}
          />
        </Fg>
      </TwoFg>
      <TwoFg>
        <Fg label="Source">
          <FieldSelect value={form.source} onChange={set("source")}>
            <option>Apollo</option>
            <option>Clay</option>
            <option>Manual</option>
            <option>LinkedIn</option>
          </FieldSelect>
        </Fg>
        <Fg label="Status">
          <FieldSelect value={form.status} onChange={set("status")}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="meeting">Meeting</option>
          </FieldSelect>
        </Fg>
      </TwoFg>
    </Modal>
  );
}

// ─── Main Table Component ──────────────────────────────────────────────────
export function LeadPipelineTable() {
  const { addToast } = useToastsStore();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, mutate } = useSWR<{ leads: LeadDto[]; total: number }>(
    search ? `/api/leads?search=${encodeURIComponent(search)}` : "/api/leads",
    fetcher,
    { refreshInterval: 30000 }
  );

  const leads = (data?.leads ?? []).map(mapDtoToLead);

  const filtered = leads.filter(
    (l) =>
      l.co.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()) ||
      l.role.toLowerCase().includes(search.toLowerCase())
  );

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  }

  const allChecked = filtered.length > 0 && selected.size === filtered.length;
  const someChecked = selected.size > 0;

  void mutate;

  return (
    <>
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b gap-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
              Lead Pipeline
            </span>
            <span
              className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                background: "var(--color-s2)",
                color: "var(--color-ink3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs w-44"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-s2)",
              }}
            >
              <Search size={12} style={{ color: "var(--color-ink3)" }} />
              <input
                className="flex-1 bg-transparent outline-none text-[12px] min-w-0"
                style={{ color: "var(--color-ink)" }}
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] transition-colors"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-ink3)",
                background: "var(--color-surface)",
              }}
            >
              <Filter size={11} />
              Filter
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] transition-opacity hover:opacity-85"
              style={{
                background: "var(--color-gold)",
                color: "#fff",
                border: "none",
              }}
            >
              <Plus size={11} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: "var(--color-s2)",
                }}
              >
                <th className="px-4 py-2.5 w-8">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    style={{ cursor: "pointer", accentColor: "var(--color-gold)" }}
                  />
                </th>
                {["Contact", "Company", "Source", "Location", "Stage", "ICP Fit", "Last Activity"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
                    style={{ color: "var(--color-ink3)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const stage = STAGE_CONFIG[lead.st] ?? STAGE_CONFIG.new;
                const src = SRC_CONFIG[lead.src] ?? { bg: "var(--color-s2)", color: "var(--color-ink3)" };
                const isSelected = selected.has(lead.id);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setActiveLead(lead)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : undefined,
                      background: isSelected ? "var(--color-gold-d, rgba(200,169,122,0.06))" : undefined,
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    className="hover:bg-[var(--color-s2)]"
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(lead.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(lead.id)}
                        style={{ cursor: "pointer", accentColor: "var(--color-gold)" }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                          style={{
                            background: "var(--color-s3)",
                            color: "var(--color-ink2)",
                          }}
                        >
                          {lead.init}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium" style={{ color: "var(--color-ink)" }}>
                            {lead.contact}
                          </div>
                          <div className="text-[11px]" style={{ color: "var(--color-ink3)" }}>
                            {lead.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px]" style={{ color: "var(--color-ink)" }}>{lead.co}</div>
                      <div className="text-[11px]" style={{ color: "var(--color-ink4)" }}>{lead.dom}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10.5px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: src.bg, color: src.color }}
                      >
                        {lead.src}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--color-ink3)" }}>
                      {lead.loc}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: stage.bg, color: stage.color }}
                      >
                        {stage.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            color: scoreColor(lead.score),
                            background: scoreBg(lead.score),
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {lead.score}
                        </span>
                        <div
                          style={{
                            width: 36,
                            height: 3,
                            background: "var(--color-s3)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${lead.score}%`,
                              background: scoreColor(lead.score),
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px]" style={{ color: "var(--color-ink4)" }}>
                      {lead.act}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div
          className="px-5 py-2.5 border-t flex items-center justify-between"
          style={{ borderColor: "var(--color-border)", background: "var(--color-s2)" }}
        >
          <span className="text-[11px]" style={{ color: "var(--color-ink4)" }}>
            {filtered.length} leads · Updated just now
          </span>
          <button
            className="text-[11px] transition-opacity hover:opacity-70"
            style={{ color: "var(--color-gold)" }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {someChecked && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            background: "var(--color-ink)",
            color: "var(--color-bg)",
            borderRadius: "var(--radius-lg)",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 4px 20px rgba(26,23,19,.28)",
            animation: "msg-in 0.18s ease",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>
            {selected.size} selected
          </span>
          <div
            style={{
              width: 1,
              height: 16,
              background: "rgba(255,255,255,0.15)",
            }}
          />
          {[
            { label: "Start Outreach", action: () => addToast({ title: `Outreach started for ${selected.size} leads`, type: "success" }) },
            { label: "Export CSV", action: () => addToast({ title: "Exported to CSV", type: "success" }) },
            { label: "Change Stage", action: () => addToast({ title: "Stage updated", type: "info" }) },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => {
                b.action();
                setSelected(new Set());
              }}
              style={{
                padding: "4px 10px",
                background: "rgba(255,255,255,0.1)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                borderRadius: 5,
                color: "inherit",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {b.label}
            </button>
          ))}
          <button
            onClick={() => setSelected(new Set())}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Lead detail panel */}
      {activeLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,23,19,.08)",
            zIndex: 199,
          }}
          onClick={() => setActiveLead(null)}
        />
      )}
      <LeadDetailPanel lead={activeLead} onClose={() => setActiveLead(null)} />

      {/* Add Lead modal */}
      <AddLeadModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
