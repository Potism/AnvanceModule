"use client"

import { Client } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, CheckCircle2, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface StatsCardsProps {
  clients: Client[]
}

export function StatsCards({ clients }: StatsCardsProps) {
  const { t } = useLanguage()
  const totalClients = clients.length
  const newClients = clients.filter(c => c.status === "new").length
  const inProgress = clients.filter(c => c.status === "in_progress").length
  const completed = clients.filter(c => c.status === "completed").length

  const stats = [
    {
      title: t("stats.totalBriefs"),
      value: totalClients,
      icon: Users,
    },
    {
      title: t("stats.newRequests"),
      value: newClients,
      icon: TrendingUp,
    },
    {
      title: t("stats.inProgress"),
      value: inProgress,
      icon: Clock,
    },
    {
      title: t("stats.completed"),
      value: completed,
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.title}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mt-0.5 sm:mt-1">{stat.value}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-secondary">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
