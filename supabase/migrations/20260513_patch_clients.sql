-- ============================================================================
--  Anvance Production – idempotent patch for the `public.clients` table.
--
--  Run this if you already have an older `clients` table (e.g. the one created
--  by an earlier build of the form) and need to bring it up to the new schema
--  without losing data.
--
--  Apply via Supabase Dashboard → SQL editor (or `supabase db push`).
--  The script is fully idempotent: you can run it multiple times safely.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Ensure the table exists with the bare minimum (no-op if already present).
-- ----------------------------------------------------------------------------
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  company_name  text not null,
  contact_name  text not null,
  email         text not null
);

-- ----------------------------------------------------------------------------
-- 2. Add every column the form expects (safe on re-run).
-- ----------------------------------------------------------------------------

-- Brief metadata
alter table public.clients add column if not exists agent_name                text;
alter table public.clients add column if not exists brief_date                date;
alter table public.clients add column if not exists is_existing_client        boolean not null default false;
alter table public.clients add column if not exists client_since              text;

-- Company / contact extras
alter table public.clients add column if not exists business_type             text;
alter table public.clients add column if not exists vat_number                text;
alter table public.clients add column if not exists tax_code                  text;
alter table public.clients add column if not exists contact_role              text;
alter table public.clients add column if not exists phone                     text;
alter table public.clients add column if not exists website                   text;

-- Address
alter table public.clients add column if not exists address                   text;
alter table public.clients add column if not exists city                      text;
alter table public.clients add column if not exists postal_code               text;
alter table public.clients add column if not exists province                  text;
alter table public.clients add column if not exists country                   text default 'Italia';

-- Punto vendita
alter table public.clients add column if not exists employees_count           text;
alter table public.clients add column if not exists store_location            text;
alter table public.clients add column if not exists surface_sqm               text;
alter table public.clients add column if not exists annual_revenue            text;
alter table public.clients add column if not exists customer_flow             text[] default '{}';
alter table public.clients add column if not exists flagship_product          text;
alter table public.clients add column if not exists local_competitors         text;

-- Identità brand
alter table public.clients add column if not exists has_logo                  boolean;
alter table public.clients add column if not exists logo_year                 text;
alter table public.clients add column if not exists brand_colors              text;
alter table public.clients add column if not exists brand_fonts               text;
alter table public.clients add column if not exists brand_guidelines_url      text;
alter table public.clients add column if not exists promo_materials           text[] default '{}';
alter table public.clients add column if not exists materials_coordinated     text;
alter table public.clients add column if not exists signage_coordinated       text;

-- Sito web
alter table public.clients add column if not exists has_website               text;
alter table public.clients add column if not exists website_year              text;
alter table public.clients add column if not exists website_updated_regularly text;
alter table public.clients add column if not exists website_seo_optimised     text;
alter table public.clients add column if not exists website_page_count        text;
alter table public.clients add column if not exists website_sections          text[] default '{}';
alter table public.clients add column if not exists website_vendor            text;

-- Social
alter table public.clients add column if not exists social_active             text;
alter table public.clients add column if not exists social_channels           text[] default '{}';
alter table public.clients add column if not exists social_frequency          text;
alter table public.clients add column if not exists social_managed_by         text;
alter table public.clients add column if not exists social_vendor             text;
alter table public.clients add column if not exists social_tone               text;

-- Google Business
alter table public.clients add column if not exists gmb_active                text;
alter table public.clients add column if not exists gmb_up_to_date            text;
alter table public.clients add column if not exists gmb_has_reviews           text;

-- Marketing automation
alter table public.clients add column if not exists newsletter_active         text;
alter table public.clients add column if not exists newsletter_frequency      text;
alter table public.clients add column if not exists newsletter_vendor         text;
alter table public.clients add column if not exists newsletter_platform       text;
alter table public.clients add column if not exists whatsapp_active           text;
alter table public.clients add column if not exists whatsapp_frequency        text;

-- Sponsorizzazioni
alter table public.clients add column if not exists online_ads_active         text;
alter table public.clients add column if not exists online_ads_channels       text[] default '{}';
alter table public.clients add column if not exists online_ads_vendor         text;
alter table public.clients add column if not exists offline_ads_active        text;
alter table public.clients add column if not exists offline_ads_channels      text[] default '{}';
alter table public.clients add column if not exists offline_ads_vendor        text;

-- Servizi richiesti
alter table public.clients add column if not exists project_type              text[] default '{}';
alter table public.clients add column if not exists services_brand            text[] default '{}';
alter table public.clients add column if not exists services_social           text[] default '{}';
alter table public.clients add column if not exists services_ads              text[] default '{}';
alter table public.clients add column if not exists services_web              text[] default '{}';
alter table public.clients add column if not exists pain_points               text[] default '{}';
alter table public.clients add column if not exists project_description       text;
alter table public.clients add column if not exists budget_range              text;
alter table public.clients add column if not exists timeline                  text;

