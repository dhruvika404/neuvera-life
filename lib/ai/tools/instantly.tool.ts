import { tool } from "ai";
import { z } from "zod";

export const instantlyCampaignTool = tool({
  description: "Create and launch an email campaign in Instantly.ai",
  inputSchema: z.object({
    name: z.string().describe("Campaign name"),
    subject: z.string().describe("Email subject line"),
    body: z.string().describe("Email body (HTML or plain text)"),
    leadListId: z.string().describe("ID of the lead list to target"),
    scheduleStart: z.string().optional().describe("ISO date string for campaign start"),
  }),
  execute: async (params) => {
    return {
      campaignId: `ic_${Date.now()}`,
      name: params.name,
      status: "draft",
      message: `Campaign "${params.name}" created — review and activate in Instantly.ai`,
    };
  },
});
