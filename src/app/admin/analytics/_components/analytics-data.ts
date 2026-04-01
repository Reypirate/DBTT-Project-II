"use client";

import { THEME_COLORS } from "./theme-colors";
export { THEME_COLORS };

export interface AnnualRevenuePoint {
  month: string;
  revenue: number;
  orders: number;
  festivalPeak: string | null;
}

export interface BundlePerformanceMetric {
  bundle: string;
  revenue: number;
  sales: number;
  views: number;
  orders: number;
  conversionRate: number;
}

export interface CustomerGroupMetric {
  group: string;
  revenue: number;
  orders: number;
  retentionRate: number;
  avgOrderValue: number;
  topProduct: string;
}

export interface PeakSeasonForecast {
  season: string;
  focusItem: string;
  demandLiftPercent: number;
  daysUntil: number;
  confidencePercent: number;
}

export interface ProxyCapacityPoint {
  date: string;
  projectedRequests: number;
  capacityLimit: number;
}

export interface PropensityCohort {
  cohort: string;
  frequency: string;
  users: number;
  probability: number;
}

export interface CartGapOpportunity {
  dialectGroup: string;
  baseProduct: string;
  missingProduct: string;
  affectedOrders: number;
  potentialRevenue: number;
}

export interface AgeDemographicMetric {
  bracket: string;
  proxyBookings: number;
  diyBundles: number;
  memberships: number;
}

export interface BundleDemand {
  bundleName: string;
  currentDemand: number;
  projectedGrowth: number;
}

export interface GeographicSegment {
  segment: string;
  totalCustomers: number;
  avgOrderValue: number;
  retentionRate: number;
}

export const revenueData: AnnualRevenuePoint[] = [
  { month: "Jan", revenue: 4200, orders: 45, festivalPeak: null },
  { month: "Feb", revenue: 5800, orders: 52, festivalPeak: "CNY" },
  { month: "Mar", revenue: 3500, orders: 38, festivalPeak: null },
  { month: "Apr", revenue: 8900, orders: 94, festivalPeak: "Qingming" },
  { month: "May", revenue: 4100, orders: 42, festivalPeak: null },
  { month: "Jun", revenue: 4300, orders: 44, festivalPeak: null },
  { month: "Jul", revenue: 4700, orders: 48, festivalPeak: null },
  { month: "Aug", revenue: 9200, orders: 98, festivalPeak: "Ghost Month" },
  { month: "Sep", revenue: 5100, orders: 55, festivalPeak: null },
  { month: "Oct", revenue: 4400, orders: 40, festivalPeak: null },
  { month: "Nov", revenue: 4200, orders: 41, festivalPeak: null },
  { month: "Dec", revenue: 5500, orders: 60, festivalPeak: "Winter Prayers" },
];

export const bundlePerformanceData: BundlePerformanceMetric[] = [
  {
    bundle: "Qingming Essential Kit",
    revenue: 18400,
    sales: 240,
    views: 1840,
    orders: 240,
    conversionRate: 13.04,
  },
  {
    bundle: "7th Month Hungry Ghost Bundle",
    revenue: 14600,
    sales: 210,
    views: 1650,
    orders: 210,
    conversionRate: 12.73,
  },
  {
    bundle: "Everyday Deity Offering Set",
    revenue: 12300,
    sales: 180,
    views: 1580,
    orders: 180,
    conversionRate: 11.39,
  },
  {
    bundle: "Respect Bundle",
    revenue: 9800,
    sales: 145,
    views: 1290,
    orders: 145,
    conversionRate: 11.24,
  },
  {
    bundle: "CNY Wealth & Prosperity Set",
    revenue: 8600,
    sales: 118,
    views: 970,
    orders: 118,
    conversionRate: 12.16,
  },
];

export const topBundleSalesData = bundlePerformanceData
  .map((bundle) => ({ sales: bundle.sales, label: bundle.bundle.replace(" Bundle", "") }))
  .sort((a, b) => b.sales - a.sales);

export const revenuePerBundleData = bundlePerformanceData.map((bundle) => ({
  bundle: bundle.bundle.replace(" Bundle", ""),
  revenue: bundle.revenue,
}));

export const customerGroupRevenueData: CustomerGroupMetric[] = [
  {
    group: "Hokkien",
    revenue: 18400,
    orders: 192,
    retentionRate: 71,
    avgOrderValue: 95.83,
    topProduct: "Qingming Essential Kit",
  },
  {
    group: "Taoist",
    revenue: 14600,
    orders: 141,
    retentionRate: 68,
    avgOrderValue: 103.55,
    topProduct: "Everyday Deity Offering Set",
  },
  {
    group: "Teochew",
    revenue: 12300,
    orders: 128,
    retentionRate: 64,
    avgOrderValue: 96.09,
    topProduct: "Everyday Deity Offering Set",
  },
  {
    group: "Cantonese",
    revenue: 9800,
    orders: 98,
    retentionRate: 58,
    avgOrderValue: 100,
    topProduct: "7th Month Hungry Ghost Bundle",
  },
  {
    group: "Hakka",
    revenue: 5600,
    orders: 56,
    retentionRate: 52,
    avgOrderValue: 100,
    topProduct: "Respect Bundle",
  },
  {
    group: "Hainanese",
    revenue: 3200,
    orders: 34,
    retentionRate: 44,
    avgOrderValue: 94.12,
    topProduct: "Sandalwood Incense",
  },
  {
    group: "Other",
    revenue: 2100,
    orders: 22,
    retentionRate: 39,
    avgOrderValue: 95.45,
    topProduct: "Qingming Essential Kit",
  },
  {
    group: "None",
    revenue: 1800,
    orders: 20,
    retentionRate: 28,
    avgOrderValue: 90,
    topProduct: "Daily Devotion Set",
  },
];

