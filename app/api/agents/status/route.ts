import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { mapAgentRun } from "@/lib/utils/mappers";

export async function GET() {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  // Last 10 agent runs for the org
  const { data: runs, error } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (runs ?? []).map(mapAgentRun);

  const getStatus = (type: string) => {
    const run = mapped.find((r) => r.agentType === type);
    if (!run) return "idle";
    if (run.status === "running") return "running";
    if (run.status === "pending") return "queued";
    if (run.status === "failed") return "error";
    return "idle";
  };

  return NextResponse.json({
    runs: mapped,
    prospectingStatus: getStatus("prospecting"),
    engagementStatus: getStatus("engagement"),
  });
}
