import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapMessage } from "@/lib/utils/mappers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages: (data ?? []).map(mapMessage) });
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;

  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { role, content } = body as { role: string; content: string };
  if (!role || !content) return NextResponse.json({ error: "role and content required" }, { status: 400 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: id, organization_id: orgId, role, content })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: mapMessage(data) }, { status: 201 });
}
