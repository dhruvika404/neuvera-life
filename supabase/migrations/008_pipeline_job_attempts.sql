-- Pipeline job attempt log
-- Depends on: 007_pipeline_jobs_queue

create table if not exists pipeline_job_attempts (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid not null references pipeline_jobs(id) on delete cascade,
  attempt_number  int not null,
  worker_id       text,
  started_at      timestamptz,
  completed_at    timestamptz,
  outcome         text,  -- 'success' | 'failure' | 'timeout'
  error_summary   text,
  created_at      timestamptz not null default now()
);

create index if not exists pipeline_job_attempts_job_idx
  on pipeline_job_attempts (job_id);
