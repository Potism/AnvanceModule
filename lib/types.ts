/**
 * Anvance Production – data model for the client analytical brief.
 *
 * The brief mirrors a classic "scheda di analisi preliminare" but is
 * rebranded for Anvance Production: cinematic video, reels, long-form
 * YouTube content, professional photography and high-quality custom-coded,
 * scalable websites (no off-the-shelf WordPress templates).
 */

export type ClientStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "archived"

export type StoreLocation = "centro" | "periferia" | "online_only" | "mixed"

export type ToneOfVoice = "professionale" | "amichevole" | "tecnico" | "indefinito"

export type Frequency =
  | "3_5_settimana"
  | "1_settimana"
  | "1_mese"
  | "3_5_anno"
  | "mai"

export interface Client {
  id: string
  created_at: string
  updated_at: string

  /* — Agent / submission metadata — */
  agent_name: string | null
  brief_date: string | null
  is_existing_client: boolean
  client_since: string | null

  /* — Company — */
  company_name: string
  business_type: string | null
  vat_number: string | null
  tax_code: string | null

  /* — Contact — */
  contact_name: string
  contact_role: string | null
  email: string
  phone: string | null
  website: string | null

  /* — Address — */
  address: string | null
  city: string | null
  postal_code: string | null
  province: string | null
  country: string | null

  /* — Punto vendita / store profile — */
  employees_count: string | null
  store_location: StoreLocation | null
  surface_sqm: string | null
  annual_revenue: string | null
  customer_flow: string[] | null
  flagship_product: string | null
  local_competitors: string | null

  /* — Identità di brand — */
  has_logo: boolean | null
  logo_year: string | null
  brand_colors: string | null
  brand_fonts: string | null
  brand_guidelines_url: string | null
  promo_materials: string[] | null
  materials_coordinated: "si" | "no" | "non_so" | null
  signage_coordinated: "si" | "no" | "non_so" | null

  /* — Presenza digitale: sito web — */
  has_website: "si" | "no" | "non_so" | "in_arrivo" | null
  website_year: string | null
  website_updated_regularly: "si" | "no" | "non_so" | null
  website_seo_optimised: "si" | "no" | "non_so" | null
  website_page_count: string | null
  website_sections: string[] | null
  website_vendor: string | null

  /* — Presenza digitale: social media — */
  social_active: "si" | "no" | "non_so" | "in_arrivo" | null
  social_channels: string[] | null
  social_frequency: Frequency | null
  social_managed_by: string | null
  social_vendor: string | null
  social_tone: ToneOfVoice | null

  /* — Google Business — */
  gmb_active: "si" | "no" | "non_so" | "in_arrivo" | null
  gmb_up_to_date: "si" | "no" | "non_so" | null
  gmb_has_reviews: "si" | "no" | "non_so" | null

  /* — Marketing automation — */
  newsletter_active: "si" | "no" | "non_so" | null
  newsletter_frequency: Frequency | null
  newsletter_vendor: string | null
  newsletter_platform: string | null
  whatsapp_active: "si" | "no" | "non_so" | null
  whatsapp_frequency: Frequency | null

  /* — Sponsorizzazioni — */
  online_ads_active: "si" | "no" | "non_so" | "in_arrivo" | null
  online_ads_channels: string[] | null
  online_ads_vendor: string | null
  offline_ads_active: "si" | "no" | "non_so" | "in_arrivo" | null
  offline_ads_channels: string[] | null
  offline_ads_vendor: string | null

  /* — Servizi richiesti / project requirements — */
  project_type: string[] | null
  services_brand: string[] | null
  services_social: string[] | null
  services_ads: string[] | null
  services_web: string[] | null
  pain_points: string[] | null
  project_description: string | null
  budget_range: string | null
  timeline: string | null

  /* — Video & photo specifics — */
  video_style: string | null
  video_duration: string | null
  location_preference: string | null
  talent_needed: boolean
  equipment_notes: string | null

  /* — Website specifics — */
  website_type: string | null
  website_features: string[] | null
  hosting_preference: string | null
  domain_name: string | null

  /* — Brand information (audience) — */
  target_audience: string | null
  competitors: string | null

  /* — Admin metadata — */
  status: ClientStatus
  notes: string | null
  assigned_to: string | null
}

export type ClientFormData = Omit<
  Client,
  "id" | "created_at" | "updated_at" | "status" | "notes" | "assigned_to"
>

/* ------------------------------------------------------------------ */
/*  Option lists – kept here so both UI and PDF generator stay in sync */
/* ------------------------------------------------------------------ */

export const PROJECT_TYPES = [
  { value: "cinematic_video", label: "Video Cinematografico" },
  { value: "reels", label: "Reels & Short-form" },
  { value: "youtube", label: "YouTube Long-form" },
  { value: "photography", label: "Fotografia Professionale" },
  { value: "website", label: "Sito Web Custom" },
  { value: "branding", label: "Brand Identity" },
  { value: "social_management", label: "Social Media Management" },
  { value: "ads", label: "Advertising / Sponsorizzazioni" },
] as const

