import type { SupabaseClient } from "@supabase/supabase-js"
import type { ListinoPackage } from "@/lib/quote-packages"
import { normalizePackages } from "@/lib/quote-packages"
import {
  DEFAULT_SERVICE_PRICING,
  DEFAULT_SERVICE_LINE_BILLING,
  DEFAULT_SERVICE_PRICING_ACTIVE,
  PRICING_STORAGE_KEY,
  LINE_BILLING_STORAGE_KEY,
  PRICING_ACTIVE_STORAGE_KEY,
  type ServicePricing,
  type ServiceLineBilling,
  type ServicePricingActive,
} from "@/lib/service-pricing"

export const LISTINO_SETTINGS_ID = "listino"

export interface ListinoBundle {
  pricing: ServicePricing
  lineBilling: ServiceLineBilling
  pricingActive: ServicePricingActive
  packages: ListinoPackage[]
}

export function defaultListinoBundle(): ListinoBundle {
  return {
    pricing: { ...DEFAULT_SERVICE_PRICING },
    lineBilling: { ...DEFAULT_SERVICE_LINE_BILLING },
    pricingActive: { ...DEFAULT_SERVICE_PRICING_ACTIVE },
    packages: [],
  }
}

function mergeListinoRow(row: {
  pricing?: unknown
  line_billing?: unknown
  pricing_active?: unknown
  packages?: unknown
} | null): ListinoBundle {
  const defaults = defaultListinoBundle()
  if (!row) return defaults
  return {
    pricing: {
      ...defaults.pricing,
      ...(typeof row.pricing === "object" && row.pricing !== null
        ? (row.pricing as Partial<ServicePricing>)
        : {}),
    },
    lineBilling: {
      ...defaults.lineBilling,
      ...(typeof row.line_billing === "object" && row.line_billing !== null
        ? (row.line_billing as Partial<ServiceLineBilling>)
        : {}),
    },
    pricingActive: {
      ...defaults.pricingActive,
      ...(typeof row.pricing_active === "object" && row.pricing_active !== null
        ? (row.pricing_active as Partial<ServicePricingActive>)
        : {}),
    },
    packages: normalizePackages(row?.packages),
  }
}

export async function fetchListino(supabase: SupabaseClient): Promise<ListinoBundle> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("pricing, line_billing, pricing_active, packages")
    .eq("id", LISTINO_SETTINGS_ID)
    .maybeSingle()

  if (error) {
    console.warn("[listino] fetch failed:", error.message)
    return defaultListinoBundle()
  }

  return mergeListinoRow(data)
}

export async function saveListino(
  supabase: SupabaseClient,
  bundle: ListinoBundle,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("app_settings").upsert({
    id: LISTINO_SETTINGS_ID,
    pricing: bundle.pricing,
    line_billing: bundle.lineBilling,
    pricing_active: bundle.pricingActive,
    packages: bundle.packages,
    updated_at: new Date().toISOString(),
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

function rowHasSavedPricing(pricing: unknown): boolean {
  return typeof pricing === "object" && pricing !== null && Object.keys(pricing as object).length > 0
}

/** One-time migration: copy browser localStorage listino into Supabase if DB row is empty. */
export async function migrateListinoFromLocalStorage(
  supabase: SupabaseClient,
): Promise<ListinoBundle> {
  const { data } = await supabase
    .from("app_settings")
    .select("pricing, line_billing, pricing_active, packages")
    .eq("id", LISTINO_SETTINGS_ID)
    .maybeSingle()

  if (rowHasSavedPricing(data?.pricing)) {
    return mergeListinoRow(data)
  }

  if (typeof window === "undefined") return defaultListinoBundle()

  const hasLocal =
    window.localStorage.getItem(PRICING_STORAGE_KEY) ||
    window.localStorage.getItem(LINE_BILLING_STORAGE_KEY) ||
    window.localStorage.getItem(PRICING_ACTIVE_STORAGE_KEY)

  if (!hasLocal) return mergeListinoRow(data)

  try {
    const pricing = JSON.parse(
      window.localStorage.getItem(PRICING_STORAGE_KEY) || "null",
    ) as Partial<ServicePricing> | null
    const lineBilling = JSON.parse(
      window.localStorage.getItem(LINE_BILLING_STORAGE_KEY) || "null",
    ) as Partial<ServiceLineBilling> | null
    const pricingActive = JSON.parse(
      window.localStorage.getItem(PRICING_ACTIVE_STORAGE_KEY) || "null",
    ) as Partial<ServicePricingActive> | null

    const bundle: ListinoBundle = {
      pricing: { ...DEFAULT_SERVICE_PRICING, ...pricing },
      lineBilling: { ...DEFAULT_SERVICE_LINE_BILLING, ...lineBilling },
      pricingActive: { ...DEFAULT_SERVICE_PRICING_ACTIVE, ...pricingActive },
      packages: [],
    }

    await saveListino(supabase, bundle)
    window.localStorage.removeItem(PRICING_STORAGE_KEY)
    window.localStorage.removeItem(LINE_BILLING_STORAGE_KEY)
    window.localStorage.removeItem(PRICING_ACTIVE_STORAGE_KEY)
    return bundle
  } catch {
    return mergeListinoRow(data)
  }
}
