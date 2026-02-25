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

  const riskValue = Math.round(sum.risk / count)
  const riskLabel = riskLabelFromValue(riskValue)

  return (
    <div className="space-y-1.5">

      {/* ── ROW 1: 4 KPI cards — same natural height as PostAward KPI row ── */}
      <div className="grid grid-cols-4 gap-1.5">

        {/* Col 1 — Vendors in View */}
        <KPICard
          title="Vendors in view"
          value={`${safe.length} / ${totalVendors}`}
          icon={<Users className="w-4 h-4" />}
          variant="blue"
        />

        {/* Col 2 — Overall Status */}
        <div className="bg-card rounded-lg p-3 shadow-sm border border-border/50 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 bg-muted" />
          <div className="relative flex flex-col justify-between h-full">
            <p className="text-xs text-muted-foreground font-medium">Overall Status</p>
            <div className="relative flex items-center mt-1 h-8">
              <div className="p-1.5 rounded-md flex-shrink-0 z-10 bg-muted">
                <BadgeCheck className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-0">
                <span className={`text-[11px] font-semibold truncate max-w-full px-1 -mt-3 ${overallTextColor}`}>
                  {vendorLabel}
                </span>
                <span className={`inline-flex px-2 py-px rounded-full font-semibold text-xs ${overallTone}`}>
                  {statusLabel}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Col 3 — Score Pre Award (gauge) */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 flex items-center justify-center">
          <GaugeChart value={scorePreAward} title="Score Pre Award" size="sm" suffix="%" />
        </div>

        {/* Col 4 — Vendor Global Risk */}
        <KPICard
          title="Vendor Global Risk"
          value={riskLabel}
          icon={<ShieldAlert className="w-4 h-4" />}
          variant="yellow"
        />
      </div>

      {/* ── ROW 2: 4 score cards only ── */}
      <div className="grid grid-cols-4 gap-1.5">

        {/* HSE */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 flex flex-col justify-between">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">HSE</p>
          <p className="text-lg font-bold" style={{ color: scoreColor(avgScores.hse) }}>{avgScores.hse}%</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(avgScores.hse, 100)}%`, backgroundColor: scoreColor(avgScores.hse) }} />
          </div>
        </div>

        {/* Ecosystem */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 flex flex-col justify-between">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ecosystem</p>
          <p className="text-lg font-bold" style={{ color: scoreColor(avgScores.ecosystem) }}>{avgScores.ecosystem}%</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(avgScores.ecosystem, 100)}%`, backgroundColor: scoreColor(avgScores.ecosystem) }} />
          </div>
        </div>

        {/* Sustainability */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 flex flex-col justify-between">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sustainability</p>
          <p className="text-lg font-bold" style={{ color: scoreColor(avgScores.sustainability) }}>{avgScores.sustainability}%</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(avgScores.sustainability, 100)}%`, backgroundColor: scoreColor(avgScores.sustainability) }} />
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-card rounded-lg p-2 shadow-sm border border-border/50 flex flex-col justify-between">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Compliance</p>
          <p className="text-lg font-bold" style={{ color: scoreColor(avgScores.compliance) }}>{avgScores.compliance}%</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(avgScores.compliance, 100)}%`, backgroundColor: scoreColor(avgScores.compliance) }} />
          </div>
        </div>
      </div>

      {/* ── ROW 3: Chart (2 cols) + 2x3 KPI cards (2 cols) ── */}
      <div className="grid grid-cols-4 gap-1.5 h-[305px]">

        {/* CA & JESA Dependence chart — 2 cols */}
        <div className="col-span-2 bg-card rounded-lg p-2 shadow-sm border border-border/50 flex flex-col min-h-0">
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

        {/* Right 2 cols: 2x3 grid of all remaining KPI cards */}
        <div className="col-span-2 grid grid-cols-2 grid-rows-3 gap-1.5 min-h-0">

          <div className="rounded-lg p-2 shadow-sm border border-border/50 bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-14 h-14 rounded-full -mr-5 -mt-5 bg-muted" />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Layers className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Tiering</p>
                    <p className="text-[10px] text-muted-foreground">Distribution</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Selected</p>
                  <p className="text-xs font-semibold text-foreground">{selectedTier}</p>
                </div>
              </div>
              <div className="flex flex-col gap-px -mt-1">
                {[
                  { label: "Tier 1", value: tierPct.tier1 },
                  { label: "Tier 2", value: tierPct.tier2 },
                  { label: "Tier 3", value: tierPct.tier3 },
                  { label: "N/A",    value: tierPct.na },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[8.5px] text-muted-foreground">{label}</span>
                    <span className="text-[8.5px] font-bold text-[#666666]">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <KPICard
            title="Ongoing Bids"
            value={sum.ongoingBids}
            icon={<Gavel className="w-4 h-4" />}
            variant="default"
          />

          <KPICard
            title="Awarding Volume"
            value={formatMillions(sum.awardingVolume)}
            icon={<Coins className="w-4 h-4" />}
            variant="orange"
          />

          <KPICard
            title="Ongoing PO / Contracts"
            value={sum.ongoingPO}
            icon={<FileText className="w-4 h-4" />}
            variant="default"
          />

          <KPICard
            title="Successful Awards"
            value={sum.successfulAwards}
            icon={<Trophy className="w-4 h-4" />}
            variant="green"
          />

          <KPICard
            title="% of JESA Scope"
            value={`${Math.round(sum.jesaScope / count)}%`}
            icon={<PieChart className="w-4 h-4" />}
            variant="blue"
          />
        </div>
      </div>

    </div>
  )
}