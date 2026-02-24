// Types for Vendor KPIs

export type PerformanceLevel = 'green' | 'yellow' | 'red'

export interface Vendor {
  id: string
  name: string
  category: string
  subCategory: string
  activity: string
  bu: string
  project: string
  tiering: 'Tier 1' | 'Tier 2' | 'Tier 3'
  region: string
}

export interface PreAwardKPIs {
  ecosystemScore: number
  hseScore: number
  sustainabilityScore: number
  complianceRate: number
  globalRiskLevel: number
  traceReport: { status: 'clear' | 'flagged'; details: string }
  dbScore: { status: 'clear' | 'flagged'; score: number; details: string }
  chiffreAffaire: number[]
  dependanceJesa: number
  productionCapacity: number
  openCapacity: number
  responseRate: number
  technicalValidationRatio: number
  priceCompetitiveness: number
  successfulAwards: number
  awardingRate: number
  responsivenesseTechnique: number
  responsivenessSignature: number
  jesaScope: number
  projectsOngoing: number
  packagesOngoing: number
}

export interface PostAwardKPIs {
  changeRequestsCount: number
  changeRequestsMontant: number
  claimsCount: number
  ncrQorCount: number
  ncrCount: number
  qorCount: number
  ncrClosureTime: number
  averageScoreClosed: number
  disciplineScores: {
    projectControl: number
    engineering: number
    contract: number
    cAndC: number
    pmqc: number
    construction: number
    material: number
  }
  avenantCount: number
  avenantPercentage: number
  contractsCount: number
  contractantsCount: number
  reactivityLetters: number
  guaranteeRenewalTime: number
  concessionRequests: number
}

export interface MaterialManagementKPIs {
  otifScore: number
  plannedVsActual: { planned: number; actual: number }
  compliancePercent: number
  qualityScore: number
  ncrProcessFlow: number
  fraisApproche: number
  osdData: { over: number; short: number; damaged: number }
  conformityData: { conformant: number; nonConformant: number; pending: number }
}

export interface VendorWithKPIs extends Vendor {
  preAward: PreAwardKPIs
  postAward: PostAwardKPIs
  materialManagement: MaterialManagementKPIs
}

export function getPerformanceLevel(value: number, thresholds: { green: number; yellow: number }): PerformanceLevel {
  if (value >= thresholds.green) return 'green'
  if (value >= thresholds.yellow) return 'yellow'
  return 'red'
}

export function getInversePerformanceLevel(value: number, thresholds: { green: number; yellow: number }): PerformanceLevel {
  if (value <= thresholds.green) return 'green'
  if (value <= thresholds.yellow) return 'yellow'
  return 'red'
}

