/**
 * Anvance Production — PDF generator (brief analisi + preventivo professionale).
 */

import jsPDF from "jspdf"
import autoTable, { type RowInput } from "jspdf-autotable"
import {
  Client,
  BUDGET_RANGES,
  TIMELINES,
  ADS_MONTHLY_BUDGETS,
} from "./types"
import {
  DEFAULT_SERVICE_PRICING,
  DEFAULT_SERVICE_LINE_BILLING,
  buildPreventivoLines,
  sumLines,
  monthlySubtotal,
  oneTimeSubtotal,
  normalizeContractMonths,
  vatAmount,
  type ServicePricing,
  type ServiceLineBilling,
  type ServicePricingActive,
} from "./service-pricing"

/* ------------------------------------------------------------------ */
/*  Brand palette                                                     */
/* ------------------------------------------------------------------ */

const BRAND = {
  name: "ANVANCE",
  tagline: "PRODUCTION",
  black: [12, 12, 14] as [number, number, number],
  ink: [28, 28, 34] as [number, number, number],
  muted: [110, 110, 122] as [number, number, number],
  hairline: [220, 220, 228] as [number, number, number],
  surface: [250, 250, 252] as [number, number, number],
  /** Accento oro — riga e titoli preventivo */
  gold: [176, 138, 58] as [number, number, number],
}

const PAGE_MARGIN_X = 18
const PAGE_MARGIN_TOP = 22
const SECTION_GAP = 10

export type ClientPDFMode = "brief" | "proposal"

export interface ClientPDFOptions {
  mode?: ClientPDFMode
  /** Listino per il preventivo (default = DEFAULT_SERVICE_PRICING) */
  pricing?: ServicePricing
  /** Una tantum vs mensile per video/foto/graphic/ads setup (default = tutti una tantum) */
  lineBilling?: ServiceLineBilling
  /** Tariffe disattivate non compaiono nel preventivo. Omesso = tutte attive. */
  pricingActive?: Partial<ServicePricingActive>
  /** Giorni di validità testo in calce */
  proposalValidityDays?: number
}

type PDF = jsPDF & { lastAutoTable: { finalY: number } }

const setFill = (doc: jsPDF, rgb: [number, number, number]) =>
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
const setText = (doc: jsPDF, rgb: [number, number, number]) =>
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
const setDraw = (doc: jsPDF, rgb: [number, number, number]) =>
  doc.setDrawColor(rgb[0], rgb[1], rgb[2])

const yn = (v: boolean | null | undefined): string => {
  if (v === true) return "Sì"
  if (v === false) return "No"
  return "—"
}

const txt = (v: string | null | undefined, fallback = "—") =>
  v && String(v).trim() !== "" ? String(v) : fallback

const CHANNEL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X / Twitter",
  pinterest: "Pinterest",
}

const ADS_PLATFORM_LABELS: Record<string, string> = {
  google: "Google Ads",
  meta: "Meta (FB + IG)",
  tiktok: "TikTok Ads",
  youtube: "YouTube Ads",
  linkedin: "LinkedIn Ads",
}

const GRAPHIC_LABELS: Record<string, string> = {
  post_social: "Post social / template",
  biglietti_visita: "Biglietti da visita",
  brochure: "Brochure",
  catalogo: "Catalogo prodotti",
  volantini: "Volantini",
  locandine: "Locandine",
  menu: "Menu / listino",
  packaging: "Packaging",
  presentazioni: "Presentazioni / pitch deck",
}

const WEBSITE_PLATFORM_LABELS: Record<string, string> = {
  custom_code: "Custom code (scalabile)",
  wordpress: "WordPress",
  undecided: "Da consigliare",
}

const WEBSITE_PURPOSE_LABELS: Record<string, string> = {
  vetrina: "Sito vetrina",
  ecommerce: "E-commerce",
  landing: "Landing page",
  booking: "Booking / prenotazioni",
  portfolio: "Portfolio",
  webapp: "Web app / piattaforma",
}

const WEBSITE_CURRENT_STATUS_LABELS: Record<string, string> = {
  nessuno: "Nessun sito attuale",
  obsoleto: "Sito obsoleto",
  funzionante: "Sito funzionante",
}

