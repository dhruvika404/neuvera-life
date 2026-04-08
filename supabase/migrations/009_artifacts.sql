-- Artifacts (Supabase Storage backed)
-- Depends on: 001_core_org_auth, 007_pipeline_jobs_queue

create table if not exists artifacts (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  job_id           uuid references pipeline_jobs(id) on delete set null,
  artifact_type    text not null,
  storage_path     text not null,  -- path within the Supabase Storage 'artifacts' bucket
  mime_type        text,
  size_bytes       bigint,
  metadata         jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists artifacts_org_idx on artifacts (organization_id);
create index if not exists artifacts_job_idx on artifacts (job_id);

-- Wire the forward FK from pipeline_jobs.result_artifact_id
alter table pipeline_jobs
  add constraint pipeline_jobs_result_artifact_id_fk
  foreign key (result_artifact_id) references artifacts(id) on delete set null;
