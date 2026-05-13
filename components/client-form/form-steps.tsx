"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
  CUSTOMER_FLOW_OPTIONS,
  PROMO_MATERIALS_OPTIONS,
  WEBSITE_SECTIONS,
  SOCIAL_CHANNELS,
  ONLINE_AD_CHANNELS,
  OFFLINE_AD_CHANNELS,
  SERVICES_BRAND,
  SERVICES_SOCIAL,
  SERVICES_ADS,
  SERVICES_WEB,
  PAIN_POINTS,
  PROJECT_TYPES,
  BUDGET_RANGES,
  TIMELINES,
  VIDEO_STYLES,
  WEBSITE_TYPES,
  FREQUENCY_OPTIONS,
} from "@/lib/types"
import {
  Building2,
  User,
  MapPin,
  Palette,
  Globe,
  Video,
  Store,
  Camera,
  Megaphone,
  Sparkles,
  FileText,
  UserCog,
  AlertTriangle,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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

function YesNoSelect({
  value,
  onChange,
  withInArrivo = false,
}: {
  value: string | null | undefined
  onChange: (v: string) => void
  withInArrivo?: boolean
}) {
  const { t } = useLanguage()
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
        <SelectValue placeholder="—" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="si">{t("yn.si")}</SelectItem>
        <SelectItem value="no">{t("yn.no")}</SelectItem>
        <SelectItem value="non_so">{t("yn.non_so")}</SelectItem>
        {withInArrivo && <SelectItem value="in_arrivo">{t("yn.in_arrivo")}</SelectItem>}
      </SelectContent>
    </Select>
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
          <FieldLabel>{t("contact.website")}</FieldLabel>
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
/*  STEP 5 — Store profile                                            */
/* ================================================================== */

export function StoreProfileStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()
  const flow = watch("customer_flow") || []

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={Store}
        title={t("store.title")}
        subtitle={t("store.subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel optional>{t("store.employees")}</FieldLabel>
          <Input
            placeholder={t("store.employeesPlaceholder")}
            {...register("employees_count")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("store.location")}</FieldLabel>
          <Select
            value={watch("store_location") ?? ""}
            onValueChange={(v) =>
              setValue("store_location", v as ClientFormData["store_location"])
            }
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centro">{t("storeLocation.centro")}</SelectItem>
              <SelectItem value="periferia">{t("storeLocation.periferia")}</SelectItem>
              <SelectItem value="online_only">{t("storeLocation.online_only")}</SelectItem>
              <SelectItem value="mixed">{t("storeLocation.mixed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("store.surface")}</FieldLabel>
          <Input
            placeholder={t("store.surfacePlaceholder")}
            {...register("surface_sqm")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("store.revenue")}</FieldLabel>
          <Input
            placeholder={t("store.revenuePlaceholder")}
            {...register("annual_revenue")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>{t("store.flow")}</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CUSTOMER_FLOW_OPTIONS.map((opt) => (
            <OptionTile
              key={opt}
              active={flow.includes(opt)}
              onClick={() => setValue("customer_flow", toggleInArray(flow, opt))}
              size="sm"
            >
              {t(`customerFlow.${opt}`)}
            </OptionTile>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("store.flagship")}</FieldLabel>
        <Input
          placeholder={t("store.flagshipPlaceholder")}
          {...register("flagship_product")}
          className="bg-secondary border-border h-9 sm:h-10 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("store.competitors")}</FieldLabel>
        <Textarea
          rows={2}
          placeholder={t("store.competitorsPlaceholder")}
          {...register("local_competitors")}
          className="bg-secondary border-border resize-none text-sm"
        />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 6 — Identity & point of sale                                 */
/* ================================================================== */

export function IdentityStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()
  const materials = watch("promo_materials") || []
  const hasLogo = watch("has_logo")

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={Palette}
        title={t("identity.title")}
        subtitle={t("identity.subtitle")}
      />

      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-secondary border border-border">
        <Label className="text-xs sm:text-sm font-medium">
          {t("identity.hasLogo")}
        </Label>
        <Switch
          checked={hasLogo || false}
          onCheckedChange={(v) => setValue("has_logo", v)}
        />
      </div>

      {hasLogo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("identity.logoYear")}</FieldLabel>
            <Input
              placeholder="2018"
              {...register("logo_year")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel optional>{t("identity.brandColors")}</FieldLabel>
          <Input
            placeholder={t("identity.brandColorsPlaceholder")}
            {...register("brand_colors")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("identity.brandFonts")}</FieldLabel>
          <Input
            placeholder={t("identity.brandFontsPlaceholder")}
            {...register("brand_fonts")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("identity.guidelines")}</FieldLabel>
        <Input
          type="url"
          placeholder={t("identity.guidelinesPlaceholder")}
          {...register("brand_guidelines_url")}
          className="bg-secondary border-border h-9 sm:h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>{t("identity.materials")}</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PROMO_MATERIALS_OPTIONS.map((opt) => (
            <OptionTile
              key={opt}
              active={materials.includes(opt)}
              onClick={() => setValue("promo_materials", toggleInArray(materials, opt))}
              size="sm"
            >
              {t(`promo.${opt}`)}
            </OptionTile>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel>{t("identity.materialsCoordinated")}</FieldLabel>
          <YesNoSelect
            value={watch("materials_coordinated")}
            onChange={(v) =>
              setValue(
                "materials_coordinated",
                v as ClientFormData["materials_coordinated"],
              )
            }
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>{t("identity.signageCoordinated")}</FieldLabel>
          <YesNoSelect
            value={watch("signage_coordinated")}
            onChange={(v) =>
              setValue(
                "signage_coordinated",
                v as ClientFormData["signage_coordinated"],
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 7 — Digital presence (web + social + GMB)                    */
/* ================================================================== */

export function DigitalPresenceStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()
  const sections = watch("website_sections") || []
  const channels = watch("social_channels") || []

  return (
    <div className="space-y-5 sm:space-y-7">
      <StepHeader
        icon={Globe}
        title={t("digital.title")}
        subtitle={t("digital.subtitle")}
      />

      {/* --- Website --- */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("web.section")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel>{t("web.hasWebsite")}</FieldLabel>
            <YesNoSelect
              withInArrivo
              value={watch("has_website")}
              onChange={(v) =>
                setValue("has_website", v as ClientFormData["has_website"])
              }
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("web.year")}</FieldLabel>
            <Input
              placeholder="2020"
              {...register("website_year")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel>{t("web.updated")}</FieldLabel>
            <YesNoSelect
              value={watch("website_updated_regularly")}
              onChange={(v) =>
                setValue(
                  "website_updated_regularly",
                  v as ClientFormData["website_updated_regularly"],
                )
              }
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("web.seo")}</FieldLabel>
            <YesNoSelect
              value={watch("website_seo_optimised")}
              onChange={(v) =>
                setValue(
                  "website_seo_optimised",
                  v as ClientFormData["website_seo_optimised"],
                )
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("web.pages")}</FieldLabel>
            <Input
              placeholder={t("web.pagesPlaceholder")}
              {...register("website_page_count")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("web.vendor")}</FieldLabel>
            <Input
              {...register("website_vendor")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>{t("web.sections")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {WEBSITE_SECTIONS.map((sec) => (
              <OptionTile
                key={sec}
                active={sections.includes(sec)}
                onClick={() =>
                  setValue("website_sections", toggleInArray(sections, sec))
                }
                size="sm"
              >
                {t(`section.${sec}`)}
              </OptionTile>
            ))}
          </div>
        </div>
      </section>

      {/* --- Social media --- */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("social.section")}
        </h3>

        <div className="space-y-1.5">
          <FieldLabel>{t("social.active")}</FieldLabel>
          <YesNoSelect
            withInArrivo
            value={watch("social_active")}
            onChange={(v) =>
              setValue("social_active", v as ClientFormData["social_active"])
            }
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>{t("social.channels")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {SOCIAL_CHANNELS.map((ch) => (
              <OptionTile
                key={ch}
                active={channels.includes(ch)}
                onClick={() =>
                  setValue("social_channels", toggleInArray(channels, ch))
                }
                size="sm"
              >
                {t(`channel.${ch}`)}
              </OptionTile>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("social.frequency")}</FieldLabel>
            <Select
              value={watch("social_frequency") ?? ""}
              onValueChange={(v) =>
                setValue(
                  "social_frequency",
                  v as ClientFormData["social_frequency"],
                )
              }
            >
              <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {t(`freq.${f.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("social.tone")}</FieldLabel>
            <Select
              value={watch("social_tone") ?? ""}
              onValueChange={(v) =>
                setValue("social_tone", v as ClientFormData["social_tone"])
              }
            >
              <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professionale">{t("tone.professionale")}</SelectItem>
                <SelectItem value="amichevole">{t("tone.amichevole")}</SelectItem>
                <SelectItem value="tecnico">{t("tone.tecnico")}</SelectItem>
                <SelectItem value="indefinito">{t("tone.indefinito")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("social.managedBy")}</FieldLabel>
            <Input
              {...register("social_managed_by")}
              placeholder="Nome / team"
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("social.vendor")}</FieldLabel>
            <Input
              {...register("social_vendor")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </section>

      {/* --- Google Business --- */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("gmb.section")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel>{t("gmb.active")}</FieldLabel>
            <YesNoSelect
              withInArrivo
              value={watch("gmb_active")}
              onChange={(v) =>
                setValue("gmb_active", v as ClientFormData["gmb_active"])
              }
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("gmb.updated")}</FieldLabel>
            <YesNoSelect
              value={watch("gmb_up_to_date")}
              onChange={(v) =>
                setValue("gmb_up_to_date", v as ClientFormData["gmb_up_to_date"])
              }
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>{t("gmb.reviews")}</FieldLabel>
            <YesNoSelect
              value={watch("gmb_has_reviews")}
              onChange={(v) =>
                setValue("gmb_has_reviews", v as ClientFormData["gmb_has_reviews"])
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}

/* ================================================================== */
/*  STEP 8 — Marketing & sponsorizzazioni                             */
/* ================================================================== */

export function MarketingStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()
  const onlineAds = watch("online_ads_channels") || []
  const offlineAds = watch("offline_ads_channels") || []

  return (
    <div className="space-y-5 sm:space-y-7">
      <StepHeader
        icon={Megaphone}
        title={t("marketing.title")}
        subtitle={t("marketing.subtitle")}
      />

      {/* Newsletter */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel>{t("marketing.newsletterActive")}</FieldLabel>
            <YesNoSelect
              value={watch("newsletter_active")}
              onChange={(v) =>
                setValue(
                  "newsletter_active",
                  v as ClientFormData["newsletter_active"],
                )
              }
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("marketing.newsletterFrequency")}</FieldLabel>
            <Select
              value={watch("newsletter_frequency") ?? ""}
              onValueChange={(v) =>
                setValue(
                  "newsletter_frequency",
                  v as ClientFormData["newsletter_frequency"],
                )
              }
            >
              <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {t(`freq.${f.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel optional>{t("marketing.newsletterPlatform")}</FieldLabel>
            <Input
              placeholder={t("marketing.newsletterPlatformPlaceholder")}
              {...register("newsletter_platform")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("marketing.newsletterVendor")}</FieldLabel>
            <Input
              {...register("newsletter_vendor")}
              className="bg-secondary border-border h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <FieldLabel>{t("marketing.whatsappActive")}</FieldLabel>
            <YesNoSelect
              value={watch("whatsapp_active")}
              onChange={(v) =>
                setValue("whatsapp_active", v as ClientFormData["whatsapp_active"])
              }
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel optional>{t("marketing.whatsappFrequency")}</FieldLabel>
            <Select
              value={watch("whatsapp_frequency") ?? ""}
              onValueChange={(v) =>
                setValue(
                  "whatsapp_frequency",
                  v as ClientFormData["whatsapp_frequency"],
                )
              }
            >
              <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {t(`freq.${f.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Online ads */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <div className="space-y-1.5">
          <FieldLabel>{t("marketing.onlineAds")}</FieldLabel>
          <YesNoSelect
            withInArrivo
            value={watch("online_ads_active")}
            onChange={(v) =>
              setValue(
                "online_ads_active",
                v as ClientFormData["online_ads_active"],
              )
            }
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>{t("marketing.onlineAdsChannels")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {ONLINE_AD_CHANNELS.map((ch) => (
              <OptionTile
                key={ch}
                active={onlineAds.includes(ch)}
                onClick={() =>
                  setValue("online_ads_channels", toggleInArray(onlineAds, ch))
                }
                size="sm"
              >
                {t(`adChannel.${ch}`)}
              </OptionTile>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel optional>{t("marketing.onlineAdsVendor")}</FieldLabel>
          <Input
            {...register("online_ads_vendor")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </section>

      {/* Offline ads */}
      <section className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <div className="space-y-1.5">
          <FieldLabel>{t("marketing.offlineAds")}</FieldLabel>
          <YesNoSelect
            withInArrivo
            value={watch("offline_ads_active")}
            onChange={(v) =>
              setValue(
                "offline_ads_active",
                v as ClientFormData["offline_ads_active"],
              )
            }
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>{t("marketing.offlineAdsChannels")}</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {OFFLINE_AD_CHANNELS.map((ch) => (
              <OptionTile
                key={ch}
                active={offlineAds.includes(ch)}
                onClick={() =>
                  setValue("offline_ads_channels", toggleInArray(offlineAds, ch))
                }
                size="sm"
              >
                {t(`adChannel.${ch}`)}
              </OptionTile>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel optional>{t("marketing.offlineAdsVendor")}</FieldLabel>
          <Input
            {...register("offline_ads_vendor")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </section>
    </div>
  )
}

/* ================================================================== */
/*  STEP 9 — Requested services (richiesta)                           */
/* ================================================================== */

export function RequestedServicesStep({ form }: StepProps) {
  const { watch, setValue, register } = form
  const { t } = useLanguage()
  const projectTypes = watch("project_type") || []
  const brand = watch("services_brand") || []
  const social = watch("services_social") || []
  const ads = watch("services_ads") || []
  const web = watch("services_web") || []

  return (
    <div className="space-y-5 sm:space-y-7">
      <StepHeader
        icon={Sparkles}
        title={t("services.title")}
        subtitle={t("services.subtitle")}
      />

      {/* Macro categories quick-pick */}
      <div className="space-y-2">
        <FieldLabel>{t("services.macroCategories")}</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROJECT_TYPES.map((p) => (
            <OptionTile
              key={p.value}
              active={projectTypes.includes(p.value)}
              onClick={() =>
                setValue("project_type", toggleInArray(projectTypes, p.value))
              }
            >
              {t(`projectType.${p.value}`)}
            </OptionTile>
          ))}
        </div>
      </div>

      {/* 1. Brand */}
      <section className="space-y-3 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold text-foreground">
          {t("services.brand.title")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES_BRAND.map((k) => (
            <OptionTile
              key={k}
              active={brand.includes(k)}
              onClick={() => setValue("services_brand", toggleInArray(brand, k))}
              size="sm"
            >
              {t(`svcBrand.${k}`)}
            </OptionTile>
          ))}
        </div>
      </section>

      {/* 2. Social */}
      <section className="space-y-3 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold text-foreground">
          {t("services.social.title")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES_SOCIAL.map((k) => (
            <OptionTile
              key={k}
              active={social.includes(k)}
              onClick={() => setValue("services_social", toggleInArray(social, k))}
              size="sm"
            >
              {t(`svcSocial.${k}`)}
            </OptionTile>
          ))}
        </div>
      </section>

      {/* 3. Ads */}
      <section className="space-y-3 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold text-foreground">
          {t("services.ads.title")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES_ADS.map((k) => (
            <OptionTile
              key={k}
              active={ads.includes(k)}
              onClick={() => setValue("services_ads", toggleInArray(ads, k))}
              size="sm"
            >
              {t(`svcAds.${k}`)}
            </OptionTile>
          ))}
        </div>
      </section>

      {/* 4. Web */}
      <section className="space-y-3 p-3 sm:p-4 rounded-xl border border-border bg-secondary/40">
        <h3 className="text-sm font-semibold text-foreground">
          {t("services.web.title")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES_WEB.map((k) => (
            <OptionTile
              key={k}
              active={web.includes(k)}
              onClick={() => setValue("services_web", toggleInArray(web, k))}
              size="sm"
            >
              {t(`svcWeb.${k}`)}
            </OptionTile>
          ))}
        </div>
      </section>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("project.description")}</FieldLabel>
        <Textarea
          rows={3}
          placeholder={t("project.descriptionPlaceholder")}
          {...register("project_description")}
          className="bg-secondary border-border resize-none text-sm"
        />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 10 — Video & photo specifics (conditional)                   */
/* ================================================================== */

export function VideoPhotoStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={Video}
        title={t("videoPhoto.title")}
        subtitle={t("videoPhoto.subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel optional>{t("videoPhoto.style")}</FieldLabel>
          <Select
            value={watch("video_style") ?? ""}
            onValueChange={(v) => setValue("video_style", v)}
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder={t("videoPhoto.stylePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_STYLES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {t(`videoStyle.${s.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("videoPhoto.duration")}</FieldLabel>
          <Input
            placeholder={t("videoPhoto.durationPlaceholder")}
            {...register("video_duration")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("videoPhoto.location")}</FieldLabel>
        <Input
          placeholder={t("videoPhoto.locationPlaceholder")}
          {...register("location_preference")}
          className="bg-secondary border-border h-9 sm:h-10 text-sm"
        />
      </div>

      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-secondary border border-border">
        <div>
          <Label className="text-xs sm:text-sm font-medium">
            {t("videoPhoto.talent")}
          </Label>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {t("videoPhoto.talentDesc")}
          </p>
        </div>
        <Switch
          checked={watch("talent_needed") || false}
          onCheckedChange={(c) => setValue("talent_needed", c)}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("videoPhoto.equipment")}</FieldLabel>
        <Textarea
          rows={2}
          placeholder={t("videoPhoto.equipmentPlaceholder")}
          {...register("equipment_notes")}
          className="bg-secondary border-border resize-none text-sm"
        />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 11 — Website specifics (conditional)                         */
/* ================================================================== */

export function WebsiteStep({ form }: StepProps) {
  const { register, watch, setValue } = form
  const { t } = useLanguage()
  const features = watch("website_features") || []

  const WEBSITE_FEATURES = [
    "cms",
    "booking",
    "payments",
    "analytics",
    "seo",
    "multilingual",
    "api",
    "auth",
    "accessibility",
    "performance",
  ] as const

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={Globe}
        title={t("website.title")}
        subtitle={t("website.subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel optional>{t("website.type")}</FieldLabel>
          <Select
            value={watch("website_type") ?? ""}
            onValueChange={(v) => setValue("website_type", v)}
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder={t("website.typePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {WEBSITE_TYPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {t(`websiteType.${s.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>{t("website.domain")}</FieldLabel>
          <Input
            placeholder={t("website.domainPlaceholder")}
            {...register("domain_name")}
            className="bg-secondary border-border h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>{t("website.features")}</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {WEBSITE_FEATURES.map((f) => (
            <OptionTile
              key={f}
              active={features.includes(f)}
              onClick={() => setValue("website_features", toggleInArray(features, f))}
              size="sm"
            >
              {t(`websiteFeature.${f}`)}
            </OptionTile>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("website.hosting")}</FieldLabel>
        <Input
          placeholder={t("website.hostingPlaceholder")}
          {...register("hosting_preference")}
          className="bg-secondary border-border h-9 sm:h-10 text-sm"
        />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 12 — Brand / audience                                        */
/* ================================================================== */

export function BrandInfoStep({ form }: StepProps) {
  const { register } = form
  const { t } = useLanguage()

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={Camera}
        title={t("brand.title")}
        subtitle={t("brand.subtitle")}
      />

      <div className="space-y-1.5">
        <FieldLabel optional>{t("brand.audience")}</FieldLabel>
        <Textarea
          rows={3}
          placeholder={t("brand.audiencePlaceholder")}
          {...register("target_audience")}
          className="bg-secondary border-border resize-none text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>{t("brand.competitors")}</FieldLabel>
        <Textarea
          rows={3}
          placeholder={t("brand.competitorsPlaceholder")}
          {...register("competitors")}
          className="bg-secondary border-border resize-none text-sm"
        />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 13 — Pain points, budget, timeline, notes                    */
/* ================================================================== */

export function FinalStep({ form }: StepProps) {
  const { watch, setValue } = form
  const { t } = useLanguage()
  const pains = watch("pain_points") || []

  return (
    <div className="space-y-4 sm:space-y-6">
      <StepHeader
        icon={AlertTriangle}
        title={t("pain.title")}
        subtitle={t("pain.subtitle")}
      />

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <FieldLabel>{t("project.budget")}</FieldLabel>
          <Select
            value={watch("budget_range") ?? ""}
            onValueChange={(v) => setValue("budget_range", v)}
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder={t("project.budgetPlaceholder")} />
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
          <FieldLabel>{t("project.timeline")}</FieldLabel>
          <Select
            value={watch("timeline") ?? ""}
            onValueChange={(v) => setValue("timeline", v)}
          >
            <SelectTrigger className="bg-secondary border-border h-9 sm:h-10 text-sm">
              <SelectValue placeholder={t("project.timelinePlaceholder")} />
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

      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-border bg-foreground/[0.03]">
        <FileText className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-foreground" />
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("success.message").split(".")[0]}.
        </p>
      </div>
    </div>
  )
}
