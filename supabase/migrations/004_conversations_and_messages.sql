-- Conversations and messages
-- Depends on: 001_core_org_auth, 002_leads_and_lists, 003_campaigns

create table if not exists conversations (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  lead_id          uuid references leads(id),
  campaign_id      uuid references campaigns(id),
  agent_type       text,
  title            text,
  status           text not null default 'open',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists conversations_org_idx on conversations (organization_id);
create index if not exists conversations_lead_idx on conversations (lead_id);

create table if not exists messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  organization_id  uuid not null references organizations(id) on delete cascade,
  role             text not null,  -- 'user' | 'assistant' | 'system'
  content          text,
  metadata         jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists messages_conversation_idx on messages (conversation_id, created_at);