export const vendors: VendorWithKPIs[] = [
  {
    id: 'V001',
    name: 'Acme Industrial Corp',
    category: 'Manufacturing',
    subCategory: 'Heavy Equipment',
    activity: 'Production',
    bu: 'BU 1',
    project: 'Project Alpha',
    tiering: 'Tier 1',
    region: 'North Africa',
    preAward: {
      ecosystemScore: 107,
      hseScore: 92,
      sustainabilityScore: 78,
      complianceRate: 92,
      globalRiskLevel: 25,
      traceReport: { status: 'clear', details: 'No legal issues found' },
      dbScore: { status: 'clear', score: 88, details: 'Strong financial health' },
      chiffreAffaire: [12.5, 14.2, 15.8, 18.1, 20.3],
      dependanceJesa: 15,
      productionCapacity: 85000,
      openCapacity: 25000,
      responseRate: 95,
      technicalValidationRatio: 88,
      priceCompetitiveness: 82,
      successfulAwards: 24,
      awardingRate: 78,
      responsivenesseTechnique: 4.2,
      responsivenessSignature: 3.5,
      jesaScope: 12,
      projectsOngoing: 5,
      packagesOngoing: 12,
    },
    postAward: {
      changeRequestsCount: 8,
      changeRequestsMontant: 125000,
      claimsCount: 2,
      ncrQorCount: 5,
      ncrCount: 3,
      qorCount: 2,
      ncrClosureTime: 12,
      averageScoreClosed: 4.2,
      disciplineScores: { projectControl: 88, engineering: 92, contract: 85, cAndC: 90, pmqc: 87, construction: 91, material: 89 },
      avenantCount: 3,
      avenantPercentage: 8,
      contractsCount: 7,
      contractantsCount: 45,
      reactivityLetters: 2.5,
      guaranteeRenewalTime: 15,
      concessionRequests: 4,
    },
    materialManagement: {
      otifScore: 94,
      plannedVsActual: { planned: 1200, actual: 1150 },
      compliancePercent: 96,
      qualityScore: 92,
      ncrProcessFlow: 88,
      fraisApproche: 4.5,
      osdData: { over: 12, short: 5, damaged: 2 },
      conformityData: { conformant: 1120, nonConformant: 25, pending: 5 },
    },
  },
  {
    id: 'V002',
    name: 'GlobalTech Solutions',
    category: 'Engineering',
    subCategory: 'Electrical Systems',
    activity: 'Design & Build',
    bu: 'BU 1',
    project: 'Project Beta',
    tiering: 'Tier 1',
    region: 'Europe',
    preAward: {
      ecosystemScore: 101,
      hseScore: 85,
      sustainabilityScore: 82,
      complianceRate: 88,
      globalRiskLevel: 35,
      traceReport: { status: 'clear', details: 'No legal issues found' },
      dbScore: { status: 'clear', score: 75, details: 'Good financial standing' },
      chiffreAffaire: [8.2, 9.1, 10.5, 11.8, 12.4],
      dependanceJesa: 28,
      productionCapacity: 62000,
      openCapacity: 18000,
      responseRate: 88,
      technicalValidationRatio: 82,
      priceCompetitiveness: 75,
      successfulAwards: 18,
      awardingRate: 65,
      responsivenesseTechnique: 5.8,
      responsivenessSignature: 4.2,
      jesaScope: 8,
      projectsOngoing: 3,
      packagesOngoing: 8,
    },
    postAward: {
      changeRequestsCount: 12,
      changeRequestsMontant: 185000,
      claimsCount: 4,
      ncrQorCount: 8,
      ncrCount: 5,
      qorCount: 3,
      ncrClosureTime: 18,
      averageScoreClosed: 3.8,
      disciplineScores: { projectControl: 82, engineering: 88, contract: 78, cAndC: 85, pmqc: 80, construction: 84, material: 82 },
      avenantCount: 5,
      avenantPercentage: 12,
      contractsCount: 5,
      contractantsCount: 32,
      reactivityLetters: 3.8,
      guaranteeRenewalTime: 22,
      concessionRequests: 6,
    },
    materialManagement: {
      otifScore: 86,
      plannedVsActual: { planned: 800, actual: 720 },
      compliancePercent: 88,
      qualityScore: 85,
      ncrProcessFlow: 78,
      fraisApproche: 7.2,
      osdData: { over: 8, short: 15, damaged: 5 },
      conformityData: { conformant: 680, nonConformant: 35, pending: 5 },
    },
  },
  {
    id: 'V003',
    name: 'Sahara Construction',
    category: 'Construction',
    subCategory: 'Civil Works',
    activity: 'Construction',
    bu: 'BU 2',
    project: 'Project Gamma',
    tiering: 'Tier 2',
    region: 'Middle East',
    preAward: {
      ecosystemScore: 84,
      hseScore: 68,
      sustainabilityScore: 55,
      complianceRate: 75,
      globalRiskLevel: 58,
      traceReport: { status: 'flagged', details: 'Minor compliance issue in 2024' },
      dbScore: { status: 'clear', score: 65, details: 'Moderate financial health' },
      chiffreAffaire: [5.5, 6.2, 5.8, 6.5, 7.1],
      dependanceJesa: 45,
      productionCapacity: 45000,
      openCapacity: 8000,
      responseRate: 72,
      technicalValidationRatio: 68,
      priceCompetitiveness: 88,
      successfulAwards: 12,
      awardingRate: 52,
      responsivenesseTechnique: 8.5,
      responsivenessSignature: 7.2,
      jesaScope: 18,
      projectsOngoing: 2,
      packagesOngoing: 5,
    },
    postAward: {
      changeRequestsCount: 18,
      changeRequestsMontant: 320000,
      claimsCount: 7,
      ncrQorCount: 15,
      ncrCount: 10,
      qorCount: 5,
      ncrClosureTime: 28,
      averageScoreClosed: 3.2,
      disciplineScores: { projectControl: 68, engineering: 72, contract: 65, cAndC: 70, pmqc: 62, construction: 74, material: 68 },
      avenantCount: 8,
      avenantPercentage: 22,
      contractsCount: 4,
      contractantsCount: 28,
      reactivityLetters: 6.5,
      guaranteeRenewalTime: 35,
      concessionRequests: 12,
    },
    materialManagement: {
      otifScore: 72,
      plannedVsActual: { planned: 500, actual: 380 },
      compliancePercent: 75,
      qualityScore: 70,
      ncrProcessFlow: 62,
      fraisApproche: 12.8,
      osdData: { over: 25, short: 35, damaged: 12 },
      conformityData: { conformant: 340, nonConformant: 35, pending: 5 },
    },
  },
  {
    id: 'V004',
    name: 'Nordic Precision AB',
    category: 'Manufacturing',
    subCategory: 'Precision Parts',
    activity: 'Production',
    bu: 'BU 2',
    project: 'Project Delta',
    tiering: 'Tier 1',
    region: 'Europe',
    preAward: {
      ecosystemScore: 114,
      hseScore: 95,
      sustainabilityScore: 88,
      complianceRate: 96,
      globalRiskLevel: 15,
      traceReport: { status: 'clear', details: 'Excellent compliance record' },
      dbScore: { status: 'clear', score: 94, details: 'Excellent financial health' },
      chiffreAffaire: [22.5, 25.8, 28.2, 31.5, 35.2],
      dependanceJesa: 8,
      productionCapacity: 120000,
      openCapacity: 45000,
      responseRate: 98,
      technicalValidationRatio: 95,
      priceCompetitiveness: 72,
      successfulAwards: 32,
      awardingRate: 88,
      responsivenesseTechnique: 2.5,
      responsivenessSignature: 2.0,
      jesaScope: 6,
      projectsOngoing: 8,
      packagesOngoing: 18,
    },
    postAward: {
      changeRequestsCount: 4,
      changeRequestsMontant: 65000,
      claimsCount: 1,
      ncrQorCount: 2,
      ncrCount: 1,
      qorCount: 1,
      ncrClosureTime: 8,
      averageScoreClosed: 4.7,
      disciplineScores: { projectControl: 94, engineering: 96, contract: 92, cAndC: 95, pmqc: 93, construction: 94, material: 95 },
      avenantCount: 1,
      avenantPercentage: 3,
      contractsCount: 12,
      contractantsCount: 68,
      reactivityLetters: 1.5,
      guaranteeRenewalTime: 8,
      concessionRequests: 2,
    },
    materialManagement: {
      otifScore: 98,
      plannedVsActual: { planned: 2000, actual: 1980 },
      compliancePercent: 99,
      qualityScore: 97,
      ncrProcessFlow: 95,
      fraisApproche: 2.8,
      osdData: { over: 3, short: 2, damaged: 0 },
      conformityData: { conformant: 1970, nonConformant: 8, pending: 2 },
    },
  },
  {
    id: 'V005',
    name: 'Atlas Logistics MENA',
    category: 'Logistics',
    subCategory: 'Transport',
    activity: 'Supply Chain',
    bu: 'BU 3',
    project: 'Project Epsilon',
    tiering: 'Tier 2',
    region: 'Middle East',
    preAward: {
      ecosystemScore: 96,
      hseScore: 78,
      sustainabilityScore: 70,
      complianceRate: 84,
      globalRiskLevel: 42,
      traceReport: { status: 'clear', details: 'No issues' },
      dbScore: { status: 'clear', score: 72, details: 'Stable finances' },
      chiffreAffaire: [4.2, 4.8, 5.5, 6.2, 6.8],
      dependanceJesa: 32,
      productionCapacity: 35000,
      openCapacity: 12000,
      responseRate: 82,
      technicalValidationRatio: 78,
      priceCompetitiveness: 85,
      successfulAwards: 15,
      awardingRate: 62,
      responsivenesseTechnique: 6.2,
      responsivenessSignature: 5.5,
      jesaScope: 14,
      projectsOngoing: 4,
      packagesOngoing: 9,
    },
    postAward: {
      changeRequestsCount: 10,
      changeRequestsMontant: 145000,
      claimsCount: 3,
      ncrQorCount: 7,
      ncrCount: 4,
      qorCount: 3,
      ncrClosureTime: 20,
      averageScoreClosed: 3.6,
      disciplineScores: { projectControl: 76, engineering: 80, contract: 74, cAndC: 78, pmqc: 75, construction: 77, material: 79 },
      avenantCount: 4,
      avenantPercentage: 15,
      contractsCount: 6,
      contractantsCount: 38,
      reactivityLetters: 4.2,
      guaranteeRenewalTime: 25,
      concessionRequests: 8,
    },
    materialManagement: {
      otifScore: 82,
      plannedVsActual: { planned: 650, actual: 580 },
      compliancePercent: 84,
      qualityScore: 80,
      ncrProcessFlow: 75,
      fraisApproche: 8.5,
      osdData: { over: 15, short: 20, damaged: 8 },
      conformityData: { conformant: 540, nonConformant: 32, pending: 8 },
    },
  },
  {
    id: 'V006',
    name: 'Pinnacle Engineering Ltd',
    category: 'Engineering',
    subCategory: 'Mechanical',
    activity: 'Design',
    bu: 'BU 1',
    project: 'Project Alpha',
    tiering: 'Tier 1',
    region: 'North Africa',
    preAward: {
      ecosystemScore: 110,
      hseScore: 90,
      sustainabilityScore: 85,
      complianceRate: 93,
      globalRiskLevel: 22,
      traceReport: { status: 'clear', details: 'Clean record' },
      dbScore: { status: 'clear', score: 86, details: 'Strong finances' },
      chiffreAffaire: [15.2, 17.5, 19.8, 22.1, 24.5],
      dependanceJesa: 18,
      productionCapacity: 78000,
      openCapacity: 28000,
      responseRate: 92,
      technicalValidationRatio: 90,
      priceCompetitiveness: 78,
      successfulAwards: 28,
      awardingRate: 82,
      responsivenesseTechnique: 3.8,
      responsivenessSignature: 3.2,
      jesaScope: 10,
      projectsOngoing: 6,
      packagesOngoing: 14,
    },
    postAward: {
      changeRequestsCount: 6,
      changeRequestsMontant: 95000,
      claimsCount: 2,
      ncrQorCount: 4,
      ncrCount: 2,
      qorCount: 2,
      ncrClosureTime: 14,
      averageScoreClosed: 4.4,
      disciplineScores: { projectControl: 90, engineering: 94, contract: 88, cAndC: 91, pmqc: 89, construction: 90, material: 91 },
      avenantCount: 2,
      avenantPercentage: 6,
      contractsCount: 9,
      contractantsCount: 52,
      reactivityLetters: 2.8,
      guaranteeRenewalTime: 12,
      concessionRequests: 3,
    },
    materialManagement: {
      otifScore: 92,
      plannedVsActual: { planned: 1500, actual: 1420 },
      compliancePercent: 94,
      qualityScore: 91,
      ncrProcessFlow: 88,
      fraisApproche: 5.2,
      osdData: { over: 8, short: 10, damaged: 3 },
      conformityData: { conformant: 1380, nonConformant: 35, pending: 5 },
    },
  },
  {
    id: 'V007',
    name: 'Desert Steel Industries',
    category: 'Manufacturing',
    subCategory: 'Steel Fabrication',
    activity: 'Production',
    bu: 'BU 2',
    project: 'Project Beta',
    tiering: 'Tier 2',
    region: 'Middle East',
    preAward: {
      ecosystemScore: 80,
      hseScore: 62,
      sustainabilityScore: 48,
      complianceRate: 65,
      globalRiskLevel: 65,
      traceReport: { status: 'flagged', details: 'Safety incident in 2024' },
      dbScore: { status: 'flagged', score: 52, details: 'Cash flow concerns' },
      chiffreAffaire: [3.2, 3.5, 3.1, 2.8, 3.4],
      dependanceJesa: 52,
      productionCapacity: 28000,
      openCapacity: 5000,
      responseRate: 65,
      technicalValidationRatio: 58,
      priceCompetitiveness: 92,
      successfulAwards: 8,
      awardingRate: 42,
      responsivenesseTechnique: 10.5,
      responsivenessSignature: 9.2,
      jesaScope: 25,
      projectsOngoing: 1,
      packagesOngoing: 3,
    },
    postAward: {
      changeRequestsCount: 22,
      changeRequestsMontant: 420000,
      claimsCount: 9,
      ncrQorCount: 22,
      ncrCount: 14,
      qorCount: 8,
      ncrClosureTime: 35,
      averageScoreClosed: 2.8,
      disciplineScores: { projectControl: 58, engineering: 62, contract: 55, cAndC: 60, pmqc: 52, construction: 65, material: 58 },
      avenantCount: 12,
      avenantPercentage: 35,
      contractsCount: 2,
      contractantsCount: 18,
      reactivityLetters: 8.5,
      guaranteeRenewalTime: 45,
      concessionRequests: 18,
    },
    materialManagement: {
      otifScore: 62,
      plannedVsActual: { planned: 350, actual: 240 },
      compliancePercent: 65,
      qualityScore: 58,
      ncrProcessFlow: 52,
      fraisApproche: 15.5,
      osdData: { over: 35, short: 48, damaged: 18 },
      conformityData: { conformant: 205, nonConformant: 30, pending: 5 },
    },
  },
  {
    id: 'V008',
    name: 'TechMarine Services',
    category: 'Services',
    subCategory: 'Offshore',
    activity: 'Maintenance',
    bu: 'BU 3',
    project: 'Project Gamma',
    tiering: 'Tier 3',
    region: 'West Africa',
    preAward: {
      ecosystemScore: 98,
      hseScore: 75,
      sustainabilityScore: 65,
      complianceRate: 78,
      globalRiskLevel: 48,
      traceReport: { status: 'clear', details: 'No issues' },
      dbScore: { status: 'clear', score: 68, details: 'Adequate finances' },
      chiffreAffaire: [2.5, 2.8, 3.2, 3.5, 3.8],
      dependanceJesa: 38,
      productionCapacity: 22000,
      openCapacity: 8000,
      responseRate: 78,
      technicalValidationRatio: 72,
      priceCompetitiveness: 80,
      successfulAwards: 10,
      awardingRate: 55,
      responsivenesseTechnique: 7.2,
      responsivenessSignature: 6.5,
      jesaScope: 16,
      projectsOngoing: 2,
      packagesOngoing: 5,
    },
    postAward: {
      changeRequestsCount: 14,
      changeRequestsMontant: 210000,
      claimsCount: 5,
      ncrQorCount: 10,
      ncrCount: 6,
      qorCount: 4,
      ncrClosureTime: 24,
      averageScoreClosed: 3.4,
      disciplineScores: { projectControl: 72, engineering: 75, contract: 70, cAndC: 73, pmqc: 68, construction: 74, material: 72 },
      avenantCount: 6,
      avenantPercentage: 18,
      contractsCount: 3,
      contractantsCount: 22,
      reactivityLetters: 5.2,
      guaranteeRenewalTime: 28,
      concessionRequests: 9,
    },
    materialManagement: {
      otifScore: 76,
      plannedVsActual: { planned: 420, actual: 350 },
      compliancePercent: 78,
      qualityScore: 74,
      ncrProcessFlow: 68,
      fraisApproche: 9.8,
      osdData: { over: 18, short: 28, damaged: 10 },
      conformityData: { conformant: 315, nonConformant: 30, pending: 5 },
    },
  },
  {
    id: 'V009',
    name: 'Apex Performance Group',
    category: 'Engineering',
    subCategory: 'Process Systems',
    activity: 'Design & Build',
    bu: 'BU 1',
    project: 'Project Delta',
    tiering: 'Tier 1',
    region: 'Europe',
    preAward: {
      ecosystemScore: 118,  // above 100
      hseScore: 124,        // above 100
      sustainabilityScore: 97,
      complianceRate: 99,
      globalRiskLevel: 12,
      traceReport: { status: 'clear', details: 'Exemplary compliance record' },
      dbScore: { status: 'clear', score: 98, details: 'Outstanding financial health' },
      chiffreAffaire: [28.5, 32.1, 36.8, 42.3, 48.7],
      dependanceJesa: 5,
      productionCapacity: 150000,
      openCapacity: 60000,
      responseRate: 99,
      technicalValidationRatio: 98,
      priceCompetitiveness: 96,
      successfulAwards: 45,
      awardingRate: 95,
      responsivenesseTechnique: 1.8,
      responsivenessSignature: 1.5,
      jesaScope: 4,
      projectsOngoing: 12,
      packagesOngoing: 25,
    },
    postAward: {
      changeRequestsCount: 2,
      changeRequestsMontant: 32000,
      claimsCount: 0,
      ncrQorCount: 1,
      ncrCount: 1,
      qorCount: 0,
      ncrClosureTime: 5,
      averageScoreClosed: 4.9,
      disciplineScores: { projectControl: 98, engineering: 99, contract: 96, cAndC: 97, pmqc: 95, construction: 98, material: 99 },
      avenantCount: 0,
      avenantPercentage: 1,
      contractsCount: 18,
      contractantsCount: 85,
      reactivityLetters: 1.0,
      guaranteeRenewalTime: 5,
      concessionRequests: 1,
    },
    materialManagement: {
      otifScore: 99,
      plannedVsActual: { planned: 2500, actual: 2520 },
      compliancePercent: 99,
      qualityScore: 98,
      ncrProcessFlow: 97,
      fraisApproche: 1.8,
      osdData: { over: 1, short: 0, damaged: 0 },
      conformityData: { conformant: 2510, nonConformant: 5, pending: 5 },
    },
  },
]

