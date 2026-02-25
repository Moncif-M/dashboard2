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
    const caAvg =
      safe.reduce((s, v) => s + (v.preAward.chiffreAffaire[idx] ?? 0), 0) / count
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
    <div className="space-y-3">

      {/* ── ROW 1: items-start → changed cards anchor to top and grow downward ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-start">

        {/* Vendors in view — taller, grows downward from top */}
        <div className="h-44">
          <KPICard
            title="Vendors in view"
            value={`${safe.length} / ${totalVendors}`}
            icon={<Users className="w-5 h-5" />}
            variant="blue"
          />
        </div>

        {/* Tiering — same height as others */}
        <div className="h-44">
          <div className="rounded-xl p-4 shadow-sm border border-border/50 bg-card relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-8 -mt-8 bg-muted" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Tiering</p>
                    <p className="text-xs text-muted-foreground">Distribution of vendors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Selected Tier
                  </p>
                  <p className="text-xs font-semibold text-foreground">{selectedTier}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tier 1</span>
                  <span className="font-semibold text-foreground">{tierPct.tier1}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tier 2</span>
                  <span className="font-semibold text-foreground">{tierPct.tier2}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tier 3</span>
                  <span className="font-semibold text-foreground">{tierPct.tier3}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">N/A</span>
                  <span className="font-semibold text-foreground">{tierPct.na}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Global Risk — taller, grows downward from top */}
        <div className="h-44">
          <KPICard
            title="Vendor Global Risk"
            value={riskLabelFromValue(Math.round(sum.risk / count))}
            icon={<ShieldAlert className="w-5 h-5" />}
            variant="yellow"
          />
        </div>

        {/* Successful Awards — taller, grows downward from top */}
        <div className="h-44">
          <KPICard
            title="Successful Awards"
            value={sum.successfulAwards}
            icon={<Trophy className="w-5 h-5" />}
            variant="green"
          />
        </div>
      </div>

      {/* ── ROW 2: items-end → changed cards anchor to bottom and grow upward ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-end">

        {/* Awarding Volume — taller, grows upward from bottom */}
        <div className="h-44">
          <KPICard
            title="Awarding Volume"
            value={formatMillions(sum.awardingVolume)}
            icon={<Coins className="w-5 h-5" />}
            variant="orange"
          />
        </div>

        {/* Ongoing PO / Contracts — UNCHANGED, natural height */}
        <KPICard
          title="Ongoing PO / Contracts"
          value={sum.ongoingPO}
          icon={<FileText className="w-5 h-5" />}
          variant="default"
        />

        {/* Ongoing Bids — taller, grows upward from bottom */}
        <div className="h-44">
          <KPICard
            title="Ongoing Bids"
            value={sum.ongoingBids}
            icon={<Gavel className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* % of JESA Scope — taller, grows upward from bottom */}
        <div className="h-44">
          <KPICard
            title="% of JESA Scope"
            value={`${Math.round(sum.jesaScope / count)}%`}
            icon={<PieChart className="w-5 h-5" />}
            variant="blue"
          />
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-2 bg-card rounded-xl p-4 shadow-sm border border-border/50 h-[340px] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex-shrink-0">
            Chiffre d&apos;Affaire &amp; JESA Dependence
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caDependanceData} margin={{ left: 0, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#6366f1" width={30} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="#10b981"
                  width={30}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} iconSize={10} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ca"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: "#4f46e5", r: 3 }}
                  name="Chiffre d'Affaire (M MAD)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="dependance"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 3 }}
                  name="Dependence to JESA (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex flex-col items-center justify-between h-[340px]">
          <div className="pt-4">
            <GaugeChart value={scorePreAward} title="Score Pre Award" size="md" suffix="%" />
          </div>
          <div className="pb-5 text-center space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Overall Status
            </p>
            <p className={`text-xs font-semibold ${overallTextColor}`}>{vendorLabel}</p>
            <span className={`inline-flex px-4 py-1.5 rounded-full font-semibold text-sm ${overallTone}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Pre Award Scores</h3>
          <div className="space-y-3">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreBars}
                  layout="vertical"
                  margin={{ left: 8, right: 6, top: 10, bottom: 10 }}
                >
                  <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={64} />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14} isAnimationActive={false}>
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
    </div>
  )
}