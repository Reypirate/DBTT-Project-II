"use client";

import {
  Crown,
  TrendingUp,
  Users,
  Users2,
  ShoppingBag,
  Flame,
  Video,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Cell, PieChart, Pie } from "recharts";
import { useMemo, useState } from "react";

type ProxyStatus = "pending" | "in-progress" | "completed";

interface ProxyVideoProof {
  id: string;
  completedAt: string;
  durationSeconds: number;
  proofNote: string;
}

interface ProxyQueueItem {
  id: string;
  customer: string;
  ancestor: string;
  date: string;
  bundle: string;
  status: ProxyStatus;
  videoProof: ProxyVideoProof;
}

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
} as const;

const INITIAL_PROXY_QUEUE: ProxyQueueItem[] = [
  {
    id: "PXY-001",
    customer: "Rey",
    ancestor: "Grandfather Lim",
    date: "2026-04-05",
    bundle: "Qingming Essential Kit",
    status: "pending",
    videoProof: {
      id: "VID-PXY-001",
      completedAt: "2026-04-05T10:15:00.000Z",
      durationSeconds: 94,
      proofNote: "Incense and joss sequence confirmed on altar table.",
    },
  },
  {
    id: "PXY-002",
    customer: "Sarah Tan",
    ancestor: "Grandmother Wong",
    date: "2026-04-12",
    bundle: "Everyday Deity Offering Set",
    status: "in-progress",
    videoProof: {
      id: "VID-PXY-002",
      completedAt: "2026-04-12T14:40:00.000Z",
      durationSeconds: 88,
      proofNote: "Fulfillment recording queued after offering completion.",
    },
  },
  {
    id: "PXY-003",
    customer: "James Lee",
    ancestor: "Father Lee",
    date: "2026-03-28",
    bundle: "7th Month Hungry Ghost Bundle",
    status: "completed",
    videoProof: {
      id: "VID-PXY-003",
      completedAt: "2026-03-28T18:05:00.000Z",
      durationSeconds: 112,
      proofNote: "Full burn sequence and completion bow captured end-to-end.",
    },
  },
];

