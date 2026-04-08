-- Row Level Security policies
-- Depends on: all prior migrations
--
-- Pattern: every business table is scoped to organization_id, resolved through
-- organization_memberships where user_id = auth.uid().
-- The service-role key (Python worker + admin client) bypasses RLS entirely.

-- ── Helper: is the calling user a member of this org? ─────────────────────────
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
  );
$$;

-- ── organizations ─────────────────────────────────────────────────────────────
alter table organizations enable row level security;

create policy "org_members_select_org" on organizations
  for select using (is_org_member(id));

-- ── profiles ──────────────────────────────────────────────────────────────────
alter table profiles enable row level security;

create policy "own_profile_select" on profiles
  for select using (id = auth.uid());

create policy "own_profile_update" on profiles
  for update using (id = auth.uid());

-- ── organization_memberships ──────────────────────────────────────────────────
alter table organization_memberships enable row level security;

create policy "org_members_select_memberships" on organization_memberships
  for select using (is_org_member(organization_id));

-- ── leads ─────────────────────────────────────────────────────────────────────
alter table leads enable row level security;

create policy "org_members_select_leads" on leads
  for select using (is_org_member(organization_id));

create policy "org_members_insert_leads" on leads
  for insert with check (is_org_member(organization_id));

create policy "org_members_update_leads" on leads
  for update using (is_org_member(organization_id));

create policy "org_members_delete_leads" on leads
  for delete using (is_org_member(organization_id));

-- ── lead_lists ────────────────────────────────────────────────────────────────
alter table lead_lists enable row level security;

create policy "org_members_select_lead_lists" on lead_lists
  for select using (is_org_member(organization_id));

create policy "org_members_insert_lead_lists" on lead_lists
  for insert with check (is_org_member(organization_id));

create policy "org_members_update_lead_lists" on lead_lists
  for update using (is_org_member(organization_id));

create policy "org_members_delete_lead_lists" on lead_lists
  for delete using (is_org_member(organization_id));

-- ── lead_list_members ─────────────────────────────────────────────────────────
alter table lead_list_members enable row level security;

create policy "org_members_select_list_members" on lead_list_members
  for select using (
    exists (
      select 1 from lead_lists ll
      where ll.id = lead_list_id
        and is_org_member(ll.organization_id)
    )
  );

-- ── campaigns ─────────────────────────────────────────────────────────────────
alter table campaigns enable row level security;

create policy "org_members_select_campaigns" on campaigns
  for select using (is_org_member(organization_id));

create policy "org_members_insert_campaigns" on campaigns
  for insert with check (is_org_member(organization_id));

create policy "org_members_update_campaigns" on campaigns
  for update using (is_org_member(organization_id));

create policy "org_members_delete_campaigns" on campaigns
  for delete using (is_org_member(organization_id));

-- ── conversations ─────────────────────────────────────────────────────────────
alter table conversations enable row level security;

create policy "org_members_select_conversations" on conversations
  for select using (is_org_member(organization_id));

create policy "org_members_insert_conversations" on conversations
  for insert with check (is_org_member(organization_id));

create policy "org_members_update_conversations" on conversations
  for update using (is_org_member(organization_id));

-- ── messages ──────────────────────────────────────────────────────────────────
alter table messages enable row level security;

create policy "org_members_select_messages" on messages
  for select using (is_org_member(organization_id));

create policy "org_members_insert_messages" on messages
  for insert with check (is_org_member(organization_id));

-- ── agent_runs ────────────────────────────────────────────────────────────────
alter table agent_runs enable row level security;

create policy "org_members_select_agent_runs" on agent_runs
  for select using (is_org_member(organization_id));

-- ── integration_accounts ──────────────────────────────────────────────────────
alter table integration_accounts enable row level security;

create policy "org_members_select_integrations" on integration_accounts
  for select using (is_org_member(organization_id));

-- ── sync_runs ─────────────────────────────────────────────────────────────────
alter table sync_runs enable row level security;

create policy "org_members_select_sync_runs" on sync_runs
  for select using (is_org_member(organization_id));

-- ── pipeline_jobs ─────────────────────────────────────────────────────────────
alter table pipeline_jobs enable row level security;

create policy "org_members_select_pipeline_jobs" on pipeline_jobs
  for select using (is_org_member(organization_id));

create policy "org_members_insert_pipeline_jobs" on pipeline_jobs
  for insert with check (is_org_member(organization_id));

-- ── pipeline_job_attempts ─────────────────────────────────────────────────────
alter table pipeline_job_attempts enable row level security;

create policy "org_members_select_job_attempts" on pipeline_job_attempts
  for select using (
    exists (
      select 1 from pipeline_jobs pj
      where pj.id = job_id
        and is_org_member(pj.organization_id)
    )
  );

-- ── artifacts ─────────────────────────────────────────────────────────────────
alter table artifacts enable row level security;

create policy "org_members_select_artifacts" on artifacts
  for select using (is_org_member(organization_id));

-- ── webhook_events ────────────────────────────────────────────────────────────
-- Webhook events are inserted by the service role only; users can read their org's events.
alter table webhook_events enable row level security;

create policy "org_members_select_webhook_events" on webhook_events
  for select using (
    organization_id is not null and is_org_member(organization_id)
  );
