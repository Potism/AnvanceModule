"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function AdminPageHeader() {
  const { t } = useLanguage()
  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-1 sm:mb-2">
          {t("admin.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("admin.subtitle")}
        </p>
      </div>
      <div className="flex flex-col sm:items-end gap-2">
        <Button variant="outline" size="sm" asChild className="gap-2 w-fit">
          <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
            {t("admin.settingsLink")}
          </Link>
        </Button>
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Anvance Production · Inviati
        </div>
      </div>
    </div>
  )
}
