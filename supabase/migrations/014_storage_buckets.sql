-- Supabase Storage buckets used by the web app and Python worker
-- Depends on: 009_artifacts
--
-- Buckets are private. Browser access should happen through signed URLs or
-- trusted server-side upload helpers.

insert into storage.buckets (id, name, public)
values
  ('uploads', 'uploads', false),
  ('artifacts', 'artifacts', false)
on conflict (id) do nothing;
