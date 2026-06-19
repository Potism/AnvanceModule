-- Packages in shared listino + simplified per-client quote (package or custom total).

alter table public.app_settings
  add column if not exists packages jsonb not null default '[]'::jsonb;

comment on column public.app_settings.packages is
  'Array of { id, name, services[], totalPrice, billing, active } — team package templates.';

alter table public.clients
  add column if not exists quote_config jsonb not null default '{}'::jsonb;

comment on column public.clients.quote_config is
  'Quote mode: package (snapshot) or custom total + included services. Frozen at submit — listino edits do not change saved briefs.';

notify pgrst, 'reload schema';
