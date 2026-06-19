-- Per-client quote prices set during final onboarding (override shared listino for this brief).

alter table public.clients
  add column if not exists quote_prices jsonb not null default '{}'::jsonb;

comment on column public.clients.quote_prices is
  'Custom € prices per listino key for this brief; used in preventivo PDF. Empty = use shared listino only.';

notify pgrst, 'reload schema';
