-- ICP (Ideal Customer Profile) definitions
-- Depends on: 001_core_org_auth

create table if not exists icp_profiles (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  name             text not null,
  description      text,
  criteria         jsonb not null default '{}',
  apollo_filters   jsonb,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists icp_profiles_org_idx on icp_profiles (organization_id);

create trigger icp_profiles_updated_at
  before update on icp_profiles
  for each row execute procedure public.set_updated_at();

-- RLS
alter table icp_profiles enable row level security;

create policy "org_members_select_icp_profiles" on icp_profiles
  for select using (is_org_member(organization_id));

create policy "org_members_insert_icp_profiles" on icp_profiles
  for insert with check (is_org_member(organization_id));

create policy "org_members_update_icp_profiles" on icp_profiles
  for update using (is_org_member(organization_id));

create policy "org_members_delete_icp_profiles" on icp_profiles
  for delete using (is_org_member(organization_id));
