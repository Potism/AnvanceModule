"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ClientFormData,
  WEBSITE_PLATFORMS,
  WEBSITE_PURPOSES,
  CURRENT_WEBSITE_STATUS_OPTIONS,
  LOGO_STYLES,
  SOCIAL_CHANNELS,
  GRAPHIC_DESIGN_ITEMS,
  ADS_PLATFORMS,
  ADS_MONTHLY_BUDGETS,
  BUDGET_RANGES,
  TIMELINES,
  PAIN_POINTS,
  WebsitePlatform,
} from "@/lib/types"
import {
  Building2,
  User,
  MapPin,
  Globe,
  Sparkles,
  AlertTriangle,
  UserCog,
  Palette,
  Megaphone,
  Camera,
  Video,
  Layout,
  Share2,
  Target,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useListino } from "@/lib/listino-context"
import Link from "next/link"
import {
  activePackages,
  DEFAULT_QUOTE_CONFIG,
  PACKAGE_SERVICE_LABEL_KEYS,
  packageMissingForBrief,
  snapshotFromPackage,
  syncIncludedServices,
  wantedServicesFromBrief,
  type ClientQuoteConfig,
  type PackageServiceKey,
} from "@/lib/quote-packages"
import { Euro } from "lucide-react"
import { useEffect } from "react"

interface StepProps {
  form: UseFormReturn<ClientFormData>
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */

function StepHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-7">
      <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-foreground text-background">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div>
        <h2 className="text-lg sm:text-2xl font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <Label className="text-xs sm:text-sm font-medium text-foreground">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
      {optional && (
        <span className="ml-1 text-[10px] text-muted-foreground font-normal">
          (facoltativo)
        </span>
      )}
    </Label>
  )
}

