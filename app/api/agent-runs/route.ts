import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapAgentRun } from "@/lib/utils/mappers";

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { conversationId, agentType } = body as { conversationId: string; agentType?: string };
  if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agent_runs")
    .insert({
      conversation_id: conversationId,
      organization_id: orgId,
      agent_type: agentType ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ agentRun: mapAgentRun(data) }, { status: 201 });
}
