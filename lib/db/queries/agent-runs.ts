/**
 * @deprecated Legacy query helpers — will be replaced with org-scoped
 * Supabase queries in P1. Do not add new functionality here.
 */
import type { Json } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export async function createAgentRun(data: {
  id: string;
  agentType: string;
  conversationId?: string;
  inputPayload?: unknown;
}) {
  const supabase = await createClient();
  const { data: run, error } = await supabase
    .from("agent_runs")
    .insert({
      id: data.id,
      agent_type: data.agentType,
      conversation_id: data.conversationId,
      input_payload: data.inputPayload as Json | null,
      status: "queued",
      // organization_id is required by RLS — callers must be updated in P1
      organization_id: "",
    })
    .select()
    .single();
  if (error) throw error;
  return run;
}

export async function updateAgentRun(
  id: string,
  data: Partial<{
    status: string;
    outputPayload: unknown;
    errorMessage: string;
    startedAt: Date;
    completedAt: Date;
  }>
) {
  const supabase = await createClient();
  const payload: Record<string, unknown> = {};
  if (data.status !== undefined) payload.status = data.status;
  if (data.outputPayload !== undefined) payload.output_payload = data.outputPayload;
  if (data.errorMessage !== undefined) payload.error_message = data.errorMessage;
  if (data.startedAt !== undefined) payload.started_at = data.startedAt.toISOString();
  if (data.completedAt !== undefined) payload.completed_at = data.completedAt.toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: run, error } = await supabase
    .from("agent_runs")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(payload as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return run;
}

export async function getRecentAgentRuns(agentType?: string, limit = 10) {
  const supabase = await createClient();
  let query = supabase
    .from("agent_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (agentType) query = query.eq("agent_type", agentType);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
