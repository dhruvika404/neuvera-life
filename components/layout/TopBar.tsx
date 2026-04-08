"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToastsStore } from "@/store/toasts.store";

const BREADCRUMBS: Record<string, string> = {
  "/": "Dashboard",
  "/agents": "Agent Monitor",
  "/integrations": "Integrations",
  "/icp-profiles": "ICP Profiles",
  "/lead-lists": "Lead Lists",
  "/outreach-tracker": "Outreach Tracker",
  "/clay-enrichment": "Clay Enrichment",
  "/hubspot-crm": "HubSpot CRM",
  "/workspace/prospecting": "Prospecting Agent",
  "/workspace/engagement": "Engagement Agent",
};

const NOTIFICATIONS = [
  { text: "Wave 1 hit 60% open rate", type: "success" as const },
  { text: "Enrichment queue paused", type: "warning" as const },
  { text: "8 new leads discovered", type: "info" as const },
];

// ─── Brand SVG mark (4-rect grid, matches HTML) ──────────────────────────────
function BrandMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="#C8A97A" />
      <rect x="9" y="2" width="5" height="5" rx="1" fill="#C8A97A" opacity=".5" />
      <rect x="2" y="9" width="5" height="5" rx="1" fill="#C8A97A" opacity=".5" />
      <rect x="9" y="9" width="5" height="5" rx="1" fill="#C8A97A" />
    </svg>
  );
}

// ─── Bell SVG ─────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1a4 4 0 0 1 4 4v2l1 2H2l1-2V5a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 9.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

// ─── Pulse dot ────────────────────────────────────────────────────────────────
function PulseDot() {
  return (
    <span style={{ position: "relative", width: 8, height: 8, flexShrink: 0, display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "var(--color-green)",
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: "50%",
          border: "1.5px solid var(--color-green)",
          animation: "pulse-ring 2s ease-out infinite",
          opacity: 0,
        }}
      />
    </span>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToastsStore();

  const breadcrumb = BREADCRUMBS[pathname] ?? "Dashboard";

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      style={{
        height: "var(--topbar-h)",
        background: "var(--color-surface)",
        borderBottom: "0.5px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 0,
        zIndex: 100,
      }}
    >
      {/* ── Brand (sidebar-width, right border) ── */}
      <div
        onClick={() => addToast({ title: "NeuvéraNet v1.0", type: "info" })}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          width: "var(--sidebar-w)",
          paddingRight: 14,
          borderRight: "0.5px solid var(--color-border)",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "var(--color-ink)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <BrandMark />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15,
              color: "var(--color-ink)",
              lineHeight: 1.1,
            }}
          >
            NeuvéraNet
          </div>
          <div
            style={{
              fontSize: 9,
              color: "var(--color-gold)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            by Neuvéra
          </div>
        </div>
      </div>

      {/* ── Breadcrumb (left-aligned, 20px from brand) ── */}
      <div
        style={{
          marginLeft: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
        }}
      >
        <span style={{ color: "var(--color-ink3)" }}>Sales OS</span>
        <span style={{ color: "var(--color-border)" }}>›</span>
        <span style={{ color: "var(--color-ink2)", fontWeight: 500 }}>
          {breadcrumb}
        </span>
      </div>

      {/* ── Right side ── */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Live pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--color-green-bg)",
            border: "0.5px solid var(--color-green-b, #B8DFD0)",
            borderRadius: 20,
            padding: "4px 11px 4px 8px",
            fontSize: 11.5,
            color: "var(--color-green)",
            fontWeight: 500,
            cursor: "default",
          }}
        >
          <PulseDot />
          2 agents live
        </div>

        {/* Notification button + dropdown */}
        <div ref={notifRef} style={{ position: "relative", display: "inline-flex" }}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              background: "var(--color-s2)",
              border: "0.5px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              transition: "all .15s",
              color: "var(--color-ink3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-s3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-s2)")}
          >
            <BellIcon />
            {/* Red notification dot */}
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--color-red)",
                border: "1.5px solid var(--color-surface)",
              }}
            />
          </button>

          {/* Notifications dropdown */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 5px)",
              right: 0,
              minWidth: 220,
              background: "var(--color-surface)",
              border: "0.5px solid var(--color-border)",
              borderRadius: 6,
              zIndex: 500,
              opacity: notifOpen ? 1 : 0,
              pointerEvents: notifOpen ? "all" : "none",
              transform: notifOpen ? "translateY(0)" : "translateY(-4px)",
              transition: "all .15s",
              boxShadow: "0 4px 16px rgba(0,0,0,.07)",
            }}
          >
            <div
              style={{
                padding: "6px 12px 4px",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-ink4)",
                fontWeight: 600,
              }}
            >
              Notifications
            </div>
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.text}
                onClick={() => { addToast({ title: n.text, type: n.type }); setNotifOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "var(--color-ink2)",
                  cursor: "pointer",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-s2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {n.text}
              </div>
            ))}
            <div style={{ height: "0.5px", background: "var(--color-border)", margin: "3px 0" }} />
            <div
              onClick={() => { addToast({ title: "Notifications cleared", type: "info" }); setNotifOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "var(--color-ink2)",
                cursor: "pointer",
                transition: "background .1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-s2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Clear all
            </div>
          </div>
        </div>

        {/* Avatar button + dropdown */}
        <div ref={userRef} style={{ position: "relative", display: "inline-flex" }}>
          <button
            onClick={() => { setUserOpen((o) => !o); setNotifOpen(false); }}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--color-ink)",
              border: "0.5px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--color-gold)",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              transition: "all .15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
          >
            TM
          </button>

          {/* User dropdown */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 5px)",
              right: 0,
              minWidth: 176,
              background: "var(--color-surface)",
              border: "0.5px solid var(--color-border)",
              borderRadius: 6,
              zIndex: 500,
              opacity: userOpen ? 1 : 0,
              pointerEvents: userOpen ? "all" : "none",
              transform: userOpen ? "translateY(0)" : "translateY(-4px)",
              transition: "all .15s",
              boxShadow: "0 4px 16px rgba(0,0,0,.07)",
            }}
          >
            <div
              style={{
                padding: "6px 12px 4px",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-ink4)",
                fontWeight: 600,
              }}
            >
              Tyler Marshall
            </div>
            {[
              { label: "View Profile", action: () => setUserOpen(false) },
              { label: "Integrations", action: () => { router.push("/integrations"); setUserOpen(false); } },
            ].map((item) => (
              <div
                key={item.label}
                onClick={item.action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "var(--color-ink2)",
                  cursor: "pointer",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-s2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {item.label}
              </div>
            ))}
            <div style={{ height: "0.5px", background: "var(--color-border)", margin: "3px 0" }} />
            <div
              onClick={async () => { 
                setUserOpen(false); 
                addToast({ title: "Signing out...", type: "info" });
                try {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/login");
                  router.refresh();
                } catch (error) {
                  console.error(error);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "var(--color-red)",
                cursor: "pointer",
                transition: "background .1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-red-bg, #FDECEC)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
