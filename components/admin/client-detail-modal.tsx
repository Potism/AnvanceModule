"use client"

import { Client } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  ExternalLink
} from "lucide-react"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"
import { generateClientPDF } from "@/lib/pdf-generator"
import { useLanguage } from "@/lib/language-context"

interface ClientDetailModalProps {
  client: Client | null
  onClose: () => void
  onStatusChange: (status: Client["status"]) => void
}

export function ClientDetailModal({ client, onClose, onStatusChange }: ClientDetailModalProps) {
  const { t, language } = useLanguage()
  
  if (!client) return null

  const STATUS_OPTIONS = [
    { value: 'new', label: t("status.new") },
    { value: 'contacted', label: t("status.contacted") },
    { value: 'in_progress', label: t("status.in_progress") },
    { value: 'completed', label: t("status.completed") },
    { value: 'archived', label: t("status.archived") },
  ]

  const hasVideoPhoto = client.project_type?.some(t => 
    ["cinematic_video", "reels", "youtube", "photography"].includes(t)
  )
  const hasWebsite = client.project_type?.includes("website")

  const getProjectTypeLabel = (type: string) => {
    return t(`projectType.${type}`)
  }

  const getBudgetLabel = (value: string | null) => {
    if (!value) return "—"
    return t(`budget.${value}`)
  }

  const getTimelineLabel = (value: string | null) => {
    if (!value) return "—"
    return t(`timeline.${value}`)
  }

  const getVideoStyleLabel = (value: string | null) => {
    if (!value) return "—"
    return t(`videoStyle.${value}`)
  }

  const getWebsiteTypeLabel = (value: string | null) => {
    if (!value) return "—"
    return t(`websiteType.${value}`)
  }

  return (
    <Dialog open={!!client} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 bg-card border-border">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border bg-secondary">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-foreground" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-xl font-semibold text-foreground">
                  {client.company_name}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{client.business_type || (language === "it" ? "Nessun tipo di attività" : "No business type")}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>
                    {language === "it" ? "Inviato il" : "Submitted"} {format(new Date(client.created_at), "d MMMM yyyy", { locale: language === "it" ? it : enUS })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={client.status} onValueChange={(v) => onStatusChange(v as Client["status"])}>
                <SelectTrigger className="w-28 sm:w-36 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-foreground" />
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                onClick={() => generateClientPDF(client)}
                className="gap-1.5 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
              >
                <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Contact Information */}
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
                  <a href={`mailto:${client.email}`} className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="truncate">{client.email}</span>
                  </a>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("contact.phone")}</p>
                  {client.phone ? (
                    <a href={`tel:${client.phone}`} className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1">
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
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate">{client.website}</span>
                    </a>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Address */}
            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("address.title")}</h3>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                <p className="font-medium text-xs sm:text-sm">
                  {[client.address, client.city, client.province, client.postal_code, client.country]
                    .filter(Boolean)
                    .join(", ") || (language === "it" ? "Nessun indirizzo fornito" : "No address provided")}
                </p>
              </div>
            </section>

            <Separator />

            {/* Project Requirements */}
            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("project.title")}</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{t("project.services")}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {client.project_type?.map(type => (
                      <Badge key={type} className="bg-foreground/10 text-foreground border-0 text-[10px] sm:text-xs">
                        {getProjectTypeLabel(type)}
                      </Badge>
                    )) || <span className="text-muted-foreground text-xs sm:text-sm">—</span>}
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
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">{t("project.description")}</p>
                    <p className="text-foreground text-xs sm:text-sm whitespace-pre-wrap">{client.project_description}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Video/Photo Details */}
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
                      <p className="font-medium text-xs sm:text-sm">{client.talent_needed ? (language === "it" ? "Sì" : "Yes") : "No"}</p>
                    </div>
                    {client.equipment_notes && (
                      <div className="col-span-2 p-3 sm:p-4 rounded-lg bg-secondary">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">{t("videoPhoto.equipment")}</p>
                        <p className="text-foreground text-xs sm:text-sm">{client.equipment_notes}</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Website Details */}
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
                      <p className="font-medium text-xs sm:text-sm">{client.website_features?.map(f => t(`websiteFeature.${f}`)).join(", ") || "—"}</p>
                    </div>
                  </div>
                </section>
              </>
            )}

            <Separator />

            {/* Brand Information */}
            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t("brand.title")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("brand.colors")}</p>
                  <p className="font-medium text-xs sm:text-sm">{client.brand_colors || "—"}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("brand.fonts")}</p>
                  <p className="font-medium text-xs sm:text-sm">{client.brand_fonts || "—"}</p>
                </div>
                {client.brand_guidelines_url && (
                  <div className="col-span-2 p-3 sm:p-4 rounded-lg bg-secondary">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t("brand.guidelines")}</p>
                    <a href={client.brand_guidelines_url} target="_blank" rel="noopener noreferrer" className="font-medium text-xs sm:text-sm text-foreground hover:underline flex items-center gap-1">
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
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">{t("brand.competitors")}</p>
                    <p className="text-foreground text-xs sm:text-sm">{client.competitors}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Company Details */}
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
