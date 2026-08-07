-- Apply prompt cleanup of abandoned email-verification records to an existing
-- beta deployment. The scheduled job already calls this function by name.

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