export const categories = [...new Set(vendors.map(v => v.category))]
export const subCategories = [...new Set(vendors.map(v => v.subCategory))]
export const activities = [...new Set(vendors.map(v => v.activity))]
export const businessUnits = [...new Set(vendors.map(v => v.bu))]
export const projects = [...new Set(vendors.map(v => v.project))]
export const tierings: ('Tier 1' | 'Tier 2' | 'Tier 3')[] = ['Tier 1', 'Tier 2', 'Tier 3']
export const regions = [...new Set(vendors.map(v => v.region))]
export const vendorNames = vendors.map(v => v.name).sort()

export const kpiThresholds = {
  ecosystemScore: { green: 80, yellow: 60 },
  hseScore: { green: 85, yellow: 70 },
  sustainabilityScore: { green: 75, yellow: 55 },
  globalRiskLevel: { green: 30, yellow: 50 },
  dbScore: { green: 80, yellow: 60 },
  dependanceJesa: { green: 20, yellow: 40 },
  responseRate: { green: 90, yellow: 75 },
  technicalValidationRatio: { green: 85, yellow: 70 },
  priceCompetitiveness: { green: 80, yellow: 65 },
  awardingRate: { green: 75, yellow: 55 },
  responsivenesseTechnique: { green: 4, yellow: 7 },
  responsivenessSignature: { green: 3, yellow: 6 },
  averageScoreClosed: { green: 4.0, yellow: 3.2 },
  ncrClosureTime: { green: 15, yellow: 25 },
  changeRequestsCount: { green: 8, yellow: 15 },
  claimsCount: { green: 3, yellow: 6 },
  avenantPercentage: { green: 10, yellow: 20 },
  reactivityLetters: { green: 3, yellow: 5 },
  guaranteeRenewalTime: { green: 15, yellow: 30 },
  otifScore: { green: 90, yellow: 75 },
  compliancePercent: { green: 90, yellow: 75 },
  qualityScore: { green: 85, yellow: 70 },
  ncrProcessFlow: { green: 80, yellow: 65 },
  fraisApproche: { green: 5, yellow: 10 },
}

