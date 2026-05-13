/**
 * Listino prezzi per sezione servizio — usato per generare righe preventivo
 * nel PDF e nel dashboard. Persistenza: localStorage (browser).
 */

import type { Client } from "@/lib/types"

export const PRICING_STORAGE_KEY = "anvance-service-pricing-v1"
export const LINE_BILLING_STORAGE_KEY = "anvance-service-line-billing-v1"

/** Come trattare ciascuna voce “produzione” nel PDF (una tantum vs canone mensile). */
export type LineBillingMode = "once" | "monthly"

export type ProductionLineKey =
  | "video_reels"
  | "video_longform"
  | "video_cinematic"
  | "photography"
  | "graphic_design"
  | "ads_setup"

export interface ServiceLineBilling {
  video_reels: LineBillingMode
  video_longform: LineBillingMode
  video_cinematic: LineBillingMode
  photography: LineBillingMode
  graphic_design: LineBillingMode
  ads_setup: LineBillingMode
}

export const DEFAULT_SERVICE_LINE_BILLING: ServiceLineBilling = {
  video_reels: "once",
  video_longform: "once",
  video_cinematic: "once",
  photography: "once",
  graphic_design: "once",
  ads_setup: "once",
}

export interface ServicePricing {
  website_custom: number
  website_wordpress: number
  logo_identity: number
  social_management_monthly: number
  video_reels_package: number
  video_longform_package: number
  video_cinematic_project: number
  photography_day: number
  graphic_design_project: number
  ads_setup_onetime: number
  ads_management_monthly: number
  /** Canoni mensili dedicati (se 0, in modalità mensile si usa il prezzo “progetto” come fallback). */
  video_reels_monthly: number
  video_longform_monthly: number
  video_cinematic_monthly: number
  photography_monthly: number
  graphic_design_monthly: number
  ads_setup_monthly: number
  vatPercent: number
}

export const DEFAULT_SERVICE_PRICING: ServicePricing = {
  website_custom: 4500,
  website_wordpress: 1800,
  logo_identity: 1200,
  social_management_monthly: 900,
  video_reels_package: 800,
  video_longform_package: 1500,
  video_cinematic_project: 3500,
  photography_day: 900,
  graphic_design_project: 600,
  ads_setup_onetime: 500,
  ads_management_monthly: 0,
  video_reels_monthly: 0,
  video_longform_monthly: 0,
  video_cinematic_monthly: 0,
  photography_monthly: 0,
  graphic_design_monthly: 0,
  ads_setup_monthly: 0,
  vatPercent: 22,
}

export type PreventivoBilling = "once" | "monthly"

export interface PreventivoLine {
  description: string
  qty: number
  unitPrice: number
  total: number
  billing: PreventivoBilling
}

export interface PreventivoBuildContext {
  pricing: ServicePricing
  lineBilling: ServiceLineBilling
  /** Mesi di impegno per le righe a canone (1 = mese per mese senza multiplo). */
  contractMonths: number
}

function clampMoney(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100) / 100
}

/** 1, 3, 6 o 12 mesi dal brief; default 1. */
export function normalizeContractMonths(
  v: Client["retainer_contract_months"] | null | undefined,
): number {
  if (v === 1 || v === 3 || v === 6 || v === 12) return v
  return 1
}

export function loadServicePricing(): ServicePricing {
  if (typeof window === "undefined") return { ...DEFAULT_SERVICE_PRICING }
  try {
    const raw = window.localStorage.getItem(PRICING_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SERVICE_PRICING }
    const parsed = JSON.parse(raw) as Partial<ServicePricing>
    return { ...DEFAULT_SERVICE_PRICING, ...parsed }
  } catch {
    return { ...DEFAULT_SERVICE_PRICING }
  }
}

export function saveServicePricing(p: ServicePricing): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(p))
}

export function loadServiceLineBilling(): ServiceLineBilling {
  if (typeof window === "undefined") return { ...DEFAULT_SERVICE_LINE_BILLING }
  try {
    const raw = window.localStorage.getItem(LINE_BILLING_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SERVICE_LINE_BILLING }
    const parsed = JSON.parse(raw) as Partial<ServiceLineBilling>
    return { ...DEFAULT_SERVICE_LINE_BILLING, ...parsed }
  } catch {
    return { ...DEFAULT_SERVICE_LINE_BILLING }
  }
}

export function saveServiceLineBilling(b: ServiceLineBilling): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LINE_BILLING_STORAGE_KEY, JSON.stringify(b))
}

