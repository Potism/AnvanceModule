-- ============================================================================
--  Dashboard: allow the browser (anon key) to list, edit, and delete briefs.
--
--  By default only `authenticated` could SELECT/UPDATE/DELETE; inserts used
--  `anon` from the public form, so submissions never appeared in /admin.
--
--  SECURITY: anyone with your anon key can read/modify all rows. Protect
--  /admin with Vercel Password Protection, Cloudflare Access, or Supabase Auth,
--  and prefer a service-role server API in production instead of this policy.
-- ============================================================================

drop policy if exists "Anon can read briefs for dashboard" on public.clients;
create policy "Anon can read briefs for dashboard"
  on public.clients for select
  to anon
  using (true);

drop policy if exists "Anon can update briefs for dashboard" on public.clients;
create policy "Anon can update briefs for dashboard"
  on public.clients for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Anon can delete briefs for dashboard" on public.clients;
create policy "Anon can delete briefs for dashboard"
  on public.clients for delete
  to anon
  using (true);

notify pgrst, 'reload schema';
