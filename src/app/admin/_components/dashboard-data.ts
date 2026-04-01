"use client";

import { type LucideIcon } from "lucide-react";

export interface AnnualRevenuePoint {
  month: string;
  revenue: number;
  orders: number;
  festivalPeak: string | null;
}

export interface CustomerGroupMetric {
  group: string;
  revenue: number;
  orders: number;
  retentionRate: number;
  avgOrderValue: number;
  topProduct: string;
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

export interface DashboardStat {
  label: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  color: string;
}
