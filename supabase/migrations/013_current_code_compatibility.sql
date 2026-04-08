-- Compatibility columns for the current frontend and legacy route helpers
-- Depends on: 012_icp_profiles
--
-- These columns keep the in-flight frontend and deprecated helpers working
-- while we transition to the cleaner org-scoped schema. Remove them only after
-- all callers have moved to the canonical DTOs/query layer.

-- ── leads legacy compatibility ────────────────────────────────────────────────
alter table if exists leads
  add column if not exists name text,
  add column if not exists stage text,
  add column if not exists icp_id uuid,
  add column if not exists icp_fit int;

create index if not exists leads_org_stage_idx on leads (organization_id, stage);
create index if not exists leads_org_icp_idx on leads (organization_id, icp_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_icp_id_fk'
  ) then
    alter table leads
      add constraint leads_icp_id_fk
      foreign key (icp_id) references icp_profiles(id) on delete set null;
  end if;
end
$$;

-- ── conversations legacy compatibility ───────────────────────────────────────
alter table if exists conversations
  add column if not exists icp_id uuid,
  add column if not exists token_cost_input int not null default 0,
  add column if not exists token_cost_output int not null default 0,
  add column if not exists blob_url text;

create index if not exists conversations_org_agent_type_idx
  on conversations (organization_id, agent_type);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'conversations_icp_id_fk'
  ) then
    alter table conversations
      add constraint conversations_icp_id_fk
      foreign key (icp_id) references icp_profiles(id) on delete set null;
  end if;
end
$$;

-- ── messages legacy compatibility ────────────────────────────────────────────
alter table if exists messages
  add column if not exists tool_call_id text,
  add column if not exists artifact_type text,
  add column if not exists artifact_data jsonb;

create index if not exists messages_conversation_tool_call_idx
  on messages (conversation_id, tool_call_id)
  where tool_call_id is not null;

-- ── agent_runs legacy compatibility ──────────────────────────────────────────
alter table if exists agent_runs
  add column if not exists agent_type text,
  add column if not exists input_payload jsonb,
  add column if not exists output_payload jsonb,
  add column if not exists error_message text;

create index if not exists agent_runs_org_agent_type_idx
  on agent_runs (organization_id, agent_type);