export const peakSeasonForecastData: PeakSeasonForecast[] = [
  {
    season: "Qingming Cycle",
    focusItem: "Qingming Essential Kit",
    demandLiftPercent: 120,
    daysUntil: 14,
    confidencePercent: 89,
  },
  {
    season: "Hungry Ghost Cycle",
    focusItem: "7th Month Hungry Ghost Bundle",
    demandLiftPercent: 105,
    daysUntil: 41,
    confidencePercent: 84,
  },
  {
    season: "Lunar Year-End",
    focusItem: "CNY Wealth & Prosperity Set",
    demandLiftPercent: 72,
    daysUntil: 92,
    confidencePercent: 76,
  },
];

export const proxyCapacityData: ProxyCapacityPoint[] = [
  { date: "T-7", projectedRequests: 40, capacityLimit: 120 },
  { date: "T-6", projectedRequests: 65, capacityLimit: 120 },
  { date: "T-5", projectedRequests: 85, capacityLimit: 120 },
  { date: "T-4", projectedRequests: 110, capacityLimit: 120 },
  { date: "T-3", projectedRequests: 128, capacityLimit: 120 },
  { date: "T-2", projectedRequests: 145, capacityLimit: 120 },
  { date: "T-1", projectedRequests: 155, capacityLimit: 120 },
];

export const propensityData: PropensityCohort[] = [
  { cohort: "Highly Engaged", frequency: "4+ Orders", users: 18, probability: 92 },
  { cohort: "Active", frequency: "3 Orders", users: 34, probability: 85 },
  { cohort: "Occasional", frequency: "2 Orders", users: 89, probability: 45 },
  { cohort: "One-Time", frequency: "1 Order", users: 312, probability: 12 },
];

export const cartGapData: CartGapOpportunity[] = [
  {
    dialectGroup: "Teochew",
    baseProduct: "Hungry Ghost Bundle",
    missingProduct: "Sugar Pagodas",
    affectedOrders: 12,
    potentialRevenue: 360,
  },
  {
    dialectGroup: "Hokkien",
    baseProduct: "Everyday Deity Offering Set",
    missingProduct: "Premium Gold Joss Paper",
    affectedOrders: 45,
    potentialRevenue: 247.5,
  },
  {
    dialectGroup: "Cantonese",
    baseProduct: "Qingming Essential Kit",
    missingProduct: "Paper Ancestor Clothing",
    affectedOrders: 28,
    potentialRevenue: 504,
  },
];

export const ageDemographicData: AgeDemographicMetric[] = [
  {
    bracket: "Gen Z (18-24)",
    proxyBookings: 85,
    diyBundles: 15,
    memberships: 40,
  },
  {
    bracket: "Millennials (25-40)",
    proxyBookings: 120,
    diyBundles: 45,
    memberships: 78,
  },
  {
    bracket: "Gen X (41-55)",
    proxyBookings: 40,
    diyBundles: 110,
    memberships: 55,
  },
  {
    bracket: "Seniors (56+)",
    proxyBookings: 12,
    diyBundles: 195,
    memberships: 32,
  },
];

export const bundleDemandData: BundleDemand[] = [
  { bundleName: "Qingming Essential Kit", currentDemand: 450, projectedGrowth: 45 },
  { bundleName: "Hungry Ghost Bundle", currentDemand: 380, projectedGrowth: 28 },
  { bundleName: "New House Bundle", currentDemand: 210, projectedGrowth: 15 },
  { bundleName: "Ancestral Veneration Kit", currentDemand: 190, projectedGrowth: 10 },
  { bundleName: "Daily Devotion Set", currentDemand: 150, projectedGrowth: 5 },
];

export const geographicData: GeographicSegment[] = [
  {
    segment: "Local (Singapore)",
    totalCustomers: 1240,
    avgOrderValue: 85.5,
    retentionRate: 42,
  },
  {
    segment: "Overseas",
    totalCustomers: 530,
    avgOrderValue: 141.2,
    retentionRate: 65,
  },
];

export const GROUP_BAR_COLORS = [
  THEME_COLORS.primary,
  THEME_COLORS.secondary,
  THEME_COLORS.chart1,
  THEME_COLORS.chart2,
  THEME_COLORS.chart3,
  THEME_COLORS.chart4,
  THEME_COLORS.chart5,
  "var(--color-muted-foreground, #9ca3af)",
];
