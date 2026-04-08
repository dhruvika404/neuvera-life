import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { enqueueUserJob } from "@/lib/jobs/enqueue";

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { provider } = body as { provider: unknown };
  const VALID_PROVIDERS = ["hubspot", "instantly"] as const;
  if (!provider || !VALID_PROVIDERS.includes(provider as (typeof VALID_PROVIDERS)[number])) {
    return NextResponse.json({ error: "provider must be 'hubspot' or 'instantly'" }, { status: 400 });
  }
  const validatedProvider = provider as (typeof VALID_PROVIDERS)[number];

  const supabase = await createClient();

  // Find the integration account for this provider
  const { data: account, error } = await supabase
    .from("integration_accounts")
    .select("id")
    .eq("organization_id", orgId)
    .eq("provider", validatedProvider)
    .eq("status", "active")
    .limit(1)
    .single();

  if (error || !account) {
    return NextResponse.json({ error: "No active integration found for this provider" }, { status: 404 });
  }

  const jobType = validatedProvider === "hubspot" ? "sync_hubspot" : "sync_instantly";
  const jobId = await enqueueUserJob(orgId, {
    job_type: jobType,
    integration_account_id: account.id,
  });

  return NextResponse.json({ jobId }, { status: 201 });
}