export const WEBSITE_TYPES = [
  { value: "e-commerce", label: "E-Commerce" },
  { value: "portfolio", label: "Portfolio / Showcase" },
  { value: "corporate", label: "Corporate" },
  { value: "landing", label: "Landing Page" },
  { value: "webapp", label: "Web Application" },
  { value: "booking", label: "Booking / Prenotazioni" },
] as const

export const VIDEO_STYLES = [
  { value: "cinematic", label: "Cinematografico / Film-like" },
  { value: "documentary", label: "Documentario" },
  { value: "commercial", label: "Commerciale / Pubblicitario" },
  { value: "corporate", label: "Corporate" },
  { value: "social", label: "Ottimizzato Social" },
  { value: "event", label: "Copertura Eventi" },
  { value: "reels", label: "Reels / Short-form" },
  { value: "youtube", label: "YouTube Long-form" },
] as const

export const BUDGET_RANGES = [
  { value: "under_500", label: "Fino a € 500 / mese" },
  { value: "500_1000", label: "€ 500 – € 1.000 / mese" },
  { value: "1000_2500", label: "€ 1.000 – € 2.500 / mese" },
  { value: "2500_5000", label: "€ 2.500 – € 5.000 / mese" },
  { value: "over_5000", label: "Oltre € 5.000 / mese" },
  { value: "one_off_3000_10000", label: "Progetto una tantum € 3k – € 10k" },
  { value: "one_off_10000_plus", label: "Progetto una tantum € 10k+" },
  { value: "discuss", label: "Da discutere" },
] as const

export const TIMELINES = [
  { value: "urgent", label: "Urgente (1-2 settimane)" },
  { value: "standard", label: "Standard (1-2 mesi)" },
  { value: "flexible", label: "Flessibile (3+ mesi)" },
  { value: "ongoing", label: "Continuativo / Retainer" },
] as const

export const CUSTOMER_FLOW_OPTIONS = [
  "molto_traffico",
  "poco_traffico",
  "clientela_fidelizzata",
  "traffico_poche_vendite",
  "traffico_comunicazione_scarsa",
  "clientela_discontinua",
] as const

export const PROMO_MATERIALS_OPTIONS = [
  "biglietti_visita",
  "brochure",
  "catalogo",
  "volantini",
  "segnaletica",
] as const

export const WEBSITE_SECTIONS = [
  "homepage",
  "chi_siamo",
  "servizi",
  "contatti",
  "assistenza",
  "recensioni",
  "catalogo",
  "shop",
  "blog",
] as const

export const SOCIAL_CHANNELS = [
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "youtube",
  "x",
  "pinterest",
] as const

export const ONLINE_AD_CHANNELS = [
  "google",
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "youtube",
  "altro",
] as const

export const OFFLINE_AD_CHANNELS = [
  "stampa",
  "tv_radio",
  "cartelloni",
  "eventi",
  "volantini",
] as const

export const SERVICES_BRAND = [
  "brand_analysis",
  "logo_from_scratch",
  "logo_digitisation",
  "coordinated_image",
  "print_management",
  "store_restyling",
  "merchandising",
  "team_photoshoot",
] as const

export const SERVICES_SOCIAL = [
  "social_strategy",
  "editorial_plan",
  "content_from_client",
  "studio_content",
  "corporate_video",
  "fb_ig_management",
  "tiktok_management",
  "linkedin_management",
  "gmb_management",
  "monthly_reporting",
  "media_plan",
] as const

export const SERVICES_ADS = [
  "ads_strategy",
  "google_ads",
  "meta_ads",
  "linkedin_ads",
  "tiktok_ads",
  "ads_reporting",
  "training",
  "in_store_problem_solving",
] as const

export const SERVICES_WEB = [
  "custom_coded_website",
  "ecommerce",
  "newsletter_setup",
  "site_maintenance",
  "accessibility",
  "seo",
  "landing_page",
  "web_app",
] as const

export const PAIN_POINTS = [
  "logo_not_memorable",
  "off_brand_perception",
  "no_social_resources",
  "low_online_visibility",
  "no_professional_content",
  "outdated_gmb",
  "no_marketing_strategy",
  "communication_hard",
  "selling_services_hard",
  "low_reviews",
  "no_time_to_reply",
  "cannot_reach_younger_audience",
] as const

export const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "3_5_settimana", label: "3-5 volte a settimana" },
  { value: "1_settimana", label: "1 volta a settimana" },
  { value: "1_mese", label: "1 volta al mese" },
  { value: "3_5_anno", label: "3-5 volte all'anno" },
  { value: "mai", label: "Mai" },
]
