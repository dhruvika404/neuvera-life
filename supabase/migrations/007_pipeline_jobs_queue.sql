-- Pipeline jobs queue
-- Depends on: 001_core_org_auth

create table if not exists pipeline_jobs (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id) on delete cascade,
  created_by          uuid references profiles(id),
  job_type            text not null,
  status              text not null default 'pending',
  -- status values: pending | claimed | running | done | failed | dead
  priority            int not null default 5,
  payload             jsonb not null default '{}',
  scheduled_at        timestamptz not null default now(),
  attempt_count       int not null default 0,
  lease_expires_at    timestamptz,
  worker_id           text,
  result_artifact_id  uuid,  -- FK to artifacts added in 009
  last_error          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists pipeline_jobs_org_status_idx
  on pipeline_jobs (organization_id, status, scheduled_at);
create index if not exists pipeline_jobs_worker_idx
  on pipeline_jobs (worker_id) where worker_id is not null;

-- Now that pipeline_jobs exists, wire the forward FK on agent_runs
alter table agent_runs
  add constraint agent_runs_pipeline_job_id_fk
  foreign key (pipeline_job_id) references pipeline_jobs(id) on delete set null;

-- Updated-at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pipeline_jobs_updated_at
  before update on pipeline_jobs
  for each row execute procedure public.set_updated_at();
