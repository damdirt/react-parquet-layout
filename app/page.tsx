"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FloorConfigPanel } from "@/components/calepinage/floor-config"
import { ManualInput } from "@/components/calepinage/manual-input"
import { CsvImport } from "@/components/calepinage/csv-import"
import { FloorVisualization } from "@/components/calepinage/floor-visualization"
import { StatisticsPanel } from "@/components/calepinage/statistics-panel"
import { computeStatistics } from "@/lib/statistics"
import type { FloorConfig, FloorPlan, Row } from "@/lib/types"

const DEFAULT_CONFIG: FloorConfig = {
  roomWidth: 3000,
  roomLength: 5000,
  poseType: "coupe-perdue",
  offsetType: "1/2",
  customOffset: 300,
  defaultPlankWidth: 150,
  defaultPlankLength: 900,
}

export default function Home() {
  const [config, setConfig] = useState<FloorConfig>(DEFAULT_CONFIG)
  const [rows, setRows] = useState<Row[]>([])
  const [activeTab, setActiveTab] = useState("manuel")

  const plan: FloorPlan = useMemo(() => ({ config, rows }), [config, rows])
  const stats = useMemo(() => computeStatistics(plan), [plan])

  function handleCsvImport(importedRows: Row[]) {
    setRows(importedRows)
    setActiveTab("manuel")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Calepinage
              </h1>
              <p className="text-xs text-muted-foreground">
                Visualisation de pose de parquet
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel: config + input */}
          <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-5">
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Configuration
              </h2>
              <div className="rounded-xl border border-border bg-card p-4">
                <FloorConfigPanel config={config} onChange={setConfig} />
              </div>
            </section>

            <Separator />

            <section>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="manuel" className="flex-1">
                    Saisie manuelle
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="flex-1">
                    Import CSV
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manuel" className="mt-3">
                  <ManualInput rows={rows} config={config} onChange={setRows} />
                </TabsContent>

                <TabsContent value="csv" className="mt-3">
                  <CsvImport
                    defaultPlankWidth={config.defaultPlankWidth}
                    onImport={handleCsvImport}
                  />
                </TabsContent>
              </Tabs>
            </section>
          </aside>

          {/* Right panel: visualization + stats */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Visualisation
              </h2>
              <div className="rounded-xl border border-border bg-card p-4">
                <FloorVisualization plan={plan} />
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Statistiques
              </h2>
              <StatisticsPanel stats={stats} />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
