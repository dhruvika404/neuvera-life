import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ReadableRouteContext = { params: Promise<{ runId: string }> };

export async function GET(_request: NextRequest, { params }: ReadableRouteContext) {
  const { runId } = await params;
  try {
    const supabase = await createClient();
    const { data: run } = await supabase
      .from("agent_runs")
      .select("status, output_payload")
      .eq("id", runId)
      .single();
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }
    // Return current status as a single SSE event
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(run)}\n\n`));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
