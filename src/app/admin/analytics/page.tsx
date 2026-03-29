"use client";

import {
  TrendingUp,
  Users2,
  RotateCcw,
  TrendingDown,
  Minus,
  ArrowUpRight,
  Activity,
  Download,
  AlertCircle,
  ShoppingBag,
  PieChart,
  Target,
  Megaphone,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_INVENTORY } from "@/data/products";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Cell, ComposedChart, Line } from "recharts";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useMemo, useState, useEffect } from "react";

interface AnnualRevenuePoint {
  month: string;
  revenue: number;
  orders: number;
  festivalPeak: string | null;
}

interface BundlePerformanceMetric {
  bundle: string;
  revenue: number;
  sales: number;
  views: number;
  orders: number;
  conversionRate: number;
}

interface CustomerGroupMetric {
  group: string;
  revenue: number;
  orders: number;
  retentionRate: number;
  avgOrderValue: number;
  topProduct: string;
}

interface PeakSeasonForecast {
  season: string;
  focusItem: string;
  demandLiftPercent: number;
  daysUntil: number;
  confidencePercent: number;
}

interface ProxyCapacityPoint {
  date: string;
  projectedRequests: number;
  capacityLimit: number;
}

interface PropensityCohort {
  cohort: string;
  frequency: string;
  users: number;
  probability: number;
}

interface CartGapOpportunity {
  dialectGroup: string;
  baseProduct: string;
  missingProduct: string;
  affectedOrders: number;
  potentialRevenue: number;
}

interface AgeDemographicMetric {
  bracket: string;
  proxyBookings: number;
  diyBundles: number;
  memberships: number;
}

const THEME_COLORS = {
  primary: "var(--color-primary, #8b1e2d)",
  secondary: "var(--color-secondary, #b8921d)",
  chart1: "var(--color-chart-1, #4f46e5)",
  chart2: "var(--color-chart-2, #0f766e)",
  chart3: "var(--color-chart-3, #92400e)",
  chart4: "var(--color-chart-4, #1d4ed8)",
  chart5: "var(--color-chart-5, #6b7280)",
} as const;

