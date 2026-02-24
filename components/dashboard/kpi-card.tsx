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
  default: {
    bg: "bg-card",
    accent: "bg-muted",
    icon: "text-muted-foreground",
  },
  green: {
    bg: "bg-card",
    accent: "bg-emerald-100",
    icon: "text-emerald-600",
  },
  yellow: {
    bg: "bg-card",
    accent: "bg-amber-100",
    icon: "text-amber-600",
  },
  orange: {
    bg: "bg-card",
    accent: "bg-orange-100",
    icon: "text-orange-600",
  },
  red: {
    bg: "bg-card",
    accent: "bg-red-100",
    icon: "text-red-600",
  },
  blue: {
    bg: "bg-card",
    accent: "bg-blue-100",
    icon: "text-blue-600",
  },
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
    <div className={cn("rounded-xl p-4 shadow-sm border border-border/50 relative overflow-hidden h-full", styles.bg)}>
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8", styles.accent)} />
      <div className="relative">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className={cn("p-2 rounded-lg", styles.accent)}>
            <div className={styles.icon}>{icon}</div>
          </div>
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className={trend.value >= 0 ? "text-emerald-600" : "text-red-600"}>
              {trend.value >= 0 ? "+" : ""}
              {trend.value}%
            </span>{" "}
            {trend.label}
          </p>
        )}
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="mt-3 text-sm text-primary hover:text-primary/80 font-medium border border-primary/30 rounded-full px-4 py-1"
          >
            View All
          </button>
        )}
      </div>
    </div>
  )
}