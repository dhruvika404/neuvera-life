-- Integration accounts and sync runs
-- Depends on: 001_core_org_auth

create table if not exists integration_accounts (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  provider         text not null,  -- 'hubspot' | 'instantly' | 'apollo' | 'clay'
  status           text not null default 'active',
  metadata         jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (organization_id, provider)
);

create index if not exists integration_accounts_org_idx on integration_accounts (organization_id);

create table if not exists sync_runs (
  id                      uuid primary key default gen_random_uuid(),
  organization_id         uuid not null references organizations(id) on delete cascade,
  integration_account_id  uuid references integration_accounts(id) on delete set null,
  job_type                text not null,
  status                  text not null default 'pending',  -- pending | running | done | failed
  synced_count            int not null default 0,
  error                   text,
  started_at              timestamptz,
  completed_at            timestamptz,
  created_at              timestamptz not null default now()
);

create index if not exists sync_runs_org_idx on sync_runs (organization_id);
create index if not exists sync_runs_integration_idx on sync_runs (integration_account_id);
