export type IntegrationCategory =
  | "Infrastructure"
  | "Sales & Outreach"
  | "Data & Enrichment"
  | "Ops & Finance";

export type IntegrationTier = "free" | "paid" | "mixed";
export type IntegrationStatus = "connected" | "disconnected";

export interface Integration {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: IntegrationCategory;
  tier: IntegrationTier;
  status: IntegrationStatus;
  costLabel: string;
  monthlyEstCost: number;
}
