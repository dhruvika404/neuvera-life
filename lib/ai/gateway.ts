/**
 * Model string helpers for Vercel AI Gateway.
 * Plain "provider/model" strings route through the gateway automatically.
 * Uses OIDC auth provisioned by `vercel env pull`.
 */

export const MODELS = {
  /** Primary chat/reasoning model */
  primary: "anthropic/claude-sonnet-4.6",
  /** Fast model for classification/scoring tasks */
  fast: "anthropic/claude-haiku-4.5",
  /** OpenAI fallback */
  openai: "openai/gpt-5.4",
} as const;

export type ModelKey = keyof typeof MODELS;

export function getModel(key: ModelKey = "primary"): string {
  return MODELS[key];
}
