"use client"

import { cn } from "@/lib/utils"

interface GaugeChartProps {
  value: number
  maxValue?: number
  title: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  suffix?: string
}

export function GaugeChart({ value, maxValue = 100, title, size = "md", showLabel = true, suffix = "" }: GaugeChartProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  
  const getColor = (pct: number) => {
    if (pct >= 80) return { stroke: "#10b981", bg: "#d1fae5" }
    if (pct >= 60) return { stroke: "#f59e0b", bg: "#fef3c7" }
    return { stroke: "#ef4444", bg: "#fee2e2" }
  }
  
  const colors = getColor(percentage)
  
  const sizes = {
    sm: { width: 80, strokeWidth: 8, fontSize: "text-lg" },
    md: { width: 120, strokeWidth: 10, fontSize: "text-2xl" },
    lg: { width: 160, strokeWidth: 12, fontSize: "text-3xl" },
  }
  
  const { width, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = radius * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height: width / 2 + 10 }}>
        <svg width={width} height={width / 2 + 10} className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2}`}
            fill="none"
            stroke={colors.bg}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-end justify-center pb-0">
            <span className={cn("font-bold", fontSize)} style={{ color: colors.stroke }}>
              {value}{suffix}
            </span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-muted-foreground text-center">{title}</p>
    </div>
  )
}
