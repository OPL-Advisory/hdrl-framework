-- Least-privilege grants for the Edge Function's server-only service role.
-- Browser roles retain no access to any operational table.

grant usage on schema public to service_role;

grant select, insert, update, delete
  on table public.beta_participants
  to service_role;

grant select, insert, update, delete
  on table public.beta_contact_preferences
  to service_role;

grant select, insert, delete
  on table public.beta_feedback
  to service_role;

grant insert
  on table public.beta_privacy_requests
  to service_role;
