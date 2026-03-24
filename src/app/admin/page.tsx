"use client";

import { Package, TrendingUp, Users, ShoppingBag, Flame, Check, Video } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useState } from "react";

const revenueData = [
  { month: "Jan", revenue: 4200, orders: 45 },
  { month: "Feb", revenue: 5800, orders: 52 },
  { month: "Mar", revenue: 3500, orders: 38 },
  { month: "Apr", revenue: 8900, orders: 94 },
  { month: "May", revenue: 4100, orders: 42 },
  { month: "Jun", revenue: 4300, orders: 44 },
  { month: "Jul", revenue: 4700, orders: 48 },
  { month: "Aug", revenue: 9200, orders: 98 },
  { month: "Sep", revenue: 5100, orders: 55 },
  { month: "Oct", revenue: 4400, orders: 40 },
  { month: "Nov", revenue: 4200, orders: 41 },
  { month: "Dec", revenue: 5500, orders: 60 },
];

const bundleData = [
  { name: "Respect", sales: 240, label: "Respect Bundle" },
  { name: "Qingming", sales: 180, label: "Qingming Spec" },
  { name: "Daily", sales: 145, label: "Daily Dev" },
  { name: "Ghost", sales: 210, label: "Ghost Month" },
];

const chartConfig = {
  revenue: { label: "Revenue ($)", color: "#8b1e2d" },
  orders: { label: "Orders Count", color: "#b8921d" },
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

const INITIAL_PROXY_QUEUE = [
  {
    id: "PXY-001",
    customer: "Rey",
    ancestor: "Grandfather Lim",
    date: "2026-04-05",
    bundle: "Qingming Essential Kit",
    status: "pending" as const,
  },
  {
    id: "PXY-002",
    customer: "Sarah Tan",
    ancestor: "Grandmother Wong",
    date: "2026-04-12",
    bundle: "Everyday Deity Offering Set",
    status: "in-progress" as const,
  },
  {
    id: "PXY-003",
    customer: "James Lee",
    ancestor: "Father Lee",
    date: "2026-03-28",
    bundle: "7th Month Hungry Ghost Bundle",
    status: "completed" as const,
  },
];

export default function AdminDashboardPage() {
  const [proxyQueue, setProxyQueue] = useState(INITIAL_PROXY_QUEUE);

  const updateProxyStatus = (id: string, newStatus: "pending" | "in-progress" | "completed") => {
    setProxyQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
  };

  const statusColors = {
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

        {/* Stats Grid */}
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
                <h3 className="font-playfair text-3xl font-bold text-text-main">48</h3>
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
                <h3 className="font-playfair text-3xl font-bold text-text-main">$3,420</h3>
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
                <p className="text-sm font-medium text-text-main/60 mb-1">Subscriber Base</p>
                <h3 className="font-playfair text-3xl font-bold text-text-main">1,204</h3>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 h-full flex flex-col justify-between border-red-100 bg-red-50/10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-text-main/70 border border-neutral-main">
                  <Package className="size-6" />
                </div>
                <span className="inline-flex text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  3 items
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main/60 mb-1">Low Inventory Alerts</p>
                <h3 className="font-playfair text-xl font-bold text-red-600">Action Needed</h3>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Proxy Service Queue */}
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
                        <strong>{request.customer}</strong> → {request.ancestor} · {request.bundle}{" "}
                        ·{" "}
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
                        <Button
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => updateProxyStatus(request.id, "completed")}
                        >
                          <Video className="size-3" />
                          Mark Complete
                        </Button>
                      )}
                      {request.status === "completed" && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                          <Check className="size-3" />
                          Done
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Overview */}
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
                    Expected surge in bundle requests in 14 days based on your customer subscriber
                    base.
                  </p>
                  <Button size="sm">Review Inventory</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Simulated Analytics */}
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
                            <stop offset="5%" stopColor="#8b1e2d" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b1e2d" stopOpacity={0.0} />
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
                          stroke="#8b1e2d"
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
                        config={{ sales: { label: "Total Sales", color: "#b8921d" } }}
                        className="aspect-none h-full w-full"
                      >
                        <BarChart
                          data={bundleData}
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
                          <Bar dataKey="sales" fill="#b8921d" radius={[0, 4, 4, 0]} barSize={20} />
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
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-main/70">Qingming preparations</span>
                          <span className="font-bold text-secondary">+120% Demand</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-main/70">Hungry Ghost Restock</span>
                          <span className="font-bold text-secondary">High Influx</span>
                        </div>
                        <div className="pt-3 border-t border-neutral-main/10">
                          <Button
                            size="sm"
                            className="w-full bg-secondary hover:bg-secondary/90 text-white"
                          >
                            View Forecast Model
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
