/**
 * Discriminated union for all pipeline_jobs payload shapes.
 * The `job_type` field is the discriminant — workers and handlers
 * switch on this to narrow the payload type safely.
 */

export type AgentRespondPayload = {
  job_type: "agent_respond";
  conversation_id: string;
  agent_run_id: string;
};

export type SyncHubspotPayload = {
  job_type: "sync_hubspot";
  integration_account_id: string;
};

export type SyncInstantlyPayload = {
  job_type: "sync_instantly";
  integration_account_id: string;
};

export type EnrichLeadPayload = {
  job_type: "enrich_lead";
  lead_id: string;
};

export type ProcessWebhookPayload = {
  job_type: "process_webhook";
  webhook_event_id: string;
};

export type JobPayload =
  | AgentRespondPayload
  | SyncHubspotPayload
  | SyncInstantlyPayload
  | EnrichLeadPayload
  | ProcessWebhookPayload;

export type JobType = JobPayload["job_type"];
