export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "meeting"
  | "closed"
  | "lost";

export interface Lead {
  id: string;
  name: string;
  email?: string | null;
  company?: string | null;
  title?: string | null;
  linkedinUrl?: string | null;
  stage: LeadStage;
  icpFit?: number | null;
  icpId?: string | null;
  hubspotContactId?: string | null;
  source?: string | null;
  enrichmentData?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
