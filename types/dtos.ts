/**
 * Application-layer DTOs — camelCase.
 *
 * Components and server actions use these types exclusively.
 * Conversion from/to snake_case DB rows happens only in lib/utils/mappers.ts.
 */

export type OrganizationDto = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileDto = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMembershipDto = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
};

export type LeadDto = {
  id: string;
  organizationId: string;
  firstName: string | null;
  lastName: string | null;
  /** Denormalized display name (legacy compat column). */
  name: string | null;
  email: string | null;
  company: string | null;
  title: string | null;
  linkedinUrl: string | null;
  enrichmentData: Record<string, unknown> | null;
  enrichedAt: string | null;
  hubspotContactId: string | null;
  source: string | null;
  /** Legacy compat columns from 013_current_code_compatibility. */
  stage: string | null;
  icpId: string | null;
  icpFit: number | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadListDto = {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  filters: Record<string, unknown> | null;
  leadCount: number;
  createdBy: string | null;
  createdAt: string;
};

export type CampaignDto = {
  id: string;
  organizationId: string;
  name: string;
  status: string;
  instantlyCampaignId: string | null;
  leadListId: string | null;
  settings: Record<string, unknown> | null;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationDto = {
  id: string;
  organizationId: string;
  leadId: string | null;
  campaignId: string | null;
  agentType: string | null;
  title: string | null;
  status: string;
  /** Legacy compat column. */
  icpId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MessageDto = {
  id: string;
  conversationId: string;
  organizationId: string;
  role: "user" | "assistant" | "system";
  content: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type AgentRunDto = {
  id: string;
  organizationId: string;
  conversationId: string | null;
  pipelineJobId: string | null;
  status: "pending" | "running" | "done" | "failed";
  /** Legacy compat column. */
  agentType: string | null;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  result: Record<string, unknown> | null;
  createdAt: string;
};

export type IntegrationAccountDto = {
  id: string;
  organizationId: string;
  provider: "hubspot" | "instantly" | "apollo" | "clay";
  status: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type SyncRunDto = {
  id: string;
  organizationId: string;
  integrationAccountId: string | null;
  jobType: string;
  status: "pending" | "running" | "done" | "failed";
  syncedCount: number;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type PipelineJobDto = {
  id: string;
  organizationId: string;
  createdBy: string | null;
  jobType: string;
  status: "pending" | "claimed" | "running" | "done" | "failed" | "dead";
  priority: number;
  payload: Record<string, unknown>;
  scheduledAt: string;
  attemptCount: number;
  leaseExpiresAt: string | null;
  workerId: string | null;
  resultArtifactId: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArtifactDto = {
  id: string;
  organizationId: string;
  jobId: string | null;
  artifactType: string;
  storagePath: string;
  mimeType: string | null;
  sizeBytes: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type WebhookEventDto = {
  id: string;
  organizationId: string | null;
  provider: string;
  eventType: string | null;
  providerEventId: string | null;
  rawPayload: Record<string, unknown>;
  processingStatus: "received" | "processed" | "failed" | "skipped";
  pipelineJobId: string | null;
  receivedAt: string;
  processedAt: string | null;
};

export type IcpProfileDto = {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  criteria: Record<string, unknown>;
  apolloFilters: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