export function getAggregatePreAwardKPIs() {
  const total = vendors.length
  return {
    avgEcosystemScore: Math.round(vendors.reduce((sum, v) => sum + v.preAward.ecosystemScore, 0) / total),
    avgHseScore: Math.round(vendors.reduce((sum, v) => sum + v.preAward.hseScore, 0) / total),
    avgSustainabilityScore: Math.round(vendors.reduce((sum, v) => sum + v.preAward.sustainabilityScore, 0) / total),
    avgGlobalRiskLevel: Math.round(vendors.reduce((sum, v) => sum + v.preAward.globalRiskLevel, 0) / total),
    totalTraceFlags: vendors.filter(v => v.preAward.traceReport.status === 'flagged').length,
    totalDbFlags: vendors.filter(v => v.preAward.dbScore.status === 'flagged').length,
    avgResponseRate: Math.round(vendors.reduce((sum, v) => sum + v.preAward.responseRate, 0) / total),
    avgTechnicalValidation: Math.round(vendors.reduce((sum, v) => sum + v.preAward.technicalValidationRatio, 0) / total),
    avgPriceCompetitiveness: Math.round(vendors.reduce((sum, v) => sum + v.preAward.priceCompetitiveness, 0) / total),
    totalSuccessfulAwards: vendors.reduce((sum, v) => sum + v.preAward.successfulAwards, 0),
    avgAwardingRate: Math.round(vendors.reduce((sum, v) => sum + v.preAward.awardingRate, 0) / total),
    totalProjectsOngoing: vendors.reduce((sum, v) => sum + v.preAward.projectsOngoing, 0),
    totalPackagesOngoing: vendors.reduce((sum, v) => sum + v.preAward.packagesOngoing, 0),
  }
}

