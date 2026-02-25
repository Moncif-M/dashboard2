"use client"

import React from "react"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  categories,
  subCategories,
  tierings,
  regions,
  vendorNames,
  businessUnits,
  projects,
} from "@/lib/vendor-data"
import { cn } from "@/lib/utils"

export interface FilterState {
  fournisseur: string
  category: string
  sousCategory: string
  bu: string
  projects: string
  tiering: string
  region: string
  period: string
  dateFrom: string
  dateTo: string
}

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

interface FilterSelectProps {
  label: string
  icon?: React.ReactNode
  options: string[]
  value: string
  onChange: (value: string) => void
}

function FilterSelect({ label, icon, options, value, onChange }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const DEFAULT_FILTERS: FilterState = {
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
}

const PERIODS = ["Last 12 months", "Last 6 months", "Last 3 months", "Year to date"]

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(filters)
  const [dateRangePct, setDateRangePct] = useState<[number, number]>([10, 90])

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setDraft(filters)
      setDateRangePct([10, 90])
    }
  }

  const clearFilters = () => {
    setDraft(DEFAULT_FILTERS)
  }

  const applyFilters = () => {
    onFilterChange(draft)
    setOpen(false)
  }

  const updateDraft = (key: keyof FilterState, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === "period" || key === "dateFrom" || key === "dateTo") return count
    if (typeof value === "string" && value !== "all" && value.trim() !== "") return count + 1
    return count
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "gap-2 border-primary text-primary hover:bg-primary/5",
            activeFilterCount > 0 && "bg-primary/5"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filters</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-4">
          <FilterSelect
            label="Fournisseur"
            options={vendorNames}
            value={draft.fournisseur}
            onChange={(value) => updateDraft("fournisseur", value)}
          />
          <FilterSelect
            label="Category"
            options={categories}
            value={draft.category}
            onChange={(value) => updateDraft("category", value)}
          />
          <FilterSelect
            label="Sous Category"
            options={subCategories}
            value={draft.sousCategory}
            onChange={(value) => updateDraft("sousCategory", value)}
          />
          <FilterSelect
            label="BU"
            options={businessUnits}
            value={draft.bu}
            onChange={(value) => updateDraft("bu", value)}
          />
          <FilterSelect
            label="Projects"
            options={projects}
            value={draft.projects}
            onChange={(value) => updateDraft("projects", value)}
          />
          <FilterSelect
            label="Tiering"
            options={tierings}
            value={draft.tiering}
            onChange={(value) => updateDraft("tiering", value)}
          />
          <FilterSelect
            label="Region"
            options={regions}
            value={draft.region}
            onChange={(value) => updateDraft("region", value)}
          />
          <FilterSelect
            label="Period"
            options={PERIODS}
            value={draft.period}
            onChange={(value) => updateDraft("period", value)}
          />
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-2 col-span-2">
              <div className="text-sm font-medium text-foreground">Date</div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <Input
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => updateDraft("dateFrom", e.target.value)}
                  className="bg-card"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={draft.dateTo}
                  onChange={(e) => updateDraft("dateTo", e.target.value)}
                  className="bg-card"
                />
              </div>
              <div className="px-2 pt-1">
                <Slider
                  value={dateRangePct}
                  onValueChange={(v) => setDateRangePct(v as [number, number])}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Clear Filter
            </button>
            <Button onClick={applyFilters} className="px-8 rounded-full">
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}