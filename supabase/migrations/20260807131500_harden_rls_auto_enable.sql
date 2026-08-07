-- Supabase creates this helper when automatic RLS is enabled for new tables.
-- It is invoked by database event-trigger infrastructure and does not need to
-- be callable through the exposed API roles.

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end
$$;
