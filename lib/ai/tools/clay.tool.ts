import { tool } from "ai";
import { z } from "zod";

export const clayEnrichTool = tool({
  description: "Enrich leads with additional data via Clay (LinkedIn, company info, intent signals)",
  inputSchema: z.object({
    leads: z.array(z.object({
      name: z.string(),
      company: z.string().optional(),
      linkedinUrl: z.string().optional(),
      email: z.string().optional(),
    })).describe("Leads to enrich"),
  }),
  execute: async (params) => {
    return {
      enriched: params.leads.length,
      message: `Queued ${params.leads.length} leads for Clay enrichment`,
    };
  },
});
