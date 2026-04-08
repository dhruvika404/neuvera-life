"use client";
import { useState } from "react";
import useSWR from "swr";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationsSummaryBar } from "@/components/integrations/IntegrationsSummaryBar";
import { IntegrationFilterChips } from "@/components/integrations/IntegrationFilterChips";
import type { Integration } from "@/types/integration";
import { useToastsStore } from "@/store/toasts.store";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Matches HTML INTEGRATIONS array exactly (19 items)
const INTEGRATIONS: Integration[] = [
  // ─── Infrastructure (9) ──────────────────────────────────────────────────────
  { id: "claude",   name: "Claude API",        logo: "ANT", category: "Infrastructure",    description: "LLM inference for agents, analysis, and generation workflows.", tier: "paid",  status: "connected",    costLabel: "~$50–150/mo",          monthlyEstCost: 99  },
  { id: "n8n",      name: "N8N",               logo: "N8N", category: "Infrastructure",    description: "Workflow automation engine for orchestrating internal operations.", tier: "paid",  status: "connected",    costLabel: "~$20–50/mo",           monthlyEstCost: 35  },
  { id: "supabase", name: "Supabase",          logo: "SB",  category: "Infrastructure",    description: "Hosted Postgres, auth, and storage backend services.", tier: "mixed", status: "connected",    costLabel: "Free; ~$25+/mo",       monthlyEstCost: 25  },
  { id: "nextjs",   name: "Next.js",           logo: "NXT", category: "Infrastructure",    description: "Core web framework for product UI and server routes.", tier: "free",  status: "connected",    costLabel: "Free (open source)",   monthlyEstCost: 0   },
  { id: "python",   name: "Python",            logo: "PY",  category: "Infrastructure",    description: "Runtime for scripts, data processing, and AI tooling.", tier: "free",  status: "connected",    costLabel: "Free (open source)",   monthlyEstCost: 0   },
  { id: "do",       name: "DigitalOcean",      logo: "DO",  category: "Infrastructure",    description: "Cloud compute and networking for deployed backend services.", tier: "paid",  status: "connected",    costLabel: "~$24–100/mo",          monthlyEstCost: 62  },
  { id: "vercel",   name: "Vercel AI SDK",     logo: "VCL", category: "Infrastructure",    description: "Streaming AI SDK used for frontend and edge integrations.", tier: "mixed", status: "disconnected",  costLabel: "Free; ~$20+/mo",       monthlyEstCost: 0   },
  { id: "notion",   name: "Notion",            logo: "NTN", category: "Infrastructure",    description: "Knowledge base and documentation workspace integration.", tier: "paid",  status: "disconnected",  costLabel: "~$8–16/user/mo",       monthlyEstCost: 0   },
  { id: "google",   name: "Google Workspace",  logo: "GWS", category: "Infrastructure",    description: "Email, calendar, and shared docs for team operations.", tier: "paid",  status: "disconnected",  costLabel: "~$6–12/user/mo",       monthlyEstCost: 0   },
  // ─── Sales & Outreach (5) ────────────────────────────────────────────────────
  { id: "apollo",    name: "Apollo.io",        logo: "APO", category: "Sales & Outreach",  description: "Prospecting database and outbound contact enrichment platform.", tier: "paid",  status: "connected",    costLabel: "~$49–99/mo",           monthlyEstCost: 74  },
  { id: "instantly", name: "Instantly.ai",     logo: "INS", category: "Sales & Outreach",  description: "Cold email automation and campaign deliverability tooling.", tier: "paid",  status: "connected",    costLabel: "~$37–97/mo",           monthlyEstCost: 67  },
  { id: "heyreach",  name: "HeyReach",         logo: "HEY", category: "Sales & Outreach",  description: "LinkedIn outreach automation with inbox and sequence controls.", tier: "paid",  status: "connected",    costLabel: "~$79–159/mo",          monthlyEstCost: 119 },
  { id: "hubspot",   name: "HubSpot CRM",      logo: "HUB", category: "Sales & Outreach",  description: "CRM pipeline and lifecycle management for revenue teams.", tier: "mixed", status: "disconnected",  costLabel: "Free; ~$50–800/mo",    monthlyEstCost: 0   },
  { id: "linkedin",  name: "LinkedIn Premium", logo: "LIN", category: "Sales & Outreach",  description: "Sales networking access and lead discovery capabilities.", tier: "paid",  status: "disconnected",  costLabel: "~$40–100/mo per seat", monthlyEstCost: 0   },
  // ─── Data & Enrichment (2) ───────────────────────────────────────────────────
  { id: "clay",    name: "Clay",               logo: "CLY", category: "Data & Enrichment", description: "Data enrichment workflows and enrichment table orchestration.", tier: "paid",  status: "disconnected",  costLabel: "~$149–800/mo",         monthlyEstCost: 0   },
  { id: "modash",  name: "Modash",             logo: "MOD", category: "Data & Enrichment", description: "Influencer discovery and audience analytics dataset provider.", tier: "paid",  status: "disconnected",  costLabel: "~$299+/mo",            monthlyEstCost: 0   },
  // ─── Ops & Finance (3) ───────────────────────────────────────────────────────
  { id: "slack",   name: "Slack",              logo: "SLK", category: "Ops & Finance",     description: "Team communication and alert routing across operations.", tier: "mixed", status: "disconnected",  costLabel: "Free; ~$7.25/user/mo", monthlyEstCost: 0   },
  { id: "xero",    name: "Xero",               logo: "XRO", category: "Ops & Finance",     description: "Accounting, invoicing, and bookkeeping automation software.", tier: "paid",  status: "disconnected",  costLabel: "~$15–55/mo",           monthlyEstCost: 0   },
  { id: "stripe",  name: "Stripe",             logo: "STR", category: "Ops & Finance",     description: "Payment processing and subscription billing infrastructure.", tier: "mixed", status: "disconnected",  costLabel: "Free; 2.9% + 30¢",     monthlyEstCost: 0   },
];

