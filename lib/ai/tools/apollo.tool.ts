import { tool } from "ai";
import { z } from "zod";

export const apolloSearchTool = tool({
  description: "Search for prospects on Apollo.io based on ICP criteria",
  inputSchema: z.object({
    titles: z.array(z.string()).describe("Job titles to target"),
    industries: z.array(z.string()).optional().describe("Industries to filter by"),
    companySizes: z.array(z.string()).optional().describe("Company size ranges (e.g. '11-50', '51-200')"),
    locations: z.array(z.string()).optional().describe("Countries or cities"),
    keywords: z.array(z.string()).optional().describe("Keywords to include"),
    limit: z.number().min(1).max(100).default(50).describe("Max results to return"),
  }),
  execute: async (params) => {
    // Integration implemented in lib/integrations/apollo.ts
    // Returns mock data in dev; replace with real API call
    return {
      leads: [],
      total: 0,
      message: `Apollo search queued for ${params.titles.join(", ")} — ${params.limit} results requested`,
    };
  },
});
