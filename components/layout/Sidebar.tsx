"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [prospOpen, setProspOpen] = useState(true);
  const [engOpen, setEngOpen] = useState(true);

  const isWS = pathname.startsWith("/workspace/");
  const wsAgent = isWS ? pathname.split("/")[2] : null;

  function navActive(key: string) {
    if (key === "dashboard") return pathname === "/";
    if (key === "agents") return pathname === "/agents";
    if (key === "integrations") return pathname === "/integrations";
    if (key === "icp") return pathname === "/icp-profiles";
    if (key === "leads") return pathname === "/lead-lists";
    if (key === "outreach") return pathname === "/outreach-tracker";
    if (key === "clay") return pathname === "/clay-enrichment";
    if (key === "hubspot") return pathname === "/hubspot-crm";
    return false;
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--color-s2)",
        borderRight: "0.5px solid var(--color-border)",
      }}
    >
      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: "10px" }}>
        {/* Overview section */}
        <div style={{ paddingBottom: "6px" }}>
          <div
            className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-ink4)" }}
          >
            Overview
          </div>

          {/* KPI Dashboard */}
          <NavRow
            active={navActive("dashboard") && !isWS}
            onClick={() => router.push("/")}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            }
            label="KPI Dashboard"
          />

          {/* Agent Dashboard */}
          <NavRow
            active={navActive("agents") && !isWS}
            onClick={() => router.push("/agents")}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1.5 12c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M10.5 4.5l1.5 1.5-1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Agent Dashboard"
          />
        </div>

        {/* Divider */}
        <div
          style={{
            height: "0.5px",
            background: "var(--color-border)",
            margin: "4px 10px",
          }}
        />

        {/* Agents section */}
        <div style={{ paddingTop: "4px" }}>
          <div
            className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-ink4)" }}
          >
            Agents
          </div>

          {/* Prospecting Agent group */}
          <AgentGroup
            agentKey="prospecting"
            active={wsAgent === "prospecting"}
            open={prospOpen}
            onToggle={() => { setProspOpen(!prospOpen); router.push("/workspace/prospecting"); }}
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="4.5" r="2.5" stroke="#C8A97A" strokeWidth="1.2"/>
                <path d="M1.5 11.5c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#C8A97A" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            }
            label="Prospecting Agent"
            subs={[
              {
                id: "icp",
                label: "ICP Profiles",
                count: "3",
                active: navActive("icp"),
                icon: (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                ),
                onClick: () => router.push("/icp-profiles"),
              },
              {
                id: "leads",
                label: "Lead Lists",
                count: "5",
                active: navActive("leads"),
                icon: (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <rect x="1" y="1.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M3 5h5M3 7h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                ),
                onClick: () => router.push("/lead-lists"),
              },
            ]}
          />

          {/* Engagement Agent group */}
          <AgentGroup
            agentKey="engagement"
            active={wsAgent === "engagement"}
            open={engOpen}
            onToggle={() => { setEngOpen(!engOpen); router.push("/workspace/engagement"); }}
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 2h10M1.5 5h10M1.5 8h6" stroke="#C8A97A" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M9.5 8.5l2.5 2-2.5 2" stroke="#C8A97A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Engagement Agent"
            subs={[
              {
                id: "outreach",
                label: "Outreach Tracker",
                count: "4",
                active: navActive("outreach"),
                icon: (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1 5.5h9M6.5 1.5l4 4-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                onClick: () => router.push("/outreach-tracker"),
              },
              {
                id: "clay",
                label: "Clay Enrichment",
                active: navActive("clay"),
                icon: (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M3.5 5.5h4M5.5 3.5v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                ),
                onClick: () => router.push("/clay-enrichment"),
              },
              {
                id: "hubspot",
                label: "HubSpot CRM",
                active: navActive("hubspot"),
                icon: (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <rect x="1" y="3" width="3.5" height="3.5" rx=".8" stroke="currentColor" strokeWidth="1.1"/>
                    <rect x="6.5" y="6" width="3.5" height="3.5" rx=".8" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M4.5 5H6a1 1 0 0 1 1 1v0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                ),
                onClick: () => router.push("/hubspot-crm"),
              },
            ]}
          />
        </div>
      </div>

      {/* Settings section */}
      <div
        style={{
          borderTop: "0.5px solid var(--color-border)",
          paddingTop: "8px",
          paddingBottom: "4px",
        }}
      >
        <div
          className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: "var(--color-ink4)" }}
        >
          Settings
        </div>
        <NavRow
          active={navActive("integrations") && !isWS}
          onClick={() => router.push("/integrations")}
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="3" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8.5" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5.5 5H7a2 2 0 0 1 2 2v0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          }
          label="Integrations"
          badge="19"
        />
      </div>

      {/* User footer */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "0.5px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold shrink-0"
            style={{
              background: "var(--gold-dim, rgba(200,169,122,0.16))",
              color: "var(--color-amber)",
            }}
          >
            DS
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[13px] font-medium truncate"
              style={{ color: "var(--color-ink)" }}
            >
              Tyler Marshall
            </div>
            <div
              className="text-[11px] truncate"
              style={{ color: "var(--color-ink3)" }}
            >
              Admin · Neuvera Life
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NavRow sub-component ─────────────────────────────────────────────────────
function NavRow({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] relative transition-colors text-left"
      style={{
        color: active ? "var(--color-ink)" : "var(--color-ink2)",
        background: active ? "var(--color-gold-d, rgba(200,169,122,0.14))" : "transparent",
        borderLeft: active ? "2px solid var(--color-gold)" : "2px solid transparent",
        fontWeight: active ? 500 : 400,
        borderRadius: 0,
      }}
    >
      <span style={{ opacity: active ? 1 : 0.65 }}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={{
            background: "var(--color-s3)",
            color: "var(--color-ink3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── AgentGroup sub-component ─────────────────────────────────────────────────
function AgentGroup({
  agentKey,
  active,
  open,
  onToggle,
  icon,
  label,
  subs,
}: {
  agentKey: string;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
  subs: {
    id: string;
    label: string;
    count?: string;
    active: boolean;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}) {
  return (
    <div>
      {/* Agent header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2.5 py-2 transition-colors relative"
        style={{
          borderLeft: active ? "2px solid var(--color-gold)" : "2px solid transparent",
          background: active ? "var(--color-gold-d, rgba(200,169,122,0.14))" : "transparent",
        }}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
          style={{
            background: "#1E1C18",
            border: "0.5px solid #3A3530",
          }}
        >
          {icon}
        </div>
        <span
          className="flex-1 text-left text-[12.5px] font-medium"
          style={{ color: active ? "var(--color-ink)" : "var(--color-ink2)" }}
        >
          {label}
        </span>
        {/* Live dot */}
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--color-green)" }}
        />
      </button>

      {/* Sub items */}
      {(active || open || subs.some((s) => s.active)) && (
        <div>
          {subs.map((sub) => (
            <button
              key={sub.id}
              onClick={sub.onClick}
              className="w-full flex items-center gap-2 py-1.5 transition-colors"
              style={{
                paddingLeft: "28px",
                color: sub.active ? "var(--color-ink)" : "var(--color-ink3)",
                background: sub.active ? "var(--color-gold-d, rgba(200,169,122,0.1))" : "transparent",
                borderLeft: sub.active ? "2px solid var(--color-gold)" : "2px solid transparent",
                fontWeight: sub.active ? 500 : 400,
              }}
            >
              <span style={{ color: sub.active ? "var(--color-gold)" : "var(--color-ink4)" }}>{sub.icon}</span>
              <span className="flex-1 text-left text-[11.5px]">{sub.label}</span>
              {sub.count && (
                <span
                  className="text-[10px] mr-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: sub.active ? "var(--color-gold)" : "var(--color-ink4)",
                  }}
                >
                  {sub.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
