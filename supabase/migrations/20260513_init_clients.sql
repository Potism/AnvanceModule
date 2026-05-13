-- ============================================================================
--  Anvance Production – initial schema for the client analytical brief.
--
--  Apply via the Supabase dashboard (SQL editor) or `supabase db push`.
--  The application connects with the anon key and inserts rows on submit.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id                          uuid primary key default gen_random_uuid(),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  -- Brief metadata
  agent_name                  text,
  brief_date                  date,
  is_existing_client          boolean not null default false,
  client_since                text,

  -- Company
  company_name                text not null,
  business_type               text,
  vat_number                  text,
  tax_code                    text,

  -- Contact
  contact_name                text not null,
  contact_role                text,
  email                       text not null,
  phone                       text,
  website                     text,

  -- Address
  address                     text,
  city                        text,
  postal_code                 text,
  province                    text,
  country                     text default 'Italia',

  -- Punto vendita
  employees_count             text,
  store_location              text check (store_location in ('centro','periferia','online_only','mixed')),
  surface_sqm                 text,
  annual_revenue              text,
  customer_flow               text[] default '{}',
  flagship_product            text,
  local_competitors           text,

  -- Identità brand
  has_logo                    boolean,
  logo_year                   text,
  brand_colors                text,
  brand_fonts                 text,
  brand_guidelines_url        text,
  promo_materials             text[] default '{}',
  materials_coordinated       text check (materials_coordinated in ('si','no','non_so')),
  signage_coordinated         text check (signage_coordinated in ('si','no','non_so')),

  -- Sito web
  has_website                 text check (has_website in ('si','no','non_so','in_arrivo')),
  website_year                text,
  website_updated_regularly   text check (website_updated_regularly in ('si','no','non_so')),
  website_seo_optimised       text check (website_seo_optimised in ('si','no','non_so')),
  website_page_count          text,
  website_sections            text[] default '{}',
  website_vendor              text,

  -- Social
  social_active               text check (social_active in ('si','no','non_so','in_arrivo')),
  social_channels             text[] default '{}',
  social_frequency            text,
  social_managed_by           text,
  social_vendor               text,
  social_tone                 text check (social_tone in ('professionale','amichevole','tecnico','indefinito')),

  -- GMB
  gmb_active                  text check (gmb_active in ('si','no','non_so','in_arrivo')),
  gmb_up_to_date              text check (gmb_up_to_date in ('si','no','non_so')),
  gmb_has_reviews             text check (gmb_has_reviews in ('si','no','non_so')),

  -- Marketing automation
  newsletter_active           text check (newsletter_active in ('si','no','non_so')),
  newsletter_frequency        text,
  newsletter_vendor           text,
  newsletter_platform         text,
  whatsapp_active             text check (whatsapp_active in ('si','no','non_so')),
  whatsapp_frequency          text,

  -- Sponsorizzazioni
  online_ads_active           text check (online_ads_active in ('si','no','non_so','in_arrivo')),
  online_ads_channels         text[] default '{}',
  online_ads_vendor           text,
  offline_ads_active          text check (offline_ads_active in ('si','no','non_so','in_arrivo')),
  offline_ads_channels        text[] default '{}',
  offline_ads_vendor          text,

  -- Servizi richiesti
  project_type                text[] default '{}',
  services_brand              text[] default '{}',
  services_social             text[] default '{}',
  services_ads                text[] default '{}',
  services_web                text[] default '{}',
  pain_points                 text[] default '{}',
  project_description         text,
  budget_range                text,
  timeline                    text,

  -- Video / foto specifics
  video_style                 text,
  video_duration              text,
  location_preference         text,
  talent_needed               boolean not null default false,
  equipment_notes             text,

  -- Website specifics
  website_type                text,
  website_features            text[] default '{}',
  hosting_preference          text,
  domain_name                 text,

  -- Audience
  target_audience             text,
  competitors                 text,

  -- Admin
  status                      text not null default 'new'
                              check (status in ('new','contacted','in_progress','completed','archived')),
  notes                       text,
  assigned_to                 text
);

-- Auto-update `updated_at`.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create index if not exists clients_created_at_idx on public.clients (created_at desc);
create index if not exists clients_status_idx     on public.clients (status);

-- ============================================================================
--  Row Level Security
--
--  The public client brief form needs to INSERT new rows. Reading is reserved
--  to authenticated users (admin dashboard).
-- ============================================================================

alter table public.clients enable row level security;

drop policy if exists "Anyone can submit a brief" on public.clients;
create policy "Anyone can submit a brief"
  on public.clients
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read briefs" on public.clients;
create policy "Authenticated can read briefs"
  on public.clients
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update briefs" on public.clients;
create policy "Authenticated can update briefs"
  on public.clients
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete briefs" on public.clients;
create policy "Authenticated can delete briefs"
  on public.clients
  for delete
  to authenticated
  using (true);
