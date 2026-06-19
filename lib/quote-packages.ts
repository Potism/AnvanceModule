import type { Client, ClientFormData } from "@/lib/types"
import type { PreventivoBilling, PreventivoLine } from "@/lib/service-pricing"
import { normalizeContractMonths } from "@/lib/service-pricing"

/** Services that can be bundled in a package or toggled in final onboarding. */
export const PACKAGE_SERVICE_KEYS = [
  "website",
  "logo",
  "social_management",
  "video_reels",
  "video_longform",
  "video_cinematic",
  "photography",
  "graphic_design",
  "ads",
] as const

export type PackageServiceKey = (typeof PACKAGE_SERVICE_KEYS)[number]

export type PackageBilling = "once" | "monthly"

export interface ListinoPackage {
  id: string
  name: string
  services: PackageServiceKey[]
  totalPrice: number
  billing: PackageBilling
  active: boolean
}

export interface PackageSnapshot {
  name: string
  services: PackageServiceKey[]
  totalPrice: number
  billing: PackageBilling
}

export type QuoteMode = "package" | "custom" | "listino"

export interface ClientQuoteConfig {
  mode: QuoteMode
  package_id?: string | null
  /** Frozen at submit — listino package edits do not change this brief. */
  package_snapshot?: PackageSnapshot | null
  /** Services included in the quote (final onboarding toggles). */
  included_services?: PackageServiceKey[]
  total_price?: number | null
  billing?: PackageBilling
}

export const DEFAULT_QUOTE_CONFIG: ClientQuoteConfig = {
  mode: "custom",
  included_services: [],
  total_price: null,
  billing: "once",
}

export const PACKAGE_SERVICE_LABEL_KEYS: Record<PackageServiceKey, string> = {
  website: "pkg.svc.website",
  logo: "pkg.svc.logo",
  social_management: "pkg.svc.social",
  video_reels: "pkg.svc.reels",
  video_longform: "pkg.svc.longform",
  video_cinematic: "pkg.svc.cinematic",
  photography: "pkg.svc.photo",
  graphic_design: "pkg.svc.graphic",
  ads: "pkg.svc.ads",
}

/** Testi ricchi per il PDF preventivo (una riga per servizio). */
export const PACKAGE_SERVICE_PDF: Record<
  PackageServiceKey,
  { title: string; detail: string }
> = {
  website: {
    title: "Sito web",
    detail: "Progetto chiavi in mano: UX/UI, sviluppo responsive e messa online",
  },
  logo: {
    title: "Logo & identità visiva",
    detail: "Concept creativo, palette colori, tipografia e applicazioni base del marchio",
  },
  social_management: {
    title: "Social media management",
    detail: "Piano editoriale, creazione contenuti, pubblicazione e monitoraggio canali",
  },
  video_reels: {
    title: "Produzione Reels & short-form",
    detail: "Script, ripresa, montaggio vertical e ottimizzazione per social e ads",
  },
  video_longform: {
    title: "Produzione YouTube / long-form",
    detail: "Episodi e format estesi: pre-produzione, ripresa, editing e consegna",
  },
  video_cinematic: {
    title: "Video cinematic / spot",
    detail: "Produzione ad alta gamma, regia narrativa, color grading e sound design",
  },
  photography: {
    title: "Fotografia professionale",
    detail: "Shooting prodotto, ambiente o ritratto per brand, web e campagne",
  },
  graphic_design: {
    title: "Graphic design & stampa",
    detail: "Materiali coordinati: social, print, presentazioni e supporti promozionali",
  },
  ads: {
    title: "Advertising & campagne",
    detail: "Strategia media, setup campagne, gestione budget e ottimizzazione performance",
  },
}

type BriefWants = Pick<
  ClientFormData,
  | "wants_website"
  | "wants_new_logo"
  | "wants_social_management"
  | "wants_short_videos"
  | "wants_long_videos"
  | "wants_cinematic_videos"
  | "wants_photography"
  | "wants_graphic_design"
  | "wants_ads_management"
>

export function wantedServicesFromBrief(data: BriefWants): PackageServiceKey[] {
  const out: PackageServiceKey[] = []
  if (data.wants_website === true) out.push("website")
  if (data.wants_new_logo === true) out.push("logo")
  if (data.wants_social_management === true) out.push("social_management")
  if (data.wants_short_videos === true) out.push("video_reels")
  if (data.wants_long_videos === true) out.push("video_longform")
  if (data.wants_cinematic_videos === true) out.push("video_cinematic")
  if (data.wants_photography === true) out.push("photography")
  if (data.wants_graphic_design === true) out.push("graphic_design")
  if (data.wants_ads_management === true) out.push("ads")
  return out
}

export function syncIncludedServices(
  data: BriefWants,
  current: PackageServiceKey[] | undefined,
): PackageServiceKey[] {
  const wanted = wantedServicesFromBrief(data)
  if (!current?.length) return wanted
  return wanted.filter((s) => current.includes(s))
}

export function activePackages(packages: ListinoPackage[]): ListinoPackage[] {
  return packages.filter((p) => p.active && p.services.length > 0)
}

/** Servizi del pacchetto non ancora selezionati nel brief (step Servizi). */
export function packageMissingForBrief(
  pkg: ListinoPackage,
  data: BriefWants,
): PackageServiceKey[] {
  const wanted = new Set(wantedServicesFromBrief(data))
  return pkg.services.filter((s) => !wanted.has(s))
}

