"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface AdminFetchAlertProps {
  fetchError: string | null
  configError: boolean
}

export function AdminFetchAlert({ fetchError, configError }: AdminFetchAlertProps) {
  const { t } = useLanguage()

  if (!fetchError && !configError) return null

  return (
    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{configError ? "Configuration" : "Database"}</AlertTitle>
      <AlertDescription>
        {configError ? t("admin.configError") : t("admin.fetchError")}
        {fetchError && !configError && (
          <span className="block mt-1 font-mono text-xs opacity-80">{fetchError}</span>
        )}
      </AlertDescription>
    </Alert>
  )
}
