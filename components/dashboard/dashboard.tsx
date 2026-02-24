"use client"
import { useState } from "react"
import {
  LayoutDashboard,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterPanel, type FilterState } from "./filter-panel"
import { PreAwardPage } from "./pages/pre-award-page"
import { PostAwardPage } from "./pages/post-award-page"

type DashboardView = "pre-award" | "post-award"

export function Dashboard() {
  const [view, setView] = useState<DashboardView>("pre-award")
  const [filters, setFilters] = useState<FilterState>({
    fournisseur: "all",
    category: "all",
    sousCategory: "all",
    bu: "all",
    projects: "all",
    tiering: "all",
    region: "all",
    period: "Last 12 months",
    dateFrom: "2015-01-01",
    dateTo: "2035-12-31",
  })

  const today = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4">

        {/* Header */}
        <header className="sticky top-0 z-30 mb-4 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-1.5">
                  <p className="text-sm text-muted-foreground font-medium">
                    Suppliers evaluation - 360 dashboard
                  </p>
                  <span className="text-muted-foreground">/</span>
                  <p className="text-sm font-semibold text-foreground">
                    Executive view
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 md:justify-end">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Last refresh: {today}</span>
              </div>
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Tab switcher — centered in a bordered card row */}
          <div className="py-2">
            <div className="flex items-center justify-center bg-card border border-border rounded-xl shadow-sm px-1 w-full">
              <button
                type="button"
                onClick={() => setView("pre-award")}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors rounded-lg",
                  view === "pre-award"
                    ? "text-primary border-b-2 border-primary bg-background"
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Pre Award
              </button>
              <button
                type="button"
                onClick={() => setView("post-award")}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors rounded-lg",
                  view === "post-award"
                    ? "text-primary border-b-2 border-primary bg-background"
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Post Award
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="pb-4">
          {view === "pre-award" && <PreAwardPage filters={filters} />}
          {view === "post-award" && <PostAwardPage filters={filters} />}
        </div>
      </main>
    </div>
  )
}