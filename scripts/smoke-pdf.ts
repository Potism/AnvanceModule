/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Smoke-test the Anvance Production PDF generator with a fully-populated
 * mock client. Writes the output to /tmp/anvance_smoke.pdf for inspection.
 *
 * Run with:   pnpm tsx scripts/smoke-pdf.ts
 *             (or  node_modules/.bin/tsx scripts/smoke-pdf.ts)
 */

import fs from "node:fs"
import { buildClientPDF } from "../lib/pdf-generator"
import type { Client } from "../lib/types"

const mock: Client = {
  id: "abc12345-6789-4def-9012-345678901234",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  agent_name: "Alessio Rossi",
  brief_date: "2026-05-13",
  is_existing_client: true,
  client_since: "2024-09",

  company_name: "Boutique Aurora",
  business_type: "Retail moda donna",
  vat_number: "IT01234567890",
  tax_code: "RSSMRA80A01H501Z",

  contact_name: "Maria Rossi",
  contact_role: "Titolare",
  email: "maria@boutiqueaurora.it",
  phone: "+39 02 1234 5678",
  website: "https://boutiqueaurora.it",

  address: "Via della Spiga 12",
  city: "Milano",
  postal_code: "20121",
  province: "MI",
  country: "Italia",

  employees_count: "6",
  store_location: "centro",
  surface_sqm: "180",
  annual_revenue: "€ 420.000",
  customer_flow: ["clientela_fidelizzata", "traffico_comunicazione_scarsa"],
  flagship_product: "Capsule collection di alta sartoria",
  local_competitors: "Maison Rivoli, Atelier 22, Casa Cipriani",

  has_logo: true,
  logo_year: "2017",
  brand_colors: "Bordeaux, oro, avorio",
  brand_fonts: "Playfair Display, Inter",
  brand_guidelines_url: "https://aurora.brand/guidelines.pdf",
  promo_materials: ["biglietti_visita", "brochure", "catalogo"],
  materials_coordinated: "no",
  signage_coordinated: "si",

  has_website: "si",
  website_year: "2020",
  website_updated_regularly: "no",
  website_seo_optimised: "non_so",
  website_page_count: "8",
  website_sections: ["homepage", "chi_siamo", "catalogo", "contatti"],
  website_vendor: "Studio Pixel",

  social_active: "si",
  social_channels: ["instagram", "facebook", "tiktok"],
  social_frequency: "1_settimana",
  social_managed_by: "Team interno (Giulia)",
  social_vendor: null,
  social_tone: "amichevole",

  gmb_active: "si",
  gmb_up_to_date: "no",
  gmb_has_reviews: "si",

  newsletter_active: "no",
  newsletter_frequency: null,
  newsletter_vendor: null,
  newsletter_platform: null,
  whatsapp_active: "si",
  whatsapp_frequency: "1_mese",

  online_ads_active: "si",
  online_ads_channels: ["google", "instagram", "facebook"],
  online_ads_vendor: "Adwerx Srl",
  offline_ads_active: "in_arrivo",
  offline_ads_channels: ["eventi", "volantini"],
  offline_ads_vendor: null,

  project_type: [
    "cinematic_video",
    "reels",
    "youtube",
    "photography",
    "website",
    "social_management",
  ],
  services_brand: ["brand_analysis", "coordinated_image", "team_photoshoot"],
  services_social: [
    "social_strategy",
    "editorial_plan",
    "studio_content",
    "fb_ig_management",
    "tiktok_management",
    "monthly_reporting",
  ],
  services_ads: ["ads_strategy", "meta_ads", "google_ads", "ads_reporting"],
  services_web: [
    "custom_coded_website",
    "seo",
    "accessibility",
    "newsletter_setup",
  ],
  pain_points: [
    "no_professional_content",
    "outdated_gmb",
    "communication_hard",
    "cannot_reach_younger_audience",
  ],
  project_description:
    "Vogliamo posizionarci come boutique di alta gamma con un linguaggio cinematografico. Obiettivo: lanciare la nuova collezione FW26 con un teaser cinematografico, una serie di reels e un nuovo sito custom ottimizzato per Core Web Vitals e accessibilità.",
  budget_range: "2500_5000",
  timeline: "standard",

  video_style: "cinematic",
  video_duration: "60-90 sec teaser + 6 reels da 15-30 sec",
  location_preference: "Boutique + Studio + Esterni Milano",
  talent_needed: true,
  equipment_notes:
    "Preferenza per cinepresa cinema (RED / Sony Venice). Audio in presa diretta dove possibile.",

  website_type: "e-commerce",
  website_features: [
    "cms",
    "payments",
    "analytics",
    "seo",
    "multilingual",
    "accessibility",
    "performance",
  ],
  hosting_preference: "Vercel + Sanity headless CMS",
  domain_name: "boutiqueaurora.it",

  target_audience:
    "Donne 30-55, residenti tra Milano, Como e Bergamo. Alto potere d'acquisto, sensibili al lusso accessibile e a una narrazione brand emozionale.",
  competitors: "Brunello Cucinelli, La DoubleJ, Pinko, atelier locali milanesi.",

  status: "new",
  notes: null,
  assigned_to: null,
}

const { doc, fileName } = buildClientPDF(mock)
const arrayBuffer = (doc as unknown as { output: (t: string) => ArrayBuffer }).output(
  "arraybuffer",
)
const outPath = `/tmp/${fileName}`
fs.writeFileSync(outPath, Buffer.from(arrayBuffer))
console.log(
  `wrote ${outPath} (${arrayBuffer.byteLength} bytes, ${doc.getNumberOfPages()} pages)`,
)