export default function AdminDashboardPage() {
  const [proxyQueue, setProxyQueue] = useState<ProxyQueueItem[]>(INITIAL_PROXY_QUEUE);
  const [completingProxyIds, setCompletingProxyIds] = useState<Record<string, boolean>>({});
  const [videoReviewOpen, setVideoReviewOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [reviewingProxy, setReviewingProxy] = useState<ProxyQueueItem | null>(null);

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

  const weeklyRevenue = useMemo(
    () => revenueData.slice(-2).reduce((sum, month) => sum + month.revenue, 0),
    [],
  );

  const updateProxyStatus = (id: string, newStatus: ProxyStatus) => {
    setProxyQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
  };

  const completeProxyRequest = (id: string) => {
    setCompletingProxyIds((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => {
      updateProxyStatus(id, "completed");
      setCompletingProxyIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 1800);
  };

  const openVideoReview = (proxy: ProxyQueueItem) => {
    setReviewingProxy(proxy);
    setVideoReviewOpen(true);
    setIsVideoPlaying(false);
  };

  const statusColors: Record<ProxyStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    "in-progress": "bg-blue-100 text-blue-700 hover:bg-blue-100",
    completed: "bg-green-100 text-green-700 hover:bg-green-100",
  };

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="mb-10 pb-6 border-b border-neutral-main flex justify-between items-end">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-text-main mb-2">
              Owner Dashboard
            </h1>
            <p className="text-text-main/70">Performance overview</p>
          </div>
          <div className="text-sm font-medium text-text-main/60 bg-surface px-4 py-2 rounded-lg border border-neutral-main">
            Today: {new Date().toLocaleDateString("en-SG", { dateStyle: "long" })}
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag className="size-6" />
                </div>
                <span className="inline-flex text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main/60 mb-1">Active Preorders</p>
                <h3 className="font-playfair text-3xl font-bold text-text-main">
                  {proxyQueue.filter((item) => item.status !== "completed").length + 39}
                </h3>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <TrendingUp className="size-6" />
                </div>
                <span className="inline-flex text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +8.4%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main/60 mb-1">Weekly Revenue</p>
                <h3 className="font-playfair text-3xl font-bold text-text-main">
                  ${weeklyRevenue.toLocaleString()}
                </h3>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Users className="size-6" />
                </div>
                <span className="inline-flex text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +24 this week
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main/60 mb-1">Avg Segment Retention</p>
                <h3 className="font-playfair text-3xl font-bold text-text-main">
                  {averageRetentionRate}%
                </h3>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Crown className="size-6" />
                </div>
                <span className="inline-flex text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +15%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main/60 mb-1">Active Members</p>
                <h3 className="font-playfair text-3xl font-bold text-text-main">128</h3>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-2xl flex items-center gap-2">
                <Flame className="size-5 text-primary" />
                Proxy Service Queue
                <Badge className="ml-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-[10px]">
                  {proxyQueue.filter((p) => p.status !== "completed").length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proxyQueue.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface border border-neutral-main/30 rounded-xl"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-text-main">{request.id}</p>
                        <Badge className={`text-[9px] h-4 ${statusColors[request.status]}`}>
                          {request.status === "in-progress"
                            ? "In Progress"
                            : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-main/60">
                        <strong>{request.customer}</strong> -&gt; {request.ancestor} -{" "}
                        {request.bundle} -{" "}
                        {new Date(request.date).toLocaleDateString("en-SG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => updateProxyStatus(request.id, "in-progress")}
                        >
                          Start Fulfillment
                        </Button>
                      )}
                      {request.status === "in-progress" && (
                        <>
                          {!completingProxyIds[request.id] ? (
                            <Button
                              size="sm"
                              className="text-xs gap-1"
                              onClick={() => completeProxyRequest(request.id)}
                            >
                              <Video className="size-3" />
                              Mark as Complete
                            </Button>
                          ) : (
                            <div className="rounded-lg border border-green-200 bg-green-50 p-2 min-w-[210px]">
                              <div className="h-10 rounded bg-black/90 text-white text-[10px] flex items-center justify-center gap-1">
                                <Video className="size-3 animate-pulse" />
                                Simulating video playback...
                              </div>
                              <div className="mt-2 text-[10px] text-green-700 font-bold">
                                Finalizing completion...
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {request.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => openVideoReview(request)}
                        >
                          <Video className="size-3.5" />
                          Review Video
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Recent Preorders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-main/60 italic text-sm">
                  A full view is available in the Orders Management page.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Upcoming Ritual Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <h3 className="font-bold text-primary mb-2">Qingming Festival Approaching</h3>
                  <p className="text-sm text-text-main/80 mb-4">
                    Expected surge in bundle requests in 14 days based on your customer member base.
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/admin/inventory">Review Inventory</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8"
        >
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
            <CardContent className="p-6">
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
                            <stop offset="5%" stopColor={THEME_COLORS.primary} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={THEME_COLORS.primary} stopOpacity={0.0} />
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
                        config={{ sales: { label: "Total Sales", color: THEME_COLORS.secondary } }}
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
                            width={90}
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
                        <div className="pt-3 border-t border-neutral-main/10">
                          <Button
                            size="sm"
                            className="w-full bg-secondary hover:bg-secondary/90 text-white"
                            asChild
                          >
                            <Link href="/admin/forecast">View Forecast Model</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 pt-6 border-t border-neutral-main/10">
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
                          <XAxis dataKey="bundle" tickLine={false} axisLine={false} interval={0} />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value / 1000}k`}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar dataKey="revenue" fill={THEME_COLORS.chart1} radius={[6, 6, 0, 0]} />
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
                          <p className="text-xs text-text-main/60 line-clamp-1">{bundle.bundle}</p>
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
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8"
        >
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
            <CardContent className="p-6">
              <div className="flex flex-col gap-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-neutral-main/30 bg-surface p-5">
                    <p className="text-xs uppercase tracking-wider text-text-main/60">
                      Avg Retention Rate
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">{averageRetentionRate}%</p>
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
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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

                <div>
                  <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    Revenue Share by Segment
                  </h4>
                  <div className="h-[220px] w-full">
                    <ChartContainer
                      config={{
                        revenue: { label: "Revenue Share", color: THEME_COLORS.secondary },
                      }}
                      className="aspect-none h-full w-full"
                    >
                      <PieChart>
                        <Pie
                          data={customerGroupRevenueData}
                          dataKey="revenue"
                          nameKey="group"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {customerGroupRevenueData.map((_, index) => (
                            <Cell
                              key={`pie-cell-${index}`}
                              fill={GROUP_BAR_COLORS[index % GROUP_BAR_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-main/10">
                  <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    Purchasing Breakdown by Customer Group
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-neutral-main/20">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface text-text-main/60 text-xs uppercase tracking-wider">
                          <th className="p-3 text-left font-bold">Group</th>
                          <th className="p-3 text-right font-bold">Retention</th>
                          <th className="p-3 text-left font-bold">Top Product</th>
                          <th className="p-3 text-right font-bold">Orders</th>
                          <th className="p-3 text-right font-bold">Avg Order</th>
                          <th className="p-3 text-right font-bold">Revenue</th>
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
        </motion.div>

        <Dialog open={videoReviewOpen} onOpenChange={setVideoReviewOpen}>
          <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="font-playfair text-2xl">
                Proxy Fulfillment Video Review
              </DialogTitle>
            </DialogHeader>
            {reviewingProxy && (
              <div className="px-6 pb-6">
                <div className="rounded-xl overflow-hidden border border-neutral-main/30 bg-black">
                  <div className="aspect-video w-full bg-gradient-to-br from-neutral-900 to-neutral-700 flex flex-col justify-center items-center text-white relative">
                    <Video className="size-16 opacity-30 mb-3" />
                    <p className="text-sm font-medium">
                      Mock Playback Stream: {reviewingProxy.videoProof.id}
                    </p>
                    <p className="text-xs text-white/75 mt-1">{reviewingProxy.bundle}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                      <div
                        className={`h-full ${
                          isVideoPlaying
                            ? "w-2/3 bg-green-400 transition-all duration-1000"
                            : "w-1/4 bg-white/70 transition-all duration-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-neutral-main/30 bg-surface p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Order:</span> {reviewingProxy.id}
                  </p>
                  <p>
                    <span className="font-semibold">Customer:</span> {reviewingProxy.customer}
                  </p>
                  <p>
                    <span className="font-semibold">Ancestor:</span> {reviewingProxy.ancestor}
                  </p>
                  <p>
                    <span className="font-semibold">Completed:</span>{" "}
                    {new Date(reviewingProxy.videoProof.completedAt).toLocaleString("en-SG")}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span>{" "}
                    {reviewingProxy.videoProof.durationSeconds}s
                  </p>
                  <p>
                    <span className="font-semibold">Proof Note:</span>{" "}
                    {reviewingProxy.videoProof.proofNote}
                  </p>
                </div>

                <DialogFooter className="mt-5">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setIsVideoPlaying((prev) => !prev)}
                  >
                    {isVideoPlaying ? (
                      <>
                        <Pause className="size-4" />
                        Pause Review
                      </>
                    ) : (
                      <>
                        <Play className="size-4" />
                        Play Review
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setVideoReviewOpen(false);
                      setIsVideoPlaying(false);
                    }}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
