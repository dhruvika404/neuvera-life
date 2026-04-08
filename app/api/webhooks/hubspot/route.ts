import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enqueueSystemJob } from "@/lib/jobs/enqueue";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.HUBSPOT_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

type HubSpotEvent = {
  objectId: string;
  propertyName?: string;
  propertyValue?: string;
  eventType?: string;
  subscriptionType?: string;
  portalId?: number;
  eventId?: string | number;
};

const LIFECYCLE_STAGE_MAP: Record<string, string> = {
  lead: "new",
  marketingqualifiedlead: "qualified",
  salesqualifiedlead: "qualified",
  opportunity: "opportunity",
  customer: "closed_won",
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hubspot-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let events: HubSpotEvent[];
  try {
    const parsed = JSON.parse(rawBody);
    events = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Resolve org via portal_id from the first event
  const portalId = String(events[0]?.portalId ?? "");
  let orgId: string | null = null;
  if (portalId) {
    const { data: integration } = await admin
      .from("integration_accounts")
      .select("organization_id")
      .eq("provider", "hubspot")
      .contains("metadata", { portal_id: portalId })
      .maybeSingle();
    orgId = integration?.organization_id ?? null;
  }

  for (const event of events) {
    const eventType = event.subscriptionType ?? event.eventType ?? "unknown";
    const providerEventId = event.eventId ? String(event.eventId) : null;

    // Persist and deduplicate
    const { data: webhookEvent, error: insertError } = await admin
      .from("webhook_events")
      .insert({
        organization_id: orgId,
        provider: "hubspot",
        event_type: eventType,
        provider_event_id: providerEventId,
        raw_payload: event as unknown as import("@/types/database").Json,
        processing_status: "received",
      })
      .select("id")
      .single();

    // ON CONFLICT returns null — skip already-processed events
    if (insertError || !webhookEvent) continue;

    // Small state: lifecycle stage change → update lead directly
    if (
      eventType === "contact.propertyChange" &&
      event.propertyName === "lifecyclestage" &&
      event.propertyValue
    ) {
      const stage = LIFECYCLE_STAGE_MAP[event.propertyValue.toLowerCase()];
      if (stage && event.objectId) {
        await admin
          .from("leads")
          .update({ stage })
          .eq("hubspot_contact_id", event.objectId);

        await admin
          .from("webhook_events")
          .update({ processing_status: "processed", processed_at: new Date().toISOString() })
          .eq("id", webhookEvent.id);

        continue;
      }
    }

    // Complex events: enqueue a system job for the worker to handle
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
  }

  return NextResponse.json({ ok: true });
}
