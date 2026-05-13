-- ============================================================================
--  Anvance Production – simplified brief schema patch (2026-05-14).
--
--  Adds the new "direct service" columns introduced when the input module
--  was simplified. Legacy columns (punto vendita, identità, presenza
--  digitale, marketing automation) are kept intact for historical briefs.
--
--  Idempotent: safe to run multiple times.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Website (new direct fields)
-- ----------------------------------------------------------------------------
alter table public.clients add column if not exists wants_website            boolean;
alter table public.clients add column if not exists website_platform         text;
alter table public.clients add column if not exists website_purpose          text;
alter table public.clients add column if not exists current_website_status   text;

-- ----------------------------------------------------------------------------
-- 2. Logo & brand identity
-- ----------------------------------------------------------------------------
alter table public.clients add column if not exists wants_new_logo           boolean;
alter table public.clients add column if not exists logo_style_preference    text;
alter table public.clients add column if not exists logo_palette_preference  text;
alter table public.clients add column if not exists brand_references         text;

-- ----------------------------------------------------------------------------
-- 3. Social media
-- ----------------------------------------------------------------------------
alter table public.clients add column if not exists current_social_channels  text[] default '{}';
alter table public.clients add column if not exists wants_social_management  boolean;
alter table public.clients add column if not exists social_management_goals  text;

-- ----------------------------------------------------------------------------
-- 4. Video & photography
-- ----------------------------------------------------------------------------
alter table public.clients add column if not exists wants_short_videos       boolean;
alter table public.clients add column if not exists wants_long_videos        boolean;
alter table public.clients add column if not exists wants_cinematic_videos   boolean;
alter table public.clients add column if not exists wants_photography        boolean;
alter table public.clients add column if not exists video_photo_notes        text;

-- ----------------------------------------------------------------------------
-- 5. Graphic design
-- ----------------------------------------------------------------------------
alter table public.clients add column if not exists wants_graphic_design     boolean;
alter table public.clients add column if not exists graphic_design_items     text[] default '{}';

-- ----------------------------------------------------------------------------
-- 6. Ads management
-- ----------------------------------------------------------------------------
alter table public.clients add column if not exists wants_ads_management     boolean;
alter table public.clients add column if not exists ads_platforms            text[] default '{}';
alter table public.clients add column if not exists ads_monthly_budget       text;
alter table public.clients add column if not exists ads_previous_experience  boolean;

-- ----------------------------------------------------------------------------
-- 7. Enum-like check constraints (drop & re-create for idempotency)
-- ----------------------------------------------------------------------------
do $$
declare
  c record;
begin
  for c in
    select * from (values
      ('website_platform_chk',         $sql$website_platform in ('wordpress','custom_code','undecided')$sql$),
      ('current_website_status_chk',   $sql$current_website_status in ('nessuno','obsoleto','funzionante')$sql$),
      ('website_purpose_chk',          $sql$website_purpose in ('vetrina','ecommerce','landing','booking','portfolio','webapp')$sql$),
      ('ads_monthly_budget_chk',       $sql$ads_monthly_budget in ('under_300','300_700','700_1500','1500_3000','over_3000','discuss')$sql$)
    ) as t(name, expr)
  loop
    execute format('alter table public.clients drop constraint if exists %I', c.name);
    execute format('alter table public.clients add  constraint %I check (%s)', c.name, c.expr);
  end loop;
end$$;

-- ----------------------------------------------------------------------------
-- 8. Refresh PostgREST schema cache so the new columns are visible immediately.
-- ----------------------------------------------------------------------------
notify pgrst, 'reload schema';
