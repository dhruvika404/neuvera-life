-- Campaigns
-- Depends on: 001_core_org_auth, 002_leads_and_lists

create table if not exists campaigns (
  id                    uuid primary key default gen_random_uuid(),
  organization_id       uuid not null references organizations(id) on delete cascade,
  name                  text not null,
  status                text not null default 'draft',
  instantly_campaign_id text,
  lead_list_id          uuid references lead_lists(id),
  settings              jsonb,
  emails_sent           int not null default 0,
  emails_opened         int not null default 0,
  emails_replied        int not null default 0,
  created_by            uuid references profiles(id),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists campaigns_org_idx on campaigns (organization_id);
create index if not exists campaigns_status_idx on campaigns (organization_id, status);
