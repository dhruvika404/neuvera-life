import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapIcpProfile } from "@/lib/utils/mappers";

export async function GET() {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("icp_profiles")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ icps: (data ?? []).map(mapIcpProfile) });
}

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("icp_profiles")
    .insert({
      organization_id: orgId,
      name: body.name,
      description: body.description ?? null,
      criteria: body.criteria ?? {},
      apollo_filters: body.apolloFilters ?? null,
      is_active: body.isActive ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ icp: mapIcpProfile(data) }, { status: 201 });
}
