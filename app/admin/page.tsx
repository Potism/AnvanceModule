import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ClientsTable } from "@/components/admin/clients-table"
import { StatsCards } from "@/components/admin/stats-cards"
import { Client } from "@/lib/types"
import { AdminPageHeader } from "@/components/admin/admin-page-header"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  let typedClients: Client[] = []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching clients:", error)
    }

    typedClients = (data || []) as Client[]
  } catch (e) {
    // Supabase env vars not configured — render an empty dashboard gracefully.
    console.warn(
      "[Anvance Production] Supabase not configured — showing empty dashboard.",
      e,
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AdminPageHeader />

        <div className="space-y-4 sm:space-y-6">
          <StatsCards clients={typedClients} />
          <ClientsTable initialClients={typedClients} />
        </div>
      </main>
    </div>
  )
}
