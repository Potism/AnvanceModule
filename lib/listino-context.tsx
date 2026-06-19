"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import {
  defaultListinoBundle,
  fetchListino,
  migrateListinoFromLocalStorage,
  saveListino,
  type ListinoBundle,
} from "@/lib/listino-settings"
import type { ServiceLineBilling, ServicePricing, ServicePricingActive } from "@/lib/service-pricing"
import type { ListinoPackage } from "@/lib/quote-packages"

interface ListinoContextValue {
  pricing: ServicePricing
  lineBilling: ServiceLineBilling
  pricingActive: ServicePricingActive
  packages: ListinoPackage[]
  loading: boolean
  refresh: () => Promise<void>
  save: (bundle: ListinoBundle) => Promise<{ ok: boolean; error?: string }>
}

const ListinoContext = createContext<ListinoContextValue | undefined>(undefined)

export function ListinoProvider({ children }: { children: ReactNode }) {
  const defaults = defaultListinoBundle()
  const [bundle, setBundle] = useState<ListinoBundle>(defaults)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const data = await migrateListinoFromLocalStorage(supabase)
      setBundle(data)
    } catch (e) {
      console.warn("[listino] refresh failed:", e)
      setBundle(defaultListinoBundle())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const save = useCallback(async (next: ListinoBundle) => {
    const supabase = createClient()
    const result = await saveListino(supabase, next)
    if (result.ok) setBundle(next)
    return result
  }, [])

  const value = useMemo<ListinoContextValue>(
    () => ({
      pricing: bundle.pricing,
      lineBilling: bundle.lineBilling,
      pricingActive: bundle.pricingActive,
      packages: bundle.packages,
      loading,
      refresh,
      save,
    }),
    [bundle, loading, refresh, save],
  )

  return <ListinoContext.Provider value={value}>{children}</ListinoContext.Provider>
}

export function useListino() {
  const ctx = useContext(ListinoContext)
  if (!ctx) {
    throw new Error("useListino must be used within a ListinoProvider")
  }
  return ctx
}
