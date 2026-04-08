import { NextResponse } from "next/server";
import { getActiveOrgId } from "@/lib/db";
import { enqueueUserJob } from "@/lib/jobs/enqueue";
import type { JobPayload } from "@/types/jobs";

export async function POST(req: Request) {
  const orgId = await getActiveOrgId();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as JobPayload;
  if (!body?.job_type) return NextResponse.json({ error: "job_type required" }, { status: 400 });

  const jobId = await enqueueUserJob(orgId, body);

  return NextResponse.json({ jobId }, { status: 201 });
}
