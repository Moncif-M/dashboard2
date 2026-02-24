"use client"

import { cn } from "@/lib/utils"
import type { PerformanceLevel } from "@/lib/vendor-data"

interface StatusBadgeProps {
  status: PerformanceLevel | "flagged" | "clear"
  label?: string
  size?: "sm" | "md"
}

const statusStyles = {
  green: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  yellow: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  flagged: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  clear: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const styles = statusStyles[status]
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        styles.bg,
        styles.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span className={cn("rounded-full", styles.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

interface PerformanceCellProps {
  value: number | string
  level: PerformanceLevel
  suffix?: string
}

export function PerformanceCell({ value, level, suffix = "" }: PerformanceCellProps) {
  const styles = statusStyles[level]
  
  return (
    <div className={cn("px-3 py-1.5 rounded-lg text-center font-medium", styles.bg, styles.text)}>
      {value}{suffix}
    </div>
  )
}
