import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type IcpRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: IcpRouteContext) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("icp_profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Failed to fetch ICP profile" }, { status: 500 });
  }
}

export async function PATCH(_req: Request, { params }: IcpRouteContext) {
  const { id } = await params;
  try {
    const body = await _req.json();
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("icp_profiles")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error || !profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Failed to update ICP profile" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: IcpRouteContext) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("icp_profiles").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete ICP profile" }, { status: 500 });
  }
}