-- Video / foto specifics
alter table public.clients add column if not exists video_style               text;
alter table public.clients add column if not exists video_duration            text;
alter table public.clients add column if not exists location_preference       text;
alter table public.clients add column if not exists talent_needed             boolean not null default false;
alter table public.clients add column if not exists equipment_notes           text;

-- Website specifics
alter table public.clients add column if not exists website_type              text;
alter table public.clients add column if not exists website_features          text[] default '{}';
alter table public.clients add column if not exists hosting_preference        text;
alter table public.clients add column if not exists domain_name               text;

-- Audience
alter table public.clients add column if not exists target_audience           text;
alter table public.clients add column if not exists competitors               text;

-- Admin
alter table public.clients add column if not exists status                    text not null default 'new';
alter table public.clients add column if not exists notes                     text;
alter table public.clients add column if not exists assigned_to               text;

-- ----------------------------------------------------------------------------
-- 3. (Re)apply check constraints so the database mirrors the form's enums.
--    Drop-then-create is idempotent and tolerates running the script again.
-- ----------------------------------------------------------------------------
do $$
declare
  c record;
begin
  for c in
    select * from (values
      ('store_location_chk',           $sql$store_location in ('centro','periferia','online_only','mixed')$sql$),
      ('materials_coordinated_chk',    $sql$materials_coordinated in ('si','no','non_so')$sql$),
      ('signage_coordinated_chk',      $sql$signage_coordinated in ('si','no','non_so')$sql$),
      ('has_website_chk',              $sql$has_website in ('si','no','non_so','in_arrivo')$sql$),
      ('website_updated_regularly_chk',$sql$website_updated_regularly in ('si','no','non_so')$sql$),
      ('website_seo_optimised_chk',    $sql$website_seo_optimised in ('si','no','non_so')$sql$),
      ('social_active_chk',            $sql$social_active in ('si','no','non_so','in_arrivo')$sql$),
      ('social_tone_chk',              $sql$social_tone in ('professionale','amichevole','tecnico','indefinito')$sql$),
      ('gmb_active_chk',               $sql$gmb_active in ('si','no','non_so','in_arrivo')$sql$),
      ('gmb_up_to_date_chk',           $sql$gmb_up_to_date in ('si','no','non_so')$sql$),
      ('gmb_has_reviews_chk',          $sql$gmb_has_reviews in ('si','no','non_so')$sql$),
      ('newsletter_active_chk',        $sql$newsletter_active in ('si','no','non_so')$sql$),
      ('whatsapp_active_chk',          $sql$whatsapp_active in ('si','no','non_so')$sql$),
      ('online_ads_active_chk',        $sql$online_ads_active in ('si','no','non_so','in_arrivo')$sql$),
      ('offline_ads_active_chk',       $sql$offline_ads_active in ('si','no','non_so','in_arrivo')$sql$),
      ('status_chk',                   $sql$status in ('new','contacted','in_progress','completed','archived')$sql$)
    ) as t(name, expr)
  loop
    execute format('alter table public.clients drop constraint if exists %I', c.name);
    execute format('alter table public.clients add  constraint %I check (%s)', c.name, c.expr);
  end loop;
end$$;

-- ----------------------------------------------------------------------------
-- 4. Auto-update trigger for `updated_at`.
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Indexes.
-- ----------------------------------------------------------------------------
create index if not exists clients_created_at_idx on public.clients (created_at desc);
create index if not exists clients_status_idx     on public.clients (status);

-- ----------------------------------------------------------------------------
-- 6. Row Level Security (idempotent).
-- ----------------------------------------------------------------------------
alter table public.clients enable row level security;

drop policy if exists "Anyone can submit a brief"        on public.clients;
drop policy if exists "Authenticated can read briefs"    on public.clients;
drop policy if exists "Authenticated can update briefs"  on public.clients;
drop policy if exists "Authenticated can delete briefs"  on public.clients;

create policy "Anyone can submit a brief"
  on public.clients for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated can read briefs"
  on public.clients for select
  to authenticated using (true);

create policy "Authenticated can update briefs"
  on public.clients for update
  to authenticated using (true) with check (true);

create policy "Authenticated can delete briefs"
  on public.clients for delete
  to authenticated using (true);

-- ----------------------------------------------------------------------------
-- 7. Refresh PostgREST schema cache so the new columns are visible immediately.
-- ----------------------------------------------------------------------------
notify pgrst, 'reload schema';