function projectTypeList(client: Client): string[] {
  return Array.isArray(client.project_type) ? client.project_type : []
}

/** Stesso schema usato in insert Supabase — allinea `project_type` ai soli servizi con Sì. */
export function projectTypeFromWantsFields(
  data: Pick<
    Client,
    | "wants_website"
    | "wants_new_logo"
    | "wants_social_management"
    | "wants_short_videos"
    | "wants_long_videos"
    | "wants_cinematic_videos"
    | "wants_photography"
    | "wants_ads_management"
  >,
): string[] {
  const out: string[] = []
  if (data.wants_website === true) out.push("website")
  if (data.wants_new_logo === true) out.push("branding")
  if (data.wants_social_management === true) out.push("social_management")
  if (data.wants_short_videos === true) out.push("reels")
  if (data.wants_long_videos === true) out.push("youtube")
  if (data.wants_cinematic_videos === true) out.push("cinematic_video")
  if (data.wants_photography === true) out.push("photography")
  if (data.wants_ads_management === true) out.push("ads")
  return out
}

function effectiveWant(
  flag: boolean | null | undefined,
  legacyIncludes: boolean,
): boolean {
  if (flag === true) return true
  if (flag === false) return false
  return legacyIncludes
}

function monthlyUnit(monthlyField: number, onceFallback: number): number {
  const m = clampMoney(monthlyField)
  return m > 0 ? m : clampMoney(onceFallback)
}

/**
 * Costruisce le righe del preventivo in base ai servizi richiesti nel brief,
 * al listino, alla modalità una tantum/mensile (settings) e ai mesi di impegno.
 */
