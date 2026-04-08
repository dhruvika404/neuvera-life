import { tool } from "ai";
import { z } from "zod";

export const icpGeneratorTool = tool({
  description: "Generate a structured ICP (Ideal Customer Profile) from a user description",
  inputSchema: z.object({
    description: z.string().describe("User's description of their ideal customer"),
    name: z.string().optional().describe("Name for this ICP profile"),
  }),
  execute: async (params) => {
    // The LLM will generate structured ICP data based on the description
    // This tool primarily signals intent; actual generation happens via structured output
    return {
      name: params.name ?? "New ICP Profile",
      description: params.description,
      message: "Generating structured ICP profile...",
    };
  },
});
