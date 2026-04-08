-- Agent runs
-- Depends on: 001_core_org_auth, 004_conversations_and_messages

create table if not exists agent_runs (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  conversation_id  uuid references conversations(id),
  pipeline_job_id  uuid,  -- forward reference; FK added in 007
  status           text not null default 'pending',  -- pending | running | done | failed
  started_at       timestamptz,
  completed_at     timestamptz,
  error            text,
  result           jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists agent_runs_org_idx on agent_runs (organization_id);
create index if not exists agent_runs_conversation_idx on agent_runs (conversation_id);
create index if not exists agent_runs_status_idx on agent_runs (organization_id, status);
