"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Ruler, Layers, Grid3X3, TrendingDown, SquareStack, Maximize2 } from "lucide-react"
import type { FloorStatistics } from "@/lib/types"

interface StatisticsPanelProps {
  stats: FloorStatistics
}

const statItems = [
  {
    key: "roomArea" as const,
    label: "Surface piece",
    unit: "m\u00b2",
    icon: Maximize2,
  },
  {
    key: "coveredArea" as const,
    label: "Surface couverte",
    unit: "m\u00b2",
    icon: Layers,
  },
  {
    key: "totalPlanks" as const,
    label: "Nombre de lames",
    unit: "",
    icon: SquareStack,
  },
  {
    key: "totalRows" as const,
    label: "Nombre de rangees",
    unit: "",
    icon: Grid3X3,
  },
  {
    key: "waste" as const,
    label: "Chutes",
    unit: "m\u00b2",
    icon: TrendingDown,
  },
  {
    key: "totalPlankLength" as const,
    label: "Longueur totale",
    unit: "mm",
    icon: Ruler,
  },
]

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon
        const value = stats[item.key]
        const isWaste = item.key === "waste"

        return (
          <Card key={item.key} className="border-border bg-card shadow-none">
            <CardContent className="p-3">
              <div className="flex items-start gap-2.5">
                <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-foreground tabular-nums">
                    {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
                    {item.unit && (
                      <span className="text-xs font-normal text-muted-foreground ml-0.5">
                        {item.unit}
                      </span>
                    )}
                  </p>
                  {isWaste && (
                    <p
                      className={`text-[11px] font-medium tabular-nums ${
                        stats.wastePercent > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {stats.wastePercent > 0 ? "+" : ""}
                      {stats.wastePercent.toLocaleString("fr-FR")}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
