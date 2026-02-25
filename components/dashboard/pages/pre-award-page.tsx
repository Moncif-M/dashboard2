"use client"

import {
  Layers,
  ShieldAlert,
  Trophy,
  Coins,
  FileText,
  Gavel,
  BadgeCheck,
  PieChart,
  Users,
} from "lucide-react"
import { KPICard } from "../kpi-card"
import type { FilterState } from "../filter-panel"
import { vendors } from "@/lib/vendor-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts"
import { GaugeChart } from "../gauge-chart"

interface PreAwardPageProps {
  filters: FilterState
}

function riskLabelFromValue(v: number) {
  if (v <= 30) return "Low"
  if (v <= 50) return "Medium"
  return "High"
}

function scoreColor(score: number) {
  if (score > 100) return "#3b82f6"
  if (score >= 80) return "#10b981"
  if (score >= 60) return "#f59e0b"
  return "#ef4444"
}

function stableDisplayValue(values: Array<string | number>) {
  const first = values[0]
  if (values.every((v) => v === first)) return String(first)
  return "All"
}

function formatMillions(value: number) {
  return `${value.toFixed(1)}M`
}

export function PreAwardPage({ filters }: PreAwardPageProps) {
  const filtered = vendors.filter((v) => {
    if (filters.fournisseur !== "all" && v.name !== filters.fournisseur) return false
    if (filters.category !== "all" && v.category !== filters.category) return false
    if (filters.sousCategory !== "all" && v.subCategory !== filters.sousCategory) return false
    if (filters.bu !== "all" && v.bu !== filters.bu) return false
    if (filters.projects !== "all" && v.project !== filters.projects) return false
    if (filters.tiering !== "all" && v.tiering !== filters.tiering) return false
    if (filters.region !== "all" && v.region !== filters.region) return false
    return true
  })

  const safe = filtered.length ? filtered : vendors
  const count = safe.length

  const sum = safe.reduce(
    (acc, v) => {
      acc.ecosystem += v.preAward.ecosystemScore
      acc.hse += v.preAward.hseScore
      acc.sustainability += v.preAward.sustainabilityScore
      acc.compliance += v.preAward.complianceRate
      acc.risk += v.preAward.globalRiskLevel
      acc.successfulAwards += v.preAward.successfulAwards
      acc.ongoingPO += v.preAward.packagesOngoing
      acc.ongoingBids += v.preAward.projectsOngoing
      acc.jesaScope += v.preAward.jesaScope
      acc.dependance += v.preAward.dependanceJesa
      acc.awardingVolume += v.preAward.chiffreAffaire[v.preAward.chiffreAffaire.length - 1] ?? 0
      return acc
    },
    {
      ecosystem: 0,
      hse: 0,
      sustainability: 0,
      compliance: 0,
      risk: 0,
      successfulAwards: 0,
      ongoingPO: 0,
      ongoingBids: 0,
      jesaScope: 0,
      dependance: 0,
      awardingVolume: 0,
    }
  )

  const avgScores = {
    ecosystem: Math.round(sum.ecosystem / count),
    hse: Math.round(sum.hse / count),
    sustainability: Math.round(sum.sustainability / count),
    compliance: Math.round(sum.compliance / count),
  }

  const scorePreAward = Math.round(
    (avgScores.ecosystem + avgScores.hse + avgScores.sustainability + avgScores.compliance) / 4
  )

  const overallStatus = scorePreAward >= 80 ? "Good" : scorePreAward >= 60 ? "Medium" : "Poor"
  const overallTone =
    overallStatus === "Good"
      ? "bg-emerald-100 text-emerald-700"
      : overallStatus === "Medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"
  const overallTextColor =
    overallStatus === "Good"
      ? "text-emerald-700"
      : overallStatus === "Medium"
        ? "text-amber-700"
        : "text-red-700"

  const years = ["2022", "2023", "2024", "2025", "2026"]
  const caDependanceData = years.map((year, idx) => {
    const caAvg = safe.reduce((s, v) => s + (v.preAward.chiffreAffaire[idx] ?? 0), 0) / count
    const depAvg = safe.reduce((s, v) => s + v.preAward.dependanceJesa, 0) / count
    return { year, ca: Number(caAvg.toFixed(1)), dependance: Math.round(depAvg) }
  })

  const scoreBars = [
    { name: "Ecosystem", value: avgScores.ecosystem },
    { name: "HSE", value: avgScores.hse },
    { name: "Sustainability", value: avgScores.sustainability },
    { name: "Compliance", value: avgScores.compliance },
  ]

  const vendorLabel = filters.fournisseur !== "all" ? filters.fournisseur : "All vendors"
  const totalVendors = vendors.length

  const tierCounts = safe.reduce(
    (acc, v) => {
      if (v.tiering === "Tier 1") acc.tier1 += 1
      else if (v.tiering === "Tier 2") acc.tier2 += 1
      else if (v.tiering === "Tier 3") acc.tier3 += 1
      else acc.na += 1
      return acc
    },
    { tier1: 0, tier2: 0, tier3: 0, na: 0 }
  )

  const tierTotal = tierCounts.tier1 + tierCounts.tier2 + tierCounts.tier3 + tierCounts.na || 1
  const tierPct = {
    tier1: Math.round((tierCounts.tier1 / tierTotal) * 100),
    tier2: Math.round((tierCounts.tier2 / tierTotal) * 100),
    tier3: Math.round((tierCounts.tier3 / tierTotal) * 100),
    na: Math.round((tierCounts.na / tierTotal) * 100),
  }

  const selectedTier =
    safe.length === 1 ? safe[0].tiering : stableDisplayValue(safe.map((v) => v.tiering))

  const statusLabel =
    scorePreAward >= 90 ? "Very good" : scorePreAward >= 80 ? "Good" : scorePreAward >= 60 ? "Medium" : "Low"

  return (
    <div className="space-y-1.5">

      {/* ── 3-COL × 3-ROW KPI GRID ── */}
      <div className="grid grid-cols-3 gap-1.5" style={{ gridTemplateRows: "auto auto auto" }}>

        {/* Row 1 Col 1 — Vendors in view */}
        <KPICard
          title="Vendors in view"
          value={`${safe.length} / ${totalVendors}`}
          icon={<Users className="w-4 h-4" />}
          variant="blue"
        />

        {/* Row 1+2 Col 2 — Tiering spans rows 1 & 2 */}
        <div className="row-span-2">
          <div className="rounded-lg p-2 shadow-sm border border-border/50 bg-card relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 bg-muted" />
            <div className="relative flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Layers className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Tiering</p>
                    <p className="text-[10px] text-muted-foreground">Distribution of vendors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Selected Tier</p>
                  <p className="text-xs font-semibold text-foreground">{selectedTier}</p>
                </div>
              </div>
              {/* Tier rows — flex-1 + justify-between to fill vertical space */}
              <div className="flex flex-col flex-1 justify-between">
                {[
                  { label: "Tier 1", value: tierPct.tier1 },
                  { label: "Tier 2", value: tierPct.tier2 },
                  { label: "Tier 3", value: tierPct.tier3 },
                  { label: "N/A",    value: tierPct.na },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-bold text-[#666666]">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 1 Col 3 — Successful Awards */}
        <KPICard
          title="Successful Awards"
          value={sum.successfulAwards}
          icon={<Trophy className="w-4 h-4" />}
          variant="green"
        />

        {/* Row 2 Col 1 — Vendor Global Risk */}
        <KPICard
          title="Vendor Global Risk"
          value={riskLabelFromValue(Math.round(sum.risk / count))}
          icon={<ShieldAlert className="w-4 h-4" />}
          variant="yellow"
        />

        {/* Row 2 Col 3 — Ongoing Bids */}
        <KPICard
          title="Ongoing Bids"
          value={sum.ongoingBids}
          icon={<Gavel className="w-4 h-4" />}
          variant="default"
        />

        {/* Row 3 Col 1 — Awarding Volume */}
        <KPICard
          title="Awarding Volume"
          value={formatMillions(sum.awardingVolume)}
          icon={<Coins className="w-4 h-4" />}
          variant="orange"
        />

        {/* Row 3 Col 2 — Ongoing PO / Contracts */}
        <KPICard
          title="Ongoing PO / Contracts"
          value={sum.ongoingPO}
          icon={<FileText className="w-4 h-4" />}
          variant="default"
        />

        {/* Row 3 Col 3 — % of JESA Scope */}
        <KPICard
          title="% of JESA Scope"
          value={`${Math.round(sum.jesaScope / count)}%`}
          icon={<PieChart className="w-4 h-4" />}
          variant="blue"
        />
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1.5">

        {/* CA & JESA Dependence chart */}
        <div className="lg:col-span-2 bg-card rounded-lg p-2 shadow-sm border border-border/50 h-[200px] flex flex-col">
          <h3 className="text-xs font-semibold text-foreground mb-1 flex-shrink-0">
            Chiffre d&apos;Affaire &amp; JESA Dependence
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caDependanceData} margin={{ left: 0, right: 24, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 9 }} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#6366f1" width={24} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#10b981" width={24} domain={[0, 100]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "9px", paddingTop: "4px" }} iconSize={8} />
                <Line yAxisId="left" type="monotone" dataKey="ca" stroke="#4f46e5" strokeWidth={1.5} dot={{ fill: "#4f46e5", r: 2 }} name="Chiffre d'Affaire (M MAD)" />
                <Line yAxisId="right" type="monotone" dataKey="dependance" stroke="#10b981" strokeWidth={1.5} dot={{ fill: "#10b981", r: 2 }} name="Dependence to JESA (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gauge — Score Pre Award */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 flex flex-col items-center justify-between h-[200px]">
          <div className="pt-1">
            <GaugeChart value={scorePreAward} title="Score Pre Award" size="sm" suffix="%" />
          </div>
          <div className="pb-2 text-center space-y-0.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Overall Status</p>
            <p className={`text-[10px] font-semibold ${overallTextColor}`}>{vendorLabel}</p>
            <span className={`inline-flex px-3 py-1 rounded-full font-semibold text-xs ${overallTone}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Pre Award Scores bar chart */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 h-[200px] flex flex-col">
          <h3 className="text-xs font-semibold text-foreground mb-1 flex-shrink-0">Pre Award Scores</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBars} layout="vertical" margin={{ left: 4, right: 4, top: 4, bottom: 4 }}>
                <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 9 }} stroke="#9ca3af" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} stroke="#9ca3af" width={60} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10} isAnimationActive={false}>
                  {scoreBars.map((entry) => (
                    <Cell key={entry.name} fill={scoreColor(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}