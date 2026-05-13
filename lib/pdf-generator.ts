/**
 * Anvance Production – branded PDF generator.
 *
 * Produces a clean, modern multi-page brief that mirrors the structure of a
 * preliminary analytical brief: company → store profile → identity →
 * digital presence → marketing → requested services → pain points → budget.
 *
 * The generator only depends on jspdf + jspdf-autotable so it works in any
 * Next.js client/server context without extra binaries.
 */

import jsPDF from "jspdf"
import autoTable, { type RowInput } from "jspdf-autotable"
import {
  Client,
  PROJECT_TYPES,
  WEBSITE_TYPES,
  VIDEO_STYLES,
  BUDGET_RANGES,
  TIMELINES,
} from "./types"

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const BRAND = {
  name: "ANVANCE",
  tagline: "PRODUCTION",
  // RGB triples
  black: [10, 10, 12] as [number, number, number],
  ink: [28, 28, 32] as [number, number, number],
  muted: [115, 115, 125] as [number, number, number],
  hairline: [225, 225, 230] as [number, number, number],
  surface: [248, 248, 250] as [number, number, number],
  accent: [10, 10, 12] as [number, number, number],
}

const PAGE_MARGIN_X = 18
const SECTION_GAP = 8

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                  */
/* ------------------------------------------------------------------ */

type PDF = jsPDF & { lastAutoTable: { finalY: number } }

const setFill = (doc: jsPDF, rgb: [number, number, number]) =>
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
const setText = (doc: jsPDF, rgb: [number, number, number]) =>
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
const setDraw = (doc: jsPDF, rgb: [number, number, number]) =>
  doc.setDrawColor(rgb[0], rgb[1], rgb[2])

const yn = (v: string | boolean | null | undefined): string => {
  if (v === true) return "Sì"
  if (v === false) return "No"
  if (!v) return "—"
  const map: Record<string, string> = {
    si: "Sì",
    no: "No",
    non_so: "Non so",
    in_arrivo: "In arrivo",
  }
  return map[v as string] ?? String(v)
}

const FREQUENCY_LABELS: Record<string, string> = {
  "3_5_settimana": "3-5 volte / settimana",
  "1_settimana": "1 volta / settimana",
  "1_mese": "1 volta / mese",
  "3_5_anno": "3-5 volte / anno",
  mai: "Mai",
}

const CUSTOMER_FLOW_LABELS: Record<string, string> = {
  molto_traffico: "Passa molta gente in negozio",
  poco_traffico: "Passa poca gente",
  clientela_fidelizzata: "Clientela fidelizzata",
  traffico_poche_vendite: "Molto traffico ma poche vendite",
  traffico_comunicazione_scarsa: "Buon traffico ma comunicazione scarsa",
  clientela_discontinua: "Clientela discontinua",
}

const PROMO_LABELS: Record<string, string> = {
  biglietti_visita: "Biglietti da visita",
  brochure: "Brochure",
  catalogo: "Catalogo",
  volantini: "Volantini",
  segnaletica: "Segnaletica / espositori",
}

const SECTION_LABELS: Record<string, string> = {
  homepage: "Homepage",
  chi_siamo: "Chi siamo",
  servizi: "Servizi",
  contatti: "Contatti",
  assistenza: "Assistenza",
  recensioni: "Recensioni",
  catalogo: "Catalogo",
  shop: "Shop / E-commerce",
  blog: "Blog / News",
}

const CHANNEL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X / Twitter",
  pinterest: "Pinterest",
  google: "Google Ads",
  altro: "Altro",
  stampa: "Stampa",
  tv_radio: "TV / Radio",
  cartelloni: "Cartelloni",
  eventi: "Eventi",
  volantini: "Volantini",
}

const TONE_LABELS: Record<string, string> = {
  professionale: "Professionale",
  amichevole: "Amichevole",
  tecnico: "Tecnico",
  indefinito: "Indefinito",
}

const STORE_LOCATION_LABELS: Record<string, string> = {
  centro: "Centro città",
  periferia: "Periferia",
  online_only: "Solo online",
  mixed: "Mista (fisico + online)",
}