const PAIN_LABELS: Record<string, string> = {
  low_online_visibility: "Poca visibilità online",
  no_professional_content: "Mancano contenuti professionali",
  no_social_resources: "Nessuno gestisce i social",
  no_marketing_strategy: "Nessuna strategia di marketing",
  logo_not_memorable: "Logo / immagine poco memorabili",
  off_brand_perception: "Comunicazione incoerente con il brand",
  communication_hard: "Difficile comunicare offerte e novità",
  selling_services_hard: "Difficile vendere servizi aggiuntivi",
  low_reviews: "Recensioni / reputazione basse",
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

const fmtEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)

/* ------------------------------------------------------------------ */
/*  Cover & layout                                                    */
/* ------------------------------------------------------------------ */

function drawProposalHero(doc: jsPDF, client: Client, mode: ClientPDFMode) {
  const w = doc.internal.pageSize.getWidth()
  setFill(doc, BRAND.black)
  doc.rect(0, 0, w, 62, "F")

  setDraw(doc, BRAND.gold)
  doc.setLineWidth(0.8)
  doc.line(PAGE_MARGIN_X, 62, w - PAGE_MARGIN_X, 62)

  setText(doc, BRAND.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(
    mode === "proposal" ? "PROPOSTA COMMERCIALE" : "SCHEDA DI ANALISI",
    PAGE_MARGIN_X,
    22,
  )

  setText(doc, [255, 255, 255])
  doc.setFontSize(26)
  doc.text(BRAND.name, PAGE_MARGIN_X, 38)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  setText(doc, [200, 200, 208])
  doc.text(BRAND.tagline, PAGE_MARGIN_X, 46)

  const metaY = 28
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  setText(doc, [180, 180, 188])
  doc.text(
    `Documento del ${new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}`,
    w - PAGE_MARGIN_X,
    metaY,
    { align: "right" },
  )
  doc.text(`Rif. ${client.id?.slice(0, 8) ?? "draft"}`, w - PAGE_MARGIN_X, metaY + 5, {
    align: "right",
  })
}

function drawClientHeroCard(doc: jsPDF, client: Client, yStart: number): number {
  const w = doc.internal.pageSize.getWidth()
  setFill(doc, BRAND.surface)
  setDraw(doc, BRAND.hairline)
  doc.roundedRect(PAGE_MARGIN_X, yStart, w - PAGE_MARGIN_X * 2, 40, 2, 2, "FD")

  setDraw(doc, BRAND.gold)
  doc.setLineWidth(0.35)
  doc.line(PAGE_MARGIN_X, yStart, PAGE_MARGIN_X + 3, yStart + 40)

  setText(doc, BRAND.ink)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text(client.company_name, PAGE_MARGIN_X + 10, yStart + 14)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  setText(doc, BRAND.muted)
  const sub = [client.business_type, [client.city, client.country].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" · ")
  if (sub) doc.text(sub, PAGE_MARGIN_X + 10, yStart + 22)

  setText(doc, BRAND.ink)
  const contact = [client.contact_name, client.email, client.phone].filter(Boolean).join("  ·  ")
  doc.text(contact, PAGE_MARGIN_X + 10, yStart + 32)

  if (client.is_existing_client) {
    setFill(doc, BRAND.gold)
    doc.roundedRect(w - PAGE_MARGIN_X - 44, yStart + 8, 40, 9, 2, 2, "F")
    setText(doc, [20, 20, 22])
    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.text("CLIENTE", w - PAGE_MARGIN_X - 24, yStart + 14.2, { align: "center" })
  }

  return yStart + 40 + SECTION_GAP
}

function sectionTitle(doc: jsPDF, title: string, y: number, accent = false): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  setText(doc, accent ? BRAND.gold : BRAND.muted)
  doc.text(title.toUpperCase(), PAGE_MARGIN_X, y)

  setDraw(doc, accent ? BRAND.gold : BRAND.hairline)
  doc.setLineWidth(accent ? 0.55 : 0.35)
  const w = doc.internal.pageSize.getWidth()
  doc.line(PAGE_MARGIN_X, y + 1.5, w - PAGE_MARGIN_X, y + 1.5)

  return y + 6
}

function ensureSpace(doc: jsPDF, y: number, needed = 32): number {
  const h = doc.internal.pageSize.getHeight()
  if (y + needed > h - 20) {
    doc.addPage()
    return PAGE_MARGIN_TOP
  }
  return y
}

function keyValueTable(doc: jsPDF, rows: [string, string][], startY: number): number {
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
      cellPadding: { top: 3, right: 4, bottom: 3, left: 0 },
      textColor: BRAND.ink,
      lineColor: BRAND.hairline,
      lineWidth: 0,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 58, textColor: BRAND.muted },
      1: { cellWidth: "auto" },
    },
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X },
  })

  return (doc as PDF).lastAutoTable.finalY + 6
}

