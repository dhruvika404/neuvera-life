import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";

export async function GET() {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  // Get active integration accounts for syncable providers
  const { data: accounts } = await supabase
    .from("integration_accounts")
    .select("id, provider")
    .eq("organization_id", orgId)
    .in("provider", ["hubspot", "instantly"])
    .eq("status", "active");

  if (!accounts?.length) {
    return NextResponse.json({ syncStatuses: [] });
  }

  const accountIds = accounts.map((a) => a.id);
  const providerById = Object.fromEntries(accounts.map((a) => [a.id, a.provider]));

  // Get the most recent sync_run per integration_account_id
  const { data: runs } = await supabase
    .from("sync_runs")
    .select("integration_account_id, status, completed_at, created_at")
    .eq("organization_id", orgId)
    .in("integration_account_id", accountIds)
    .order("created_at", { ascending: false })
    .limit(50);

  // Deduplicate: keep only the latest per provider
  const latestByProvider = new Map<string, { provider: string; lastSyncedAt: string | null; status: string | null }>();
  for (const row of runs ?? []) {
    if (!row.integration_account_id) continue;
    const provider = providerById[row.integration_account_id];
    if (!provider) continue;
    if (!latestByProvider.has(provider)) {
      latestByProvider.set(provider, {
        provider,
        lastSyncedAt: row.completed_at ?? null,
        status: row.status,
      });
    }
  }

  return NextResponse.json({ syncStatuses: Array.from(latestByProvider.values()) });
}
