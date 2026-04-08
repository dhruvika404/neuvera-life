import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { agentType, conversationId, inputPayload } = await req.json();

  if (!agentType) {
    return NextResponse.json({ error: "agentType required" }, { status: 400 });
  }

  const runId = `run_${Date.now()}`;
  const run = {
    id: runId,
    agentType,
    conversationId: conversationId ?? null,
    inputPayload: inputPayload ?? {},
    status: "running",
    startedAt: new Date().toISOString(),
    steps: [
      { step: "validateIcp", status: "running" },
    ],
  };

  return NextResponse.json({ run, runId }, { status: 201 });
}
