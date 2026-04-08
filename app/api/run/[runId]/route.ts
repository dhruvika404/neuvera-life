import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RunRouteContext = { params: Promise<{ runId: string }> };

export async function GET(_request: Request, { params }: RunRouteContext) {
  const { runId } = await params;
  try {
    const supabase = await createClient();
    const { data: run, error } = await supabase
      .from("agent_runs")
      .select("*")
      .eq("id", runId)
      .single();
    if (error || !run) {
      return NextResponse.json(
        { ok: false, error: { code: "RUN_NOT_FOUND", message: `Run ${runId} not found` } },
        { status: 404 }
      );
    }
    return NextResponse.json({
      runId,
      status: run.status,
      agentType: run.agent_type,
      createdAt: run.created_at,
      startedAt: run.started_at ?? null,
      completedAt: run.completed_at ?? null,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "RUN_UNAVAILABLE", message: `Run ${runId} is unavailable` } },
      { status: 503 }
    );
  }
}
