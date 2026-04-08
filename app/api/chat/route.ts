import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";
import { generateUUID } from "@/lib/utils/uuid";

export const maxDuration = 60;

// AI SDK v6 UI Message Stream chunk types
// Transported via SSE: `data: {"type":"...","..."}\n\n`
// Header: x-vercel-ai-ui-message-stream: v1

interface StreamChunk {
  type: string;
  [key: string]: unknown;
}

interface StepDef {
  kind: "text" | "tool";
  content?: string;
  toolCallId?: string;
  toolName?: string;
  args?: unknown;
  result?: unknown;
}

const PROSPECTING_STEPS: StepDef[] = [
  {
    kind: "text",
    content:
      "I'll help you find the right leads. Let me start by searching Apollo for prospects matching your criteria.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_search_001",
    toolName: "search_apollo",
    args: {
      query: "VP Marketing health wellness SaaS",
      seniority: ["vp", "director"],
      industry: ["health_wellness", "saas"],
      limit: 50,
    },
    result: {
      total: 47,
      returned: 25,
      leads: [
        { name: "Sarah Chen", title: "VP of Marketing", company: "WellnessIQ", email: "s.chen@wellnessiq.com" },
        { name: "Marcus Thompson", title: "Director of Growth", company: "FitTech Pro", email: "m.thompson@fittechpro.com" },
        { name: "Priya Nair", title: "VP Marketing", company: "HealthBridge", email: "p.nair@healthbridge.io" },
        { name: "James Okoye", title: "VP Growth", company: "NutriFlow", email: "j.okoye@nutriflow.com" },
        { name: "Elena Vasquez", title: "Director of Marketing", company: "ActiveWell", email: "e.vasquez@activewell.co" },
      ],
    },
  },
  {
    kind: "text",
    content:
      "Found **47 prospects** matching your ICP. Now enriching profiles with Clay to get full contact data and LinkedIn signals.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_clay_002",
    toolName: "enrich_with_clay",
    args: {
      leadCount: 25,
      fields: ["linkedin_url", "phone", "funding_stage", "headcount", "technologies"],
    },
    result: {
      enriched: 23,
      failed: 2,
      fields_filled: ["linkedin_url", "phone", "headcount"],
      avg_completeness: 0.87,
    },
  },
  {
    kind: "text",
    content:
      "Enrichment complete — **23 leads** fully enriched. Running ICP scoring to qualify and rank.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_qualify_003",
    toolName: "qualify_leads",
    args: {
      criteria: {
        min_headcount: 50,
        max_headcount: 500,
        funding_stages: ["series_a", "series_b", "series_c"],
        min_icp_score: 70,
      },
    },
    result: {
      qualified: 18,
      disqualified: 5,
      avg_score: 82,
      top_leads: [
        { name: "Sarah Chen", company: "WellnessIQ", icp_score: 94 },
        { name: "Marcus Thompson", company: "FitTech Pro", icp_score: 88 },
        { name: "Priya Nair", company: "HealthBridge", icp_score: 85 },
      ],
    },
  },
  {
    kind: "text",
    content: "**18 leads** qualified (avg score: 82). Saving to your lead list.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_list_004",
    toolName: "create_lead_list",
    args: {
      name: "Health & Wellness VPs — March 2026",
      leadCount: 18,
      icpProfileId: "icp_001",
      tags: ["health", "vp_level", "series_a_c"],
    },
    result: {
      listId: "list_hv_march26",
      name: "Health & Wellness VPs — March 2026",
      leadCount: 18,
    },
  },
  {
    kind: "text",
    content: "Lead list created. Syncing contacts to HubSpot CRM.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_hubspot_005",
    toolName: "sync_to_hubspot",
    args: {
      listId: "list_hv_march26",
      dealStage: "prospecting",
      ownerEmail: "team@neuvera.life",
    },
    result: {
      synced: 18,
      created: 15,
      updated: 3,
      hubspotListId: "hs_list_4821",
    },
  },
  {
    kind: "text",
    content:
      "\n\n✅ **All done!** Here's your summary:\n\n- **18 qualified leads** saved to \"Health & Wellness VPs — March 2026\"\n- Avg ICP score: **82/100**\n- Synced to HubSpot (15 new contacts, 3 updated)\n\nTop picks: Sarah Chen (WellnessIQ, 94), Marcus Thompson (FitTech Pro, 88), Priya Nair (HealthBridge, 85). Ready to launch an outreach campaign?",
  },
];

const ENGAGEMENT_STEPS: StepDef[] = [
  {
    kind: "text",
    content:
      "I'll create a personalized outreach campaign for your lead list. Let me load the list first.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_load_001",
    toolName: "load_lead_list",
    args: { listId: "list_hv_march26", fields: ["name", "title", "company", "email", "linkedin_url"] },
    result: { listId: "list_hv_march26", name: "Health & Wellness VPs — March 2026", leadCount: 18, loaded: 18 },
  },
  {
    kind: "text",
    content: "Loaded **18 leads**. Generating a 3-touch email sequence with AI personalization.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_email_002",
    toolName: "generate_email_sequence",
    args: { touches: 3, tone: "consultative", personalization: ["company", "title", "industry"], subject_lines: true },
    result: {
      sequence: [
        { step: 1, subject: "Quick question about {company}'s growth strategy", delay_days: 0 },
        { step: 2, subject: "Following up — relevant case study for {title}s", delay_days: 3 },
        { step: 3, subject: "Last touch — worth a 15-min chat?", delay_days: 7 },
      ],
      avg_word_count: 87,
      personalization_tokens: 12,
    },
  },
  {
    kind: "text",
    content: "3-touch sequence generated. Creating campaign in Instantly.ai.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_campaign_003",
    toolName: "create_instantly_campaign",
    args: { name: "HW VPs Outreach — Mar 26", dailyLimit: 30, fromEmail: "team@neuvera.life" },
    result: { campaignId: "camp_hw_mar26", name: "HW VPs Outreach — Mar 26", status: "draft", instantlyCampaignId: "inst_8821" },
  },
  {
    kind: "text",
    content: "Campaign created. Adding leads and activating.\n\n",
  },
  {
    kind: "tool",
    toolCallId: "tc_activate_004",
    toolName: "activate_campaign",
    args: { campaignId: "camp_hw_mar26", leadListId: "list_hv_march26", activate: true },
    result: { status: "active", leadsAdded: 18, firstEmailsScheduled: 18, estimatedStartDate: "2026-04-01T09:00:00Z" },
  },
  {
    kind: "text",
    content:
      "\n\n🚀 **Campaign launched!**\n\n- **18 leads** enrolled in \"HW VPs Outreach — Mar 26\"\n- 3-touch sequence: Day 0, Day 3, Day 7\n- First emails send tomorrow at 9AM\n- Daily limit: 30 emails/day\n\nI'll track opens and replies and update you when responses come in.",
  },
];

