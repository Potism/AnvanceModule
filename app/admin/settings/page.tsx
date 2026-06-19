"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_SERVICE_PRICING } from "@/lib/service-pricing"
import { useListino } from "@/lib/listino-context"
import { PackagesEditor } from "@/components/admin/packages-editor"
import type { ListinoPackage } from "@/lib/quote-packages"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Save, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const { t } = useLanguage()
  const { pricing, lineBilling, pricingActive, packages, loading, save, refresh } = useListino()
  const [vatPercent, setVatPercent] = useState(DEFAULT_SERVICE_PRICING.vatPercent)
  const [packagesLocal, setPackagesLocal] = useState<ListinoPackage[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) {
      setVatPercent(pricing.vatPercent)
      setPackagesLocal(packages)
    }
  }, [loading, pricing.vatPercent, packages])

  const handleSave = async () => {
    setSaving(true)
    const result = await save({
      pricing: { ...pricing, vatPercent },
      lineBilling,
      pricingActive,
      packages: packagesLocal,
    })
    setSaving(false)
    if (result.ok) {
      toast.success(t("pricing.saved"))
      void refresh()
    } else {
      toast.error(result.error ?? t("pricing.saveError"))
    }
  }

  const handleReset = async () => {
    setVatPercent(DEFAULT_SERVICE_PRICING.vatPercent)
    setPackagesLocal([])
    setSaving(true)
    const result = await save({
      pricing: { ...pricing, vatPercent: DEFAULT_SERVICE_PRICING.vatPercent },
      lineBilling,
      pricingActive,
      packages: [],
    })
    setSaving(false)
    if (result.ok) {
      toast.success(t("pricing.reset"))
      void refresh()
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
            <CardTitle className="text-lg">{t("pkg.cardTitle")}</CardTitle>
            <CardDescription>{t("pkg.cardDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <PackagesEditor packages={packagesLocal} onChange={setPackagesLocal} />
          </CardContent>
        </Card>

        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("pricing.vatCardTitle")}</CardTitle>
            <CardDescription>{t("pricing.vatCardDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="vatPercent" className="text-xs font-medium">
                {t("pricing.vat")}
              </Label>
              <Input
                id="vatPercent"
                type="number"
                min={0}
                step={1}
                value={vatPercent}
                onChange={(e) => {
                  const n = parseFloat(e.target.value.replace(",", "."))
                  setVatPercent(Number.isFinite(n) ? n : 0)
                }}
                className="bg-secondary border-border font-mono text-sm"
              />
            </div>
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
