"use client"

import { useState } from "react"
import { Client } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Eye,
  FileDown,
  FileText,
  Trash2,
  Mail,
  Phone,
  Building2,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"
import { generateClientPDF } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ClientDetailModal } from "./client-detail-modal"
import { useLanguage } from "@/lib/language-context"
import { useListino } from "@/lib/listino-context"

interface ClientsTableProps {
  initialClients: Client[]
}

export function ClientsTable({ initialClients }: ClientsTableProps) {
  const { pricing, lineBilling, pricingActive } = useListino()
  const { t, language } = useLanguage()
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const STATUS_OPTIONS = [
    { value: 'new', label: t("status.new") },
    { value: 'contacted', label: t("status.contacted") },
    { value: 'in_progress', label: t("status.in_progress") },
    { value: 'completed', label: t("status.completed") },
    { value: 'archived', label: t("status.archived") },
  ]

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const refreshClients = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setClients(data || [])
      toast.success(language === "it" ? "Clienti aggiornati" : "Clients refreshed")
    } catch (error) {
      console.error("Error refreshing clients:", error)
      toast.error(language === "it" ? "Errore nell'aggiornamento" : "Failed to refresh clients")
    } finally {
      setIsLoading(false)
    }
  }

  const updateClientStatus = async (clientId: string, newStatus: Client["status"]) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("clients")
        .update({ status: newStatus })
        .eq("id", clientId)

      if (error) throw error

      setClients(prev => 
        prev.map(c => c.id === clientId ? { ...c, status: newStatus } : c)
      )
      toast.success(language === "it" ? "Stato aggiornato" : "Status updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error(language === "it" ? "Errore nell'aggiornamento" : "Failed to update status")
    }
  }

  const deleteClient = async (clientId: string) => {
    if (!confirm(t("admin.deleteConfirm"))) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)

      if (error) throw error

      setClients(prev => prev.filter(c => c.id !== clientId))
      toast.success(language === "it" ? "Cliente eliminato" : "Client deleted")
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error(language === "it" ? "Errore nell'eliminazione" : "Failed to delete client")
    }
  }

  const getStatusBadge = (status: Client["status"]) => {
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status)
    return (
      <Badge 
        variant="outline" 
        className="bg-secondary border-border text-foreground text-[10px] sm:text-xs"
      >
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-foreground mr-1.5 sm:mr-2" />
        {statusConfig?.label}
      </Badge>
    )
  }

  /**
   * Build the list of services to display as badges, supporting both the
   * legacy `project_type` array and the new direct `wants_*` boolean fields.
   */
  const deriveServiceTypes = (client: Client): string[] => {
    if (client.project_type && client.project_type.length > 0) return client.project_type
    const out: string[] = []
    if (client.wants_website) out.push("website")
    if (client.wants_new_logo) out.push("branding")
    if (client.wants_social_management) out.push("social_management")
    if (client.wants_short_videos) out.push("reels")
    if (client.wants_long_videos) out.push("youtube")
    if (client.wants_cinematic_videos) out.push("cinematic_video")
    if (client.wants_photography) out.push("photography")
    if (client.wants_ads_management) out.push("ads")
    return out
  }

  const getProjectTypeBadges = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return null

    const getTypeLabel = (type: string) => {
      const labels: Record<string, { it: string; en: string }> = {
        cinematic_video: { it: "Video", en: "Video" },
        reels: { it: "Reels", en: "Reels" },
        youtube: { it: "YouTube", en: "YouTube" },
        photography: { it: "Foto", en: "Photo" },
        website: { it: "Web", en: "Web" },
        branding: { it: "Logo", en: "Logo" },
        social_management: { it: "Social", en: "Social" },
        ads: { it: "Ads", en: "Ads" },
      }
      return labels[type]?.[language] || type
    }

    return (
      <div className="flex flex-wrap gap-1">
        {types.slice(0, 2).map(type => (
          <Badge key={type} variant="secondary" className="text-[10px] sm:text-xs">
            {getTypeLabel(type)}
          </Badge>
        ))}
        {types.length > 2 && (
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            +{types.length - 2}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <CardTitle className="text-base sm:text-xl font-semibold">{t("admin.clientBriefs")}</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-9 bg-secondary border-border h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-36 bg-secondary border-border h-9 sm:h-10 text-sm">
                    <SelectValue placeholder={t("admin.allStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("admin.allStatus")}</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={refreshClients}
                  disabled={isLoading}
                  className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-border">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? t("admin.noMatch")
                  : t("admin.noClients")
                }
              </div>
            ) : (
              filteredClients.map((client) => (
                <div key={client.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{client.company_name}</p>
                        <p className="text-xs text-muted-foreground">{client.business_type || "—"}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t("admin.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => generateClientPDF(client, { mode: "brief" })}>
                          <FileDown className="h-4 w-4 mr-2" />
                          {t("admin.downloadBriefPdf")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            generateClientPDF(client, {
                              mode: "proposal",
                              pricing,
                              lineBilling,
                              pricingActive,
                            })
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {t("admin.downloadProposalPdf")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-muted-foreground" disabled>
                          {t("admin.changeStatus")}
                        </DropdownMenuItem>
                        {STATUS_OPTIONS.map((status) => (
                          <DropdownMenuItem
                            key={status.value}
                            onClick={() => updateClientStatus(client.id, status.value as Client["status"])}
                            className="pl-6"
                          >
                            <span className="w-2 h-2 rounded-full bg-foreground mr-2" />
                            {status.label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteClient(client.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("admin.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-foreground">{client.contact_name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(client.status)}
                      {getProjectTypeBadges(deriveServiceTypes(client))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(client.created_at), "d MMM yyyy", { locale: language === "it" ? it : enUS })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs">{t("table.company")}</TableHead>
                  <TableHead className="text-muted-foreground text-xs">{t("table.contact")}</TableHead>
                  <TableHead className="text-muted-foreground text-xs">{t("table.services")}</TableHead>
                  <TableHead className="text-muted-foreground text-xs">{t("table.status")}</TableHead>
                  <TableHead className="text-muted-foreground text-xs">{t("table.date")}</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                      {searchQuery || statusFilter !== "all" 
                        ? t("admin.noMatch")
                        : t("admin.noClients")
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Building2 className="h-4 w-4 lg:h-5 lg:w-5 text-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{client.company_name}</p>
                            <p className="text-xs text-muted-foreground">{client.business_type || "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-sm text-foreground">{client.contact_name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-28 lg:max-w-32">{client.email}</span>
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getProjectTypeBadges(deriveServiceTypes(client))}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.status)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(client.created_at), "d MMM yyyy", { locale: language === "it" ? it : enUS })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t("admin.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generateClientPDF(client, { mode: "brief" })}>
                              <FileDown className="h-4 w-4 mr-2" />
                              {t("admin.downloadBriefPdf")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                generateClientPDF(client, {
                                  mode: "proposal",
                                  pricing,
                                  lineBilling,
                                  pricingActive,
                                })
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {t("admin.downloadProposalPdf")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-muted-foreground" disabled>
                              {t("admin.changeStatus")}
                            </DropdownMenuItem>
                            {STATUS_OPTIONS.map((status) => (
                              <DropdownMenuItem
                                key={status.value}
                                onClick={() => updateClientStatus(client.id, status.value as Client["status"])}
                                className="pl-6"
                              >
                                <span className="w-2 h-2 rounded-full bg-foreground mr-2" />
                                {status.label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteClient(client.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("admin.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClientDetailModal
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
        onStatusChange={(status) => {
          if (selectedClient) {
            updateClientStatus(selectedClient.id, status)
            setSelectedClient({ ...selectedClient, status })
          }
        }}
        onClientUpdated={(updated) => {
          setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
          setSelectedClient(updated)
        }}
      />
    </>
  )
}
