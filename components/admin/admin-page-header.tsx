"use client"

import { useLanguage } from "@/lib/language-context"

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
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Anvance Production · Client Briefs
      </div>
    </div>
  )
}
