/**
 * Two enqueue paths:
 *
 * enqueueUserJob — authenticated, inserts via the session Supabase client.
 *   RLS must allow the calling user to insert into pipeline_jobs for their org.
 *   Use for UI-triggered actions (send message, sync now, etc.)
 *
 * enqueueSystemJob — service-role insert, bypasses RLS.
 *   Use ONLY in webhook handlers, cron routes, and trusted server-only paths.
 *   Never call from a route that acts on behalf of a user session.
 */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { JobPayload } from "@/types/jobs";
import type { Json } from "@/types/database";

export type EnqueueOptions = {
  /** Higher value = higher priority. Default: 5. */
  priority?: number;
  /** ISO timestamp. Defaults to now. */
  scheduledAt?: string;
};

export async function enqueueUserJob(
  organizationId: string,
  payload: JobPayload,
  options: EnqueueOptions = {}
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pipeline_jobs")
    .insert({
      organization_id: organizationId,
      job_type: payload.job_type,
      payload: payload as unknown as Json,
      priority: options.priority ?? 5,
      scheduled_at: options.scheduledAt ?? new Date().toISOString(),
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw new Error(`enqueueUserJob failed: ${error.message}`);
  return data.id;
}

export async function enqueueSystemJob(
  organizationId: string,
  payload: JobPayload,
  options: EnqueueOptions = {}
): Promise<string> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("pipeline_jobs")
    .insert({
      organization_id: organizationId,
      job_type: payload.job_type,
      payload: payload as unknown as Json,
      priority: options.priority ?? 5,
      scheduled_at: options.scheduledAt ?? new Date().toISOString(),
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw new Error(`enqueueSystemJob failed: ${error.message}`);
  return data.id;
}
