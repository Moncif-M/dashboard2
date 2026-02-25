"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    label: string
  }
  variant?: "default" | "green" | "yellow" | "orange" | "red" | "blue"
  showViewAll?: boolean
  onViewAll?: () => void
}

const variantStyles = {
  default: { bg: "bg-card", accent: "bg-muted", icon: "text-muted-foreground" },
  green:   { bg: "bg-card", accent: "bg-emerald-100", icon: "text-emerald-600" },
  yellow:  { bg: "bg-card", accent: "bg-amber-100", icon: "text-amber-600" },
  orange:  { bg: "bg-card", accent: "bg-orange-100", icon: "text-orange-600" },
  red:     { bg: "bg-card", accent: "bg-red-100", icon: "text-red-600" },
  blue:    { bg: "bg-card", accent: "bg-blue-100", icon: "text-blue-600" },
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  variant = "default",
  showViewAll = false,
  onViewAll,
}: KPICardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn("rounded-lg p-3 shadow-sm border border-border/50 relative overflow-hidden h-full", styles.bg)}>
      <div className={cn("absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6", styles.accent)} />
      <div className="relative">
        {/* Title + icon — left aligned */}
        <div className="flex items-center gap-1.5">
          <div className={cn("p-1.5 rounded-md", styles.accent)}>
            <div className={styles.icon}>{icon}</div>
          </div>
          <p className="text-xs text-muted-foreground font-medium truncate">{title}</p>
        </div>
        {/* Value — centred */}
        <p className="text-xl font-bold text-foreground mt-1.5 text-center">{value}</p>
        {trend && (
          <p className="text-[10px] text-muted-foreground mt-1 text-center">
            <span className={trend.value >= 0 ? "text-emerald-600" : "text-red-600"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>{" "}
            {trend.label}
          </p>
        )}
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="mt-2 text-xs text-primary hover:text-primary/80 font-medium border border-primary/30 rounded-full px-3 py-0.5"
          >
            View All
          </button>
        )}
      </div>
    </div>
  )
}