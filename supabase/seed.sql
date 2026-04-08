-- =============================================================================
-- Seed data for local development
-- Run via: supabase db reset  (applies migrations then this file)
-- All UUIDs are fixed so re-seeding is fully idempotent.
-- Login: admin@neuveralife.com / Password123!
-- =============================================================================

-- Disable trigger so we can insert profiles manually without a race condition
alter table auth.users disable trigger on_auth_user_created;

-- ── Auth users ────────────────────────────────────────────────────────────────
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@neuveralife.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Alex Rivera"}',
    now(), now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'member@neuveralife.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Jordan Chen"}',
    now(), now()
  )
on conflict (id) do nothing;

-- Cloud auth compatibility:
-- Ensure text token columns are non-null so GoTrue can load users consistently.
update auth.users
set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  reauthentication_token = coalesce(reauthentication_token, '')
where id in (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

-- Auth identities (required for email login)
insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at
)
values
  (
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"admin@neuveralife.com"}'::jsonb,
    'email', 'admin@neuveralife.com',
    now(), now(), now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"member@neuveralife.com"}'::jsonb,
    'email', 'member@neuveralife.com',
    now(), now(), now()
  )
on conflict (id) do nothing;

alter table auth.users enable trigger on_auth_user_created;

-- ── Profiles ──────────────────────────────────────────────────────────────────
insert into public.profiles (id, full_name, avatar_url, created_at, updated_at)
values
  ('22222222-2222-2222-2222-222222222222', 'Alex Rivera', null, now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Jordan Chen', null, now(), now())
on conflict (id) do update
  set full_name = excluded.full_name, updated_at = now();

-- ── Organization ──────────────────────────────────────────────────────────────
insert into public.organizations (id, name, slug, created_at, updated_at)
values ('11111111-1111-1111-1111-111111111111', 'Neuvera Life', 'neuvera-life', now(), now())
on conflict (id) do nothing;

-- ── Memberships ───────────────────────────────────────────────────────────────
insert into public.organization_memberships (id, organization_id, user_id, role, created_at)
values
  ('44444444-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'admin', now()),
  ('44444444-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'member', now())
on conflict (organization_id, user_id) do nothing;

-- ── ICP Profiles ──────────────────────────────────────────────────────────────
insert into public.icp_profiles (id, organization_id, name, description, criteria, apollo_filters, is_active, created_at, updated_at)
values
  (
    'aaaaaaaa-0001-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'Health & Wellness VPs',
    'VP-level decision makers at health and wellness companies with 50–500 employees',
    '{"industries":["Health & Wellness","Nutraceuticals","Functional Foods"],"titles":["VP Marketing","VP Sales","VP Growth","CMO"],"company_sizes":["51-200","201-500"],"locations":["United States","Canada"]}'::jsonb,
    '{"person_titles":["VP Marketing","VP Sales","CMO"],"q_organization_num_employees_ranges":["51,200","201,500"]}'::jsonb,
    true, now(), now()
  ),
  (
    'aaaaaaaa-0002-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'Supplement Brand Founders',
    'Founders and co-founders of DTC supplement and nutrition brands',
    '{"industries":["Dietary Supplements","E-Commerce","Consumer Goods"],"titles":["Founder","Co-Founder","CEO","Owner"],"company_sizes":["1-10","11-50"],"locations":["United States"]}'::jsonb,
    '{"person_titles":["Founder","Co-Founder","CEO"],"q_organization_num_employees_ranges":["1,10","11,50"]}'::jsonb,
    true, now(), now()
  )
on conflict (id) do nothing;

-- ── Leads ─────────────────────────────────────────────────────────────────────
insert into public.leads (
  id, organization_id,
  first_name, last_name, email, company, title, linkedin_url,
  source, icp_id, icp_fit, stage, name,
  enrichment_data, enriched_at, created_at, updated_at
)
values
  (
    'bbbbbbbb-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Sarah', 'Chen', 'sarah.chen@luminaryhealth.com', 'Luminary Health', 'VP Marketing',
    'https://linkedin.com/in/sarah-chen-luminary', 'apollo',
    'aaaaaaaa-0001-0000-0000-000000000000', 92, 'qualified', 'Sarah Chen',
    '{"location":"New York, NY","company_size":"201-500","funding_stage":"Series B","technologies":["HubSpot","Klaviyo","Shopify"]}'::jsonb,
    now() - interval '2 days', now() - interval '5 days', now()
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Marcus', 'Johnson', 'marcus@vitalityco.io', 'Vitality Co', 'CMO',
    'https://linkedin.com/in/marcus-johnson-vitality', 'apollo',
    'aaaaaaaa-0001-0000-0000-000000000000', 88, 'contacted', 'Marcus Johnson',
    '{"location":"Austin, TX","company_size":"51-200","funding_stage":"Series A","technologies":["ActiveCampaign","WooCommerce"]}'::jsonb,
    now() - interval '3 days', now() - interval '7 days', now()
  ),
  (
    'bbbbbbbb-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Priya', 'Patel', 'priya@greenroots.co', 'Green Roots', 'Founder & CEO',
    'https://linkedin.com/in/priya-patel-greenroots', 'clay',
    'aaaaaaaa-0002-0000-0000-000000000000', 85, 'new', 'Priya Patel',
    '{"location":"San Francisco, CA","company_size":"11-50","funding_stage":"Seed","technologies":["Shopify","Klaviyo"]}'::jsonb,
    now() - interval '1 day', now() - interval '3 days', now()
  ),
  (
    'bbbbbbbb-0004-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'David', 'Kim', 'dkim@peakhuman.com', 'Peak Human', 'VP Sales',
    'https://linkedin.com/in/david-kim-peakhuman', 'apollo',
    'aaaaaaaa-0001-0000-0000-000000000000', 79, 'qualified', 'David Kim',
    '{"location":"Denver, CO","company_size":"51-200","funding_stage":"Series A","technologies":["Salesforce","Mailchimp"]}'::jsonb,
    now() - interval '4 days', now() - interval '9 days', now()
  ),
  (
    'bbbbbbbb-0005-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Elena', 'Torres', 'elena@solaradtx.com', 'Solarad Therapeutics', 'Co-Founder',
    'https://linkedin.com/in/elena-torres-solarad', 'clay',
    'aaaaaaaa-0002-0000-0000-000000000000', 81, 'new', 'Elena Torres',
    '{"location":"Miami, FL","company_size":"1-10","funding_stage":"Pre-Seed","technologies":["Shopify","Mailchimp"]}'::jsonb,
    now() - interval '1 day', now() - interval '2 days', now()
  ),
  (
    'bbbbbbbb-0006-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'James', 'Okafor', 'james.okafor@nutricraft.io', 'NutriCraft', 'VP Growth',
    'https://linkedin.com/in/james-okafor-nutricraft', 'apollo',
    'aaaaaaaa-0001-0000-0000-000000000000', 76, 'contacted', 'James Okafor',
    '{"location":"Chicago, IL","company_size":"51-200","funding_stage":"Series A","technologies":["HubSpot","ActiveCampaign"]}'::jsonb,
    now() - interval '5 days', now() - interval '10 days', now()
  ),
  (
    'bbbbbbbb-0007-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Aisha', 'Williams', 'aisha@bloom.health', 'Bloom Health', 'CMO',
    'https://linkedin.com/in/aisha-williams-bloom', 'manual',
    'aaaaaaaa-0001-0000-0000-000000000000', 91, 'meeting', 'Aisha Williams',
    '{"location":"Los Angeles, CA","company_size":"201-500","funding_stage":"Series B","technologies":["Salesforce","Marketo","Shopify Plus"]}'::jsonb,
    now() - interval '6 days', now() - interval '14 days', now()
  ),
  (
    'bbbbbbbb-0008-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Ryan', 'Nakamura', 'ryan@herbalharvest.co', 'Herbal Harvest', 'Founder',
    'https://linkedin.com/in/ryan-nakamura-herbalharvest', 'clay',
    'aaaaaaaa-0002-0000-0000-000000000000', 73, 'new', 'Ryan Nakamura',
    '{"location":"Portland, OR","company_size":"1-10","funding_stage":"Bootstrapped","technologies":["Shopify","Omnisend"]}'::jsonb,
    now() - interval '2 days', now() - interval '4 days', now()
  ),
  (
    'bbbbbbbb-0009-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Sofia', 'Martinez', 'sofia@wellspring.io', 'Wellspring', 'VP Marketing',
    'https://linkedin.com/in/sofia-martinez-wellspring', 'apollo',
    'aaaaaaaa-0001-0000-0000-000000000000', 84, 'contacted', 'Sofia Martinez',
    '{"location":"New York, NY","company_size":"51-200","funding_stage":"Series A","technologies":["HubSpot","Klaviyo","Stripe"]}'::jsonb,
    now() - interval '3 days', now() - interval '8 days', now()
  ),
  (
    'bbbbbbbb-0010-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Tyler', 'Brooks', 'tyler@apexnutrition.com', 'Apex Nutrition', 'Co-Founder & CEO',
    'https://linkedin.com/in/tyler-brooks-apex', 'clay',
    'aaaaaaaa-0002-0000-0000-000000000000', 78, 'new', 'Tyler Brooks',
    '{"location":"Dallas, TX","company_size":"11-50","funding_stage":"Seed","technologies":["Shopify","Postscript"]}'::jsonb,
    now() - interval '1 day', now() - interval '3 days', now()
  )
on conflict (id) do nothing;

-- ── Lead Lists ────────────────────────────────────────────────────────────────
insert into public.lead_lists (id, organization_id, name, description, filters, lead_count, created_by, created_at)
values
  (
    'cccccccc-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Q2 Health VPs', 'VP-level health and wellness contacts targeted for Q2 outreach',
    '{"icp_id":"aaaaaaaa-0001-0000-0000-000000000000"}'::jsonb,
    6, '22222222-2222-2222-2222-222222222222', now() - interval '10 days'
  ),
  (
    'cccccccc-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Supplement Founders Wave 1', 'Founders of DTC supplement brands for the first wave',
    '{"icp_id":"aaaaaaaa-0002-0000-0000-000000000000"}'::jsonb,
    4, '22222222-2222-2222-2222-222222222222', now() - interval '8 days'
  )
on conflict (id) do nothing;

-- ── Lead List Members ──────────────────────────────────────────────────────────
insert into public.lead_list_members (lead_list_id, lead_id, added_at)
values
  ('cccccccc-0001-0000-0000-000000000000', 'bbbbbbbb-0001-0000-0000-000000000000', now()),
  ('cccccccc-0001-0000-0000-000000000000', 'bbbbbbbb-0002-0000-0000-000000000000', now()),
  ('cccccccc-0001-0000-0000-000000000000', 'bbbbbbbb-0004-0000-0000-000000000000', now()),
  ('cccccccc-0001-0000-0000-000000000000', 'bbbbbbbb-0006-0000-0000-000000000000', now()),
  ('cccccccc-0001-0000-0000-000000000000', 'bbbbbbbb-0007-0000-0000-000000000000', now()),
  ('cccccccc-0001-0000-0000-000000000000', 'bbbbbbbb-0009-0000-0000-000000000000', now()),
  ('cccccccc-0002-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000', now()),
  ('cccccccc-0002-0000-0000-000000000000', 'bbbbbbbb-0005-0000-0000-000000000000', now()),
  ('cccccccc-0002-0000-0000-000000000000', 'bbbbbbbb-0008-0000-0000-000000000000', now()),
  ('cccccccc-0002-0000-0000-000000000000', 'bbbbbbbb-0010-0000-0000-000000000000', now())
on conflict (lead_list_id, lead_id) do nothing;

-- ── Campaigns ─────────────────────────────────────────────────────────────────
insert into public.campaigns (
  id, organization_id, name, status,
  instantly_campaign_id, lead_list_id, settings,
  emails_sent, emails_opened, emails_replied,
  created_by, created_at, updated_at
)
values
  (
    'dddddddd-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Q2 Health VP Outreach', 'active',
    'instantly_camp_q2healthvp', 'cccccccc-0001-0000-0000-000000000000',
    '{"daily_limit":50,"schedule":"weekdays","sequence_steps":3}'::jsonb,
    1847, 621, 94,
    '22222222-2222-2222-2222-222222222222', now() - interval '21 days', now()
  ),
  (
    'dddddddd-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Supplement Founders Wave 1', 'active',
    'instantly_camp_suppfounder1', 'cccccccc-0002-0000-0000-000000000000',
    '{"daily_limit":30,"schedule":"weekdays","sequence_steps":4}'::jsonb,
    983, 297, 41,
    '22222222-2222-2222-2222-222222222222', now() - interval '14 days', now()
  ),
  (
    'dddddddd-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Wellness Founders Re-engagement', 'paused',
    'instantly_camp_wellness_reeng', null,
    '{"daily_limit":20,"schedule":"all_days","sequence_steps":2}'::jsonb,
    412, 98, 11,
    '22222222-2222-2222-2222-222222222222', now() - interval '35 days', now() - interval '7 days'
  ),
  (
    'dddddddd-0004-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'Series A Health Tech', 'draft',
    null, null,
    '{"daily_limit":40,"schedule":"weekdays","sequence_steps":3}'::jsonb,
    0, 0, 0,
    '33333333-3333-3333-3333-333333333333', now() - interval '3 days', now()
  )
on conflict (id) do nothing;

-- ── Integration Accounts ──────────────────────────────────────────────────────
insert into public.integration_accounts (id, organization_id, provider, status, metadata, created_at, updated_at)
values
  (
    'eeeeeeee-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'hubspot', 'active',
    '{"portal_id":"12345678","hub_domain":"neuveralife.hubspot.com","scopes":["contacts","deals","companies"]}'::jsonb,
    now() - interval '30 days', now() - interval '1 hour'
  ),
  (
    'eeeeeeee-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'instantly', 'active',
    '{"workspace_id":"ws_neuvera001","workspace_name":"Neuvera Life Outreach","email_accounts":["outreach@neuveralife.com"]}'::jsonb,
    now() - interval '28 days', now() - interval '2 hours'
  )
on conflict (id) do nothing;

-- ── Sync Runs ─────────────────────────────────────────────────────────────────
insert into public.sync_runs (
  id, organization_id, integration_account_id,
  job_type, status, synced_count,
  started_at, completed_at, created_at
)
values
  (
    'ffffffff-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'eeeeeeee-0001-0000-0000-000000000000',
    'sync_hubspot', 'done', 247,
    now() - interval '3 hours', now() - interval '3 hours' + interval '8 minutes',
    now() - interval '3 hours'
  ),
  (
    'ffffffff-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'eeeeeeee-0002-0000-0000-000000000000',
    'sync_instantly', 'done', 2830,
    now() - interval '2 hours', now() - interval '2 hours' + interval '5 minutes',
    now() - interval '2 hours'
  )
on conflict (id) do nothing;

-- ── Pipeline Jobs ─────────────────────────────────────────────────────────────
-- result_artifact_id is null initially; updated after artifact insert below
insert into public.pipeline_jobs (
  id, organization_id, created_by,
  job_type, status, priority, payload, scheduled_at,
  attempt_count, result_artifact_id, last_error,
  created_at, updated_at
)
values
  (
    '00000003-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'sync_hubspot', 'done', 5,
    '{"integration_account_id":"eeeeeeee-0001-0000-0000-000000000000"}'::jsonb,
    now() - interval '3 hours', 1, null, null,
    now() - interval '3 hours', now() - interval '3 hours' + interval '8 minutes'
  ),
  (
    '00000003-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'enrich_lead', 'failed', 5,
    '{"lead_id":"bbbbbbbb-0008-0000-0000-000000000000"}'::jsonb,
    now() - interval '1 hour', 2, null,
    'Clay API rate limit exceeded after 2 attempts',
    now() - interval '1 hour', now() - interval '45 minutes'
  ),
  (
    '00000003-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'agent_respond', 'pending', 5,
    '{"conversation_id":"00000001-0003-0000-0000-000000000000","agent_run_id":"00000002-0003-0000-0000-000000000000"}'::jsonb,
    now() - interval '5 minutes', 0, null, null,
    now() - interval '5 minutes', now() - interval '5 minutes'
  )
on conflict (id) do nothing;

-- ── Conversations ─────────────────────────────────────────────────────────────
insert into public.conversations (
  id, organization_id, lead_id, campaign_id,
  agent_type, title, status,
  icp_id, token_cost_input, token_cost_output,
  created_at, updated_at
)
values
  (
    '00000001-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    null, null,
    'prospecting', 'Find VP Marketing leads in US health supplement space', 'open',
    'aaaaaaaa-0001-0000-0000-000000000000', 4200, 1800,
    now() - interval '2 days', now() - interval '2 days' + interval '15 minutes'
  ),
  (
    '00000001-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    null, 'dddddddd-0001-0000-0000-000000000000',
    'engagement', 'Write email sequence for Q2 Health VP campaign', 'open',
    null, 6100, 2400,
    now() - interval '1 day', now() - interval '1 day' + interval '22 minutes'
  ),
  (
    '00000001-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-0001-0000-0000-000000000000', null,
    'prospecting', 'Enrich and qualify Sarah Chen profile', 'open',
    'aaaaaaaa-0001-0000-0000-000000000000', 1200, 480,
    now() - interval '6 hours', now() - interval '5 minutes'
  ),
  (
    '00000001-0004-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    null, 'dddddddd-0002-0000-0000-000000000000',
    'engagement', 'Personalize outreach for Supplement Founders Wave 1', 'open',
    null, 3800, 1600,
    now() - interval '12 hours', now() - interval '12 hours' + interval '18 minutes'
  )
on conflict (id) do nothing;

-- ── Messages ──────────────────────────────────────────────────────────────────
insert into public.messages (id, conversation_id, organization_id, role, content, metadata, created_at)
values
  -- Conversation 1: prospecting VP leads (completed)
  ('00000004-0001-0000-0000-000000000000'::uuid, '00000001-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'user', 'Find me 10 VP Marketing contacts at US health supplement companies with 50–500 employees. Prioritize Series A/B companies using HubSpot or Klaviyo.',
   null, now() - interval '2 days'),
  ('00000004-0002-0000-0000-000000000000'::uuid, '00000001-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Running Apollo search: titles=[VP Marketing, CMO, VP Growth], industry=Health & Wellness, company_size=51-500, technologies=[HubSpot, Klaviyo].',
   '{"tool_calls":[{"name":"apollo_search","status":"running"}]}'::jsonb,
   now() - interval '2 days' + interval '30 seconds'),
  ('00000004-0003-0000-0000-000000000000'::uuid, '00000001-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Found 47 matching contacts. After deduplication: 12 net-new prospects. Top matches: Sarah Chen (Luminary Health, score 92), Marcus Johnson (Vitality Co, score 88), David Kim (Peak Human, score 79). Shall I enrich all 12 with Clay and add them to your Q2 Health VPs list?',
   '{"artifact_type":"lead_list","lead_count":12}'::jsonb,
   now() - interval '2 days' + interval '4 minutes'),
  ('00000004-0004-0000-0000-000000000000'::uuid, '00000001-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'user', 'Yes, enrich and add them all. Also add them to the Q2 Health VP Outreach campaign.',
   null, now() - interval '2 days' + interval '5 minutes'),
  ('00000004-0005-0000-0000-000000000000'::uuid, '00000001-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Done. Enriched 12 leads via Clay (avg. 94% data completeness). Added to Q2 Health VPs list and enrolled in Q2 Health VP Outreach campaign.',
   '{"artifact_type":"lead_list","lead_count":12,"campaign_enrolled":true}'::jsonb,
   now() - interval '2 days' + interval '14 minutes'),

  -- Conversation 2: email sequence (completed)
  ('00000004-0006-0000-0000-000000000000'::uuid, '00000001-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'user', 'Write a 3-step email sequence for the Q2 Health VP Outreach campaign. Focus on ROI, keep it concise.',
   null, now() - interval '1 day'),
  ('00000004-0007-0000-0000-000000000000'::uuid, '00000001-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Crafting a 3-step sequence for Health VPs. Analyzing campaign context and ICP data...',
   null, now() - interval '1 day' + interval '20 seconds'),
  ('00000004-0008-0000-0000-000000000000'::uuid, '00000001-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant',
   'Here''s your 3-step sequence:

Step 1 (Day 1) — Pattern interrupt: Subject: {{company}} growth question
Body: Hi {{first_name}}, noticed {{company}} recently [trigger]. How are you handling [pain point]? We helped similar companies increase qualified pipeline 34% in 60 days.

Step 2 (Day 4) — Value add: Subject: Quick thought on {{company}}
Body: Built a playbook specifically for {{industry}} VPs. Happy to share — no pitch.

Step 3 (Day 9) — Soft close: Subject: Closing the loop
Body: Last touch. If Q3 pipeline is a priority, 15 minutes could uncover a quick win.',
   '{"artifact_type":"email_sequence","steps":3}'::jsonb,
   now() - interval '1 day' + interval '22 minutes'),

  -- Conversation 3: enriching Sarah Chen (in-progress / pending)
  ('00000004-0009-0000-0000-000000000000'::uuid, '00000001-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'user', 'Enrich Sarah Chen''s profile and tell me if she''s a strong fit for our ICP.',
   null, now() - interval '6 hours'),
  ('00000004-0010-0000-0000-000000000000'::uuid, '00000001-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Running Clay enrichment on Sarah Chen (sarah.chen@luminaryhealth.com) and pulling recent news for Luminary Health...',
   '{"tool_calls":[{"name":"clay_enrich","status":"running"}]}'::jsonb,
   now() - interval '5 minutes'),

  -- Conversation 4: supplement founders (completed)
  ('00000004-0011-0000-0000-000000000000'::uuid, '00000001-0004-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'user', 'Create personalized first-touch emails for the 4 Supplement Founders in Wave 1. Reference their product lines and funding stage.',
   null, now() - interval '12 hours'),
  ('00000004-0012-0000-0000-000000000000'::uuid, '00000001-0004-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Pulling enrichment data for all 4 founders...',
   null, now() - interval '12 hours' + interval '15 seconds'),
  ('00000004-0013-0000-0000-000000000000'::uuid, '00000001-0004-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'assistant', 'Generated 4 personalized emails: Priya Patel (Green Roots, seed-stage DTC angle), Elena Torres (Solarad, pre-seed bootstrapping angle), Ryan Nakamura (Herbal Harvest, Portland wellness community angle), Tyler Brooks (Apex Nutrition, growth + SMS stack angle). All 4 ready to push to Supplement Founders Wave 1 campaign on Instantly. Confirm?',
   '{"artifact_type":"email_sequence","personalized_count":4}'::jsonb,
   now() - interval '12 hours' + interval '18 minutes')
on conflict (id) do nothing;

-- ── Agent Runs ────────────────────────────────────────────────────────────────
insert into public.agent_runs (
  id, organization_id, conversation_id, pipeline_job_id,
  status, agent_type,
  started_at, completed_at, error,
  result, input_payload, output_payload,
  created_at
)
values
  (
    '00000002-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '00000001-0001-0000-0000-000000000000', '00000003-0001-0000-0000-000000000000',
    'done', 'prospecting',
    now() - interval '2 days', now() - interval '2 days' + interval '14 minutes', null,
    '{"leads_found":47,"leads_deduplicated":12,"leads_enriched":12}'::jsonb,
    '{"query":"VP Marketing health supplement 50-500 employees"}'::jsonb,
    '{"lead_list_id":"cccccccc-0001-0000-0000-000000000000"}'::jsonb,
    now() - interval '2 days'
  ),
  (
    '00000002-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '00000001-0002-0000-0000-000000000000', null,
    'done', 'engagement',
    now() - interval '1 day', now() - interval '1 day' + interval '22 minutes', null,
    '{"sequence_steps":3,"personalization_tokens":14}'::jsonb,
    '{"campaign_id":"dddddddd-0001-0000-0000-000000000000","steps":3}'::jsonb,
    '{"sequence_pushed_to_instantly":true}'::jsonb,
    now() - interval '1 day'
  ),
  (
    '00000002-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '00000001-0003-0000-0000-000000000000', '00000003-0003-0000-0000-000000000000',
    'pending', 'prospecting',
    null, null, null, null,
    '{"lead_id":"bbbbbbbb-0001-0000-0000-000000000000"}'::jsonb, null,
    now() - interval '5 minutes'
  )
on conflict (id) do nothing;

-- ── Pipeline Job Attempts ─────────────────────────────────────────────────────
insert into public.pipeline_job_attempts (
  id, job_id, attempt_number, worker_id,
  started_at, completed_at, outcome, error_summary, created_at
)
values
  (
    'a0000001-0001-0000-0000-000000000000',
    '00000003-0001-0000-0000-000000000000',
    1, 'worker-prod-01',
    now() - interval '3 hours', now() - interval '3 hours' + interval '8 minutes',
    'success', null, now() - interval '3 hours'
  ),
  (
    'a0000002-0001-0000-0000-000000000000',
    '00000003-0002-0000-0000-000000000000',
    1, 'worker-prod-01',
    now() - interval '1 hour', now() - interval '1 hour' + interval '12 seconds',
    'failure', 'Clay API 429: rate limit exceeded', now() - interval '1 hour'
  ),
  (
    'a0000002-0002-0000-0000-000000000000',
    '00000003-0002-0000-0000-000000000000',
    2, 'worker-prod-02',
    now() - interval '50 minutes', now() - interval '50 minutes' + interval '10 seconds',
    'failure', 'Clay API 429: rate limit exceeded after retry', now() - interval '50 minutes'
  )
on conflict (id) do nothing;

-- ── Artifacts ─────────────────────────────────────────────────────────────────
insert into public.artifacts (
  id, organization_id, job_id,
  artifact_type, storage_path, mime_type, size_bytes, metadata, created_at
)
values
  (
    '00000004-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    '00000003-0001-0000-0000-000000000000',
    'lead_list',
    'artifacts/11111111-1111-1111-1111-111111111111/lead_lists/q2-health-vps-20260402.csv',
    'text/csv', 18432,
    '{"lead_count":12,"list_id":"cccccccc-0001-0000-0000-000000000000"}'::jsonb,
    now() - interval '2 days' + interval '14 minutes'
  )
on conflict (id) do nothing;

-- Wire result artifact back to the completed job
update public.pipeline_jobs
set result_artifact_id = '00000004-0001-0000-0000-000000000000'
where id = '00000003-0001-0000-0000-000000000000' and result_artifact_id is null;

-- ── Webhook Events ────────────────────────────────────────────────────────────
insert into public.webhook_events (
  id, organization_id, provider, event_type,
  provider_event_id, raw_payload,
  processing_status, pipeline_job_id, received_at, processed_at
)
values
  (
    '00000005-0001-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'hubspot', 'contact.propertyChange',
    'hs_evt_20260401_001',
    '{"subscriptionType":"contact.propertyChange","portalId":12345678,"objectId":987654321,"propertyName":"lifecyclestage","propertyValue":"marketingqualifiedlead","eventId":"hs_evt_20260401_001"}'::jsonb,
    'processed', null,
    now() - interval '8 hours', now() - interval '8 hours' + interval '2 seconds'
  ),
  (
    '00000005-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'instantly', 'email.opened',
    'inst_evt_20260402_001',
    '{"event":"email.opened","campaign_id":"instantly_camp_q2healthvp","lead_email":"sarah.chen@luminaryhealth.com","timestamp":"2026-04-02T09:14:22Z","sequence_step":1}'::jsonb,
    'processed', null,
    now() - interval '4 hours', now() - interval '4 hours' + interval '1 second'
  )
on conflict (provider, provider_event_id) do nothing;