const FOLLOWUP_TEXT =
  "I found the leads from your previous search. Would you like me to run another Apollo search with different criteria, or shall I proceed with enriching these further?\n\nCurrently you have **18 qualified leads** in \"Health & Wellness VPs — March 2026\" with an average ICP score of 82. I can also filter by funding stage or company size if you'd like to narrow the list.";

function sse(chunk: StreamChunk): string {
  return `data: ${JSON.stringify(chunk)}\n\n`;
}

async function createStream(
  steps: StepDef[],
  conversationId: string,
  orgId: string,
  userId: string
) {
  const encoder = new TextEncoder();
  const supabase = await createClient();

  return new ReadableStream({
    async start(controller) {
      const enqueue = (chunk: StreamChunk) => {
        controller.enqueue(encoder.encode(sse(chunk)));
      };

      const assistantMessageId = `msg_${Date.now()}`;

      // Start message
      enqueue({ type: "start", messageId: assistantMessageId });

      let textPartId = 0;
      let fullContent = "";
      const toolCalls: any[] = [];

      for (const step of steps) {
        if (step.kind === "text" && step.content) {
          const partId = `text_${textPartId++}`;
          fullContent += step.content;

          enqueue({ type: "text-start", id: partId });

          const chunks = step.content.match(/.{1,6}/g) ?? [step.content];
          for (const chunk of chunks) {
            enqueue({ type: "text-delta", id: partId, delta: chunk });
            await new Promise((r) => setTimeout(r, 15));
          }

          enqueue({ type: "text-end", id: partId });
        } else if (step.kind === "tool") {
          toolCalls.push({
            name: step.toolName,
            input: step.args,
            output: step.result,
            status: "done",
          });

          // Signal tool call started
          enqueue({
            type: "tool-input-start",
            toolCallId: step.toolCallId,
            toolName: step.toolName,
          });

          // Simulate tool input being streamed (500ms)
          await new Promise((r) => setTimeout(r, 500));

          // Tool input available (full args)
          enqueue({
            type: "tool-input-available",
            toolCallId: step.toolCallId,
            toolName: step.toolName,
            input: step.args,
          });

          // Simulate tool execution (600ms)
          await new Promise((r) => setTimeout(r, 600));

          // Tool output available
          enqueue({
            type: "tool-output-available",
            toolCallId: step.toolCallId,
            output: step.result,
          });

          await new Promise((r) => setTimeout(r, 100));
        }
      }

      // Finish message
      enqueue({ type: "finish", finishReason: "stop" });
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      const { error: msgError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        organization_id: orgId,
        role: "assistant",
        content: fullContent,
        user_id: userId,
        metadata: { tool_calls: toolCalls },
        created_at: new Date().toISOString(),
      });

      if (msgError) {
        console.error("Failed to save assistant message:", msgError);
      }

      controller.close();
    },
  });
}

export async function POST(req: Request) {
  let { messages, agentType = "prospecting", conversationId } = await req.json();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!conversationId || !uuidRegex.test(conversationId)) {
    conversationId = generateUUID();
  }

  const orgId = await getActiveOrgId();
  if (!orgId) return new Response("Unauthorized", { status: 401 });

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.id;

  const initialMessage = messages.find((m: any) => m.role === "user")?.content ?? "New Conversation";
  const { error: convError } = await supabase.from("conversations").upsert(
    {
      id: conversationId,
      organization_id: orgId,
      agent_type: agentType,
      user_id: user.id,
      title: initialMessage.slice(0, 50),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (convError) {
    console.error("Failed to upsert conversation:", convError);
  }

  const latestMessage = messages[messages.length - 1];
  if (latestMessage && latestMessage.role === "user") {
    const { error: userMsgError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      organization_id: orgId,
      user_id: user.id,
      role: "user",
      content: latestMessage.content,
      created_at: new Date().toISOString(),
    });

    if (userMsgError) {
      console.error("Failed to insert user message:", userMsgError);
    }
  }

  const userMessages = (messages ?? []).filter(
    (m: { role: string }) => m.role === "user"
  );
  const turnIndex = (userMessages.length - 1) % 3;

  let steps: StepDef[];
  if (agentType === "engagement") {
    steps = ENGAGEMENT_STEPS;
  } else if (turnIndex === 0) {
    steps = PROSPECTING_STEPS;
  } else {
    steps = [{ kind: "text", content: FOLLOWUP_TEXT }];
  }

  const stream = await createStream(steps, conversationId, orgId, userId);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
      "x-accel-buffering": "no",
    },
  });
}

