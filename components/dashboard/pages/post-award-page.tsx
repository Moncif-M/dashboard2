"use client"

import {
  RotateCcw,
  Scale,
  Gavel,
  Star,
  Users,
} from "lucide-react"
import { KPICard } from "../kpi-card"
import { GaugeChart } from "../gauge-chart"
import type { FilterState } from "../filter-panel"
import { vendors } from "@/lib/vendor-data"
interface PostAwardPageProps {
  filters: FilterState
}

type Status = "Open" | "In Progress" | "Closed"
type Criticality = "High" | "Medium" | "Low"

function Pill({ label, tone }: { label: string; tone: "red" | "yellow" | "green" }) {
  const styles =
    tone === "green"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "yellow"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"
  return <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>{label}</span>
}

function statusTone(status: Status): "red" | "yellow" | "green" {
  if (status === "Closed") return "green"
  if (status === "In Progress") return "yellow"
  return "red"
}

function critTone(c: Criticality): "red" | "yellow" | "green" {
  if (c === "Low") return "green"
  if (c === "Medium") return "yellow"
  return "red"
}

function DataTable({
  title,
  subtitle,
  rows,
}: {
  title: string
  subtitle?: string
  rows: Array<{
    contractor: string
    project: string
    status: Status
    criticality: Criticality
    discipline: string
    count: number
  }>
}) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">Contractor</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">Project</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">Criticality</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">Discipline</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, idx) => (
              <tr key={`${r.contractor}-${idx}`} className="hover:bg-muted/20">
                <td className="px-3 py-2 text-sm text-foreground">{r.contractor}</td>
                <td className="px-3 py-2 text-sm text-muted-foreground">{r.project}</td>
                <td className="px-3 py-2">
                  <Pill label={r.status} tone={statusTone(r.status)} />
                </td>
                <td className="px-3 py-2">
                  <Pill label={r.criticality} tone={critTone(r.criticality)} />
                </td>
                <td className="px-3 py-2 text-sm text-muted-foreground">{r.discipline}</td>
                <td className="px-3 py-2 text-sm font-semibold text-foreground text-right">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PostAwardPage({ filters }: PostAwardPageProps) {
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

  const sums = safe.reduce(
    (acc, v) => {
      acc.avenants += v.postAward.avenantCount
      acc.changeRequests += v.postAward.changeRequestsCount
      acc.claims += v.postAward.claimsCount
      acc.avgScoreClosed += v.postAward.averageScoreClosed
      acc.contracts += v.postAward.contractsCount
      acc.contractants += v.postAward.contractantsCount
      acc.disciplineMaterial += v.postAward.disciplineScores.material
      acc.disciplineContract += v.postAward.disciplineScores.contract
      return acc
    },
    {
      avenants: 0,
      changeRequests: 0,
      claims: 0,
      avgScoreClosed: 0,
      contracts: 0,
      contractants: 0,
      disciplineMaterial: 0,
      disciplineContract: 0,
    }
  )

  const avgScoreClosedPct = Math.round(((sums.avgScoreClosed / count) / 5) * 100)
  const contractPerContractant = Math.round(sums.contractants ? sums.contracts / count : sums.contracts / count)
  const scorePostAwardMM = Math.round(sums.disciplineMaterial / count)
  const scorePostAwardContract = Math.round(sums.disciplineContract / count)

  const disciplineFromVendor = (v: typeof vendors[number]) => {
    if (v.category === "Construction") return "Civil"
    if (v.category === "Engineering") return "Mechanical"
    if (v.category === "Manufacturing") return "Process"
    return "Piping"
  }

  const statusFromCount = (n: number): Status => {
    if (n <= 1) return "Closed"
    if (n <= 4) return "In Progress"
    return "Open"
  }

  const criticalityFromCount = (n: number): Criticality => {
    if (n <= 2) return "Low"
    if (n <= 5) return "Medium"
    return "High"
  }

  const topKPIs = [
    { title: "Avenants", value: sums.avenants, icon: <RotateCcw className="w-5 h-5" />, variant: "yellow" as const },
    { title: "Change Requests", value: sums.changeRequests, icon: <Scale className="w-5 h-5" />, variant: "blue" as const },
    { title: "Count of Claims", value: sums.claims, icon: <Gavel className="w-5 h-5" />, variant: "red" as const },
  ]

  const secondRow = [
    { title: "Average Score Closed", value: `${avgScoreClosedPct}%`, icon: <Star className="w-5 h-5" />, variant: "green" as const },
    { title: "Nbre de contrat / Contractant", value: contractPerContractant, icon: <Users className="w-5 h-5" />, variant: "blue" as const },
  ]

  const ncrRows = safe
    .filter((v) => v.postAward.ncrCount > 0)
    .map((v) => ({
      contractor: v.name,
      project: v.project,
      status: statusFromCount(v.postAward.ncrCount),
      criticality: criticalityFromCount(v.postAward.ncrCount),
      discipline: disciplineFromVendor(v),
      count: v.postAward.ncrCount,
    }))

  const qorRows = safe
    .filter((v) => v.postAward.qorCount > 0)
    .map((v) => ({
      contractor: v.name,
      project: v.project,
      status: statusFromCount(v.postAward.qorCount),
      criticality: criticalityFromCount(v.postAward.qorCount),
      discipline: disciplineFromVendor(v),
      count: v.postAward.qorCount,
    }))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topKPIs.map((k) => (
          <KPICard key={k.title} title={k.title} value={k.value} icon={k.icon} variant={k.variant} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {secondRow.map((k) => (
          <KPICard key={k.title} title={k.title} value={k.value} icon={k.icon} variant={k.variant} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex items-center justify-center">
          <GaugeChart value={scorePostAwardMM} title="Score Post Award MM" size="lg" suffix="%" />
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex items-center justify-center">
          <GaugeChart value={scorePostAwardContract} title="Score Post Award Contract" size="lg" suffix="%" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DataTable
          title="NCR Count by Status / Contractor / Project"
          rows={ncrRows}
        />
        <DataTable
          title="QOR Count by Status / Contractor / Project"
          rows={qorRows}
        />
      </div>
    </div>
  )
}