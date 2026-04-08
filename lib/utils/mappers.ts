/**
 * Single mapper boundary: DB snake_case rows → camelCase DTOs.
 *
 * Components and API responses use DTOs exclusively.
 * Raw DB rows must never escape this file into UI code.
 */

import type { Database } from "@/types/database";
import type {
  LeadDto,
  LeadListDto,
  CampaignDto,
  ConversationDto,
  MessageDto,
  AgentRunDto,
  IntegrationAccountDto,
  SyncRunDto,
  PipelineJobDto,
  ArtifactDto,
  WebhookEventDto,
  IcpProfileDto,
} from "@/types/dtos";

type Tables = Database["public"]["Tables"];

export function mapLead(row: Tables["leads"]["Row"]): LeadDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    firstName: row.first_name,
    lastName: row.last_name,
    // legacy compatibility: name = first_name + last_name or the denormalized name column
    name: row.name ?? ([row.first_name, row.last_name].filter(Boolean).join(" ") || null),
    email: row.email,
    company: row.company,
    title: row.title,
    linkedinUrl: row.linkedin_url,
    enrichmentData: row.enrichment_data as Record<string, unknown> | null,
    enrichedAt: row.enriched_at,
    hubspotContactId: row.hubspot_contact_id,
    source: row.source,
    stage: row.stage,
    icpId: row.icp_id,
    icpFit: row.icp_fit,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapLeadList(row: Tables["lead_lists"]["Row"]): LeadListDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    description: row.description,
    filters: row.filters as Record<string, unknown> | null,
    leadCount: row.lead_count,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function mapCampaign(row: Tables["campaigns"]["Row"]): CampaignDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    status: row.status,
    instantlyCampaignId: row.instantly_campaign_id,
    leadListId: row.lead_list_id,
    settings: row.settings as Record<string, unknown> | null,
    emailsSent: row.emails_sent,
    emailsOpened: row.emails_opened,
    emailsReplied: row.emails_replied,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapConversation(row: Tables["conversations"]["Row"]): ConversationDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    leadId: row.lead_id,
    campaignId: row.campaign_id,
    agentType: row.agent_type,
    title: row.title,
    status: row.status,
    icpId: row.icp_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessage(row: Tables["messages"]["Row"]): MessageDto {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    organizationId: row.organization_id,
    role: row.role as "user" | "assistant" | "system",
    content: row.content,
    metadata: row.metadata as Record<string, unknown> | null,
    createdAt: row.created_at,
  };
}

export function mapAgentRun(row: Tables["agent_runs"]["Row"]): AgentRunDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    conversationId: row.conversation_id,
    pipelineJobId: row.pipeline_job_id,
    status: row.status as AgentRunDto["status"],
    agentType: row.agent_type,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    error: row.error,
    result: row.result as Record<string, unknown> | null,
    createdAt: row.created_at,
  };
}

export function mapIntegrationAccount(
  row: Tables["integration_accounts"]["Row"]
): IntegrationAccountDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    provider: row.provider as IntegrationAccountDto["provider"],
    status: row.status,
    metadata: row.metadata as Record<string, unknown> | null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSyncRun(row: Tables["sync_runs"]["Row"]): SyncRunDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    integrationAccountId: row.integration_account_id,
    jobType: row.job_type,
    status: row.status as SyncRunDto["status"],
    syncedCount: row.synced_count,
    error: row.error,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}

export function mapPipelineJob(row: Tables["pipeline_jobs"]["Row"]): PipelineJobDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    createdBy: row.created_by,
    jobType: row.job_type,
    status: row.status as PipelineJobDto["status"],
    priority: row.priority,
    payload: row.payload as Record<string, unknown>,
    scheduledAt: row.scheduled_at,
    attemptCount: row.attempt_count,
    leaseExpiresAt: row.lease_expires_at,
    workerId: row.worker_id,
    resultArtifactId: row.result_artifact_id,
    lastError: row.last_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapArtifact(row: Tables["artifacts"]["Row"]): ArtifactDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    jobId: row.job_id,
    artifactType: row.artifact_type,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    metadata: row.metadata as Record<string, unknown> | null,
    createdAt: row.created_at,
  };
}

export function mapWebhookEvent(row: Tables["webhook_events"]["Row"]): WebhookEventDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    provider: row.provider,
    eventType: row.event_type,
    providerEventId: row.provider_event_id,
    rawPayload: row.raw_payload as Record<string, unknown>,
    processingStatus: row.processing_status as WebhookEventDto["processingStatus"],
    pipelineJobId: row.pipeline_job_id,
    receivedAt: row.received_at,
    processedAt: row.processed_at,
  };
}

export function mapIcpProfile(row: Tables["icp_profiles"]["Row"]): IcpProfileDto {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    description: row.description,
    criteria: row.criteria as Record<string, unknown>,
    apolloFilters: row.apollo_filters as Record<string, unknown> | null,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