/** @deprecated Usare activePackages — i pacchetti sono sempre visibili nel brief finale. */
export function packageFitsBrief(pkg: ListinoPackage, data: BriefWants): boolean {
  return packageMissingForBrief(pkg, data).length === 0
}

export function snapshotFromPackage(pkg: ListinoPackage): PackageSnapshot {
  return {
    name: pkg.name,
    services: [...pkg.services],
    totalPrice: pkg.totalPrice,
    billing: pkg.billing,
  }
}

export function freezeQuoteConfigOnSubmit(
  config: ClientQuoteConfig,
  packages: ListinoPackage[],
): ClientQuoteConfig {
  if (config.mode !== "package" || !config.package_id) return config
  const pkg = packages.find((p) => p.id === config.package_id)
  if (!pkg) return config
  return {
    ...config,
    package_snapshot: snapshotFromPackage(pkg),
    included_services: [...pkg.services],
    total_price: pkg.totalPrice,
    billing: pkg.billing,
  }
}

function clampMoney(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100) / 100
}

function servicePdfDescription(svc: PackageServiceKey, t?: (key: string) => string): string {
  const info = PACKAGE_SERVICE_PDF[svc]
  if (t) {
    const title = t(PACKAGE_SERVICE_LABEL_KEYS[svc])
    const detailKey = `pkg.pdf.${svc}`
    const detail = t(detailKey)
    return detail !== detailKey ? `${title} — ${detail}` : `${info.title} — ${info.detail}`
  }
  return `${info.title} — ${info.detail}`
}

function buildDetailedQuoteLines(opts: {
  services: PackageServiceKey[]
  billing: PackageBilling
  total: number
  months: number
  titleLine: string
}): PreventivoLine[] {
  const { services, billing, total, months, titleLine } = opts
  const monthly = billing === "monthly"
  const unit = clampMoney(total)
  const qty = monthly ? months : 1
  const lines: PreventivoLine[] = []

  for (const svc of services) {
    lines.push({
      description: servicePdfDescription(svc),
      qty: 1,
      unitPrice: 0,
      total: 0,
      billing: billing as PreventivoBilling,
      informational: true,
    })
  }

  lines.push({
    description: titleLine,
    qty,
    unitPrice: unit,
    total: clampMoney(unit * qty),
    billing: billing as PreventivoBilling,
  })

  return lines
}

function resolvePackageSnapshot(
  cfg: ClientQuoteConfig,
  packages?: ListinoPackage[],
): PackageSnapshot | null {
  if (cfg.package_snapshot) return cfg.package_snapshot
  if (cfg.package_id && packages?.length) {
    const pkg = packages.find((p) => p.id === cfg.package_id)
    if (pkg) return snapshotFromPackage(pkg)
  }
  return null
}

/**
 * Build PDF lines from simplified quote_config (package or custom total).
 * Returns null → fall back to listino line-by-line builder.
 */
export function buildQuoteConfigLines(
  client: Client,
  t?: (key: string) => string,
  packages?: ListinoPackage[],
): PreventivoLine[] | null {
  const cfg = client.quote_config
  if (!cfg || cfg.mode === "listino") return null

  const months = Math.max(1, Math.min(12, normalizeContractMonths(client.retainer_contract_months)))

  if (cfg.mode === "package") {
    const snap = resolvePackageSnapshot(cfg, packages)
    if (!snap || snap.totalPrice <= 0) return null

    const monthly = snap.billing === "monthly"
    const titleLine = monthly
      ? `Pacchetto «${snap.name}» — canone mensile complessivo${months > 1 ? ` (× ${months} mesi)` : ""}`
      : `Pacchetto «${snap.name}» — investimento totale`

    return buildDetailedQuoteLines({
      services: snap.services,
      billing: snap.billing,
      total: snap.totalPrice,
      months,
      titleLine,
    })
  }

  if (cfg.mode === "custom") {
    const services = cfg.included_services ?? []
    const total = cfg.total_price
    if (services.length === 0 || total == null || total <= 0) return null

    const billing = cfg.billing ?? "once"
    const monthly = billing === "monthly"
    const titleLine = monthly
      ? `Preventivo personalizzato — canone mensile complessivo${months > 1 ? ` (× ${months} mesi)` : ""}`
      : "Preventivo personalizzato — investimento totale"

    return buildDetailedQuoteLines({
      services,
      billing,
      total,
      months,
      titleLine,
    })
  }

  return null
}

export function newPackageId(): string {
  return `pkg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function normalizePackages(raw: unknown): ListinoPackage[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const o = item as Record<string, unknown>
      const services = Array.isArray(o.services)
        ? o.services.filter((s): s is PackageServiceKey =>
            PACKAGE_SERVICE_KEYS.includes(s as PackageServiceKey),
          )
        : []
      return {
        id: typeof o.id === "string" ? o.id : newPackageId(),
        name: typeof o.name === "string" ? o.name : "Pacchetto",
        services,
        totalPrice: clampMoney(Number(o.totalPrice)),
        billing: o.billing === "monthly" ? "monthly" : "once",
        active: o.active !== false,
      } satisfies ListinoPackage
    })
    .filter((p): p is ListinoPackage => p !== null)
}
