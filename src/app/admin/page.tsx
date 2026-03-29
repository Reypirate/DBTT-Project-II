"use client";

import { Crown, TrendingUp, Users, ShoppingBag, Flame, Video, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/data/mock-orders";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
                          {new Date(order.pickupDate).toLocaleDateString()}
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
