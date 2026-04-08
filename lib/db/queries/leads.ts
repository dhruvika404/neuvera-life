/**
 * @deprecated Legacy query helpers — will be replaced with org-scoped
 * Supabase queries in P1. Do not add new functionality here.
 */
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

export async function getLeads(filters?: {
  stage?: string;
  icpId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters?.limit ?? 50)
    .range(filters?.offset ?? 0, (filters?.offset ?? 0) + (filters?.limit ?? 50) - 1);

  if (filters?.stage) query = query.eq("stage", filters.stage);
  if (filters?.icpId) query = query.eq("icp_id", filters.icpId);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getLeadById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createLead(data: LeadInsert) {
  const supabase = await createClient();
  const { data: lead, error } = await supabase.from("leads").insert(data).select().single();
  if (error) throw error;
  return lead;
}

export async function updateLead(id: string, data: LeadUpdate) {
  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return lead;
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
