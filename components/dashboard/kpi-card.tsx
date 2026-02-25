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
  default: { bg: "bg-card", accent: "bg-muted",        icon: "text-muted-foreground" },
  green:   { bg: "bg-card", accent: "bg-emerald-100",  icon: "text-emerald-600" },
  yellow:  { bg: "bg-card", accent: "bg-amber-100",    icon: "text-amber-600" },
  orange:  { bg: "bg-card", accent: "bg-orange-100",   icon: "text-orange-600" },
  red:     { bg: "bg-card", accent: "bg-red-100",      icon: "text-red-600" },
  blue:    { bg: "bg-card", accent: "bg-blue-100",     icon: "text-blue-600" },
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
      <div className="relative flex flex-col justify-between h-full">
        {/* Title — top left */}
        <p className="text-xs text-muted-foreground font-medium truncate">{title}</p>
        {/* Icon bottom-left + Value truly centered over full width */}
        <div className="relative flex items-center mt-1 h-8">
          <div className={cn("p-1.5 rounded-md flex-shrink-0 z-10", styles.accent)}>
            <div className={styles.icon}>{icon}</div>
          </div>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#666666]">
            {value}
          </span>
        </div>
        {trend && (
          <p className="text-[10px] text-muted-foreground mt-1">
            <span className={trend.value >= 0 ? "text-emerald-600" : "text-red-600"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>{" "}
            {trend.label}
          </p>
        )}
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="mt-2 text-xs text-primary hover:text-primary/80 font-medium border border-primary/30 rounded-full px-3 py-0.5 self-start"
          >
            View All
          </button>
        )}
      </div>
    </div>
  )
}