function drawFooter(doc: jsPDF, mode: ClientPDFMode, validityDays: number) {
  const pageCount = doc.getNumberOfPages()
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()
  const tag =
    mode === "proposal"
      ? `Preventivo indicativo — validità ${validityDays} giorni salvo diverso accordo scritto.`
      : "Scheda di analisi preliminare — uso interno Anvance Production."

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    setDraw(doc, BRAND.hairline)
    doc.setLineWidth(0.25)
    doc.line(PAGE_MARGIN_X, h - 16, w - PAGE_MARGIN_X, h - 16)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.8)
    setText(doc, BRAND.muted)
    const tw = w - PAGE_MARGIN_X * 2
    const lines = doc.splitTextToSize(tag, tw)
    doc.text(lines, PAGE_MARGIN_X, h - 12)

    doc.setFontSize(7.5)
    doc.text("Anvance Production", PAGE_MARGIN_X, h - 5)
    doc.text(`Pag. ${i} / ${pageCount}`, w - PAGE_MARGIN_X, h - 5, { align: "right" })
  }
}

function buildRequestedServiceList(client: Client): string[] {
  const out: string[] = []
  if (client.wants_website) out.push("Sito web")
  if (client.wants_new_logo) out.push("Logo & identità")
  if (client.wants_social_management) out.push("Social management")
  if (client.wants_short_videos) out.push("Reels / short-form")
  if (client.wants_long_videos) out.push("Long-form / YouTube")
  if (client.wants_cinematic_videos) out.push("Video cinematic")
  if (client.wants_photography) out.push("Fotografia")
  if (client.wants_graphic_design) out.push("Graphic design")
  if (client.wants_ads_management) out.push("Ads")
  return out
}

function drawServiceChips(doc: jsPDF, chips: string[], y: number): number {
  if (chips.length === 0) {
    setText(doc, BRAND.muted)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.text("Nessun servizio selezionato.", PAGE_MARGIN_X, y + 2)
    return y + 8
  }
  const w = doc.internal.pageSize.getWidth()
  let chipX = PAGE_MARGIN_X
  let chipY = y
  doc.setFontSize(8)
  for (const m of chips) {
    const cw = doc.getTextWidth(m) + 8
    if (chipX + cw > w - PAGE_MARGIN_X) {
      chipX = PAGE_MARGIN_X
      chipY += 8
    }
    setDraw(doc, BRAND.hairline)
    doc.roundedRect(chipX, chipY - 3.5, cw, 7, 1.5, 1.5, "S")
    setText(doc, BRAND.ink)
    doc.text(m, chipX + 4, chipY + 1)
    chipX += cw + 4
  }
  return chipY + 10
}

/** Riga finali imponibile / IVA / totale (sempre visibili nel preventivo). */
function renderPreventivoTotals(
  doc: jsPDF,
  y: number,
  pricing: ServicePricing,
  subtotal: number,
  vat: number,
  grand: number,
  monthlyImp: number,
  onceImp: number,
  contractMonths: number,
): number {
  y = ensureSpace(doc, y, 38)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  setText(doc, BRAND.muted)

  if (contractMonths > 1) {
    doc.setFont("helvetica", "italic")
    const cmNote = `Durata impegno indicata nel brief: ${contractMonths} mesi — sulle voci a canone: Totale = canone mensile × ${contractMonths}.`
    const cmW = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2
    const cmLines = doc.splitTextToSize(cmNote, cmW)
    doc.text(cmLines, PAGE_MARGIN_X, y)
    y += cmLines.length * 4 + 4
    doc.setFont("helvetica", "normal")
  }
  if (monthlyImp > 0) {
    doc.setFont("helvetica", "bold")
    setText(doc, BRAND.ink)
    doc.text(`Totale voci a canone mensile (imponibile): ${fmtEuro(monthlyImp)}`, PAGE_MARGIN_X, y)
    y += 5
    doc.setFont("helvetica", "normal")
    setText(doc, BRAND.muted)
    doc.text(`Totale una tantum / progetto (imponibile): ${fmtEuro(onceImp)}`, PAGE_MARGIN_X, y)
    y += 5
    const note =
      "Le righe «Canone mensile» con quantità > 1 riflettono l’impegno su più mesi (canone unitario × mesi)."
    const noteW = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2
    const noteLines = doc.splitTextToSize(note, noteW)
    doc.text(noteLines, PAGE_MARGIN_X, y)
    y += noteLines.length * 4 + 6
  }

  doc.text(`Imponibile complessivo: ${fmtEuro(subtotal)}`, PAGE_MARGIN_X, y)
  y += 5
  doc.text(`IVA (${pricing.vatPercent}%): ${fmtEuro(vat)}`, PAGE_MARGIN_X, y)
  y += 6
  doc.setFont("helvetica", "bold")
  setText(doc, BRAND.ink)
  doc.setFontSize(11)
  doc.text(`Totale documento (IVA inclusa): ${fmtEuro(grand)}`, PAGE_MARGIN_X, y)
  y += 8

  if (contractMonths === 12) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    setText(doc, BRAND.muted)
    const avgDocMonthly = Math.round((grand / 12) * 100) / 100
    doc.text(
      `Equiv. mensile medio (totale documento ÷ 12, IVA inclusa): ${fmtEuro(avgDocMonthly)}`,
      PAGE_MARGIN_X,
      y,
    )
    y += 5
    if (monthlyImp > 0) {
      const avgRetainerImp = Math.round((monthlyImp / 12) * 100) / 100
      doc.text(
        `Equiv. canone mensile medio (solo voci a canone, imponibile ÷ 12): ${fmtEuro(avgRetainerImp)}`,
        PAGE_MARGIN_X,
        y,
      )
      y += 5
    }
  }

  return y + 3
}