const SERVICE_LABELS: Record<string, string> = {
  // Brand
  brand_analysis: "Analisi identità del brand",
  logo_from_scratch: "Creazione logo da zero",
  logo_digitisation: "Digitalizzazione logo",
  coordinated_image: "Immagine coordinata",
  print_management: "Gestione stampe",
  store_restyling: "Restyling punto vendita",
  merchandising: "Merchandising & gadget",
  team_photoshoot: "Shooting fotografico negozio & team",
  // Social
  social_strategy: "Strategia social",
  editorial_plan: "Piano editoriale",
  content_from_client: "Contenuti dal cliente (UGC)",
  studio_content: "Contenuti in studio",
  corporate_video: "Video corporate",
  fb_ig_management: "Gestione FB + IG",
  tiktok_management: "Gestione TikTok",
  linkedin_management: "Gestione LinkedIn",
  gmb_management: "Gestione Google My Business",
  monthly_reporting: "Report mensili",
  media_plan: "Media Business Plan",
  // Ads
  ads_strategy: "Strategia campagne",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  linkedin_ads: "LinkedIn Ads",
  tiktok_ads: "TikTok Ads",
  ads_reporting: "Report campagne",
  training: "Formazione",
  in_store_problem_solving: "Problem solving in store",
  // Web
  custom_coded_website:
    "Sito web custom-coded (scalabile, veloce, no template generici)",
  ecommerce: "E-commerce",
  newsletter_setup: "Newsletter set-up",
  site_maintenance: "Manutenzione sito",
  accessibility: "Accessibilità (EAA / WCAG)",
  seo: "SEO",
  landing_page: "Landing page",
  web_app: "Web application",
}

const WEBSITE_FEATURE_LABELS: Record<string, string> = {
  cms: "CMS personalizzato",
  booking: "Prenotazioni / Scheduling",
  payments: "Pagamenti online",
  analytics: "Dashboard analytics",
  seo: "SEO",
  multilingual: "Multilingua",
  api: "Integrazione API",
  auth: "Autenticazione utenti",
  accessibility: "Accessibilità EAA",
  performance: "Performance & Core Web Vitals",
}

const PAIN_LABELS: Record<string, string> = {
  logo_not_memorable: "Logo / immagine poco memorabili",
  off_brand_perception: "Negozio datato o off-brand",
  no_social_resources: "Nessuno gestisce i social",
  low_online_visibility: "Poca visibilità online",
  no_professional_content: "Assenza contenuti professionali",
  outdated_gmb: "GMB non aggiornato",
  no_marketing_strategy: "Nessuna strategia marketing",
  communication_hard: "Difficile comunicare offerte / novità",
  selling_services_hard: "Difficile vendere servizi",
  low_reviews: "Reputazione / recensioni basse",
  no_time_to_reply: "Manca tempo per rispondere online",
  cannot_reach_younger_audience: "Non si raggiungono i più giovani",
}

const labelOf = (
  value: string | null | undefined,
  table: readonly { value: string; label: string }[],
): string => {
  if (!value) return "—"
  return table.find((o) => o.value === value)?.label ?? value
}

const list = (
  values: string[] | null | undefined,
  dict?: Record<string, string>,
): string => {
  if (!values || values.length === 0) return "—"
  return values.map((v) => dict?.[v] ?? v).join(", ")
}

const txt = (v: string | null | undefined, fallback = "—") =>
  v && String(v).trim() !== "" ? String(v) : fallback

/* ------------------------------------------------------------------ */
/*  Drawing primitives                                                */
/* ------------------------------------------------------------------ */

