import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enqueueSystemJob } from "@/lib/jobs/enqueue";
import { createHmac } from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.INSTANTLY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return `sha256=${expected}` === signature;
}

type InstantlyEvent = {
  event?: string;
  type?: string;
  campaign_id?: string;
  lead_email?: string;
  timestamp?: string;
  id?: string;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-instantly-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: InstantlyEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const admin = createAdminClient();
  const eventType = event.event ?? event.type ?? "unknown";
  const providerEventId = event.id ?? null;

  // Resolve org via campaign_id → integration_accounts
  let orgId: string | null = null;
  if (event.campaign_id) {
    const { data: campaign } = await admin
      .from("campaigns")
      .select("organization_id")
      .eq("instantly_campaign_id", event.campaign_id)
      .maybeSingle();
    orgId = campaign?.organization_id ?? null;
  }

  // Persist and deduplicate
  const { data: webhookEvent, error: insertError } = await admin
    .from("webhook_events")
    .insert({
      organization_id: orgId,
      provider: "instantly",
      event_type: eventType,
      provider_event_id: providerEventId ? String(providerEventId) : null,
      raw_payload: event as unknown as import("@/types/database").Json,
      processing_status: "received",
    })
    .select("id")
    .single();

  // ON CONFLICT (dedup) — skip duplicate
  if (insertError || !webhookEvent) {
    return NextResponse.json({ ok: true });
  }

  // Small state: email metrics → update campaign counters directly
  if (event.campaign_id) {
    if (eventType === "email.opened") {
      const { data: camp } = await admin
        .from("campaigns")
        .select("emails_opened")
        .eq("instantly_campaign_id", event.campaign_id)
        .single();
      if (camp) {
        await admin
          .from("campaigns")
          .update({ emails_opened: (camp.emails_opened ?? 0) + 1 })
          .eq("instantly_campaign_id", event.campaign_id);
      }
      await admin
        .from("webhook_events")
        .update({ processing_status: "processed", processed_at: new Date().toISOString() })
        .eq("id", webhookEvent.id);
      return NextResponse.json({ ok: true });
    }

    if (eventType === "email.replied") {
      const { data: camp } = await admin
        .from("campaigns")
        .select("emails_replied")
        .eq("instantly_campaign_id", event.campaign_id)
        .single();
      if (camp) {
        await admin
          .from("campaigns")
          .update({ emails_replied: (camp.emails_replied ?? 0) + 1 })
          .eq("instantly_campaign_id", event.campaign_id);
      }
      await admin
        .from("webhook_events")
        .update({ processing_status: "processed", processed_at: new Date().toISOString() })
        .eq("id", webhookEvent.id);
      return NextResponse.json({ ok: true });
    }
  }

  // Complex events: enqueue for worker
  if (orgId) {
    const jobId = await enqueueSystemJob(orgId, {
      job_type: "process_webhook",
      webhook_event_id: webhookEvent.id,
    }).catch(() => null);

    if (jobId) {
      await admin
        .from("webhook_events")
        .update({ pipeline_job_id: jobId })
        .eq("id", webhookEvent.id);
    }
  }

  return NextResponse.json({ ok: true });
}