function drawPricingBlock(
  doc: jsPDF,
  client: Client,
  pricing: ServicePricing,
  lineBilling: ServiceLineBilling,
  pricingActive: Partial<ServicePricingActive> | undefined,
  startY: number,
): number {
  const contractMonths = normalizeContractMonths(client.retainer_contract_months)
  const lines = buildPreventivoLines(client, {
    pricing,
    lineBilling,
    contractMonths,
    pricingActive,
  })
  const subtotal = sumLines(lines)
  const vat = vatAmount(subtotal, pricing.vatPercent)
  const grand = subtotal + vat
  const monthlyImp = monthlySubtotal(lines)
  const onceImp = oneTimeSubtotal(lines)

  if (lines.length === 0) {
    setText(doc, BRAND.muted)
    doc.setFontSize(9)
    const emptyMsg =
      "Nessun servizio mappato dal brief su questo listino (oppure tutti i prezzi sono a zero, oppure le tariffe sono disattivate in Listino preventivi). Controlla i servizi selezionati e /admin/settings."
    const emptyW = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2
    const emptyLines = doc.splitTextToSize(emptyMsg, emptyW)
    doc.text(emptyLines, PAGE_MARGIN_X, startY)
    let y = startY + emptyLines.length * 4 + 6
    return renderPreventivoTotals(
      doc,
      y,
      pricing,
      subtotal,
      vat,
      grand,
      monthlyImp,
      onceImp,
      contractMonths,
    )
  }

  const body: RowInput[] = lines.map((l) => [
    l.description,
    l.billing === "monthly" ? "Canone mensile" : "Una tantum",
    String(l.qty),
    fmtEuro(l.unitPrice),
    fmtEuro(l.total),
  ])

  autoTable(doc, {
    startY,
    head: [["Voce", "Tipo", "Qtà", "Prezzo unit.", "Totale"]],
    body,
    theme: "striped",
    headStyles: {
      fillColor: BRAND.black,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: BRAND.ink,
      lineColor: BRAND.hairline,
    },
    alternateRowStyles: { fillColor: [248, 248, 250] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 28, fontSize: 8 },
      2: { halign: "center", cellWidth: 14 },
      3: { halign: "right", cellWidth: 28 },
      4: { halign: "right", cellWidth: 28 },
    },
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X },
  })

  let y = (doc as PDF).lastAutoTable.finalY + 6
  return renderPreventivoTotals(
    doc,
    y,
    pricing,
    subtotal,
    vat,
    grand,
    monthlyImp,
    onceImp,
    contractMonths,
  )
}

/* ------------------------------------------------------------------ */
/*  Main body (shared)                                               */
/* ------------------------------------------------------------------ */