function drawCoverHeader(doc: jsPDF, client: Client) {
  const w = doc.internal.pageSize.getWidth()

  // Black band
  setFill(doc, BRAND.black)
  doc.rect(0, 0, w, 56, "F")

  // Brand wordmark
  setText(doc, [255, 255, 255])
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.text(BRAND.name, PAGE_MARGIN_X, 28)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  setText(doc, [180, 180, 185])
  doc.text(BRAND.tagline, PAGE_MARGIN_X, 36)

  // Right side meta
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  setText(doc, [255, 255, 255])
  doc.text("SCHEDA DI ANALISI", w - PAGE_MARGIN_X, 24, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  setText(doc, [180, 180, 185])
  doc.text(
    `Generato il ${new Date(client.created_at || new Date()).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}`,
    w - PAGE_MARGIN_X,
    32,
    { align: "right" },
  )
  doc.text(
    `ID: ${client.id?.slice(0, 8) ?? "draft"}`,
    w - PAGE_MARGIN_X,
    40,
    { align: "right" },
  )
}

function drawClientCard(doc: jsPDF, client: Client, yStart = 70): number {
  const w = doc.internal.pageSize.getWidth()
  setFill(doc, BRAND.surface)
  setDraw(doc, BRAND.hairline)
  doc.roundedRect(
    PAGE_MARGIN_X,
    yStart,
    w - PAGE_MARGIN_X * 2,
    36,
    3,
    3,
    "FD",
  )

  setText(doc, BRAND.ink)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(client.company_name, PAGE_MARGIN_X + 6, yStart + 12)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  setText(doc, BRAND.muted)
  const sub = [
    client.business_type,
    [client.city, client.country].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" · ")
  if (sub) doc.text(sub, PAGE_MARGIN_X + 6, yStart + 19)

  // Contact line
  setText(doc, BRAND.ink)
  doc.setFontSize(9)
  const contact = [
    client.contact_name,
    client.email,
    client.phone,
  ]
    .filter(Boolean)
    .join("  ·  ")
  doc.text(contact, PAGE_MARGIN_X + 6, yStart + 28)

  // Right meta
  if (client.is_existing_client) {
    setFill(doc, BRAND.black)
    doc.roundedRect(w - PAGE_MARGIN_X - 38, yStart + 6, 32, 8, 2, 2, "F")
    setText(doc, [255, 255, 255])
    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.text("CLIENTE ATTIVO", w - PAGE_MARGIN_X - 22, yStart + 11.5, {
      align: "center",
    })
  }

  return yStart + 36 + SECTION_GAP
}

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  setText(doc, BRAND.muted)
  doc.text(title.toUpperCase(), PAGE_MARGIN_X, y)

  setDraw(doc, BRAND.hairline)
  doc.setLineWidth(0.4)
  const w = doc.internal.pageSize.getWidth()
  doc.line(PAGE_MARGIN_X, y + 1.5, w - PAGE_MARGIN_X, y + 1.5)

  return y + 5
}

function ensureSpace(doc: jsPDF, y: number, needed = 30): number {
  const h = doc.internal.pageSize.getHeight()
  if (y + needed > h - 18) {
    doc.addPage()
    return 22
  }
  return y
}

function keyValueTable(
  doc: jsPDF,
  rows: [string, string][],
  startY: number,
): number {
  const filtered: RowInput[] = rows
    .filter(([, v]) => v && v !== "—")
    .map(([k, v]) => [k, v])

  if (filtered.length === 0) {
    setText(doc, BRAND.muted)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.text("Non specificato.", PAGE_MARGIN_X, startY + 4)
    return startY + 8
  }

  autoTable(doc, {
    startY,
    body: filtered,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: { top: 2, right: 4, bottom: 2, left: 0 },
      textColor: BRAND.ink,
      lineColor: BRAND.hairline,
      lineWidth: 0,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 56,
        textColor: BRAND.muted,
      },
      1: { cellWidth: "auto" },
    },
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X },
  })

  return (doc as PDF).lastAutoTable.finalY + 4
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    setDraw(doc, BRAND.hairline)
    doc.setLineWidth(0.3)
    doc.line(PAGE_MARGIN_X, h - 14, w - PAGE_MARGIN_X, h - 14)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    setText(doc, BRAND.muted)
    doc.text("Anvance Production · Scheda di Analisi", PAGE_MARGIN_X, h - 9)
    doc.text(`Pagina ${i} / ${pageCount}`, w - PAGE_MARGIN_X, h - 9, {
      align: "right",
    })
  }
}

/* ------------------------------------------------------------------ */
/*  Main generator                                                    */
/* ------------------------------------------------------------------ */

/**
 * Build the PDF document and return both the jsPDF instance and the
 * suggested file name. The split makes the generator usable in both the
 * browser (where we call `doc.save(...)`) and a Node/server context
 * (where we want to grab `doc.output("arraybuffer")` and forward the
 * bytes to e.g. an email service).
 */
