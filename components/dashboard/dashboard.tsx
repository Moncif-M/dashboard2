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
import { Button } from "@/components/ui/button"

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
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                  <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Suppliers evaluation - 360 dashboard
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    Executive view
                  </p>
                </div>
              </div>

              {/* View toggle */}
              <div className="inline-flex items-center rounded-full bg-muted p-1 ml-2">
                <button
                  type="button"
                  onClick={() => setView("pre-award")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    view === "pre-award"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Pre Award
                </button>
                <button
                  type="button"
                  onClick={() => setView("post-award")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    view === "post-award"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Post Award
                </button>
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