import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { enqueueSystemJob } from "@/lib/jobs/enqueue";

/**
 * Vercel Cron — runs hourly.
 * Enqueues a sync job for every active HubSpot and Instantly integration.
 *
 * Protected by CRON_SECRET (set in Vercel env vars).
 * Vercel automatically sends this as the Authorization header when invoking crons.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  const expected = `Bearer ${cronSecret}`;
  if (
    !cronSecret ||
    !authHeader ||
    authHeader.length !== expected.length ||
    !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: integrations, error } = await admin
    .from("integration_accounts")
    .select("id, organization_id, provider")
    .eq("status", "active")
    .in("provider", ["hubspot", "instantly"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const enqueued: string[] = [];

  for (const integration of integrations ?? []) {
    const jobType =
      integration.provider === "hubspot" ? "sync_hubspot" : "sync_instantly";

    const jobId = await enqueueSystemJob(
      integration.organization_id,
      {
        job_type: jobType,
        integration_account_id: integration.id,
      },
      { priority: 3 }
    ).catch(() => null);

    if (jobId) enqueued.push(jobId);
  }

  return NextResponse.json({ enqueued: enqueued.length, jobIds: enqueued });
}
