import { tool } from "ai";
import { z } from "zod";

export const hubspotWriteTool = tool({
  description: "Create or update contacts in HubSpot CRM",
  inputSchema: z.object({
    leads: z.array(z.object({
      name: z.string(),
      email: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      stage: z.string().optional(),
    })).describe("Leads to sync to HubSpot"),
  }),
  execute: async (params) => {
    return {
      synced: params.leads.length,
      message: `Queued ${params.leads.length} contacts for HubSpot sync`,
    };
  },
});
