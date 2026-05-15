-- ============================================================================
--  Security: remove anon read/update/delete on clients (dashboard was open).
--  Team-only app: brief insert requires authenticated session.
--  Listino: shared app_settings row (pricing, billing modes, active flags).
-- ============================================================================

-- Revoke insecure anon policies added in 20260515_admin_dashboard_rls.sql
drop policy if exists "Anon can read briefs for dashboard" on public.clients;
drop policy if exists "Anon can update briefs for dashboard" on public.clients;
drop policy if exists "Anon can delete briefs for dashboard" on public.clients;

-- Brief submit: authenticated team only (login required via middleware)
drop policy if exists "Anyone can submit a brief" on public.clients;
create policy "Authenticated can submit a brief"
  on public.clients
  for insert
  to authenticated
  with check (true);

-- --------------------------------------------------------------------------
--  Shared listino (pricing) — one row, all team members see the same values
-- --------------------------------------------------------------------------

create table if not exists public.app_settings (
  id              text primary key,
  pricing         jsonb not null default '{}'::jsonb,
  line_billing    jsonb not null default '{}'::jsonb,
  pricing_active  jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

alter table public.app_settings enable row level security;

drop policy if exists "Authenticated can read settings" on public.app_settings;
create policy "Authenticated can read settings"
  on public.app_settings for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert settings" on public.app_settings;
create policy "Authenticated can insert settings"
  on public.app_settings for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update settings" on public.app_settings;
create policy "Authenticated can update settings"
  on public.app_settings for update
  to authenticated
  using (true)
  with check (true);

insert into public.app_settings (id, pricing, line_billing, pricing_active)
values ('listino', '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