export function getAggregatePostAwardKPIs() {
  const total = vendors.length
  return {
    totalChangeRequests: vendors.reduce((sum, v) => sum + v.postAward.changeRequestsCount, 0),
    totalChangeRequestsMontant: vendors.reduce((sum, v) => sum + v.postAward.changeRequestsMontant, 0),
    totalClaims: vendors.reduce((sum, v) => sum + v.postAward.claimsCount, 0),
    totalNcrQor: vendors.reduce((sum, v) => sum + v.postAward.ncrQorCount, 0),
    totalNcr: vendors.reduce((sum, v) => sum + v.postAward.ncrCount, 0),
    totalQor: vendors.reduce((sum, v) => sum + v.postAward.qorCount, 0),
    avgNcrClosureTime: Math.round(vendors.reduce((sum, v) => sum + v.postAward.ncrClosureTime, 0) / total),
    avgScoreClosed: (vendors.reduce((sum, v) => sum + v.postAward.averageScoreClosed, 0) / total).toFixed(1),
    avgDisciplineScores: {
      projectControl: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.projectControl, 0) / total),
      engineering: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.engineering, 0) / total),
      contract: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.contract, 0) / total),
      cAndC: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.cAndC, 0) / total),
      pmqc: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.pmqc, 0) / total),
      construction: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.construction, 0) / total),
      material: Math.round(vendors.reduce((sum, v) => sum + v.postAward.disciplineScores.material, 0) / total),
    },
    totalAvenants: vendors.reduce((sum, v) => sum + v.postAward.avenantCount, 0),
    avgAvenantPercentage: Math.round(vendors.reduce((sum, v) => sum + v.postAward.avenantPercentage, 0) / total),
    totalContracts: vendors.reduce((sum, v) => sum + v.postAward.contractsCount, 0),
    totalContractants: vendors.reduce((sum, v) => sum + v.postAward.contractantsCount, 0),
    avgReactivityLetters: (vendors.reduce((sum, v) => sum + v.postAward.reactivityLetters, 0) / total).toFixed(1),
    avgGuaranteeRenewalTime: Math.round(vendors.reduce((sum, v) => sum + v.postAward.guaranteeRenewalTime, 0) / total),
    totalConcessionRequests: vendors.reduce((sum, v) => sum + v.postAward.concessionRequests, 0),
  }
}

