import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapCampaign } from "@/lib/utils/mappers";

export async function GET() {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ campaigns: (data ?? []).map(mapCampaign) });
}

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      organization_id: orgId,
      name: body.name,
      status: "draft",
      lead_list_id: body.leadListId ?? null,
      instantly_campaign_id: body.instantlyCampaignId ?? null,
      settings: body.settings ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ campaign: mapCampaign(data) }, { status: 201 });
}
