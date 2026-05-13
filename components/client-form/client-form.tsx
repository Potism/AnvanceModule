"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ClientFormData } from "@/lib/types"
import {
  AgentInfoStep,
  CompanyInfoStep,
  ContactInfoStep,
  AddressStep,
  StoreProfileStep,
  IdentityStep,
  DigitalPresenceStep,
  MarketingStep,
  RequestedServicesStep,
  VideoPhotoStep,
  WebsiteStep,
  BrandInfoStep,
  FinalStep,
} from "./form-steps"
import {
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  Loader2,
  FileDown,
  SkipForward,
  ChevronsRight,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/language-context"
import { generateClientPDF } from "@/lib/pdf-generator"

const VIDEO_TYPES = ["cinematic_video", "reels", "youtube", "photography"]

export function ClientForm() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<ClientFormData | null>(null)
  const stepBarRef = useRef<HTMLDivElement | null>(null)

  const form = useForm<ClientFormData>({
    defaultValues: {
      agent_name: "",
      brief_date: new Date().toISOString().split("T")[0],
      is_existing_client: false,
      client_since: null,

      company_name: "",
      business_type: "",
      vat_number: "",
      tax_code: "",
      contact_name: "",
      contact_role: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      postal_code: "",
      province: "",
      country: "Italia",

      employees_count: "",
      store_location: null,
      surface_sqm: "",
      annual_revenue: "",
      customer_flow: [],
      flagship_product: "",
      local_competitors: "",

      has_logo: null,
      logo_year: "",
      brand_colors: "",
      brand_fonts: "",
      brand_guidelines_url: "",
      promo_materials: [],
      materials_coordinated: null,
      signage_coordinated: null,

      has_website: null,
      website_year: "",
      website_updated_regularly: null,
      website_seo_optimised: null,
      website_page_count: "",
      website_sections: [],
      website_vendor: "",

      social_active: null,
      social_channels: [],
      social_frequency: null,
      social_managed_by: "",
      social_vendor: "",
      social_tone: null,

      gmb_active: null,
      gmb_up_to_date: null,
      gmb_has_reviews: null,

      newsletter_active: null,
      newsletter_frequency: null,
      newsletter_vendor: "",
      newsletter_platform: "",
      whatsapp_active: null,
      whatsapp_frequency: null,

      online_ads_active: null,
      online_ads_channels: [],
      online_ads_vendor: "",
      offline_ads_active: null,
      offline_ads_channels: [],
      offline_ads_vendor: "",

      project_type: [],
      services_brand: [],
      services_social: [],
      services_ads: [],
      services_web: [],
      pain_points: [],
      project_description: "",
      budget_range: "",
      timeline: "",

      video_style: "",
      video_duration: "",
      location_preference: "",
      talent_needed: false,
      equipment_notes: "",

      website_type: "",
      website_features: [],
      hosting_preference: "",
      domain_name: "",

      target_audience: "",
      competitors: "",
    },
  })

  const projectTypes = form.watch("project_type") || []
  const hasVideoNeeds = projectTypes.some((p) => VIDEO_TYPES.includes(p))
  const hasWebsiteNeeds = projectTypes.includes("website")

  const STEPS = [
    { id: "agent", title: t("step.agent"), component: AgentInfoStep, optional: true },
    { id: "company", title: t("step.company"), component: CompanyInfoStep, optional: false },
    { id: "contact", title: t("step.contact"), component: ContactInfoStep, optional: false },
    { id: "address", title: t("step.address"), component: AddressStep, optional: true },
    { id: "store", title: t("step.store"), component: StoreProfileStep, optional: true },
    { id: "identity", title: t("step.identity"), component: IdentityStep, optional: true },
    { id: "digital", title: t("step.digital"), component: DigitalPresenceStep, optional: true },
    { id: "marketing", title: t("step.marketing"), component: MarketingStep, optional: true },
    { id: "services", title: t("step.services"), component: RequestedServicesStep, optional: true },
    {
      id: "video",
      title: t("step.video"),
      component: VideoPhotoStep,
      visible: hasVideoNeeds,
      optional: true,
    },
    {
      id: "website",
      title: t("step.website"),
      component: WebsiteStep,
      visible: hasWebsiteNeeds,
      optional: true,
    },
    { id: "brand", title: t("step.brand"), component: BrandInfoStep, optional: true },
    { id: "summary", title: t("step.summary"), component: FinalStep, optional: false },
  ]

  const activeSteps = STEPS.filter((s) => s.visible !== false)
  const safeStepIndex = Math.min(currentStep, activeSteps.length - 1)
  const progress = ((safeStepIndex + 1) / activeSteps.length) * 100
  const currentStepDef = activeSteps[safeStepIndex]
  const CurrentStepComponent = currentStepDef?.component
  const isSummary = safeStepIndex === activeSteps.length - 1

  useEffect(() => {
    const container = stepBarRef.current
    if (!container) return
    const active = container.querySelector<HTMLButtonElement>(
      `button[data-step-index="${safeStepIndex}"]`,
    )
    if (active) {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [safeStepIndex])

  const validateCurrentStep = async () => {
    const stepId = activeSteps[safeStepIndex].id
    if (stepId === "company") return form.trigger(["company_name"])
    if (stepId === "contact") return form.trigger(["contact_name", "email"])
    return true
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && safeStepIndex < activeSteps.length - 1) {
      setCurrentStep(safeStepIndex + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    if (safeStepIndex > 0) {
      setCurrentStep(safeStepIndex - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSkipSection = () => {
    if (safeStepIndex < activeSteps.length - 1) {
      setCurrentStep(safeStepIndex + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSkipToSummary = () => {
    const summaryIndex = activeSteps.findIndex((s) => s.id === "summary")
    if (summaryIndex >= 0) {
      setCurrentStep(summaryIndex)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  /**
   * Normalise the form payload before sending to Supabase.
   * - Empty strings become `null` so they don't violate CHECK constraints
   *   for enum-like columns (`store_location`, `has_website`, etc.).
   * - Empty arrays stay as `[]` (Postgres `text[] default '{}'`).
   */
  const normalizePayload = (data: ClientFormData): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        out[key] = value.trim() === "" ? null : value.trim()
      } else {
        out[key] = value
      }
    }
    return out
  }

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const payload = normalizePayload(data)
      const { error } = await supabase.from("clients").insert([payload])
      if (error) throw error

      setSubmittedData(data)
      setIsSubmitted(true)
      toast.success(t("success.toast"))
    } catch (error) {
      const err = error as { code?: string; message?: string }
      console.error("Error submitting form:", err)
      if (err?.code === "PGRST204" || /column .* of '?clients'? in the schema cache/i.test(err?.message || "")) {
        toast.error(
          "Schema Supabase non aggiornato. Esegui supabase/migrations/20260513_patch_clients.sql nel SQL editor di Supabase.",
          { duration: 8000 },
        )
      } else {
        toast.error(t("error.toast"))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="bg-card border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.7)]">
        <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center px-4 sm:px-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-success/20 mb-4 sm:mb-6">
            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            {t("success.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6 sm:mb-8">
            {t("success.message")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            {submittedData && (
              <Button
                onClick={() =>
                  generateClientPDF({
                    id: "draft",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    status: "new",
                    notes: null,
                    assigned_to: null,
                    ...submittedData,
                  })
                }
                className="gap-2 text-sm"
              >
                <FileDown className="h-4 w-4" />
                {t("success.downloadPdf")}
              </Button>
            )}
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setSubmittedData(null)
                setCurrentStep(0)
                form.reset()
              }}
              variant="outline"
              className="text-sm"
            >
              {t("success.submitAnother")}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm">
      {/* Progress Header */}
      <div className="bg-secondary px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {t("form.step")} {safeStepIndex + 1} {t("form.of")} {activeSteps.length}
            <span className="hidden sm:inline">
              {" "}
              · <span className="text-foreground">{activeSteps[safeStepIndex]?.title}</span>
            </span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {Math.round(progress)}% {t("form.complete")}
          </span>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2" />

        {/* Step indicators */}
        <div
          ref={stepBarRef}
          className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1 sm:pb-2 -mx-1 px-1"
          style={{
            maskImage:
              "linear-gradient(to right, black 0, black calc(100% - 32px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, black 0, black calc(100% - 32px), transparent 100%)",
          }}
        >
          {activeSteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              data-step-index={index}
              onClick={() => index <= safeStepIndex && setCurrentStep(index)}
              disabled={index > safeStepIndex}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                index === safeStepIndex
                  ? "bg-foreground text-background"
                  : index < safeStepIndex
                  ? "bg-muted text-foreground cursor-pointer hover:bg-muted/80"
                  : "bg-muted/40 text-muted-foreground"
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="min-h-[360px] sm:min-h-[420px] lg:min-h-[460px]">
            {CurrentStepComponent && <CurrentStepComponent form={form} />}
          </div>

          {/* Optional-section hint + jump-to-summary */}
          {currentStepDef?.optional && !isSummary && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {t("form.sectionOptional")}
              </span>
              <button
                type="button"
                onClick={handleSkipToSummary}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {t("form.skipToSummary")}
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={safeStepIndex === 0}
              className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{t("form.previous")}</span>
            </Button>

            <div className="flex items-center gap-2 sm:gap-3">
              {currentStepDef?.optional && !isSummary && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkipSection}
                  className="gap-1.5 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 text-muted-foreground hover:text-foreground"
                >
                  <span className="hidden sm:inline">{t("form.skipSection")}</span>
                  <span className="sm:hidden">Salta</span>
                  <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}

              {isSummary ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      <span>{t("form.submitting")}</span>
                    </>
                  ) : (
                    <>
                      {t("form.submit")}
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
                >
                  <span>{t("form.next")}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
