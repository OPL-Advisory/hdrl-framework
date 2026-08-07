-- HDRL thin public-beta operational store.
-- Assessment response values and narrative remain entirely client-side and
-- are deliberately absent from this schema.

create extension if not exists pg_cron;

create table if not exists public.beta_participants (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 120),
  role text not null check (char_length(role) between 1 and 120),
  organisation text not null check (char_length(organisation) between 1 and 180),
  region text not null default '' check (char_length(region) <= 120),
  service_type text not null default '' check (char_length(service_type) <= 120),
  scale text not null default '' check (char_length(scale) <= 120),
  use_mode text not null check (char_length(use_mode) between 1 and 120),
  report_use text not null check (char_length(report_use) between 1 and 120),
  privacy_notice_version text not null check (char_length(privacy_notice_version) <= 80),
  verified_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  retention_at timestamptz not null default (now() + interval '365 days')
);

create table if not exists public.beta_contact_preferences (
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null check (purpose in ('research_contact', 'newsletter')),
  granted boolean not null,
  wording_version text not null check (char_length(wording_version) <= 80),
  recorded_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  primary key (user_id, purpose)
);

create table if not exists public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  contact_mode text not null check (contact_mode in ('without_contact', 'contactable')),
  user_id uuid references auth.users(id) on delete set null,
  rating smallint check (rating is null or rating between 1 and 5),
  category text check (category is null or category in (
    'overall_experience', 'bug', 'unclear_framework_wording',
    'unclear_tool_wording', 'accessibility', 'suggestion', 'other'
  )),
  comment text check (comment is null or char_length(comment) <= 2000),
  context jsonb not null default '{}'::jsonb,
  received_date date not null default current_date,
  retention_at timestamptz not null default (now() + interval '365 days'),
  check ((contact_mode = 'without_contact' and user_id is null)
    or (contact_mode = 'contactable' and user_id is not null))
);

create table if not exists public.beta_privacy_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in (
    'access_export', 'correction_applied', 'deletion_completed', 'deletion_failed'
  )),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null check (status in ('completed', 'failed')),
  detail text not null default '' check (char_length(detail) <= 200)
);

create table if not exists public.beta_rate_limits (
  key_digest text not null,
  route text not null check (char_length(route) <= 60),
  window_start timestamptz not null,
  hits integer not null default 1 check (hits > 0),
  expires_at timestamptz not null,
  primary key (key_digest, route, window_start)
);

create table if not exists public.beta_admin_audit (
  id uuid primary key default gen_random_uuid(),
  action text not null check (char_length(action) <= 80),
  occurred_at timestamptz not null default now(),
  detail text not null default '' check (char_length(detail) <= 200)
);

create index if not exists beta_participants_retention_idx on public.beta_participants(retention_at);
create index if not exists beta_feedback_retention_idx on public.beta_feedback(retention_at);
create index if not exists beta_feedback_user_idx on public.beta_feedback(user_id) where user_id is not null;
create index if not exists beta_rate_limits_expiry_idx on public.beta_rate_limits(expires_at);

alter table public.beta_participants enable row level security;
alter table public.beta_contact_preferences enable row level security;
alter table public.beta_feedback enable row level security;
alter table public.beta_privacy_requests enable row level security;
alter table public.beta_rate_limits enable row level security;
alter table public.beta_admin_audit enable row level security;

revoke all on table public.beta_participants from anon, authenticated;
revoke all on table public.beta_contact_preferences from anon, authenticated;
revoke all on table public.beta_feedback from anon, authenticated;
revoke all on table public.beta_privacy_requests from anon, authenticated;
revoke all on table public.beta_rate_limits from anon, authenticated;
revoke all on table public.beta_admin_audit from anon, authenticated;

create or replace function public.take_beta_rate_limit(
  p_key_digest text,
  p_route text,
  p_window_start timestamptz,
  p_expires_at timestamptz
)
returns integer
language sql
security definer
set search_path = ''
as $$
  insert into public.beta_rate_limits (
    key_digest,
    route,
    window_start,
    hits,
    expires_at
  ) values (
    p_key_digest,
    p_route,
    p_window_start,
    1,
    p_expires_at
  )
  on conflict (key_digest, route, window_start)
  do update set
    hits = public.beta_rate_limits.hits + 1,
    expires_at = excluded.expires_at
  returning hits;
$$;

revoke all on function public.take_beta_rate_limit(text, text, timestamptz, timestamptz)
  from public, anon, authenticated;
grant execute on function public.take_beta_rate_limit(text, text, timestamptz, timestamptz)
  to service_role;

create or replace function public.purge_expired_beta_records()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  expired_user uuid;
begin
  delete from public.beta_rate_limits where expires_at < now();
  delete from public.beta_feedback where retention_at < now();
  delete from public.beta_privacy_requests where requested_at < now() - interval '24 months';
  delete from public.beta_admin_audit where occurred_at < now() - interval '12 months';

  -- OTP requests can create an Auth user before a participant profile exists.
  -- Remove abandoned or failed registrations promptly rather than retaining
  -- an email address indefinitely.
  delete from auth.users as auth_user
  where auth_user.created_at < now() - interval '24 hours'
    and not exists (
      select 1 from public.beta_participants as participant
      where participant.user_id = auth_user.id
    );

  for expired_user in
    select user_id from public.beta_participants where retention_at < now()
  loop
    delete from public.beta_feedback where user_id = expired_user;
    delete from auth.users where id = expired_user;
  end loop;
end;
$$;

revoke all on function public.purge_expired_beta_records() from public, anon, authenticated;
grant execute on function public.purge_expired_beta_records() to service_role;

select cron.unschedule(jobid)
from cron.job
where jobname = 'hdrl-beta-retention';

select cron.schedule(
  'hdrl-beta-retention',
  '17 3 * * *',
  $$select public.purge_expired_beta_records();$$
);

comment on table public.beta_participants is
  'Verified beta administration profile only. Assessment content is prohibited.';
comment on table public.beta_feedback is
  'Deliberately submitted beta feedback. without_contact rows have no user key.';
