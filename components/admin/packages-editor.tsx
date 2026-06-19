"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PACKAGE_SERVICE_KEYS,
  PACKAGE_SERVICE_LABEL_KEYS,
  newPackageId,
  type ListinoPackage,
  type PackageServiceKey,
} from "@/lib/quote-packages"
import { useLanguage } from "@/lib/language-context"
import { Plus, Trash2 } from "lucide-react"

interface PackagesEditorProps {
  packages: ListinoPackage[]
  onChange: (packages: ListinoPackage[]) => void
}

export function PackagesEditor({ packages, onChange }: PackagesEditorProps) {
  const { t } = useLanguage()

  const addPackage = () => {
    onChange([
      ...packages,
      {
        id: newPackageId(),
        name: t("pkg.newName"),
        services: [],
        totalPrice: 0,
        billing: "once",
        active: true,
      },
    ])
  }

  const update = (id: string, patch: Partial<ListinoPackage>) => {
    onChange(packages.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const remove = (id: string) => {
    onChange(packages.filter((p) => p.id !== id))
  }

  const toggleService = (id: string, key: PackageServiceKey) => {
    const pkg = packages.find((p) => p.id === id)
    if (!pkg) return
    const next = pkg.services.includes(key)
      ? pkg.services.filter((s) => s !== key)
      : [...pkg.services, key]
    update(id, { services: next })
  }

  return (
    <div className="space-y-4">
      {packages.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("pkg.empty")}</p>
      )}

      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">{t("pkg.name")}</Label>
                <Input
                  value={pkg.name}
                  onChange={(e) => update(pkg.id, { name: e.target.value })}
                  className="bg-background border-border h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t("pkg.total")}</Label>
                <Input
                  type="number"
                  min={0}
                  step={50}
                  value={pkg.totalPrice}
                  onChange={(e) =>
                    update(pkg.id, { totalPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-background border-border h-9 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t("pkg.billing")}</Label>
                <Select
                  value={pkg.billing}
                  onValueChange={(v) =>
                    update(pkg.id, { billing: v as ListinoPackage["billing"] })
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => remove(pkg.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t("pkg.services")}</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PACKAGE_SERVICE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleService(pkg.id, key)}
                  className={`text-left text-xs px-2.5 py-2 rounded-md border transition-colors ${
                    pkg.services.includes(key)
                      ? "border-foreground bg-foreground/[0.06]"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  {t(PACKAGE_SERVICE_LABEL_KEYS[key])}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Switch
              checked={pkg.active}
              onCheckedChange={(checked) => update(pkg.id, { active: checked })}
            />
            <span className="text-xs text-muted-foreground">{t("pkg.active")}</span>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addPackage} className="gap-2">
        <Plus className="h-4 w-4" />
        {t("pkg.add")}
      </Button>
    </div>
  )
}