export function buildPreventivoLines(client: Client, ctx: PreventivoBuildContext): PreventivoLine[] {
  const { pricing, lineBilling, contractMonths } = ctx
  const months = Math.max(1, Math.min(12, contractMonths))
  const lines: PreventivoLine[] = []
  const pt = projectTypeList(client)

  if (effectiveWant(client.wants_website, pt.includes("website"))) {
    const unit =
      client.website_platform === "wordpress"
        ? pricing.website_wordpress
        : pricing.website_custom
    lines.push({
      description:
        client.website_platform === "wordpress"
          ? "Sito web — WordPress / template"
          : "Sito web — sviluppo custom / scalabile",
      qty: 1,
      unitPrice: unit,
      total: unit,
      billing: "once",
    })
  }

  if (effectiveWant(client.wants_new_logo, pt.includes("branding"))) {
    lines.push({
      description: "Logo & identità visiva / restyling",
      qty: 1,
      unitPrice: pricing.logo_identity,
      total: pricing.logo_identity,
      billing: "once",
    })
  }

  if (effectiveWant(client.wants_social_management, pt.includes("social_management"))) {
    const unit = pricing.social_management_monthly
    lines.push({
      description:
        months > 1
          ? `Social media management — canone mensile (impegno ${months} mesi)`
          : "Social media management — canone mensile",
      qty: months,
      unitPrice: unit,
      total: unit * months,
      billing: "monthly",
    })
  }

  if (effectiveWant(client.wants_short_videos, pt.includes("reels"))) {
    const monthly = lineBilling.video_reels === "monthly"
    const unit = monthly
      ? monthlyUnit(pricing.video_reels_monthly, pricing.video_reels_package)
      : pricing.video_reels_package
    lines.push({
      description: monthly
        ? "Produzione Reels / short-form — canone mensile (retainer produzione)"
        : "Produzione Reels / short-form — pacchetto (una tantum)",
      qty: monthly ? months : 1,
      unitPrice: unit,
      total: monthly ? unit * months : unit,
      billing: monthly ? "monthly" : "once",
    })
  }

  if (effectiveWant(client.wants_long_videos, pt.includes("youtube"))) {
    const monthly = lineBilling.video_longform === "monthly"
    const unit = monthly
      ? monthlyUnit(pricing.video_longform_monthly, pricing.video_longform_package)
      : pricing.video_longform_package
    lines.push({
      description: monthly
        ? "Produzione YouTube / long-form — canone mensile (retainer produzione)"
        : "Produzione YouTube / long-form — pacchetto (una tantum)",
      qty: monthly ? months : 1,
      unitPrice: unit,
      total: monthly ? unit * months : unit,
      billing: monthly ? "monthly" : "once",
    })
  }

  if (effectiveWant(client.wants_cinematic_videos, pt.includes("cinematic_video"))) {
    const monthly = lineBilling.video_cinematic === "monthly"
    const unit = monthly
      ? monthlyUnit(pricing.video_cinematic_monthly, pricing.video_cinematic_project)
      : pricing.video_cinematic_project
    lines.push({
      description: monthly
        ? "Video cinematic / spot / corporate — canone mensile (retainer)"
        : "Video cinematic / spot / corporate (progetto una tantum)",
      qty: monthly ? months : 1,
      unitPrice: unit,
      total: monthly ? unit * months : unit,
      billing: monthly ? "monthly" : "once",
    })
  }

  if (effectiveWant(client.wants_photography, pt.includes("photography"))) {
    const monthly = lineBilling.photography === "monthly"
    const unit = monthly
      ? monthlyUnit(pricing.photography_monthly, pricing.photography_day)
      : pricing.photography_day
    lines.push({
      description: monthly
        ? "Fotografia — canone mensile (piano produzione / giornate incluse)"
        : "Fotografia professionale — giornata / shooting (una tantum)",
      qty: monthly ? months : 1,
      unitPrice: unit,
      total: monthly ? unit * months : unit,
      billing: monthly ? "monthly" : "once",
    })
  }

  if (effectiveWant(client.wants_graphic_design, false)) {
    const monthly = lineBilling.graphic_design === "monthly"
    if (monthly) {
      const unit = monthlyUnit(pricing.graphic_design_monthly, pricing.graphic_design_project)
      lines.push({
        description:
          months > 1
            ? `Graphic design & stampa — canone mensile (retainer, impegno ${months} mesi)`
            : "Graphic design & stampa — canone mensile (retainer)",
        qty: months,
        unitPrice: unit,
        total: unit * months,
        billing: "monthly",
      })
    } else {
      const n = client.graphic_design_items?.length ?? 0
      const qty = n > 0 ? n : 1
      const unit = pricing.graphic_design_project
      lines.push({
        description: "Graphic design & stampa (listino base × voci selezionate)",
        qty,
        unitPrice: unit,
        total: unit * qty,
        billing: "once",
      })
    }
  }

  if (effectiveWant(client.wants_ads_management, pt.includes("ads"))) {
    const setupMonthly = lineBilling.ads_setup === "monthly"
    if (setupMonthly) {
      const unit = monthlyUnit(pricing.ads_setup_monthly, pricing.ads_setup_onetime)
      lines.push({
        description:
          months > 1
            ? `Ads — strategia & struttura (canone mensile, impegno ${months} mesi)`
            : "Ads — strategia & struttura campagne (canone mensile)",
        qty: months,
        unitPrice: unit,
        total: unit * months,
        billing: "monthly",
      })
    } else if (pricing.ads_setup_onetime > 0) {
      lines.push({
        description: "Ads — setup, strategia e struttura campagne (una tantum)",
        qty: 1,
        unitPrice: pricing.ads_setup_onetime,
        total: pricing.ads_setup_onetime,
        billing: "once",
      })
    }
    if (pricing.ads_management_monthly > 0) {
      const u = pricing.ads_management_monthly
      lines.push({
        description:
          months > 1
            ? `Ads — gestione e ottimizzazione campagne (canone mensile × ${months} mesi)`
            : "Ads — gestione e ottimizzazione campagne (canone mensile)",
        qty: months,
        unitPrice: u,
        total: u * months,
        billing: "monthly",
      })
    }
    if (
      !setupMonthly &&
      pricing.ads_setup_onetime <= 0 &&
      pricing.ads_management_monthly <= 0
    ) {
      lines.push({
        description: "Advertising / campagne — importo da confermare (listino Ads a €0)",
        qty: 1,
        unitPrice: 0,
        total: 0,
        billing: "once",
      })
    }
  }

  return lines.map((l) => ({
    ...l,
    unitPrice: clampMoney(l.unitPrice),
    total: clampMoney(l.total),
  }))
}

export function sumLines(lines: PreventivoLine[]): number {
  return clampMoney(lines.reduce((s, l) => s + l.total, 0))
}

export function monthlySubtotal(lines: PreventivoLine[]): number {
  return clampMoney(lines.filter((l) => l.billing === "monthly").reduce((s, l) => s + l.total, 0))
}

export function oneTimeSubtotal(lines: PreventivoLine[]): number {
  return clampMoney(lines.filter((l) => l.billing === "once").reduce((s, l) => s + l.total, 0))
}

export function vatAmount(subtotal: number, vatPercent: number): number {
  return clampMoney((subtotal * vatPercent) / 100)
}
