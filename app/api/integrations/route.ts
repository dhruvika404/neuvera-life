import { NextResponse } from "next/server";
import type { Integration } from "@/types/integration";

const INTEGRATIONS: Integration[] = [
  { id: "vercel", name: "Vercel", logo: "VCL", description: "Hosting & deployment platform", category: "Infrastructure", tier: "paid", status: process.env.VERCEL_TOKEN ? "connected" : "disconnected", costLabel: "~$20+/mo", monthlyEstCost: process.env.VERCEL_TOKEN ? 20 : 0 },
  { id: "neon", name: "Neon Postgres", logo: "NEO", description: "Serverless Postgres database", category: "Infrastructure", tier: "paid", status: process.env.DATABASE_URL ? "connected" : "disconnected", costLabel: "~$19+/mo", monthlyEstCost: process.env.DATABASE_URL ? 19 : 0 },
  { id: "upstash", name: "Upstash Redis", logo: "UPS", description: "Serverless Redis for caching", category: "Infrastructure", tier: "paid", status: process.env.UPSTASH_REDIS_REST_URL ? "connected" : "disconnected", costLabel: "~$10+/mo", monthlyEstCost: process.env.UPSTASH_REDIS_REST_URL ? 10 : 0 },
  { id: "apollo", name: "Apollo.io", logo: "APO", description: "B2B contact database for prospecting", category: "Data & Enrichment", tier: "paid", status: process.env.APOLLO_API_KEY ? "connected" : "disconnected", costLabel: "~$99/mo", monthlyEstCost: process.env.APOLLO_API_KEY ? 99 : 0 },
  { id: "clay", name: "Clay", logo: "CLY", description: "Lead enrichment and data waterfall", category: "Data & Enrichment", tier: "paid", status: process.env.CLAY_API_KEY ? "connected" : "disconnected", costLabel: "~$149/mo", monthlyEstCost: process.env.CLAY_API_KEY ? 149 : 0 },
  { id: "hubspot", name: "HubSpot CRM", logo: "HUB", description: "CRM for contact and pipeline management", category: "Sales & Outreach", tier: "mixed", status: process.env.HUBSPOT_ACCESS_TOKEN ? "connected" : "disconnected", costLabel: "Free; ~$50+/mo", monthlyEstCost: process.env.HUBSPOT_ACCESS_TOKEN ? 50 : 0 },
  { id: "instantly", name: "Instantly.ai", logo: "INS", description: "Cold email outreach platform", category: "Sales & Outreach", tier: "paid", status: process.env.INSTANTLY_API_KEY ? "connected" : "disconnected", costLabel: "~$97/mo", monthlyEstCost: process.env.INSTANTLY_API_KEY ? 97 : 0 },
  { id: "anthropic", name: "Anthropic", logo: "ANT", description: "Claude models via AI Gateway", category: "Infrastructure", tier: "paid", status: "connected", costLabel: "Usage-based", monthlyEstCost: 50 },
  { id: "openai", name: "OpenAI", logo: "OAI", description: "GPT models via AI Gateway fallback", category: "Infrastructure", tier: "paid", status: "connected", costLabel: "Usage-based", monthlyEstCost: 30 },
  { id: "blob", name: "Vercel Blob", logo: "BLB", description: "File storage for exports and reports", category: "Infrastructure", tier: "mixed", status: process.env.BLOB_READ_WRITE_TOKEN ? "connected" : "disconnected", costLabel: "Free; usage-based", monthlyEstCost: process.env.BLOB_READ_WRITE_TOKEN ? 5 : 0 },
];

export async function GET() {
  const connectedCount = INTEGRATIONS.filter((i) => i.status === "connected").length;
  const disconnectedCount = INTEGRATIONS.filter((i) => i.status === "disconnected").length;
  const estimatedMonthlyCost = INTEGRATIONS
    .filter((i) => i.status === "connected" && i.monthlyEstCost)
    .reduce((sum, i) => sum + (i.monthlyEstCost ?? 0), 0);

  return NextResponse.json({
    integrations: INTEGRATIONS,
    connectedCount,
    disconnectedCount,
    estimatedMonthlyCost,
  });
}