const revenueData: AnnualRevenuePoint[] = [
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

const bundlePerformanceData: BundlePerformanceMetric[] = [
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

const topBundleSalesData = bundlePerformanceData
  .map((bundle) => ({ sales: bundle.sales, label: bundle.bundle.replace(" Bundle", "") }))
  .sort((a, b) => b.sales - a.sales);

const revenuePerBundleData = bundlePerformanceData.map((bundle) => ({
  bundle: bundle.bundle.replace(" Bundle", ""),
  revenue: bundle.revenue,
}));

const customerGroupRevenueData: CustomerGroupMetric[] = [
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

const peakSeasonForecastData: PeakSeasonForecast[] = [
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

const proxyCapacityData: ProxyCapacityPoint[] = [
  { date: "T-7", projectedRequests: 40, capacityLimit: 120 },
  { date: "T-6", projectedRequests: 65, capacityLimit: 120 },
  { date: "T-5", projectedRequests: 85, capacityLimit: 120 },
  { date: "T-4", projectedRequests: 110, capacityLimit: 120 },
  { date: "T-3", projectedRequests: 128, capacityLimit: 120 },
  { date: "T-2", projectedRequests: 145, capacityLimit: 120 },
  { date: "T-1", projectedRequests: 155, capacityLimit: 120 },
];

const propensityData: PropensityCohort[] = [
  { cohort: "Highly Engaged", frequency: "4+ Orders", users: 18, probability: 92 },
  { cohort: "Active", frequency: "3 Orders", users: 34, probability: 85 },
  { cohort: "Occasional", frequency: "2 Orders", users: 89, probability: 45 },
  { cohort: "One-Time", frequency: "1 Order", users: 312, probability: 12 },
];

const cartGapData: CartGapOpportunity[] = [
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

const ageDemographicData: AgeDemographicMetric[] = [
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

const GROUP_BAR_COLORS = [
  THEME_COLORS.primary,
  THEME_COLORS.secondary,
  THEME_COLORS.chart1,
  THEME_COLORS.chart2,
  THEME_COLORS.chart3,
  THEME_COLORS.chart4,
  THEME_COLORS.chart5,
  "var(--color-muted-foreground, #9ca3af)",
];

const chartConfig = {
  revenue: { label: "Revenue ($)", color: THEME_COLORS.primary },
  orders: { label: "Orders Count", color: THEME_COLORS.secondary },
} satisfies ChartConfig;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

export default function DeepAnalyticsPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const averageRetentionRate = useMemo(
    () =>
      Math.round(
        customerGroupRevenueData.reduce((sum, group) => sum + group.retentionRate, 0) /
          customerGroupRevenueData.length,
      ),
    [],
  );

  const topRetentionSegment = useMemo(
    () =>
      customerGroupRevenueData.reduce((best, current) =>
        current.retentionRate > best.retentionRate ? current : best,
      ),
    [],
  );

  const topSurgingProducts = useMemo(() => {
    return MOCK_INVENTORY.filter((item) => item.trend === "up")
      .sort((a, b) => b.projectedDemand - a.projectedDemand)
      .slice(0, 5);
  }, []);

  const handleExportCSV = () => {
    // Inventory Velocity Block
    const invHeaders = ["Inventory Tracker", "", "", "", "", "", ""];
    const invCols = [
      "ID",
      "Product Name",
      "Category",
      "Stock",
      "Velocity (Wk)",
      "Demand Trend",
      "Projected Demand (%)",
    ];
    const invRows = MOCK_INVENTORY.sort((a, b) => b.velocity - a.velocity).map((item) => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      item.stock,
      item.velocity,
      item.trend,
      item.projectedDemand,
    ]);

    // Revenue Trends Block
    const revHeaders = ["Annual Revenue & Orders", "", "", ""];
    const revCols = ["Month", "Revenue", "Orders", "Festival Peak"];
    const revRows = revenueData.map((data) => [
      data.month,
      data.revenue,
      data.orders,
      data.festivalPeak || "None",
    ]);

    // Proxy Capacity Block
    const capHeaders = ["Proxy Capacity Forecasting", "", ""];
    const capCols = ["Date", "Projected Requests", "Capacity Limit"];
    const capRows = proxyCapacityData.map((data) => [
      data.date,
      data.projectedRequests,
      data.capacityLimit,
    ]);

    // Propensity Block
    const propHeaders = ["Membership Propensity", "", "", ""];
    const propCols = ["Cohort", "Frequency", "Users", "Probability (%)"];
    const propRows = propensityData.map((data) => [
      data.cohort,
      data.frequency,
      data.users,
      data.probability,
    ]);

    // Cart Gaps Block
    const gapsHeaders = ["Cultural Cart-Gaps", "", "", "", ""];
    const gapsCols = [
      "Dialect Group",
      "Base Product",
      "Missing Product",
      "Affected Orders",
      "Potential Revenue",
    ];
    const gapsRows = cartGapData.map((data) => [
      data.dialectGroup,
      `"${data.baseProduct}"`,
      `"${data.missingProduct}"`,
      data.affectedOrders,
      data.potentialRevenue,
    ]);

    const csvContent = [
      invHeaders.join(","),
      invCols.join(","),
      ...invRows.map((r) => r.join(",")),
      "",
      revHeaders.join(","),
      revCols.join(","),
      ...revRows.map((r) => r.join(",")),
      "",
      capHeaders.join(","),
      capCols.join(","),
      ...capRows.map((r) => r.join(",")),
      "",
      propHeaders.join(","),
      propCols.join(","),
      ...propRows.map((r) => r.join(",")),
      "",
      gapsHeaders.join(","),
      gapsCols.join(","),
      ...gapsRows.map((r) => r.join(",")),
    ];

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `hinlong_deep_analytics_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-neutral-main pb-6">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-text-main mb-2">Deep Analytics</h1>
            <p className="text-text-main/70">Business intelligence and seasonal trends</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2 font-bold whitespace-nowrap bg-surface border-neutral-main hidden sm:flex"
            >
              <Download className="size-4" /> Export CSV
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Back to Overview</Link>
            </Button>
            <div className="text-sm font-medium text-text-main/60 bg-surface px-4 py-2 rounded-lg border border-neutral-main flex items-center hidden md:flex">
              YTD: {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {!hasMounted ? (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-text-main/60 font-medium font-playfair animate-pulse">
                Synchronizing Analytics Data...
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 border-primary/20 bg-primary/5 col-span-1 lg:col-span-2 flex flex-col h-full gap-6">
                <div className="flex items-start md:items-center gap-4 w-full shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Activity className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-text-main mb-1">
                      Surging Product Demand
                    </h3>
                    <p className="text-sm text-text-main/70">
                      High-velocity items requiring immediate restocking attention based on
                      projected forecast.
                    </p>
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between py-2">
                  {topSurgingProducts.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between group hover:bg-primary/5 p-2 rounded-lg transition-colors"
                    >
                      <span className="font-medium text-text-main group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                      <Badge className="bg-primary hover:bg-primary/90 text-white font-medium py-1 px-3 flex items-center gap-2">
                        <ArrowUpRight className="size-3 text-white/80" /> +{item.projectedDemand}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 flex flex-col h-full border-secondary/30 bg-secondary/5 col-span-1">
                <div className="flex flex-col gap-4 h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="size-5 text-secondary" />
                      <h3 className="font-playfair text-lg font-bold text-text-main">
                        Cart-Gap Analysis
                      </h3>
                    </div>
                    <p className="text-[11px] text-text-main/70">
                      Missed cross-sell opportunities based on dialect grouping logic.
                    </p>
                  </div>
                  <div className="space-y-3 flex-grow overflow-auto">
                    {cartGapData.map((gap, i) => (
                      <div key={i} className="text-xs border-l-2 border-secondary/40 pl-3">
                        <span className="font-bold text-text-main">{gap.missingProduct}</span>{" "}
                        missed in {gap.affectedOrders} orders{" "}
                        <span className="opacity-70">({gap.dialectGroup})</span>
                        <div className="text-secondary font-medium mt-0.5">
                          +${gap.potentialRevenue.toFixed(2)} potential MRR
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2 pt-4 border-t border-neutral-main/10">
                    <Button size="sm" className="w-full text-[10px] h-7 px-2" variant="outline">
                      Auto-Upsell
                    </Button>
                    <Button size="sm" className="w-full text-[10px] h-7 px-2" variant="outline">
                      SMS Reminder
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-playfair text-2xl flex items-center gap-2">
                  <TrendingUp className="size-5 text-secondary" />
                  Operational Analytics
                </CardTitle>
                <p className="text-sm text-text-main/60">
                  Monthly revenue and seasonal demand aggregates.
                </p>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="flex flex-col gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Annual Revenue Trend & Festival Peaks
                    </h4>
                    <div className="h-[240px] w-full">
                      <ChartContainer config={chartConfig} className="aspect-none h-full w-full">
                        <AreaChart
                          data={revenueData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor={THEME_COLORS.primary}
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor={THEME_COLORS.primary}
                                stopOpacity={0.0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="text-[11px] text-text-main/60"
                          />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Area
                            dataKey="revenue"
                            type="monotone"
                            fill="url(#revenueGrad)"
                            stroke={THEME_COLORS.primary}
                            strokeWidth={2.5}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-neutral-main/10">
                    <div>
                      <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        Top Product Bundles
                      </h4>
                      <div className="h-[180px]">
                        <ChartContainer
                          config={{
                            sales: { label: "Total Sales", color: THEME_COLORS.secondary },
                          }}
                          className="aspect-none h-full w-full"
                        >
                          <BarChart
                            data={topBundleSalesData}
                            layout="vertical"
                            margin={{ left: 0, right: 10, top: 0, bottom: 0 }}
                          >
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="label"
                              type="category"
                              tickLine={false}
                              axisLine={false}
                              className="text-[10px] text-text-main/60"
                              width={110}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                              dataKey="sales"
                              fill={THEME_COLORS.secondary}
                              radius={[0, 4, 4, 0]}
                              barSize={20}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Peak Season Forecast
                      </h4>
                      <div className="bg-surface border border-neutral-main/20 rounded-xl p-5 h-full flex flex-col justify-center">
                        <div className="space-y-4">
                          {peakSeasonForecastData.map((forecast) => (
                            <div key={forecast.season} className="space-y-1">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-text-main/70">{forecast.season}</span>
                                <span className="font-bold text-secondary">
                                  +{forecast.demandLiftPercent}% Demand
                                </span>
                              </div>
                              <div className="text-xs text-text-main/60">
                                {forecast.focusItem} {forecast.daysUntil} days{" "}
                                {forecast.confidencePercent}% confidence
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-2 border-t border-neutral-main/10">
                    <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      Proxy Capacity Risk Forecasting
                    </h4>
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="h-[220px] w-full">
                        <ChartContainer
                          config={{
                            requests: { label: "Projected", color: THEME_COLORS.primary },
                            capacity: { label: "Limit", color: "#ef4444" },
                          }}
                          className="aspect-none h-full w-full"
                        >
                          <ComposedChart
                            data={proxyCapacityData}
                            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                          >
                            <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              className="text-[11px] text-text-main/60"
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Area
                              dataKey="projectedRequests"
                              type="monotone"
                              fill={THEME_COLORS.primary}
                              fillOpacity={0.15}
                              stroke={THEME_COLORS.primary}
                              strokeWidth={2}
                            />
                            <Line
                              dataKey="capacityLimit"
                              type="step"
                              stroke="#ef4444"
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              dot={false}
                            />
                          </ComposedChart>
                        </ChartContainer>
                      </div>
                      <div>
                        <Alert variant="destructive" className="bg-red-50/50 border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle className="text-sm font-bold">Capacity Warning</AlertTitle>
                          <AlertDescription className="text-[12px] mt-2 text-red-900/80 leading-relaxed">
                            Projected proxy requests for Qingming week exceed operational capacity
                            by 15%. Recommend immediate intervention to prevent fulfillment
                            bottlenecks.
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 text-[11px] px-4 sm:w-auto"
                              >
                                Cap Pre-orders
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-[11px] px-4 sm:w-auto border-red-200 text-red-800 bg-white hover:bg-red-50"
                              >
                                Request Temp Staff
                              </Button>
                            </div>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8 pt-8 mt-2 border-t border-neutral-main/10">
                    <div>
                      <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Revenue per Bundle
                      </h4>
                      <div className="h-[220px] w-full">
                        <ChartContainer
                          config={{ revenue: { label: "Revenue", color: THEME_COLORS.chart1 } }}
                          className="aspect-none h-full w-full"
                        >
                          <BarChart data={revenuePerBundleData} margin={{ left: 0, right: 8 }}>
                            <XAxis
                              dataKey="bundle"
                              tickLine={false}
                              axisLine={false}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              tick={{ fontSize: 10 }}
                              dx={-5}
                              dy={5}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                              dataKey="revenue"
                              fill={THEME_COLORS.chart1}
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                        <RotateCcw className="size-4 text-secondary" />
                        Conversion Rate per Bundle
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {bundlePerformanceData.slice(0, 4).map((bundle) => (
                          <div
                            key={bundle.bundle}
                            className="rounded-xl border border-neutral-main/30 bg-surface p-4"
                          >
                            <p className="text-xs text-text-main/60 line-clamp-1">
                              {bundle.bundle}
                            </p>
                            <p className="text-2xl font-bold text-primary mt-1">
                              {bundle.conversionRate.toFixed(2)}%
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-text-main/60">
                              <span>{bundle.orders} orders</span>
                              <span>{bundle.views} views</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-playfair text-2xl flex items-center gap-2">
                  <Target className="size-5 text-primary" />
                  Demographic Intelligence
                </CardTitle>
                <p className="text-sm text-text-main/60">
                  Purchasing behaviors and service preference segmented by age bracket.
                </p>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="flex flex-col gap-10">
                  <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className="h-[280px] w-full">
                      <ChartContainer
                        config={{
                          proxyBookings: { label: "Proxy Bookings", color: THEME_COLORS.primary },
                          diyBundles: { label: "DIY Bundles", color: THEME_COLORS.secondary },
                          memberships: { label: "Memberships", color: THEME_COLORS.chart1 },
                        }}
                        className="aspect-none h-full w-full"
                      >
                        <BarChart
                          data={ageDemographicData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <XAxis
                            dataKey="bracket"
                            tickLine={false}
                            axisLine={false}
                            className="text-[10px] sm:text-[11px]"
                          />
                          <YAxis tickLine={false} axisLine={false} className="text-[11px]" />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="proxyBookings"
                            stackId="a"
                            fill={THEME_COLORS.primary}
                            radius={[0, 0, 0, 0]}
                            barSize={40}
                          />
                          <Bar
                            dataKey="diyBundles"
                            stackId="a"
                            fill={THEME_COLORS.secondary}
                            radius={[0, 0, 0, 0]}
                          />
                          <Bar
                            dataKey="memberships"
                            stackId="a"
                            fill={THEME_COLORS.chart1}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>

                    <div className="space-y-6">
                      <Alert className="bg-primary/5 border-primary/20">
                        <Megaphone className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-sm font-bold text-primary">
                          Generational Shift
                        </AlertTitle>
                        <AlertDescription className="text-xs mt-1.5 text-text-main/80 leading-relaxed">
                          Millennials and Gen Z account for{" "}
                          <strong>65% of all Proxy Service bookings</strong>, indicating a strong
                          preference for "Done-For-You" convenience over DIY rituals.
                        </AlertDescription>
                      </Alert>

                      <div className="p-5 border border-neutral-main/20 rounded-xl bg-surface">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-text-main/50 mb-4">
                          Strategic Marketing Responses
                        </p>
                        <div className="flex flex-col gap-3">
                          <Button
                            variant="outline"
                            className="justify-start gap-3 h-11 border-neutral-main/30 hover:bg-primary/5 hover:text-primary transition-all group"
                          >
                            <Target className="size-4 opacity-50 group-hover:opacity-100" />
                            <span className="text-xs font-semibold">
                              Run "Convenience" Ads (Ages 18-40)
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start gap-3 h-11 border-neutral-main/30 hover:bg-secondary/5 hover:text-secondary transition-all group"
                          >
                            <RotateCcw className="size-4 opacity-50 group-hover:opacity-100" />
                            <span className="text-xs font-semibold">
                              Launch "How-To" Ritual Email Series
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-playfair text-2xl flex items-center gap-2">
                  <Users2 className="size-5 text-primary" />
                  Customer Group Analytics
                </CardTitle>
                <p className="text-sm text-text-main/60">
                  Revenue, retention, and purchasing patterns segmented by customer group.
                </p>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="flex flex-col gap-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-neutral-main/30 bg-surface p-5">
                      <p className="text-xs uppercase tracking-wider text-text-main/60">
                        Avg Retention Rate
                      </p>
                      <p className="text-3xl font-bold text-primary mt-1">
                        {averageRetentionRate}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-neutral-main/30 bg-surface p-5">
                      <p className="text-xs uppercase tracking-wider text-text-main/60">
                        Top Retained Segment
                      </p>
                      <p className="text-3xl font-bold text-primary mt-1">
                        {topRetentionSegment.group}
                      </p>
                      <p className="text-xs text-text-main/60 mt-1">
                        {topRetentionSegment.retentionRate}% returning customers
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Revenue by Customer Group
                    </h4>
                    <div className="h-[240px] w-full">
                      <ChartContainer
                        config={{ revenue: { label: "Revenue ($)", color: THEME_COLORS.chart3 } }}
                        className="aspect-none h-full w-full"
                      >
                        <BarChart data={customerGroupRevenueData} margin={{ left: 4, right: 20 }}>
                          <XAxis dataKey="group" tickLine={false} axisLine={false} />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            className="text-[11px] text-text-main/60"
                            tickFormatter={(value) => `$${value / 1000}k`}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={22}>
                            {customerGroupRevenueData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={GROUP_BAR_COLORS[index % GROUP_BAR_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>

                  <div className="pt-8 mt-2 border-t border-neutral-main/10">
                    <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      Membership Upgrade Propensity
                    </h4>
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="h-[220px] w-full">
                        <ChartContainer
                          config={{
                            probability: {
                              label: "Conversion Prob (%)",
                              color: THEME_COLORS.secondary,
                            },
                          }}
                          className="aspect-none h-full w-full"
                        >
                          <BarChart
                            data={propensityData}
                            layout="vertical"
                            margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
                          >
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="cohort"
                              type="category"
                              tickLine={false}
                              axisLine={false}
                              className="text-[11px] font-medium text-text-main/70"
                              width={100}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar
                              dataKey="probability"
                              fill={THEME_COLORS.secondary}
                              radius={[0, 4, 4, 0]}
                              barSize={28}
                            >
                              {propensityData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    index < 2
                                      ? THEME_COLORS.secondary
                                      : "var(--color-muted-foreground)"
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </div>
                      <div>
                        <div className="bg-surface border border-secondary/30 rounded-xl p-6 shadow-sm">
                          <div className="flex items-start gap-4 mb-5">
                            <PieChart className="size-6 text-secondary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-text-main text-sm leading-relaxed">
                                34 non-members have purchased 3+ remembrance bundles this year.
                              </p>
                              <p className="text-xs text-secondary font-bold mt-1.5 flex items-center gap-1.5 w-fit bg-secondary/10 px-2 py-1 rounded">
                                <TrendingUp className="size-3" /> 85% conversion probability
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 border-t border-neutral-main/10 pt-5">
                            <Button
                              size="sm"
                              className="h-9 text-xs px-4 sm:w-auto bg-secondary hover:bg-secondary/90 text-white shadow-sm"
                            >
                              Deploy Target Discount
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 text-xs px-4 sm:w-auto border-neutral-main/40"
                            >
                              Export Target List
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-2 border-t border-neutral-main/10">
                    <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      Purchasing Breakdown by Customer Group
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-neutral-main/20">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface text-text-main/60 text-xs uppercase tracking-wider">
                            <th className="p-3 text-left font-bold w-1/4">Group</th>
                            <th className="p-3 text-right font-bold w-1/6">Retention</th>
                            <th className="p-3 text-left font-bold min-w-[200px]">Top Product</th>
                            <th className="p-3 text-right font-bold w-[100px]">Orders</th>
                            <th className="p-3 text-right font-bold w-[100px]">Avg Order</th>
                            <th className="p-3 text-right font-bold w-1/6">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-main/10">
                          {customerGroupRevenueData.map((item) => (
                            <tr key={item.group} className="hover:bg-surface/50 transition-colors">
                              <td className="p-3 font-bold text-text-main">{item.group}</td>
                              <td className="p-3 text-right font-semibold text-secondary">
                                {item.retentionRate}%
                              </td>
                              <td className="p-3 text-text-main/70">{item.topProduct}</td>
                              <td className="p-3 text-right font-medium text-text-main">
                                {item.orders}
                              </td>
                              <td className="p-3 text-right font-medium text-text-main">
                                ${item.avgOrderValue.toFixed(2)}
                              </td>
                              <td className="p-3 text-right font-bold text-primary">
                                ${item.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-playfair text-2xl flex items-center gap-2">
                  <Activity className="size-5 text-secondary" />
                  Product Velocity & Demand Tracker
                </CardTitle>
                <p className="text-sm text-text-main/60">
                  Granular sales velocity and predicted demand changes for individual SKU
                  components.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-xl border border-neutral-main/20">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface border-b border-neutral-main/20 text-text-main/60 text-xs uppercase tracking-wider">
                        <th className="p-4 text-left font-bold min-w-[220px]">Product Name</th>
                        <th className="p-4 text-left font-bold">Category</th>
                        <th className="p-4 text-right font-bold">Stock</th>
                        <th className="p-4 text-right font-bold text-secondary">Velocity (Wk)</th>
                        <th className="p-4 text-right font-bold text-primary">Demand Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-main/10">
                      {MOCK_INVENTORY.sort((a, b) => b.velocity - a.velocity).map((item) => (
                        <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-text-main">{item.name}</p>
                            <p className="text-[10px] text-text-main/50">{item.id}</p>
                          </td>
                          <td className="p-4 text-text-main/80 font-medium">{item.category}</td>
                          <td className="p-4 text-right">
                            <span
                              className={`font-bold ${item.stock <= item.threshold ? "text-red-600" : "text-text-main"}`}
                            >
                              {item.stock}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-text-main">
                            {item.velocity} units
                          </td>
                          <td className="p-4 text-right font-medium flex items-center justify-end gap-2">
                            {item.trend === "up" ? (
                              <span className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded border border-green-200">
                                <TrendingUp className="size-3.5" /> +{item.projectedDemand}%
                              </span>
                            ) : item.trend === "down" ? (
                              <span className="flex items-center gap-1.5 text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200">
                                <TrendingDown className="size-3.5" /> {item.projectedDemand}%
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-text-main/60 font-bold bg-surface px-2.5 py-1 rounded border border-neutral-main/30">
                                <Minus className="size-3.5" /> Flat
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
