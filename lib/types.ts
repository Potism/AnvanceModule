/**
 * Anvance Production – data model for the client analytical brief.
 *
 * The new brief is structured around the *actual* services Anvance sells:
 * a custom website (or WordPress), a new logo, social media management,
 * video (reels / long-form / cinematic), photography, graphic design and
 * ads management — each with its own concrete sub-questions so the team
 * can quote the project directly from the form.
 *
 * Legacy "punto vendita / identità / presenza digitale / marketing" fields
 * are kept on the type & DB schema for backward compatibility, but are no
 * longer collected through the UI.
 */

export type ClientStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "archived"

/** Mesi di impegno sui canoni mensili nel preventivo (PDF: quantità × canone). */
export type RetainerContractMonths = 1 | 3 | 6 | 12

export type StoreLocation = "centro" | "periferia" | "online_only" | "mixed"

export type ToneOfVoice = "professionale" | "amichevole" | "tecnico" | "indefinito"

export type Frequency =
  | "3_5_settimana"
  | "1_settimana"
  | "1_mese"
  | "3_5_anno"
  | "mai"

export type WebsitePlatform = "wordpress" | "custom_code" | "undecided"

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

  /* =================================================================
   *  NEW — Direct service requests (the heart of the brief)
   * ================================================================= */

  /* Website */
  wants_website: boolean | null
  website_platform: WebsitePlatform | null
  website_purpose: string | null
  current_website_status: "nessuno" | "obsoleto" | "funzionante" | null

  /* Logo & brand identity */
  wants_new_logo: boolean | null
  logo_style_preference: string | null
  logo_palette_preference: string | null
  brand_references: string | null

  /* Social media */
  current_social_channels: string[] | null
  wants_social_management: boolean | null
  social_management_goals: string | null

  /* Video & photo */
  wants_short_videos: boolean | null
  wants_long_videos: boolean | null
  wants_cinematic_videos: boolean | null
  wants_photography: boolean | null
  video_photo_notes: string | null

  /* Graphic design */
  wants_graphic_design: boolean | null
  graphic_design_items: string[] | null

  /* Ads management */
  wants_ads_management: boolean | null
  ads_platforms: string[] | null
  ads_monthly_budget: string | null
  ads_previous_experience: boolean | null

  /* — Project meta — */
  pain_points: string[] | null
  project_description: string | null
  budget_range: string | null
  timeline: string | null
  /** Impegno sui canoni mensili nel preventivo (1 = solo mese corrente). */
  retainer_contract_months?: RetainerContractMonths | null
  target_audience: string | null
  competitors: string | null

  /* — Admin metadata — */
  status: ClientStatus
  notes: string | null
  assigned_to: string | null

  /* =================================================================
   *  Legacy fields — preserved on the DB for historical briefs.
   *  Not collected through the new simplified UI.
   * ================================================================= */
  employees_count?: string | null
  store_location?: StoreLocation | null
  surface_sqm?: string | null
  annual_revenue?: string | null
  customer_flow?: string[] | null
  flagship_product?: string | null
  local_competitors?: string | null

  has_logo?: boolean | null
  logo_year?: string | null
  brand_colors?: string | null
  brand_fonts?: string | null
  brand_guidelines_url?: string | null
  promo_materials?: string[] | null
  materials_coordinated?: "si" | "no" | "non_so" | null
  signage_coordinated?: "si" | "no" | "non_so" | null

  has_website?: "si" | "no" | "non_so" | "in_arrivo" | null
  website_year?: string | null
  website_updated_regularly?: "si" | "no" | "non_so" | null
  website_seo_optimised?: "si" | "no" | "non_so" | null
  website_page_count?: string | null
  website_sections?: string[] | null
  website_vendor?: string | null

  social_active?: "si" | "no" | "non_so" | "in_arrivo" | null
  social_channels?: string[] | null
  social_frequency?: Frequency | null
  social_managed_by?: string | null
  social_vendor?: string | null
  social_tone?: ToneOfVoice | null

  gmb_active?: "si" | "no" | "non_so" | "in_arrivo" | null
  gmb_up_to_date?: "si" | "no" | "non_so" | null
  gmb_has_reviews?: "si" | "no" | "non_so" | null

  newsletter_active?: "si" | "no" | "non_so" | null
  newsletter_frequency?: Frequency | null
  newsletter_vendor?: string | null
  newsletter_platform?: string | null
  whatsapp_active?: "si" | "no" | "non_so" | null
  whatsapp_frequency?: Frequency | null

  online_ads_active?: "si" | "no" | "non_so" | "in_arrivo" | null
  online_ads_channels?: string[] | null
  online_ads_vendor?: string | null
  offline_ads_active?: "si" | "no" | "non_so" | "in_arrivo" | null
  offline_ads_channels?: string[] | null
  offline_ads_vendor?: string | null

  project_type?: string[] | null
  services_brand?: string[] | null
  services_social?: string[] | null
  services_ads?: string[] | null
  services_web?: string[] | null
  video_style?: string | null
  video_duration?: string | null
  location_preference?: string | null
  talent_needed?: boolean
  equipment_notes?: string | null
  website_type?: string | null
  website_features?: string[] | null
  hosting_preference?: string | null
  domain_name?: string | null
}

export type ClientFormData = Omit<
  Client,
  "id" | "created_at" | "updated_at" | "status" | "notes" | "assigned_to"
>

/* ------------------------------------------------------------------ */
/*  Option lists                                                       */
/* ------------------------------------------------------------------ */

export const WEBSITE_PLATFORMS: { value: WebsitePlatform; label: string }[] = [
  { value: "custom_code", label: "Custom code — più scalabile, veloce, sicuro" },
  { value: "wordpress", label: "WordPress — più rapido, basato su template" },
  { value: "undecided", label: "Non so, voglio un consiglio" },
]

export const WEBSITE_PURPOSES = [
  "vetrina",
  "ecommerce",
  "landing",
  "booking",
  "portfolio",
  "webapp",
] as const

export const CURRENT_WEBSITE_STATUS_OPTIONS = [
  "nessuno",
  "obsoleto",
  "funzionante",
] as const

export const LOGO_STYLES = [
  "minimal",
  "elegante",
  "moderno",
  "classico",
  "audace",
  "vintage",
  "playful",
  "lusso",
] as const

export const SOCIAL_CHANNELS = [
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "linkedin",
  "x",
  "pinterest",
] as const

export const GRAPHIC_DESIGN_ITEMS = [
  "post_social",
  "biglietti_visita",
  "brochure",
  "catalogo",
  "volantini",
  "locandine",
  "menu",
  "packaging",
  "presentazioni",
] as const

export const ADS_PLATFORMS = [
  "google",
  "meta",
  "tiktok",
  "youtube",
  "linkedin",
] as const

export const ADS_MONTHLY_BUDGETS = [
  { value: "under_300", label: "Fino a € 300 / mese" },
  { value: "300_700", label: "€ 300 – € 700 / mese" },
  { value: "700_1500", label: "€ 700 – € 1.500 / mese" },
  { value: "1500_3000", label: "€ 1.500 – € 3.000 / mese" },
  { value: "over_3000", label: "Oltre € 3.000 / mese" },
  { value: "discuss", label: "Da discutere" },
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

export const PAIN_POINTS = [
  "low_online_visibility",
  "no_professional_content",
  "no_social_resources",
  "no_marketing_strategy",
  "logo_not_memorable",
  "off_brand_perception",
  "communication_hard",
  "selling_services_hard",
  "low_reviews",
  "cannot_reach_younger_audience",
] as const

/* Kept for backward compatibility with legacy PDFs & DB */
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
