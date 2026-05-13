/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Smoke-test the Anvance Production PDF generator with a fully-populated
 * mock client. Writes the output to /tmp/anvance_smoke.pdf for inspection.
 *
 * Run with:   pnpm tsx scripts/smoke-pdf.ts
 */

import fs from "node:fs"
import { buildClientPDF } from "../lib/pdf-generator"
import type { Client } from "../lib/types"
import {
  DEFAULT_SERVICE_PRICING,
  DEFAULT_SERVICE_LINE_BILLING,
} from "../lib/service-pricing"

const mock: Client = {
  id: "abc12345-6789-4def-9012-345678901234",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  agent_name: "Alessio Rossi",
  brief_date: "2026-05-14",
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

  // Direct service requests
  wants_website: true,
  website_platform: "custom_code",
  website_purpose: "ecommerce",
  current_website_status: "obsoleto",

  wants_new_logo: true,
  logo_style_preference: "elegante, lusso",
  logo_palette_preference: "Bordeaux + oro + avorio",
  brand_references: "Brunello Cucinelli, La DoubleJ",

  current_social_channels: ["instagram", "facebook", "tiktok"],
  wants_social_management: true,
  social_management_goals:
    "Crescita follower targetizzati su Milano + lead per appuntamenti boutique.",

  wants_short_videos: true,
  wants_long_videos: false,
  wants_cinematic_videos: true,
  wants_photography: true,
  video_photo_notes:
    "Teaser cinematografico per la collezione FW26 + serie di 6 reels 15-30s + shooting prodotto e team.",

  wants_graphic_design: true,
  graphic_design_items: ["catalogo", "biglietti_visita", "post_social", "packaging"],

  wants_ads_management: true,
  ads_platforms: ["meta", "google", "tiktok"],
  ads_monthly_budget: "1500_3000",
  ads_previous_experience: true,

  pain_points: [
    "no_professional_content",
    "communication_hard",
    "cannot_reach_younger_audience",
  ],
  project_description:
    "Vogliamo posizionarci come boutique di alta gamma con un linguaggio cinematografico. Obiettivo: lanciare la nuova collezione FW26 con un teaser cinematografico, una serie di reels e un nuovo sito custom ottimizzato per Core Web Vitals e accessibilità.",
  budget_range: "2500_5000",
  timeline: "standard",
  retainer_contract_months: 6,

  target_audience:
    "Donne 30-55, residenti tra Milano, Como e Bergamo. Alto potere d'acquisto, sensibili al lusso accessibile e a una narrazione brand emozionale.",
  competitors: "Brunello Cucinelli, La DoubleJ, Pinko, atelier locali milanesi.",

  status: "new",
  notes: null,
  assigned_to: null,
}

const lineBilling = {
  ...DEFAULT_SERVICE_LINE_BILLING,
  video_reels: "monthly" as const,
  video_longform: "monthly" as const,
  video_cinematic: "monthly" as const,
  photography: "monthly" as const,
  graphic_design: "monthly" as const,
  ads_setup: "monthly" as const,
}

const { doc, fileName } = buildClientPDF(mock, {
  mode: "proposal",
  pricing: DEFAULT_SERVICE_PRICING,
  lineBilling,
})
const arrayBuffer = (doc as unknown as { output: (t: string) => ArrayBuffer }).output(
  "arraybuffer",
)
const outPath = `/tmp/${fileName}`
fs.writeFileSync(outPath, Buffer.from(arrayBuffer))
console.log(
  `wrote ${outPath} (${arrayBuffer.byteLength} bytes, ${doc.getNumberOfPages()} pages)`,
)