export function buildClientPDF(client: Client): {
  doc: jsPDF
  fileName: string
} {
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  drawCoverHeader(doc, client)
  let y = drawClientCard(doc, client, 70)

  /* ------------------ Brief metadata ------------------ */
  y = sectionTitle(doc, "Brief", y)
  y = keyValueTable(
    doc,
    [
      ["Agente", txt(client.agent_name)],
      [
        "Data brief",
        client.brief_date
          ? new Date(client.brief_date).toLocaleDateString("it-IT")
          : "—",
      ],
      ["Cliente esistente", yn(client.is_existing_client)],
      [
        "Cliente dal",
        client.client_since
          ? new Date(client.client_since).toLocaleDateString("it-IT", {
              month: "long",
              year: "numeric",
            })
          : "—",
      ],
    ],
    y,
  )

  /* ------------------ Company ------------------ */
  y = ensureSpace(doc, y, 40)
  y = sectionTitle(doc, "Azienda", y)
  y = keyValueTable(
    doc,
    [
      ["Ragione sociale", txt(client.company_name)],
      ["Settore", txt(client.business_type)],
      ["Partita IVA", txt(client.vat_number)],
      ["Codice fiscale", txt(client.tax_code)],
    ],
    y,
  )

  /* ------------------ Contact + address ------------------ */
  y = ensureSpace(doc, y, 50)
  y = sectionTitle(doc, "Contatto & Sede", y)
  y = keyValueTable(
    doc,
    [
      ["Referente", txt(client.contact_name)],
      ["Ruolo", txt(client.contact_role)],
      ["Email", txt(client.email)],
      ["Telefono", txt(client.phone)],
      ["Sito web attuale", txt(client.website)],
      [
        "Indirizzo",
        [client.address, client.postal_code, client.city, client.province, client.country]
          .filter(Boolean)
          .join(", ") || "—",
      ],
    ],
    y,
  )

  /* ------------------ Store profile ------------------ */
  y = ensureSpace(doc, y, 60)
  y = sectionTitle(doc, "Punto Vendita", y)
  y = keyValueTable(
    doc,
    [
      ["Dipendenti", txt(client.employees_count)],
      [
        "Posizione",
        client.store_location
          ? STORE_LOCATION_LABELS[client.store_location]
          : "—",
      ],
      ["Superficie (mq)", txt(client.surface_sqm)],
      ["Fatturato annuo", txt(client.annual_revenue)],
      ["Flusso clienti", list(client.customer_flow, CUSTOMER_FLOW_LABELS)],
      ["Prodotto / servizio di punta", txt(client.flagship_product)],
      ["Competitor locali", txt(client.local_competitors)],
    ],
    y,
  )

  /* ------------------ Identity ------------------ */
  y = ensureSpace(doc, y, 60)
  y = sectionTitle(doc, "Identità & Punto Vendita", y)
  y = keyValueTable(
    doc,
    [
      ["Logo presente", yn(client.has_logo)],
      ["Anno di creazione logo", txt(client.logo_year)],
      ["Colori del brand", txt(client.brand_colors)],
      ["Font del brand", txt(client.brand_fonts)],
      ["Brand guidelines", txt(client.brand_guidelines_url)],
      [
        "Materiali promozionali",
        list(client.promo_materials, PROMO_LABELS),
      ],
      ["Materiali coordinati al logo", yn(client.materials_coordinated)],
      ["Insegna & arredo coordinati", yn(client.signage_coordinated)],
    ],
    y,
  )

  /* ------------------ Digital presence ------------------ */
  doc.addPage()
  y = 22
  y = sectionTitle(doc, "Presenza Digitale — Sito Web", y)
  y = keyValueTable(
    doc,
    [
      ["Sito web", yn(client.has_website)],
      ["Anno creazione", txt(client.website_year)],
      ["Aggiornato regolarmente", yn(client.website_updated_regularly)],
      ["SEO-ottimizzato", yn(client.website_seo_optimised)],
      ["Numero pagine", txt(client.website_page_count)],
      [
        "Sezioni presenti",
        list(client.website_sections, SECTION_LABELS),
      ],
      ["Fornitore attuale", txt(client.website_vendor)],
    ],
    y,
  )

  y = ensureSpace(doc, y, 60)
  y = sectionTitle(doc, "Presenza Digitale — Social Media", y)
  y = keyValueTable(
    doc,
    [
      ["Profili social attivi", yn(client.social_active)],
      ["Canali", list(client.social_channels, CHANNEL_LABELS)],
      [
        "Frequenza di pubblicazione",
        client.social_frequency ? FREQUENCY_LABELS[client.social_frequency] : "—",
      ],
      ["Gestione interna", txt(client.social_managed_by)],
      ["Fornitore", txt(client.social_vendor)],
      [
        "Tono di voce",
        client.social_tone ? TONE_LABELS[client.social_tone] : "—",
      ],
    ],
    y,
  )

  y = ensureSpace(doc, y, 40)
  y = sectionTitle(doc, "Profilo Google Business", y)
  y = keyValueTable(
    doc,
    [
      ["Profilo GMB attivo", yn(client.gmb_active)],
      ["Aggiornato (logo, foto, orari)", yn(client.gmb_up_to_date)],
      ["Recensioni presenti", yn(client.gmb_has_reviews)],
    ],
    y,
  )

  /* ------------------ Marketing automation ------------------ */
  y = ensureSpace(doc, y, 60)
  y = sectionTitle(doc, "Marketing Automation", y)
  y = keyValueTable(
    doc,
    [
      ["Newsletter attiva", yn(client.newsletter_active)],
      [
        "Frequenza newsletter",
        client.newsletter_frequency
          ? FREQUENCY_LABELS[client.newsletter_frequency]
          : "—",
      ],
      ["Programma usato", txt(client.newsletter_platform)],
      ["Fornitore newsletter", txt(client.newsletter_vendor)],
      ["WhatsApp attivo", yn(client.whatsapp_active)],
      [
        "Frequenza WhatsApp",
        client.whatsapp_frequency
          ? FREQUENCY_LABELS[client.whatsapp_frequency]
          : "—",
      ],
    ],
    y,
  )

  /* ------------------ Sponsorizzazioni ------------------ */
  y = ensureSpace(doc, y, 60)
  y = sectionTitle(doc, "Sponsorizzazioni", y)
  y = keyValueTable(
    doc,
    [
      ["Campagne online", yn(client.online_ads_active)],
      [
        "Canali online",
        list(client.online_ads_channels, CHANNEL_LABELS),
      ],
      ["Fornitore online", txt(client.online_ads_vendor)],
      ["Campagne tradizionali", yn(client.offline_ads_active)],
      [
        "Canali offline",
        list(client.offline_ads_channels, CHANNEL_LABELS),
      ],
      ["Fornitore offline", txt(client.offline_ads_vendor)],
    ],
    y,
  )

  /* ------------------ Requested services ------------------ */
  doc.addPage()
  y = 22
  y = sectionTitle(doc, "Richiesta — Servizi di interesse", y)

  // Macro categories as chips
  const macros = client.project_type ?? []
  if (macros.length > 0) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    setText(doc, BRAND.muted)
    doc.text("MACRO-CATEGORIE", PAGE_MARGIN_X, y)
    y += 4
    let chipX = PAGE_MARGIN_X
    const chipY = y
    const chipPadding = 3
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    for (const m of macros) {
      const label = labelOf(m, PROJECT_TYPES)
      const w = doc.getTextWidth(label) + chipPadding * 2 + 2
      if (chipX + w > doc.internal.pageSize.getWidth() - PAGE_MARGIN_X) {
        chipX = PAGE_MARGIN_X
        y += 8
      }
      setFill(doc, BRAND.black)
      doc.roundedRect(chipX, y - 3, w, 6.5, 3, 3, "F")
      setText(doc, [255, 255, 255])
      doc.text(label, chipX + chipPadding + 1, y + 1.5)
      chipX += w + 3
    }
    y = Math.max(chipY, y) + 8
    setText(doc, BRAND.ink)
  }

  y = ensureSpace(doc, y, 30)
  y = keyValueTable(
    doc,
    [
      ["1. Brand Identity", list(client.services_brand, SERVICE_LABELS)],
      ["2. Social media", list(client.services_social, SERVICE_LABELS)],
      ["3. Advertising", list(client.services_ads, SERVICE_LABELS)],
      ["4. Web & Email", list(client.services_web, SERVICE_LABELS)],
    ],
    y,
  )

  /* Video/photo specifics */
  if (
    client.project_type?.some((p) =>
      ["cinematic_video", "reels", "youtube", "photography"].includes(p),
    )
  ) {
    y = ensureSpace(doc, y, 50)
    y = sectionTitle(doc, "Video & Fotografia", y)
    y = keyValueTable(
      doc,
      [
        ["Stile", labelOf(client.video_style, VIDEO_STYLES)],
        ["Durata", txt(client.video_duration)],
        ["Location", txt(client.location_preference)],
        ["Talent / casting", yn(client.talent_needed)],
        ["Note tecniche", txt(client.equipment_notes)],
      ],
      y,
    )
  }

  /* Website specifics */
  if (client.project_type?.includes("website")) {
    y = ensureSpace(doc, y, 40)
    y = sectionTitle(doc, "Sito Web Custom", y)
    y = keyValueTable(
      doc,
      [
        ["Tipo di sito", labelOf(client.website_type, WEBSITE_TYPES)],
        ["Dominio", txt(client.domain_name)],
        ["Hosting", txt(client.hosting_preference)],
        ["Funzionalità", list(client.website_features, WEBSITE_FEATURE_LABELS)],
      ],
      y,
    )
  }

  /* ------------------ Audience & competitors ------------------ */
  if (client.target_audience || client.competitors) {
    y = ensureSpace(doc, y, 40)
    y = sectionTitle(doc, "Brand & Audience", y)
    y = keyValueTable(
      doc,
      [
        ["Target audience", txt(client.target_audience)],
        ["Competitor / brand di riferimento", txt(client.competitors)],
      ],
      y,
    )
  }

  /* ------------------ Pain points ------------------ */
  y = ensureSpace(doc, y, 40)
  y = sectionTitle(doc, "Difficoltà Riscontrate", y)
  if (client.pain_points && client.pain_points.length > 0) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    setText(doc, BRAND.ink)
    for (const p of client.pain_points) {
      const text = PAIN_LABELS[p] ?? p
      y = ensureSpace(doc, y, 8)
      // bullet
      setFill(doc, BRAND.black)
      doc.circle(PAGE_MARGIN_X + 1, y - 1, 0.7, "F")
      doc.text(text, PAGE_MARGIN_X + 5, y)
      y += 5
    }
  } else {
    setText(doc, BRAND.muted)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.text("Nessuna difficoltà segnalata.", PAGE_MARGIN_X, y + 2)
    y += 6
  }

  /* ------------------ Budget & timeline + description ------------------ */
  y = ensureSpace(doc, y, 40)
  y = sectionTitle(doc, "Budget & Tempistiche", y)
  y = keyValueTable(
    doc,
    [
      ["Budget", labelOf(client.budget_range, BUDGET_RANGES)],
      ["Tempistiche", labelOf(client.timeline, TIMELINES)],
    ],
    y,
  )

  if (client.project_description && client.project_description.trim() !== "") {
    y = ensureSpace(doc, y, 30)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    setText(doc, BRAND.muted)
    doc.text("DESCRIZIONE PROGETTO", PAGE_MARGIN_X, y)
    y += 5
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    setText(doc, BRAND.ink)
    const w = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2
    const lines = doc.splitTextToSize(client.project_description, w)
    doc.text(lines, PAGE_MARGIN_X, y)
    y += lines.length * 5 + 4
  }

  drawFooter(doc)

  const safeName = (client.company_name || "client")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
  const datePart = new Date().toISOString().split("T")[0]
  return { doc, fileName: `anvance_brief_${safeName}_${datePart}.pdf` }
}

/**
 * Browser entry point — builds the PDF and triggers a download.
 */
export function generateClientPDF(client: Client): void {
  const { doc, fileName } = buildClientPDF(client)
  doc.save(fileName)
}
