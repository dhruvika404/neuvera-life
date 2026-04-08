import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapLead } from "@/lib/utils/mappers";

export async function GET(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const search = searchParams.get("search");
  const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 200);
  const offset = Number(searchParams.get("offset") ?? "0");

  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (stage) query = query.eq("stage", stage);
  if (search) query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ leads: (data ?? []).map(mapLead), total: count ?? 0 });
}

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      organization_id: orgId,
      first_name: body.firstName ?? null,
      last_name: body.lastName ?? null,
      name: body.name ?? null,
      email: body.email ?? null,
      company: body.company ?? null,
      title: body.title ?? null,
      linkedin_url: body.linkedinUrl ?? null,
      source: body.source ?? "manual",
      stage: body.stage ?? "new",
      icp_id: body.icpId ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ lead: mapLead(data) }, { status: 201 });
}
