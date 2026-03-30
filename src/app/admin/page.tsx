"use client";

import { Crown, TrendingUp, Users, ShoppingBag, Flame, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/data/mock-orders";
import { useMemo } from "react";

interface AnnualRevenuePoint {
  month: string;
  revenue: number;
  orders: number;
  festivalPeak: string | null;
}

interface CustomerGroupMetric {
  group: string;
  revenue: number;
  orders: number;
  retentionRate: number;
  avgOrderValue: number;
  topProduct: string;
}

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

export default function AdminDashboardPage() {
  const averageRetentionRate = useMemo(
    () =>
      Math.round(
        customerGroupRevenueData.reduce((sum, group) => sum + group.retentionRate, 0) /
          customerGroupRevenueData.length,
      ),
    [],
  );

  const weeklyRevenue = useMemo(
    () => revenueData.slice(-2).reduce((sum, month) => sum + month.revenue, 0),
    [],
  );

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
                <h3 className="font-playfair text-3xl font-bold text-text-main">42</h3>
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
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="font-playfair text-xl flex items-center gap-2">
                <Flame className="size-5 text-primary" />
                Proxy Queue Overview
              </CardTitle>
              <Button
                size="sm"
                asChild
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/5"
              >
                <Link href="/admin/proxy-orders" className="flex items-center gap-1 font-bold">
                  Manage Queue <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 mb-1">
                    Awaiting Action
                  </p>
                  <p className="text-3xl font-bold text-text-main font-playfair">12</p>
                </div>
                <div className="w-px h-12 bg-primary/10" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 mb-1">
                    In Fulfillment
                  </p>
                  <p className="text-3xl font-bold text-primary font-playfair">08</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-text-main/60 mt-4 italic">
                    All proxy service orders require video proof upon completion.
                  </p>
                </div>
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
            <Card className="h-full border-neutral-main">
              <CardHeader className="pb-3 border-b border-neutral-main/10">
                <CardTitle className="font-playfair text-xl flex justify-between items-center">
                  Recent Orders
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 h-auto font-medium text-primary"
                  >
                    <Link href="/admin/orders">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 sm:pb-4 pt-1">
                <div className="divide-y divide-neutral-main/10">
                  {MOCK_ORDERS.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 sm:px-6 hover:bg-surface/50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-sm text-text-main mb-1">
                          {order.id} &bull; {order.customer}
                        </p>
                        <p className="text-[11px] text-text-main/60">
                          {order.items.length} item(s) &bull; Pickup:{" "}
                          {new Date(order.pickupDate).toLocaleDateString("en-SG", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-bold text-sm text-primary mb-1">
                          ${order.total.toFixed(2)}
                        </p>
                        <Badge
                          className={`text-[9px] uppercase px-1.5 py-0 border-neutral-main/30 bg-surface text-text-main hover:bg-surface`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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
      </div>
    </div>
  );
}