function OptionTile({
  active,
  onClick,
  children,
  size = "md",
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  size?: "sm" | "md"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 ${
        size === "sm" ? "p-2 sm:p-2.5 text-[11px] sm:text-xs" : "p-3 sm:p-3.5 text-xs sm:text-sm"
      } rounded-lg border text-left transition-all duration-150 ${
        active
          ? "border-foreground bg-foreground/[0.03] shadow-[0_1px_0_0_oklch(0.88_0_0)] ring-1 ring-foreground/10"
          : "border-border bg-background hover:bg-secondary hover:border-foreground/30"
      }`}
    >
      <span
        className={`flex-shrink-0 h-4 w-4 rounded-[5px] border-2 transition-colors flex items-center justify-center ${
          active ? "border-foreground bg-foreground" : "border-border bg-background"
        }`}
      >
        {active && (
          <svg
            className="h-2.5 w-2.5 text-background"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 6.5L4.5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="leading-tight">{children}</span>
    </button>
  )
}

/**
 * Stylish, side-by-side Sì/No toggle used throughout the services step.
 * Keeps the form feeling decisive rather than form-heavy.
 */
function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null | undefined
  onChange: (v: boolean | null) => void
}) {
  const { t } = useLanguage()
  return (
    <div className="inline-flex rounded-lg border border-border bg-background overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(value === true ? null : true)}
        className={`px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
          value === true
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-secondary"
        }`}
      >
        {t("svc.yes")}
      </button>
      <button
        type="button"
        onClick={() => onChange(value === false ? null : false)}
        className={`px-4 py-1.5 text-xs sm:text-sm font-medium border-l border-border transition-colors ${
          value === false
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-secondary"
        }`}
      >
        {t("svc.no")}
      </button>
    </div>
  )
}

/** Section card used inside the services step. */
function ServiceCard({
  icon: Icon,
  title,
  question,
  value,
  onToggle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  question?: string
  value: boolean | null | undefined
  onToggle: (v: boolean | null) => void
  children?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-secondary/40 overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-background/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-md bg-foreground/[0.06] text-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
            {question && (
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                {question}
              </p>
            )}
          </div>
        </div>
        <YesNoToggle value={value} onChange={onToggle} />
      </header>
      {value && children ? (
        <div className="px-4 py-4 space-y-4 bg-secondary/20">{children}</div>
      ) : null}
    </section>
  )
}

function toggleInArray<T extends string>(
  current: T[] | undefined | null,
  value: T,
): T[] {
  const safe = current ?? []
  return safe.includes(value) ? safe.filter((v) => v !== value) : [...safe, value]
}

/* ================================================================== */
/*  STEP 1 — Agent / brief meta                                        */
/* ================================================================== */

export function AgentInfoStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()
  const isExisting = watch("is_existing_client")

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={UserCog}
        title={t("agent.title")}
        subtitle={t("agent.subtitle")}
      />

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <FieldLabel optional>{t("agent.name")}</FieldLabel>
          <Input
            placeholder={t("agent.namePlaceholder")}
            {...register("agent_name")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("agent.date")}</FieldLabel>
          <Input
            type="date"
            {...register("brief_date")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-secondary border border-border">
        <div className="pr-3">
          <Label className="text-xs sm:text-sm font-medium">
            {t("agent.existingClient")}
          </Label>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            {t("agent.existingClientDesc")}
          </p>
        </div>
        <Switch
          checked={isExisting || false}
          onCheckedChange={(v) => setValue("is_existing_client", v)}
        />
      </div>

      {isExisting && (
        <div className="space-y-1.5">
          <FieldLabel optional>{t("agent.since")}</FieldLabel>
          <Input
            type="month"
            {...register("client_since")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  STEP 2 — Company                                                  */
/* ================================================================== */

export function CompanyInfoStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
  } = form
  const { t } = useLanguage()

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={Building2}
        title={t("company.title")}
        subtitle={t("company.subtitle")}
      />

      <div className="grid gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel required>{t("company.name")}</FieldLabel>
          <Input
            placeholder={t("company.namePlaceholder")}
            {...register("company_name", { required: t("company.nameRequired") })}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
          {errors.company_name && (
            <p className="text-xs text-destructive">{errors.company_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel>{t("company.businessType")}</FieldLabel>
          <Input
            placeholder={t("company.businessTypePlaceholder")}
            {...register("business_type")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("company.vatNumber")}</FieldLabel>
            <Input
              placeholder="IT00000000000"
              {...register("vat_number")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("company.taxCode")}</FieldLabel>
            <Input
              placeholder="Codice Fiscale"
              {...register("tax_code")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 3 — Contact                                                  */
/* ================================================================== */

export function ContactInfoStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
  } = form
  const { t } = useLanguage()

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={User}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <div className="grid gap-3 sm:gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel required>{t("contact.name")}</FieldLabel>
            <Input
              placeholder={t("contact.namePlaceholder")}
              {...register("contact_name", { required: t("contact.nameRequired") })}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
            {errors.contact_name && (
              <p className="text-xs text-destructive">{errors.contact_name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("contact.role")}</FieldLabel>
            <Input
              placeholder={t("contact.rolePlaceholder")}
              {...register("contact_role")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel required>{t("contact.email")}</FieldLabel>
            <Input
              type="email"
              placeholder={t("contact.emailPlaceholder")}
              {...register("email", {
                required: t("contact.emailRequired"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("contact.emailInvalid"),
                },
              })}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("contact.phone")}</FieldLabel>
            <Input
              type="tel"
              placeholder={t("contact.phonePlaceholder")}
              {...register("phone")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel optional>{t("contact.website")}</FieldLabel>
          <Input
            type="url"
            placeholder={t("contact.websitePlaceholder")}
            {...register("website")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 4 — Address                                                  */
/* ================================================================== */

export function AddressStep({ form }: StepProps) {
  const { register } = form
  const { t } = useLanguage()

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={MapPin}
        title={t("address.title")}
        subtitle={t("address.subtitle")}
      />

      <div className="grid gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel>{t("address.street")}</FieldLabel>
          <Input
            placeholder={t("address.streetPlaceholder")}
            {...register("address")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <FieldLabel>{t("address.city")}</FieldLabel>
            <Input
              placeholder={t("address.cityPlaceholder")}
              {...register("city")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("address.postalCode")}</FieldLabel>
            <Input
              placeholder="20100"
              {...register("postal_code")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("address.province")}</FieldLabel>
            <Input
              placeholder="MI"
              {...register("province")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm uppercase"
            />
          </div>
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <FieldLabel>{t("address.country")}</FieldLabel>
            <Input
              placeholder="Italia"
              defaultValue="Italia"
              {...register("country")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 5 — Services (the new, direct one)                           */
/* ================================================================== */

export function ServicesStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()

  const wantsWebsite = watch("wants_website")
  const wantsLogo = watch("wants_new_logo")
  const wantsSocial = watch("wants_social_management")
  const wantsGraphic = watch("wants_graphic_design")
  const wantsAds = watch("wants_ads_management")

  const socialChannels = watch("current_social_channels") || []
  const logoStyles = (watch("logo_style_preference") || "").split(",").map(s => s.trim()).filter(Boolean)
  const graphicItems = watch("graphic_design_items") || []
  const adsPlatforms = watch("ads_platforms") || []

  return (
    <div className="space-y-5 sm:space-y-6">
      <StepHeader
        icon={Sparkles}
        title={t("services.title")}
        subtitle={t("services.subtitle")}
      />

      {/* ───── Website ───── */}
      <ServiceCard
        icon={Globe}
        title={t("svc.website.title")}
        question={t("svc.website.question")}
        value={wantsWebsite}
        onToggle={(v) => setValue("wants_website", v)}
      >
        <div className="space-y-1.5">
          <FieldLabel>{t("svc.website.platform")}</FieldLabel>
          <p className="text-[11px] text-muted-foreground -mt-0.5">
            {t("svc.website.platformHint")}
          </p>
          <div className="grid gap-2 sm:grid-cols-1">
            {WEBSITE_PLATFORMS.map((p) => (
              <OptionTile
                key={p.value}
                active={watch("website_platform") === p.value}
                onClick={() =>
                  setValue(
                    "website_platform",
                    watch("website_platform") === p.value ? null : (p.value as WebsitePlatform),
                  )
                }
              >
                {t(`websitePlatform.${p.value}`)}
              </OptionTile>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("svc.website.currentStatus")}</FieldLabel>
            <Select
              value={watch("current_website_status") ?? ""}
              onValueChange={(v) =>
                setValue(
                  "current_website_status",
                  v as ClientFormData["current_website_status"],
                )
              }
            >
              <SelectTrigger className="bg-background border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {CURRENT_WEBSITE_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`websiteCurrent.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("svc.website.purpose")}</FieldLabel>
            <Select
              value={watch("website_purpose") ?? ""}
              onValueChange={(v) => setValue("website_purpose", v)}
            >
              <SelectTrigger className="bg-background border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {WEBSITE_PURPOSES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {t(`websitePurpose.${p}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ServiceCard>

      {/* ───── Logo ───── */}
      <ServiceCard
        icon={Palette}
        title={t("svc.logo.title")}
        question={t("svc.logo.question")}
        value={wantsLogo}
        onToggle={(v) => setValue("wants_new_logo", v)}
      >
        <div className="space-y-1.5">
          <FieldLabel>{t("svc.logo.style")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LOGO_STYLES.map((s) => (
              <OptionTile
                key={s}
                active={logoStyles.includes(s)}
                onClick={() => {
                  const next = toggleInArray(logoStyles, s)
                  setValue("logo_style_preference", next.join(", "))
                }}
                size="sm"
              >
                {t(`logoStyle.${s}`)}
              </OptionTile>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <FieldLabel>{t("svc.logo.palette")}</FieldLabel>
            <Input
              placeholder={t("svc.logo.palettePlaceholder")}
              {...register("logo_palette_preference")}
              className="bg-background border-border h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("svc.logo.references")}</FieldLabel>
            <Input
              placeholder={t("svc.logo.referencesPlaceholder")}
              {...register("brand_references")}
              className="bg-background border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </ServiceCard>

      {/* ───── Social ───── */}
      <section className="rounded-xl border border-border bg-secondary/40 overflow-hidden">
        <header className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-background/40">
          <div className="p-1.5 rounded-md bg-foreground/[0.06] text-foreground">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{t("svc.social.title")}</h3>
          </div>
        </header>
        <div className="px-4 py-4 space-y-4 bg-secondary/20">
          <div className="space-y-1.5">
            <FieldLabel>{t("svc.social.currentChannels")}</FieldLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SOCIAL_CHANNELS.map((c) => (
                <OptionTile
                  key={c}
                  active={socialChannels.includes(c)}
                  onClick={() =>
                    setValue("current_social_channels", toggleInArray(socialChannels, c))
                  }
                  size="sm"
                >
                  {t(`channel.${c}`)}
                </OptionTile>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-border/60">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {t("svc.social.management")}
              </p>
            </div>
            <YesNoToggle value={wantsSocial} onChange={(v) => setValue("wants_social_management", v)} />
          </div>

          {wantsSocial && (
            <div className="space-y-1.5">
              <FieldLabel optional>{t("svc.social.goals")}</FieldLabel>
              <Textarea
                rows={2}
                placeholder={t("svc.social.goalsPlaceholder")}
                {...register("social_management_goals")}
                className="bg-background border-border resize-none text-sm"
              />
            </div>
          )}
        </div>
      </section>

      {/* ───── Video & Photo ───── */}
      <section className="rounded-xl border border-border bg-secondary/40 overflow-hidden">
        <header className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-background/40">
          <div className="p-1.5 rounded-md bg-foreground/[0.06] text-foreground">
            <Video className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{t("svc.video.title")}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">{t("svc.video.hint")}</p>
          </div>
        </header>
        <div className="px-4 py-4 space-y-3 bg-secondary/20">
          <FormatCheckRow
            icon={Video}
            label={t("svc.video.short")}
            description={t("svc.video.shortDesc")}
            value={watch("wants_short_videos")}
            onChange={(v) => setValue("wants_short_videos", v)}
          />
          <FormatCheckRow
            icon={Video}
            label={t("svc.video.long")}
            description={t("svc.video.longDesc")}
            value={watch("wants_long_videos")}
            onChange={(v) => setValue("wants_long_videos", v)}
          />
          <FormatCheckRow
            icon={Video}
            label={t("svc.video.cinematic")}
            description={t("svc.video.cinematicDesc")}
            value={watch("wants_cinematic_videos")}
            onChange={(v) => setValue("wants_cinematic_videos", v)}
          />
          <FormatCheckRow
            icon={Camera}
            label={t("svc.video.photo")}
            description={t("svc.video.photoDesc")}
            value={watch("wants_photography")}
            onChange={(v) => setValue("wants_photography", v)}
          />

          {(watch("wants_short_videos") ||
            watch("wants_long_videos") ||
            watch("wants_cinematic_videos") ||
            watch("wants_photography")) && (
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <FieldLabel optional>{t("svc.video.notes")}</FieldLabel>
              <Textarea
                rows={2}
                placeholder={t("svc.video.notesPlaceholder")}
                {...register("video_photo_notes")}
                className="bg-background border-border resize-none text-sm"
              />
            </div>
          )}
        </div>
      </section>

      {/* ───── Graphic Design ───── */}
      <ServiceCard
        icon={Layout}
        title={t("svc.graphic.title")}
        question={t("svc.graphic.question")}
        value={wantsGraphic}
        onToggle={(v) => setValue("wants_graphic_design", v)}
      >
        <div className="space-y-1.5">
          <FieldLabel>{t("svc.graphic.items")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GRAPHIC_DESIGN_ITEMS.map((g) => (
              <OptionTile
                key={g}
                active={graphicItems.includes(g)}
                onClick={() =>
                  setValue("graphic_design_items", toggleInArray(graphicItems, g))
                }
                size="sm"
              >
                {t(`graphic.${g}`)}
              </OptionTile>
            ))}
          </div>
        </div>
      </ServiceCard>

      {/* ───── Ads ───── */}
      <ServiceCard
        icon={Megaphone}
        title={t("svc.ads.title")}
        question={t("svc.ads.question")}
        value={wantsAds}
        onToggle={(v) => setValue("wants_ads_management", v)}
      >
        <div className="space-y-1.5">
          <FieldLabel>{t("svc.ads.platforms")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ADS_PLATFORMS.map((p) => (
              <OptionTile
                key={p}
                active={adsPlatforms.includes(p)}
                onClick={() =>
                  setValue("ads_platforms", toggleInArray(adsPlatforms, p))
                }
                size="sm"
              >
                {t(`adsPlatform.${p}`)}
              </OptionTile>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <FieldLabel>{t("svc.ads.budget")}</FieldLabel>
            <Select
              value={watch("ads_monthly_budget") ?? ""}
              onValueChange={(v) => setValue("ads_monthly_budget", v)}
            >
              <SelectTrigger className="bg-background border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder={t("svc.ads.budgetPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {ADS_MONTHLY_BUDGETS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {t(`adsBudget.${b.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("svc.ads.previous")}</FieldLabel>
            <YesNoToggle
              value={watch("ads_previous_experience")}
              onChange={(v) => setValue("ads_previous_experience", v)}
            />
          </div>
        </div>
      </ServiceCard>
    </div>
  )
}

function FormatCheckRow({
  icon: Icon,
  label,
  description,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  value: boolean | null | undefined
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-150 ${
        value
          ? "border-foreground bg-foreground/[0.04] ring-1 ring-foreground/10"
          : "border-border bg-background hover:bg-secondary"
      }`}
    >
      <span
        className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center ${
          value ? "border-foreground bg-foreground" : "border-border bg-background"
        }`}
      >
        {value && (
          <svg className="h-3 w-3 text-background" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5L4.5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-xs sm:text-sm font-medium text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground truncate">{description}</div>
      </div>
    </button>
  )
}

/* ================================================================== */
/*  STEP 6 — Final brief (audience, pains, budget, timeline, description)
/* ================================================================== */

export function FinalStep({ form }: StepProps) {
  const { register, watch, setValue, getValues } = form
  const { t } = useLanguage()
  const { packages, loading: listinoLoading, refresh: refreshListino } = useListino()
  const pains = watch("pain_points") || []

  const briefWants = {
    wants_website: watch("wants_website"),
    wants_new_logo: watch("wants_new_logo"),
    wants_social_management: watch("wants_social_management"),
    wants_short_videos: watch("wants_short_videos"),
    wants_long_videos: watch("wants_long_videos"),
    wants_cinematic_videos: watch("wants_cinematic_videos"),
    wants_photography: watch("wants_photography"),
    wants_graphic_design: watch("wants_graphic_design"),
    wants_ads_management: watch("wants_ads_management"),
  }

  const wanted = wantedServicesFromBrief(briefWants)
  const quoteConfig = (watch("quote_config") ?? DEFAULT_QUOTE_CONFIG) as ClientQuoteConfig
  const selectablePackages = activePackages(packages)

  useEffect(() => {
    void refreshListino()
  }, [refreshListino])

  useEffect(() => {
    if (listinoLoading) return
    const current = (getValues("quote_config") ?? DEFAULT_QUOTE_CONFIG) as ClientQuoteConfig
    const synced = syncIncludedServices(briefWants, current.included_services)
    if (JSON.stringify(synced) !== JSON.stringify(current.included_services ?? [])) {
      setValue("quote_config", { ...current, included_services: synced }, { shouldDirty: false })
    }
  }, [
    listinoLoading,
    setValue,
    getValues,
    briefWants.wants_website,
    briefWants.wants_new_logo,
    briefWants.wants_social_management,
    briefWants.wants_short_videos,
    briefWants.wants_long_videos,
    briefWants.wants_cinematic_videos,
    briefWants.wants_photography,
    briefWants.wants_graphic_design,
    briefWants.wants_ads_management,
  ])

  const setQuoteConfig = (patch: Partial<ClientQuoteConfig>) => {
    setValue("quote_config", { ...quoteConfig, ...patch })
  }

  const toggleIncludedService = (key: PackageServiceKey) => {
    const current = quoteConfig.included_services ?? []
    const next = current.includes(key)
      ? current.filter((s) => s !== key)
      : [...current, key]
    setQuoteConfig({ included_services: next, mode: "custom", package_id: null, package_snapshot: null })
  }

  const selectPackage = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId)
    if (!pkg) return
    const snap = snapshotFromPackage(pkg)
    setQuoteConfig({
      mode: "package",
      package_id: pkg.id,
      package_snapshot: snap,
      included_services: [...pkg.services],
      total_price: pkg.totalPrice,
      billing: pkg.billing,
    })
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <StepHeader
        icon={Target}
        title={t("final.title")}
        subtitle={t("final.subtitle")}
      />

      <section className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-foreground" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("final.painTitle")}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              {t("final.painSubtitle")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PAIN_POINTS.map((p) => (
            <OptionTile
              key={p}
              active={pains.includes(p)}
              onClick={() => setValue("pain_points", toggleInArray(pains, p))}
              size="sm"
            >
              {t(`pain.${p}`)}
            </OptionTile>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel optional>{t("final.audience")}</FieldLabel>
          <Textarea
            rows={3}
            placeholder={t("final.audiencePlaceholder")}
            {...register("target_audience")}
            className="bg-secondary border-border resize-none text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("final.competitors")}</FieldLabel>
          <Textarea
            rows={3}
            placeholder={t("final.competitorsPlaceholder")}
            {...register("competitors")}
            className="bg-secondary border-border resize-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("final.description")}</FieldLabel>
        <Textarea
          rows={3}
          placeholder={t("final.descriptionPlaceholder")}
          {...register("project_description")}
          className="bg-secondary border-border resize-none text-sm"
        />
      </div>

      <section className="rounded-xl border border-border bg-secondary/40 p-4 space-y-4">
        <div className="flex items-start gap-2.5">
          <Euro className="h-4 w-4 mt-0.5 text-foreground" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("final.pricingTitle")}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">{t("final.pricingSubtitle")}</p>
          </div>
        </div>

        {wanted.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("final.pricingEmpty")}</p>
        ) : (
          <>
            <div className="space-y-2">
              <FieldLabel>{t("final.servicesInQuote")}</FieldLabel>
              <p className="text-[11px] text-muted-foreground -mt-1">{t("final.servicesInQuoteHint")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {wanted.map((key) => {
                  const included = (quoteConfig.included_services ?? []).includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleIncludedService(key)}
                      className={`text-left text-xs px-2.5 py-2 rounded-md border transition-colors ${
                        included
                          ? "border-foreground bg-foreground/[0.06]"
                          : "border-border bg-background opacity-50 line-through"
                      }`}
                    >
                      {t(PACKAGE_SERVICE_LABEL_KEYS[key])}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <FieldLabel>{t("final.quoteMode")}</FieldLabel>
              <div className="inline-flex rounded-lg border border-border bg-background overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setQuoteConfig({
                      mode: "package",
                      package_id: null,
                      package_snapshot: null,
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    quoteConfig.mode === "package"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t("final.modePackage")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuoteConfig({
                      mode: "custom",
                      package_id: null,
                      package_snapshot: null,
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-medium border-l border-border transition-colors ${
                    quoteConfig.mode === "custom"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t("final.modeCustom")}
                </button>
              </div>
            </div>

            {quoteConfig.mode === "package" ? (
              <div className="space-y-2">
                {listinoLoading ? (
                  <p className="text-xs text-muted-foreground">{t("final.packagesLoading")}</p>
                ) : selectablePackages.length === 0 ? (
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>{t("final.noPackages")}</p>
                    <Link
                      href="/admin/settings"
                      className="text-foreground underline underline-offset-2 hover:opacity-80"
                    >
                      {t("final.goToListino")}
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {selectablePackages.map((pkg) => {
                      const selected = quoteConfig.package_id === pkg.id
                      const missing = packageMissingForBrief(pkg, briefWants)
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => selectPackage(pkg.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selected
                              ? "border-foreground bg-foreground/[0.05] ring-1 ring-foreground/10"
                              : "border-border bg-background hover:bg-secondary"
                          }`}
                        >
                          <div className="flex justify-between gap-2 items-start">
                            <span className="text-sm font-medium">{pkg.name}</span>
                            <span className="text-sm font-mono shrink-0">
                              € {pkg.totalPrice.toLocaleString("it-IT")}
                              {pkg.billing === "monthly" ? t("final.perMonth") : ""}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {pkg.services.map((s) => t(PACKAGE_SERVICE_LABEL_KEYS[s])).join(" · ")}
                          </p>
                          {missing.length > 0 && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1.5">
                              {t("final.packageHint")}:{" "}
                              {missing.map((s) => t(PACKAGE_SERVICE_LABEL_KEYS[s])).join(", ")}
                            </p>
                          )}
                          {pkg.totalPrice <= 0 && (
                            <p className="text-[10px] text-destructive mt-1">{t("final.packageNoPrice")}</p>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">{t("final.packageFrozenHint")}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <FieldLabel>{t("final.totalPrice")}</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      €
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={50}
                      value={quoteConfig.total_price ?? ""}
                      onChange={(e) =>
                        setQuoteConfig({
                          total_price: parseFloat(e.target.value) || 0,
                          mode: "custom",
                          package_id: null,
                        })
                      }
                      className="bg-background border-border font-mono text-sm pl-7"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>{t("final.totalBilling")}</FieldLabel>
                  <Select
                    value={quoteConfig.billing ?? "once"}
                    onValueChange={(v) =>
                      setQuoteConfig({ billing: v as ClientQuoteConfig["billing"] })
                    }
                  >
                    <SelectTrigger className="bg-background border-border h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">{t("pricing.billingOnce")}</SelectItem>
                      <SelectItem value="monthly">{t("pricing.billingMonthly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <div className="space-y-1.5 rounded-xl border border-border bg-secondary/40 p-4">
        <FieldLabel>{t("final.contractMonths")}</FieldLabel>
        <p className="text-[11px] text-muted-foreground -mt-0.5">{t("final.contractMonthsHint")}</p>
        <Select
          value={String(watch("retainer_contract_months") ?? 1)}
          onValueChange={(v) =>
            setValue(
              "retainer_contract_months",
              Number(v) as ClientFormData["retainer_contract_months"],
            )
          }
        >
          <SelectTrigger className="bg-background border-border h-9 sm:h-10 text-sm max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t("final.contract1")}</SelectItem>
            <SelectItem value="3">{t("final.contract3")}</SelectItem>
            <SelectItem value="6">{t("final.contract6")}</SelectItem>
            <SelectItem value="12">{t("final.contract12")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel>{t("final.budget")}</FieldLabel>
          <Select
            value={watch("budget_range") ?? ""}
            onValueChange={(v) => setValue("budget_range", v)}
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder={t("final.budgetPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {t(`budget.${b.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel>{t("final.timeline")}</FieldLabel>
          <Select
            value={watch("timeline") ?? ""}
            onValueChange={(v) => setValue("timeline", v)}
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder={t("final.timelinePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {TIMELINES.map((tl) => (
                <SelectItem key={tl.value} value={tl.value}>
                  {t(`timeline.${tl.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
