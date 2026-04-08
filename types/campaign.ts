export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  instantlyCampaignId?: string | null;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  icpId?: string | null;
  leadListId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
