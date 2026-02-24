"use client"

import { useState } from "react"
import {
  Package,
  CheckCircle,
  Star,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  DollarSign,
} from "lucide-react"
import { KPICard } from "../kpi-card"
import { GaugeChart } from "../gauge-chart"
import { VendorTable } from "../vendor-table"
import {
  type VendorWithKPIs,
  vendors as allVendors,
} from "@/lib/vendor-data"
import type { FilterState } from "../filter-panel"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface MaterialPageProps {
  filters: FilterState
  view: "overview" | "table"
}

const COLORS = ["#10b981", "#ef4444", "#f59e0b"]

export function MaterialPage({ filters, view }: MaterialPageProps) {
  const [selectedVendor, setSelectedVendor] = useState<VendorWithKPIs | null>(null)

  // Filter vendors
  const filteredVendors = allVendors.filter((v) => {
    if (filters.vendors.length && !filters.vendors.includes(v.name)) return false
    if (filters.categories.length && !filters.categories.includes(v.category)) return false
    if (filters.subCategories.length && !filters.subCategories.includes(v.subCategory)) return false
    if (filters.activities.length && !filters.activities.includes(v.activity)) return false
    if (filters.tierings.length && !filters.tierings.includes(v.tiering)) return false
    if (filters.regions.length && !filters.regions.includes(v.region)) return false
    return true
  })

  // Calculate aggregate KPIs from filtered vendors
  const calculateAggregateKPIs = (vendors: VendorWithKPIs[]) => {
    if (vendors.length === 0) {
      return {
        avgOtifScore: 0,
        avgCompliancePercent: 0,
        avgQualityScore: 0,
        avgNcrProcessFlow: 0,
        avgFraisApproche: 0,
        totalPlanned: 0,
        totalActual: 0,
        totalOsd: { over: 0, short: 0, damaged: 0 },
        totalConformity: { conformant: 0, nonConformant: 0, pending: 0 },
      }
    }

    const sum = vendors.reduce((acc, v) => ({
      otifScore: acc.otifScore + v.materialManagement.otifScore,
      compliancePercent: acc.compliancePercent + v.materialManagement.compliancePercent,
      qualityScore: acc.qualityScore + v.materialManagement.qualityScore,
      ncrProcessFlow: acc.ncrProcessFlow + v.materialManagement.ncrProcessFlow,
      fraisApproche: acc.fraisApproche + v.materialManagement.fraisApproche,
      planned: acc.planned + v.materialManagement.plannedVsActual.planned,
      actual: acc.actual + v.materialManagement.plannedVsActual.actual,
      osd: {
        over: acc.osd.over + v.materialManagement.osdData.over,
        short: acc.osd.short + v.materialManagement.osdData.short,
        damaged: acc.osd.damaged + v.materialManagement.osdData.damaged,
      },
      conformity: {
        conformant: acc.conformity.conformant + v.materialManagement.conformityData.conformant,
        nonConformant: acc.conformity.nonConformant + v.materialManagement.conformityData.nonConformant,
        pending: acc.conformity.pending + v.materialManagement.conformityData.pending,
      },
    }), {
      otifScore: 0,
      compliancePercent: 0,
      qualityScore: 0,
      ncrProcessFlow: 0,
      fraisApproche: 0,
      planned: 0,
      actual: 0,
      osd: { over: 0, short: 0, damaged: 0 },
      conformity: { conformant: 0, nonConformant: 0, pending: 0 },
    })

    const count = vendors.length

    return {
      avgOtifScore: Math.round(sum.otifScore / count),
      avgCompliancePercent: Math.round(sum.compliancePercent / count),
      avgQualityScore: Math.round(sum.qualityScore / count),
      avgNcrProcessFlow: Math.round(sum.ncrProcessFlow / count),
      avgFraisApproche: sum.fraisApproche / count,
      totalPlanned: sum.planned,
      totalActual: sum.actual,
      totalOsd: sum.osd,
      totalConformity: sum.conformity,
    }
  }

  // Get display KPIs based on selection
  const displayKPIs = selectedVendor
    ? {
      avgOtifScore: selectedVendor.materialManagement.otifScore,
      avgCompliancePercent: selectedVendor.materialManagement.compliancePercent,
      avgQualityScore: selectedVendor.materialManagement.qualityScore,
      avgNcrProcessFlow: selectedVendor.materialManagement.ncrProcessFlow,
      avgFraisApproche: selectedVendor.materialManagement.fraisApproche,
      totalPlanned: selectedVendor.materialManagement.plannedVsActual.planned,
      totalActual: selectedVendor.materialManagement.plannedVsActual.actual,
      totalOsd: selectedVendor.materialManagement.osdData,
      totalConformity: selectedVendor.materialManagement.conformityData,
    }
    : calculateAggregateKPIs(filteredVendors)

  // Planned vs Actual data
  const plannedVsActualData = selectedVendor
    ? [
      {
        name: selectedVendor.name.split(" ")[0],
        planned: selectedVendor.materialManagement.plannedVsActual.planned,
        actual: selectedVendor.materialManagement.plannedVsActual.actual,
      },
    ]
    : filteredVendors.slice(0, 6).map((v) => ({
      name: v.name.split(" ")[0],
      planned: v.materialManagement.plannedVsActual.planned,
      actual: v.materialManagement.plannedVsActual.actual,
    }))

  // OSD Table data
  const osdData = [
    { type: "Over", count: displayKPIs.totalOsd.over, icon: ArrowUp, color: "text-amber-600" },
    { type: "Short", count: displayKPIs.totalOsd.short, icon: ArrowDown, color: "text-red-600" },
    { type: "Damaged", count: displayKPIs.totalOsd.damaged, icon: Minus, color: "text-red-700" },
  ]

  // Conformity Pie data
  const conformityPieData = [
    { name: "Conformant", value: displayKPIs.totalConformity.conformant },
    { name: "Non-Conformant", value: displayKPIs.totalConformity.nonConformant },
    { name: "Pending", value: displayKPIs.totalConformity.pending },
  ]

  const deliveryVariance = Math.round(
    ((displayKPIs.totalActual - displayKPIs.totalPlanned) / displayKPIs.totalPlanned) * 100
  )

  // Table View
  if (view === "table") {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="flex-1 overflow-auto">
          <VendorTable
            vendors={filteredVendors}
            type="material"
            selectedVendorId={selectedVendor?.id}
            onSelectVendor={setSelectedVendor}
          />
        </div>
      </div>
    )
  }

  // Overview View
  return (
    <div className="space-y-3">
      {/* Top Half - OTIF Gauge and Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex items-center justify-center">
          <GaugeChart
            value={displayKPIs.avgOtifScore}
            title={selectedVendor ? `OTIF Score - ${selectedVendor.name.split(" ")[0]}` : "OTIF Score"}
            size="md"
          />
        </div>

        <div className="space-y-3">
          <KPICard
            title="Compliance %"
            value={`${displayKPIs.avgCompliancePercent}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="green"
          />
          <KPICard
            title="Quality Score"
            value={`${displayKPIs.avgQualityScore}%`}
            icon={<Star className="w-5 h-5" />}
            variant="blue"
          />
        </div>

        <div className="space-y-3">
          <KPICard
            title="NCR Process Flow"
            value={`${displayKPIs.avgNcrProcessFlow}%`}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="yellow"
          />
          <KPICard
            title={selectedVendor ? "Planned Units" : "Total Planned Units"}
            value={displayKPIs.totalPlanned.toLocaleString()}
            icon={<Package className="w-5 h-5" />}
            variant="default"
          />
        </div>

        <div className="space-y-3">
          <KPICard
            title={selectedVendor ? "Actual Units" : "Total Actual Units"}
            value={displayKPIs.totalActual.toLocaleString()}
            icon={<Package className="w-5 h-5" />}
            variant={deliveryVariance >= -5 ? "green" : "red"}
          />
          <KPICard
            title="Delivery Variance"
            value={`${deliveryVariance}%`}
            icon={deliveryVariance >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            variant={deliveryVariance >= -5 ? "green" : "red"}
          />
        </div>
      </div>

      {/* Bottom Half - Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Planned vs Actual Bar Chart */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex-shrink-0">
            {selectedVendor
              ? `Planned vs Actual - ${selectedVendor.name.split(" ")[0]}`
              : "Planned vs Actual by Vendor"}
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plannedVsActualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="planned" fill="#3b82f6" name="Planned" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conformity Pie Chart */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex-shrink-0">
            {selectedVendor ? `Conformity - ${selectedVendor.name.split(" ")[0]}` : "Conformity Distribution"}
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conformityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: '11px' }}
                >
                  {conformityPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-shrink-0 mt-2">
            {conformityPieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frais d'Approche */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex-shrink-0">
            Frais d&apos;Approche
            {selectedVendor && <span className="text-primary ml-1">- {selectedVendor.name.split(" ")[0]}</span>}
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                <DollarSign className="w-12 h-12 text-primary" />
              </div>
              <p className="text-5xl font-bold text-foreground">{displayKPIs.avgFraisApproche.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-2">Approach Costs</p>
            </div>
          </div>
        </div>

        {/* OSD Summary */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex-shrink-0">
            OSD (Over, Short, Damaged)
            {selectedVendor && <span className="text-primary ml-1">- {selectedVendor.name.split(" ")[0]}</span>}
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              {osdData.map((item) => (
                <div
                  key={item.type}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <div className={`p-3 rounded-full bg-card ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{item.count}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}