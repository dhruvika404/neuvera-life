/**
 * @deprecated Legacy query helpers — will be replaced with org-scoped
 * Supabase queries in P1. Do not add new functionality here.
 */
import type { Json } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export async function getConversations(agentType?: string) {
  const supabase = await createClient();
  let query = supabase.from("conversations").select("*").order("updated_at", { ascending: false });
  if (agentType) query = query.eq("agent_type", agentType);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getConversationById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("conversations").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createConversation(data: {
  id: string;
  agentType: string;
  title?: string;
  icpId?: string;
}) {
  const supabase = await createClient();
  const { data: conv, error } = await supabase
    .from("conversations")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({ id: data.id, agent_type: data.agentType, title: data.title, icp_id: data.icpId } as any)
    .select()
    .single();
  if (error) throw error;
  return conv;
}

export async function updateConversationTokens(id: string, input: number, output: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("conversations")
    .update({ token_cost_input: input, token_cost_output: output, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function getMessagesByConversation(conversationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createMessage(data: {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  toolCallId?: string;
  artifactType?: string;
  artifactData?: unknown;
}) {
  const supabase = await createClient();
  const { data: msg, error } = await supabase
    .from("messages")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      id: data.id,
      conversation_id: data.conversationId,
      // organization_id is required by RLS — callers must be updated in P1
      organization_id: "",
      role: data.role,
      content: data.content,
      tool_call_id: data.toolCallId,
      artifact_type: data.artifactType,
      artifact_data: data.artifactData as Json | null,
    })
    .select()
    .single();
  if (error) throw error;
  return msg;
}