function drawBriefBody(doc: jsPDF, client: Client, y0: number, mode: ClientPDFMode): number {
  let y = y0

  y = sectionTitle(doc, mode === "proposal" ? "Contesto & cliente" : "Brief", y, mode === "proposal")
  y = keyValueTable(
    doc,
    [
      ["Agente", txt(client.agent_name)],
      [
        "Data brief",
        client.brief_date ? new Date(client.brief_date).toLocaleDateString("it-IT") : "—",
      ],
      ["Cliente esistente", yn(client.is_existing_client)],
      [
        "Cliente dal",
        client.client_since
          ? new Date(client.client_since).toLocaleDateString("it-IT", { month: "long", year: "numeric" })
          : "—",
      ],
    ],
    y,
  )

  y = ensureSpace(doc, y, 44)
  y = sectionTitle(doc, "Azienda", y)
  y = keyValueTable(
    doc,
    [
      ["Ragione sociale", txt(client.company_name)],
      ["Settore", txt(client.business_type)],
      ["P.IVA", txt(client.vat_number)],
      ["C.F.", txt(client.tax_code)],
    ],
    y,
  )

  y = ensureSpace(doc, y, 52)
  y = sectionTitle(doc, "Contatto & sede", y)
  y = keyValueTable(
    doc,
    [
      ["Referente", txt(client.contact_name)],
      ["Ruolo", txt(client.contact_role)],
      ["Email", txt(client.email)],
      ["Telefono", txt(client.phone)],
      ["Sito attuale", txt(client.website)],
      [
        "Indirizzo",
        [client.address, client.postal_code, client.city, client.province, client.country]
          .filter(Boolean)
          .join(", ") || "—",
      ],
    ],
    y,
  )

  y = ensureSpace(doc, y, 28)
  y = sectionTitle(doc, "Servizi richiesti", y, true)
  y = drawServiceChips(doc, buildRequestedServiceList(client), y + 2)

  if (mode === "proposal") {
    const cm = normalizeContractMonths(client.retainer_contract_months)
    y = keyValueTable(
      doc,
      [
        [
          "Durata impegno sui canoni (dal brief)",
          cm === 1 ? "1 mese" : `${cm} mesi (totale canone = mensile × mesi in tabella)`,
        ],
      ],
      y,
    )
  }

  if (client.wants_website) {
    y = ensureSpace(doc, y, 40)
    y = sectionTitle(doc, "Sito web", y)
    y = keyValueTable(
      doc,
      [
        [
          "Piattaforma",
          client.website_platform ? WEBSITE_PLATFORM_LABELS[client.website_platform] : "—",
        ],
        [
          "Tipo",
          client.website_purpose
            ? WEBSITE_PURPOSE_LABELS[client.website_purpose] ?? client.website_purpose
            : "—",
        ],
        [
          "Sito attuale",
          client.current_website_status
            ? WEBSITE_CURRENT_STATUS_LABELS[client.current_website_status]
            : "—",
        ],
      ],
      y,
    )
  }

  if (client.wants_new_logo) {
    y = ensureSpace(doc, y, 36)
    y = sectionTitle(doc, "Logo & identità", y)
    y = keyValueTable(
      doc,
      [
        ["Stile", txt(client.logo_style_preference)],
        ["Palette", txt(client.logo_palette_preference)],
        ["Riferimenti", txt(client.brand_references)],
      ],
      y,
    )
  }

  const hasSocial =
    (client.current_social_channels && client.current_social_channels.length > 0) ||
    client.wants_social_management
  if (hasSocial) {
    y = ensureSpace(doc, y, 40)
    y = sectionTitle(doc, "Social", y)
    y = keyValueTable(
      doc,
      [
        ["Canali attivi", list(client.current_social_channels, CHANNEL_LABELS)],
        ["Management", yn(client.wants_social_management)],
        ["Obiettivi", txt(client.social_management_goals)],
      ],
      y,
    )
  }

  if (
    client.wants_short_videos ||
    client.wants_long_videos ||
    client.wants_cinematic_videos ||
    client.wants_photography
  ) {
    y = ensureSpace(doc, y, 44)
    y = sectionTitle(doc, "Video & fotografia", y)
    y = keyValueTable(
      doc,
      [
        ["Reels / short", yn(client.wants_short_videos)],
        ["Long-form", yn(client.wants_long_videos)],
        ["Cinematic", yn(client.wants_cinematic_videos)],
        ["Foto", yn(client.wants_photography)],
        ["Note", txt(client.video_photo_notes)],
      ],
      y,
    )
  }

  if (client.wants_graphic_design) {
    y = ensureSpace(doc, y, 28)
    y = sectionTitle(doc, "Graphic design", y)
    y = keyValueTable(
      doc,
      [["Materiali", list(client.graphic_design_items, GRAPHIC_LABELS)]],
      y,
    )
  }

  if (client.wants_ads_management) {
    y = ensureSpace(doc, y, 36)
    y = sectionTitle(doc, "Ads", y)
    y = keyValueTable(
      doc,
      [
        ["Piattaforme", list(client.ads_platforms, ADS_PLATFORM_LABELS)],
        ["Budget mensile", labelOf(client.ads_monthly_budget, ADS_MONTHLY_BUDGETS)],
        ["Esperienza pregressa", yn(client.ads_previous_experience)],
      ],
      y,
    )
  }

  if (client.target_audience || client.competitors) {
    y = ensureSpace(doc, y, 36)
    y = sectionTitle(doc, "Brand & audience", y)
    y = keyValueTable(
      doc,
      [
        ["Target", txt(client.target_audience)],
        ["Competitor / ispirazioni", txt(client.competitors)],
      ],
      y,
    )
  }

  if (client.pain_points && client.pain_points.length > 0) {
    y = ensureSpace(doc, y, 36)
    y = sectionTitle(doc, "Criticità", y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    setText(doc, BRAND.ink)
    for (const p of client.pain_points) {
      const text = PAIN_LABELS[p] ?? p
      y = ensureSpace(doc, y, 8)
      setFill(doc, BRAND.gold)
      doc.circle(PAGE_MARGIN_X + 1.2, y - 1, 0.9, "F")
      doc.text(text, PAGE_MARGIN_X + 6, y)
      y += 5
    }
    y += 4
  }

  y = ensureSpace(doc, y, 36)
  y = sectionTitle(doc, "Budget & tempistiche", y)
  y = keyValueTable(
    doc,
    [
      ["Budget complessivo", labelOf(client.budget_range, BUDGET_RANGES)],
      ["Tempistiche", labelOf(client.timeline, TIMELINES)],
    ],
    y,
  )

  if (client.project_description && client.project_description.trim() !== "") {
    y = ensureSpace(doc, y, 28)
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
    y += lines.length * 5 + 6
  }

  if (client.notes && client.notes.trim() !== "") {
    y = ensureSpace(doc, y, 28)
    y = sectionTitle(doc, "Note interne", y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    setText(doc, BRAND.ink)
    const w = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2
    const lines = doc.splitTextToSize(client.notes, w)
    doc.text(lines, PAGE_MARGIN_X, y)
    y += lines.length * 5 + 4
  }

  return y
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

export function buildClientPDF(
  client: Client,
  options?: ClientPDFOptions,
): {
  doc: jsPDF
  fileName: string
} {
  const mode = options?.mode ?? "brief"
  const pricing = options?.pricing ?? DEFAULT_SERVICE_PRICING
  const lineBilling = options?.lineBilling ?? DEFAULT_SERVICE_LINE_BILLING
  const pricingActive = options?.pricingActive
  const validityDays = options?.proposalValidityDays ?? 30

  const doc = new jsPDF({ unit: "mm", format: "a4" })

  drawProposalHero(doc, client, mode)
  let y = drawClientHeroCard(doc, client, 70)

  if (mode === "proposal") {
    y = ensureSpace(doc, y, 50)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    setText(doc, BRAND.ink)
    const intro =
      "Gentile Partner,\ndi seguito riepiloghiamo i servizi emersi dal brief preliminare e un indicativo economico basato sul listino interno. L'importo è orientativo e potrà essere confermato dopo call conoscitiva e scope definitivo."
    const w = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2
    doc.text(doc.splitTextToSize(intro, w), PAGE_MARGIN_X, y)
    y += 22
  }

  y = drawBriefBody(doc, client, y, mode)

  if (mode === "proposal") {
    y = ensureSpace(doc, y, 55)
    y = sectionTitle(doc, "Indicativo economico", y, true)
    y = drawPricingBlock(doc, client, pricing, lineBilling, pricingActive, y)
  }

  drawFooter(doc, mode, validityDays)

  const safeName = (client.company_name || "client")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
  const datePart = new Date().toISOString().split("T")[0]
  const prefix = mode === "proposal" ? "anvance_preventivo" : "anvance_brief"
  return { doc, fileName: `${prefix}_${safeName}_${datePart}.pdf` }
}

export function generateClientPDF(client: Client, options?: ClientPDFOptions): void {
  const { doc, fileName } = buildClientPDF(client, options)
  doc.save(fileName)
}
