"use client"

import { useEffect, useState } from "react"
import { Client } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Building2,
  User,
  MapPin,
  Briefcase,
  Palette,
  Globe,
  Video,
  Mail,
  Phone,
  Calendar,
  FileDown,
  FileText,
  ExternalLink,
  Pencil,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"
import { generateClientPDF } from "@/lib/pdf-generator"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useListino } from "@/lib/listino-context"

interface ClientDetailModalProps {
  client: Client | null
  onClose: () => void
  onStatusChange: (status: Client["status"]) => void
  onClientUpdated?: (client: Client) => void
}

function deriveServiceTypes(c: Client): string[] {
  if (c.project_type && c.project_type.length > 0) return c.project_type
  const out: string[] = []
  if (c.wants_website) out.push("website")
  if (c.wants_new_logo) out.push("branding")
  if (c.wants_social_management) out.push("social_management")
  if (c.wants_short_videos) out.push("reels")
  if (c.wants_long_videos) out.push("youtube")
  if (c.wants_cinematic_videos) out.push("cinematic_video")
  if (c.wants_photography) out.push("photography")
  if (c.wants_ads_management) out.push("ads")
  return out
}

export function ClientDetailModal({
  client,
  onClose,
  onStatusChange,
  onClientUpdated,
}: ClientDetailModalProps) {
  const { t, language } = useLanguage()
  const { pricing, lineBilling, pricingActive, packages } = useListino()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    project_description: "",
    notes: "",
  })

  useEffect(() => {
    if (!client) return
    setDraft({
      company_name: client.company_name ?? "",
      contact_name: client.contact_name ?? "",
      email: client.email ?? "",
      project_description: client.project_description ?? "",
      notes: client.notes ?? "",
    })
    setIsEditing(false)
  }, [client])

  const cancelEdit = () => {
    if (!client) return
    setDraft({
      company_name: client.company_name ?? "",
      contact_name: client.contact_name ?? "",
      email: client.email ?? "",
      project_description: client.project_description ?? "",
      notes: client.notes ?? "",
    })
    setIsEditing(false)
  }

  if (!client) return null

  const hasVideoPhoto =
    client.project_type?.some((x) =>
      ["cinematic_video", "reels", "youtube", "photography"].includes(x),
    ) ||
    !!(
      client.wants_short_videos ||
      client.wants_long_videos ||
      client.wants_cinematic_videos ||
      client.wants_photography
    )

  const hasWebsite = client.project_type?.includes("website") || !!client.wants_website

  const getProjectTypeLabel = (type: string) => t(`projectType.${type}`)

  const getBudgetLabel = (value: string | null) => {
    if (!value) return "—"
    return t(`budget.${value}`)
  }

  const getTimelineLabel = (value: string | null) => {
    if (!value) return "—"
    return t(`timeline.${value}`)
  }

  const getVideoStyleLabel = (value: string | null | undefined) => {
    if (!value) return "—"
    return t(`videoStyle.${value}`)
  }

  const getWebsiteTypeLabel = (value: string | null | undefined) => {
    if (!value) return "—"
    return t(`websiteType.${value}`)
  }

  const yn = (v: boolean | null | undefined) =>
    v === true ? (language === "it" ? "Sì" : "Yes") : v === false ? (language === "it" ? "No" : "No") : "—"

  const saveEdits = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("clients")
        .update({
          company_name: draft.company_name.trim(),
          contact_name: draft.contact_name.trim(),
          email: draft.email.trim(),
          project_description: draft.project_description.trim() || null,
          notes: draft.notes.trim() || null,
        })
        .eq("id", client.id)

      if (error) throw error

      const updated: Client = {
        ...client,
        ...draft,
        project_description: draft.project_description.trim() || null,
        notes: draft.notes.trim() || null,
      }
      onClientUpdated?.(updated)
      toast.success(t("admin.saved"))
      setIsEditing(false)
    } catch (e) {
      console.error(e)
      toast.error(t("admin.saveError"))
    } finally {
      setSaving(false)
    }
  }

  const svcRows: { label: string; value: string }[] = [
    { label: "Sito web", value: yn(client.wants_website) },
    {
      label: "Piattaforma",
      value:
        client.website_platform === "wordpress"
          ? "WordPress"
          : client.website_platform === "custom_code"
            ? "Custom"
            : client.website_platform === "undecided"
              ? "—"
              : "—",
    },
    { label: "Logo / identità", value: yn(client.wants_new_logo) },
    { label: "Social management", value: yn(client.wants_social_management) },
    { label: "Reels / short", value: yn(client.wants_short_videos) },
    { label: "Long-form", value: yn(client.wants_long_videos) },
    { label: "Video cinematic", value: yn(client.wants_cinematic_videos) },
    { label: "Fotografia", value: yn(client.wants_photography) },
    { label: "Graphic design", value: yn(client.wants_graphic_design) },
    { label: "Ads", value: yn(client.wants_ads_management) },
  ]

  return (
    <Dialog open={!!client} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 bg-card border-border">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border bg-secondary">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-foreground" />
                </div>
                <div>
                  <DialogTitle className="text-base sm:text-xl font-semibold text-foreground">
                    {isEditing ? (
                      <Input
                        value={draft.company_name}
                        onChange={(e) => setDraft((d) => ({ ...d, company_name: e.target.value }))}
                        className="mt-1 max-w-md bg-background"
                      />
                    ) : (
                      client.company_name
                    )}
                  </DialogTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {client.business_type || (language === "it" ? "Nessun tipo di attività" : "No business type")}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>
                      {language === "it" ? "Inviato il" : "Submitted"}{" "}
                      {format(new Date(client.created_at), "d MMMM yyyy", {
                        locale: language === "it" ? it : enUS,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={client.status} onValueChange={(v) => onStatusChange(v as Client["status"])}>
                  <SelectTrigger className="w-28 sm:w-36 h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["new", "contacted", "in_progress", "completed", "archived"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`status.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing((e) => !e)}
                  className="gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t("admin.editBrief")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateClientPDF(client, { mode: "brief" })}
                  className="gap-1.5"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  {t("admin.downloadBriefPdf")}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() =>
                    generateClientPDF(client, {
                      mode: "proposal",
                      pricing,
                      lineBilling,
                      pricingActive,
                      packages,
                    })
                  }
                  className="gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {t("admin.downloadProposalPdf")}
                </Button>
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end gap-2 pt-1 border-t border-border/60">
                <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                  {t("admin.discardEdits")}
                </Button>
                <Button type="button" size="sm" disabled={saving} onClick={saveEdits} className="gap-1.5">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  {t("admin.saveChanges")}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {isEditing && (
              <section className="p-4 rounded-lg border border-border bg-secondary/50 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t("contact.name")}</Label>
                    <Input
                      value={draft.contact_name}
                      onChange={(e) => setDraft((d) => ({ ...d, contact_name: e.target.value }))}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t("contact.email")}</Label>
                    <Input
                      type="email"
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("project.description")}</Label>
                  <Textarea
                    rows={3}
                    value={draft.project_description}
                    onChange={(e) => setDraft((d) => ({ ...d, project_description: e.target.value }))}
                    className="bg-background resize-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("admin.notesInternal")}</Label>
                  <Textarea
                    rows={2}
                    placeholder={t("admin.notesPlaceholder")}
                    value={draft.notes}
                    onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                    className="bg-background resize-none text-sm"
                  />
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">
                  {t("admin.servicesFromBrief")}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {svcRows.map((row) => (
                  <div key={row.label} className="p-2.5 rounded-lg bg-secondary text-xs">
                    <p className="text-muted-foreground text-[10px]">{row.label}</p>
                    <p className="font-medium">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("contact.title")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-secondary">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("contact.name")}</p>
                  <p className="font-medium text-xs sm:text-sm">{client.contact_name}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("contact.role")}</p>
                  <p className="font-medium text-xs sm:text-sm">{client.contact_role || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("contact.email")}</p>
                  <a
                    href={`mailto:${client.email}`}
                    className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="truncate">{client.email}</span>
                  </a>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("contact.phone")}</p>
                  {client.phone ? (
                    <a
                      href={`tel:${client.phone}`}
                      className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {client.phone}
                    </a>
                  ) : (
                    <p className="font-medium text-xs sm:text-sm">—</p>
                  )}
                </div>
                {client.website && (
                  <div className="col-span-2">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t("contact.website")}</p>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate">{client.website}</span>
                    </a>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("address.title")}</h3>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                <p className="font-medium text-xs sm:text-sm">
                  {[client.address, client.city, client.province, client.postal_code, client.country]
                    .filter(Boolean)
                    .join(", ") ||
                    (language === "it" ? "Nessun indirizzo fornito" : "No address provided")}
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("project.title")}</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{t("project.services")}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {deriveServiceTypes(client).length ? (
                      deriveServiceTypes(client).map((type) => (
                        <Badge key={type} className="bg-foreground/10 text-foreground border-0 text-[10px] sm:text-xs">
                          {getProjectTypeLabel(type)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs sm:text-sm">—</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t("project.budget")}</p>
                    <p className="font-medium text-xs sm:text-sm">{getBudgetLabel(client.budget_range)}</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t("project.timeline")}</p>
                    <p className="font-medium text-xs sm:text-sm">{getTimelineLabel(client.timeline)}</p>
                  </div>
                </div>
                {client.project_description && (
                  <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                      {t("project.description")}
                    </p>
                    <p className="text-foreground text-xs sm:text-sm whitespace-pre-wrap">
                      {client.project_description}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {hasVideoPhoto && (
              <>
                <Separator />
                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Video className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("videoPhoto.title")}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("videoPhoto.style")}</p>
                      <p className="font-medium text-xs sm:text-sm">{getVideoStyleLabel(client.video_style)}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("videoPhoto.duration")}</p>
                      <p className="font-medium text-xs sm:text-sm">{client.video_duration || "—"}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("videoPhoto.location")}</p>
                      <p className="font-medium text-xs sm:text-sm">{client.location_preference || "—"}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("videoPhoto.talent")}</p>
                      <p className="font-medium text-xs sm:text-sm">
                        {client.talent_needed ? (language === "it" ? "Sì" : "Yes") : "No"}
                      </p>
                    </div>
                    {client.equipment_notes && (
                      <div className="col-span-2 p-3 sm:p-4 rounded-lg bg-secondary">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                          {t("videoPhoto.equipment")}
                        </p>
                        <p className="text-foreground text-xs sm:text-sm">{client.equipment_notes}</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {hasWebsite && (
              <>
                <Separator />
                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("website.title")}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("website.type")}</p>
                      <p className="font-medium text-xs sm:text-sm">{getWebsiteTypeLabel(client.website_type)}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("website.domain")}</p>
                      <p className="font-medium text-xs sm:text-sm">{client.domain_name || "—"}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("website.hosting")}</p>
                      <p className="font-medium text-xs sm:text-sm">{client.hosting_preference || "—"}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("website.features")}</p>
                      <p className="font-medium text-xs sm:text-sm">
                        {client.website_features?.map((f) => t(`websiteFeature.${f}`)).join(", ") || "—"}
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("brand.title")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("brand.colors")}</p>
                  <p className="font-medium text-xs sm:text-sm">{client.brand_colors || client.logo_palette_preference || "—"}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("brand.fonts")}</p>
                  <p className="font-medium text-xs sm:text-sm">{client.brand_fonts || "—"}</p>
                </div>
                {client.brand_guidelines_url && (
                  <div className="col-span-2 p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t("brand.guidelines")}</p>
                    <a
                      href={client.brand_guidelines_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate">{client.brand_guidelines_url}</span>
                    </a>
                  </div>
                )}
                {client.target_audience && (
                  <div className="col-span-2 p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">{t("brand.audience")}</p>
                    <p className="text-foreground text-xs sm:text-sm">{client.target_audience}</p>
                  </div>
                )}
                {client.competitors && (
                  <div className="col-span-2 p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                      {t("brand.competitors")}
                    </p>
                    <p className="text-foreground text-xs sm:text-sm">{client.competitors}</p>
                  </div>
                )}
              </div>
            </section>

            {(client.vat_number || client.tax_code) && (
              <>
                <Separator />
                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("company.title")}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("company.vatNumber")}</p>
                      <p className="font-medium text-xs sm:text-sm font-mono">{client.vat_number || "—"}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t("company.taxCode")}</p>
                      <p className="font-medium text-xs sm:text-sm font-mono">{client.tax_code || "—"}</p>
                    </div>
                  </div>
                </section>
              </>
            )}

            {client.notes && !isEditing && (
              <>
                <Separator />
                <section>
                  <h3 className="font-semibold text-sm mb-2">{t("admin.notesInternal")}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
