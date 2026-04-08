import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapConversation } from "@/lib/utils/mappers";

export async function GET(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const agentType = searchParams.get("agentType");

  const supabase = await createClient();

  let query = supabase
    .from("conversations")
    .select("*")
    .eq("organization_id", orgId)
    .order("updated_at", { ascending: false });

  if (agentType) query = query.eq("agent_type", agentType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ conversations: (data ?? []).map(mapConversation) });
}

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      organization_id: orgId,
      agent_type: body.agentType ?? "prospecting",
      title: body.title ?? null,
      lead_id: body.leadId ?? null,
      campaign_id: body.campaignId ?? null,
      icp_id: body.icpId ?? null,
      status: "open",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ conversation: mapConversation(data) }, { status: 201 });
}
