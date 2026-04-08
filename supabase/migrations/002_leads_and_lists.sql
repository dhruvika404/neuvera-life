-- Leads and lead lists
-- Depends on: 001_core_org_auth

create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  first_name       text,
  last_name        text,
  email            text,
  company          text,
  title            text,
  linkedin_url     text,
  enrichment_data  jsonb,
  enriched_at      timestamptz,
  hubspot_contact_id text,
  source           text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists leads_org_idx on leads (organization_id);
create index if not exists leads_email_idx on leads (organization_id, email);

create table if not exists lead_lists (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  name             text not null,
  description      text,
  filters          jsonb,
  lead_count       int not null default 0,
  created_by       uuid references profiles(id),
  created_at       timestamptz not null default now()
);

create index if not exists lead_lists_org_idx on lead_lists (organization_id);

-- Junction table for many-to-many lead ↔ list membership
create table if not exists lead_list_members (
  lead_list_id  uuid not null references lead_lists(id) on delete cascade,
  lead_id       uuid not null references leads(id) on delete cascade,
  added_at      timestamptz not null default now(),
  primary key (lead_list_id, lead_id)
);