// Providers that support background sync via pipeline_jobs
const SYNCABLE_PROVIDERS = ["hubspot", "instantly"] as const;
type SyncableProvider = (typeof SYNCABLE_PROVIDERS)[number];

function formatStaleness(dateStr: string | null | undefined): string {
  if (!dateStr) return "Never synced";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface SyncStatus {
  provider: string;
  lastSyncedAt: string | null;
  status: string | null;
}

export default function IntegrationsPage() {
  const { addToast } = useToastsStore();
  const [filter, setFilter] = useState("All");
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});

  const { data: syncData, mutate: mutateSyncData } = useSWR<{ syncStatuses: SyncStatus[] }>(
    "/api/integrations/sync-status",
    fetcher,
    { refreshInterval: 30000 }
  );

  const syncStatusMap = Object.fromEntries(
    (syncData?.syncStatuses ?? []).map((s) => [s.provider, s])
  );

  const filtered =
    filter === "All"
      ? INTEGRATIONS
      : filter === "Connected"
      ? INTEGRATIONS.filter((i) => i.status === "connected")
      : INTEGRATIONS.filter((i) => i.category === filter);

  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;
  const notConnected = INTEGRATIONS.filter((i) => i.status === "disconnected").length;
  const freeTier = INTEGRATIONS.filter((i) => i.tier === "free" || i.tier === "mixed").length;
  const estimatedCost = INTEGRATIONS.filter((i) => i.status === "connected").reduce(
    (sum, i) => sum + i.monthlyEstCost,
    0
  );

  async function handleSyncNow(provider: SyncableProvider) {
    setSyncing((prev) => ({ ...prev, [provider]: true }));
    try {
      const res = await fetch("/api/integrations/sync-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        addToast({ title: `${provider} sync queued`, type: "success" });
        mutateSyncData();
      } else {
        const json = await res.json();
        addToast({ title: json?.error ?? "Sync failed", type: "error" });
      }
    } catch {
      addToast({ title: "Sync request failed", type: "error" });
    } finally {
      setSyncing((prev) => ({ ...prev, [provider]: false }));
    }
  }

  return (
    <div className="px-6 py-6 space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: "var(--color-ink)", marginBottom: 2 }}
          >
            Integrations
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink3)" }}>
            All services powering NeuvéraNet · Track cost and connection status
          </p>
        </div>
        <button
          onClick={() => { mutateSyncData(); addToast({ title: "All connections refreshed", type: "success" }); }}
          style={{
            padding: "7px 16px",
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "var(--radius)",
            fontSize: 12.5,
            color: "var(--color-ink2)",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          Refresh All
        </button>
      </div>

      <IntegrationsSummaryBar
        connected={connected}
        notConnected={notConnected}
        freeTier={freeTier}
        estimatedCost={estimatedCost}
        total={INTEGRATIONS.length}
      />

      <IntegrationFilterChips
        active={filter}
        onChange={setFilter}
        total={INTEGRATIONS.length}
      />

      {/* Sync freshness bar for syncable integrations */}
      {SYNCABLE_PROVIDERS.some((p) => INTEGRATIONS.find((i) => i.id === p)?.status === "connected") && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "var(--radius)",
            padding: "10px 14px",
            display: "flex",
            gap: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 11.5, color: "var(--color-ink3)", fontWeight: 500 }}>
            Sync status
          </span>
          {SYNCABLE_PROVIDERS.map((provider) => {
            const integration = INTEGRATIONS.find((i) => i.id === provider);
            if (!integration || integration.status !== "connected") return null;
            const syncInfo = syncStatusMap[provider];
            const isSyncing = syncing[provider];
            return (
              <div key={provider} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--color-ink2)" }}>
                  {integration.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--color-ink4)" }}>
                  {formatStaleness(syncInfo?.lastSyncedAt)}
                </span>
                <button
                  onClick={() => handleSyncNow(provider)}
                  disabled={isSyncing}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "2px 8px",
                    background: "var(--color-s2)",
                    border: "0.5px solid var(--color-border)",
                    borderRadius: 4,
                    color: isSyncing ? "var(--color-ink4)" : "var(--color-ink2)",
                    cursor: isSyncing ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {isSyncing ? "Queuing…" : "Sync now"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
