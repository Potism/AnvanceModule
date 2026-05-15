"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DEFAULT_SERVICE_PRICING,
  DEFAULT_SERVICE_LINE_BILLING,
  DEFAULT_SERVICE_PRICING_ACTIVE,
  type ServicePricing,
  type ServiceLineBilling,
  type ProductionLineKey,
  type ListinoTariffKey,
  type ServicePricingActive,
} from "@/lib/service-pricing"
import { useListino } from "@/lib/listino-context"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Save, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"

const FIELDS: { key: keyof ServicePricing; labelKey: string }[] = [
  { key: "website_custom", labelKey: "pricing.websiteCustom" },
  { key: "website_wordpress", labelKey: "pricing.websiteWp" },
  { key: "logo_identity", labelKey: "pricing.logo" },
  { key: "social_management_monthly", labelKey: "pricing.socialMonthly" },
  { key: "video_reels_package", labelKey: "pricing.videoReels" },
  { key: "video_reels_monthly", labelKey: "pricing.videoReelsMonthly" },
  { key: "video_longform_package", labelKey: "pricing.videoLong" },
  { key: "video_longform_monthly", labelKey: "pricing.videoLongMonthly" },
  { key: "video_cinematic_project", labelKey: "pricing.videoCine" },
  { key: "video_cinematic_monthly", labelKey: "pricing.videoCineMonthly" },
  { key: "photography_day", labelKey: "pricing.photoDay" },
  { key: "photography_monthly", labelKey: "pricing.photoMonthly" },
  { key: "graphic_design_project", labelKey: "pricing.graphic" },
  { key: "graphic_design_monthly", labelKey: "pricing.graphicMonthly" },
  { key: "ads_setup_onetime", labelKey: "pricing.adsSetup" },
  { key: "ads_setup_monthly", labelKey: "pricing.adsSetupMonthly" },
  { key: "ads_management_monthly", labelKey: "pricing.adsMonthly" },
  { key: "vatPercent", labelKey: "pricing.vat" },
]

const BILLING_ROWS: { key: ProductionLineKey; labelKey: string }[] = [
  { key: "social_management", labelKey: "pricing.billSocial" },
  { key: "video_reels", labelKey: "pricing.billReels" },
  { key: "video_longform", labelKey: "pricing.billLong" },
  { key: "video_cinematic", labelKey: "pricing.billCine" },
  { key: "photography", labelKey: "pricing.billPhoto" },
  { key: "graphic_design", labelKey: "pricing.billGraphic" },
  { key: "ads_setup", labelKey: "pricing.billAdsSetup" },
  { key: "ads_management", labelKey: "pricing.billAdsManagement" },
]

export default function AdminSettingsPage() {
  const { t } = useLanguage()
  const { pricing, lineBilling, pricingActive, loading, save } = useListino()
  const [p, setP] = useState<ServicePricing>(DEFAULT_SERVICE_PRICING)
  const [lineBillingLocal, setLineBillingLocal] = useState<ServiceLineBilling>(DEFAULT_SERVICE_LINE_BILLING)
  const [pricingActiveLocal, setPricingActiveLocal] = useState<ServicePricingActive>(
    DEFAULT_SERVICE_PRICING_ACTIVE,
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) {
      setP(pricing)
      setLineBillingLocal(lineBilling)
      setPricingActiveLocal(pricingActive)
    }
  }, [loading, pricing, lineBilling, pricingActive])

  const update = (key: keyof ServicePricing, value: string) => {
    const n = parseFloat(value.replace(",", "."))
    setP((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }))
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await save({
      pricing: p,
      lineBilling: lineBillingLocal,
      pricingActive: pricingActiveLocal,
    })
    setSaving(false)
    if (result.ok) {
      toast.success(t("pricing.saved"))
    } else {
      toast.error(result.error ?? t("pricing.saveError"))
    }
  }

  const handleReset = async () => {
    setP({ ...DEFAULT_SERVICE_PRICING })
    setLineBillingLocal({ ...DEFAULT_SERVICE_LINE_BILLING })
    setPricingActiveLocal({ ...DEFAULT_SERVICE_PRICING_ACTIVE })
    setSaving(true)
    const result = await save({
      pricing: { ...DEFAULT_SERVICE_PRICING },
      lineBilling: { ...DEFAULT_SERVICE_LINE_BILLING },
      pricingActive: { ...DEFAULT_SERVICE_PRICING_ACTIVE },
    })
    setSaving(false)
    if (result.ok) {
      toast.success(t("pricing.reset"))
    } else {
      toast.error(result.error ?? t("pricing.saveError"))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="sr-only">{t("pricing.loading")}</span>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
              {t("pricing.backAdmin")}
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {t("pricing.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("pricing.subtitle")}</p>
        </div>

        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("pricing.cardTitle")}</CardTitle>
            <CardDescription>{t("pricing.cardDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {FIELDS.map(({ key, labelKey }) =>
                key === "vatPercent" ? (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key} className="text-xs font-medium">
                      {t(labelKey)}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      min={0}
                      step={1}
                      value={p[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="bg-secondary border-border font-mono text-sm max-w-xs"
                    />
                  </div>
                ) : (
                  <div
                    key={key}
                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-end pb-4 border-b border-border/60 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <Label htmlFor={key} className="text-xs font-medium">
                        {t(labelKey)}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`active-${key}`}
                          checked={pricingActiveLocal[key as ListinoTariffKey]}
                          onCheckedChange={(checked) =>
                            setPricingActiveLocal((prev) => ({
                              ...prev,
                              [key as ListinoTariffKey]: checked,
                            }))
                          }
                        />
                        <span className="text-xs text-muted-foreground">{t("pricing.showInPdf")}</span>
                      </div>
                    </div>
                    <Input
                      id={key}
                      type="number"
                      min={0}
                      step={50}
                      value={p[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="bg-secondary border-border font-mono text-sm w-full sm:max-w-[140px]"
                    />
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("pricing.billingCardTitle")}</CardTitle>
            <CardDescription>{t("pricing.billingCardDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {BILLING_ROWS.map(({ key, labelKey }) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0"
              >
                <Label className="text-xs font-medium sm:min-w-[140px]">{t(labelKey)}</Label>
                <Select
                  value={lineBillingLocal[key]}
                  onValueChange={(v) =>
                    setLineBillingLocal((prev) => ({ ...prev, [key]: v as "once" | "monthly" }))
                  }
                >
                  <SelectTrigger className="w-full sm:w-[220px] bg-secondary border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">{t("pricing.billingOnce")}</SelectItem>
                    <SelectItem value="monthly">{t("pricing.billingMonthly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t("pricing.save")}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} disabled={saving} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t("pricing.resetDefaults")}
          </Button>
        </div>
      </main>
    </div>
  )
}