export function getAggregateMaterialKPIs() {
  const total = vendors.length
  return {
    avgOtifScore: Math.round(vendors.reduce((sum, v) => sum + v.materialManagement.otifScore, 0) / total),
    totalPlanned: vendors.reduce((sum, v) => sum + v.materialManagement.plannedVsActual.planned, 0),
    totalActual: vendors.reduce((sum, v) => sum + v.materialManagement.plannedVsActual.actual, 0),
    avgCompliancePercent: Math.round(vendors.reduce((sum, v) => sum + v.materialManagement.compliancePercent, 0) / total),
    avgQualityScore: Math.round(vendors.reduce((sum, v) => sum + v.materialManagement.qualityScore, 0) / total),
    avgNcrProcessFlow: Math.round(vendors.reduce((sum, v) => sum + v.materialManagement.ncrProcessFlow, 0) / total),
    avgFraisApproche: vendors.reduce((sum, v) => sum + v.materialManagement.fraisApproche, 0) / total,
    totalOsd: {
      over: vendors.reduce((sum, v) => sum + v.materialManagement.osdData.over, 0),
      short: vendors.reduce((sum, v) => sum + v.materialManagement.osdData.short, 0),
      damaged: vendors.reduce((sum, v) => sum + v.materialManagement.osdData.damaged, 0),
    },
    totalConformity: {
      conformant: vendors.reduce((sum, v) => sum + v.materialManagement.conformityData.conformant, 0),
      nonConformant: vendors.reduce((sum, v) => sum + v.materialManagement.conformityData.nonConformant, 0),
      pending: vendors.reduce((sum, v) => sum + v.materialManagement.conformityData.pending, 0),
    },
  }
}