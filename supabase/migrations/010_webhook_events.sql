-- Webhook events — deduplication and audit log
-- Depends on: 001_core_org_auth, 007_pipeline_jobs_queue

create table if not exists webhook_events (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid references organizations(id) on delete set null,
  provider           text not null,          -- 'hubspot' | 'instantly'
  event_type         text,
  provider_event_id  text,                   -- deduplication key from the provider
  raw_payload        jsonb not null,
  processing_status  text not null default 'received',
  -- processing_status values: received | processed | failed | skipped
  pipeline_job_id    uuid references pipeline_jobs(id) on delete set null,
  received_at        timestamptz not null default now(),
  processed_at       timestamptz,

  -- Deduplication: one row per (provider, provider_event_id)
  unique (provider, provider_event_id)
);

create index if not exists webhook_events_provider_idx
  on webhook_events (provider, received_at desc);
create index if not exists webhook_events_org_idx
  on webhook_events (organization_id) where organization_id is not null;
