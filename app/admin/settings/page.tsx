"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  loadServicePricing,
  saveServicePricing,
  loadServiceLineBilling,
  saveServiceLineBilling,
  type ServicePricing,
  type ServiceLineBilling,
  type ProductionLineKey,
} from "@/lib/service-pricing"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Save, RotateCcw } from "lucide-react"
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
  { key: "video_reels", labelKey: "pricing.billReels" },
  { key: "video_longform", labelKey: "pricing.billLong" },
  { key: "video_cinematic", labelKey: "pricing.billCine" },
  { key: "photography", labelKey: "pricing.billPhoto" },
  { key: "graphic_design", labelKey: "pricing.billGraphic" },
  { key: "ads_setup", labelKey: "pricing.billAdsSetup" },
]

export default function AdminSettingsPage() {
  const { t } = useLanguage()
  const [p, setP] = useState<ServicePricing>(DEFAULT_SERVICE_PRICING)
  const [lineBilling, setLineBilling] = useState<ServiceLineBilling>(DEFAULT_SERVICE_LINE_BILLING)

  useEffect(() => {
    setP(loadServicePricing())
    setLineBilling(loadServiceLineBilling())
  }, [])

  const update = (key: keyof ServicePricing, value: string) => {
    const n = parseFloat(value.replace(",", "."))
    setP((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }))
  }

  const handleSave = () => {
    saveServicePricing(p)
    saveServiceLineBilling(lineBilling)
    toast.success(t("pricing.saved"))
  }

  const handleReset = () => {
    setP({ ...DEFAULT_SERVICE_PRICING })
    setLineBilling({ ...DEFAULT_SERVICE_LINE_BILLING })
    saveServicePricing(DEFAULT_SERVICE_PRICING)
    saveServiceLineBilling(DEFAULT_SERVICE_LINE_BILLING)
    toast.success(t("pricing.reset"))
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
            <div className="grid gap-4 sm:grid-cols-2">
              {FIELDS.map(({ key, labelKey }) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key} className="text-xs font-medium">
                    {t(labelKey)}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min={0}
                    step={key === "vatPercent" ? 1 : 50}
                    value={p[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="bg-secondary border-border font-mono text-sm"
                  />
                </div>
              ))}
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
                  value={lineBilling[key]}
                  onValueChange={(v) =>
                    setLineBilling((prev) => ({ ...prev, [key]: v as "once" | "monthly" }))
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
          <Button type="button" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {t("pricing.save")}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t("pricing.resetDefaults")}
          </Button>
        </div>
      </main>
    </div>
  )
}
