"use client";

import {
  Video,
  Play,
  Pause,
  Search,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Inbox,
  AlertCircle,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useMemo, useEffect, useRef } from "react";

type ProxyStatus = "pending" | "in-progress" | "completed";

interface ProxyVideoProof {
  id: string;
  completedAt: string;
  durationSeconds: number;
  proofNote: string;
  url?: string;
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

const INITIAL_PROXY_QUEUE: ProxyQueueItem[] = [
  {
    id: "PXY-001",
    customer: "Rey",
    ancestor: "Grandfather Lim",
    date: "2026-04-05",
    bundle: "Qingming Essential Kit",
    status: "pending",
    videoProof: { id: "VID-001", completedAt: "", durationSeconds: 0, proofNote: "", url: "" },
  },
  {
    id: "PXY-002",
    customer: "Sarah Tan",
    ancestor: "Grandmother Wong",
    date: "2026-04-12",
    bundle: "Everyday Deity Offering Set",
    status: "in-progress",
    videoProof: { id: "VID-002", completedAt: "", durationSeconds: 0, proofNote: "", url: "" },
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
      url: "/images/proxy.mp4",
    },
  },
  {
    id: "PXY-004",
    customer: "Ah Boon",
    ancestor: "Grandfather Tan",
    date: "2026-04-15",
    bundle: "Qingming Essential Kit",
    status: "pending",
    videoProof: { id: "VID-004", completedAt: "", durationSeconds: 0, proofNote: "", url: "" },
  },
  {
    id: "PXY-005",
    customer: "Madam Low",
    ancestor: "Mother Low",
    date: "2026-04-20",
    bundle: "Daily Devotion Set",
    status: "in-progress",
    videoProof: { id: "VID-005", completedAt: "", durationSeconds: 0, proofNote: "", url: "" },
  },
  {
    id: "PXY-006",
    customer: "Uncle Chen",
    ancestor: "Ancestor Chen",
    date: "2026-03-25",
    bundle: "Respect Bundle",
    status: "completed",
    videoProof: {
      id: "VID-PXY-006",
      completedAt: "2026-03-25T09:30:00.000Z",
      durationSeconds: 95,
      proofNote: "Traditional chanting and incense placement verified.",
      url: "/images/proxy.mp4",
    },
  },
  {
    id: "PXY-007",
    customer: "Linda Ng",
    ancestor: "Grandmother Ng",
    date: "2026-04-02",
    bundle: "Qingming Essential Kit",
    status: "pending",
    videoProof: { id: "VID-007", completedAt: "", durationSeconds: 0, proofNote: "", url: "" },
  },
  {
    id: "PXY-008",
    customer: "Kenji Wong",
    ancestor: "Father Wong",
    date: "2026-03-22",
    bundle: "Sandalwood Incense Premium",
    status: "completed",
    videoProof: {
      id: "VID-PXY-008",
      completedAt: "2026-03-22T16:45:00.000Z",
      durationSeconds: 120,
      proofNote: "Premium sandalwood burn sequence recorded in full.",
      url: "/images/proxy.mp4",
    },
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
} as const;

export default function ProxyOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [proxyQueue, setProxyQueue] = useState<ProxyQueueItem[]>(INITIAL_PROXY_QUEUE);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ProxyStatus | "all">("all");

  const [completingProxyIds, setCompletingProxyIds] = useState<Record<string, boolean>>({});
  const [videoReviewOpen, setVideoReviewOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [reviewingProxy, setReviewingProxy] = useState<ProxyQueueItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.play().catch(() => setIsVideoPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  const filteredOrders = useMemo(() => {
    return proxyQueue.filter((item) => {
      const matchesSearch =
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ancestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeTab === "all" || item.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [proxyQueue, searchTerm, activeTab]);

  const updateProxyStatus = (id: string, newStatus: ProxyStatus) => {
    setProxyQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
  };

  const completeProxyRequest = (id: string) => {
    setCompletingProxyIds((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => {
      setProxyQueue((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "completed",
                videoProof: {
                  ...item.videoProof,
                  completedAt: new Date().toISOString(),
                  durationSeconds: 45,
                  proofNote: "Fulfillment ceremony completed and verified by operator.",
                  url: "/images/proxy.mp4",
                },
              }
            : item,
        ),
      );
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

  const getStatusBadge = (status: ProxyStatus) => {
    const configs: Record<ProxyStatus, { label: string; class: string }> = {
      pending: { label: "Pending", class: "bg-amber-100/80 text-amber-900 border-amber-200" },
      "in-progress": {
        label: "In Progress",
        class: "bg-slate-100 text-slate-900 border-slate-200",
      },
      completed: {
        label: "Completed",
        class: "bg-emerald-100 text-emerald-900 border-emerald-200",
      },
    };
    const config = configs[status];
    return (
      <Badge
        variant="outline"
        className={`font-semibold px-2.5 py-0.5 whitespace-nowrap ${config.class}`}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="mb-10 pb-6 border-b border-neutral-main/30 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="font-playfair text-3xl font-bold text-text-main flex items-center gap-3">
              <Flame className="size-8 text-primary" />
              Proxy Service Queue
            </h1>
            <p className="text-text-main/60 font-medium">
              Fulfillment management & ritual verification
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              asChild
              className="hidden sm:flex border-neutral-main/40 hover:bg-surface"
            >
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
            <div className="text-sm font-medium text-text-main/60 bg-surface px-4 py-2 rounded-lg border border-neutral-main/20 flex items-center gap-2">
              <Clock className="size-4 text-secondary" />
              Sync: {mounted ? new Date().toLocaleTimeString() : "--:--:--"}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-main/40" />
              <Input
                placeholder="Search IDs, customers, ancestors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-surface border-neutral-main/20 h-11 focus-visible:ring-primary/20 transition-all shadow-sm"
              />
            </div>

            <div className="flex bg-surface border border-neutral-main/20 rounded-xl p-1 shadow-sm overflow-hidden">
              {(["all", "pending", "in-progress", "completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider relative ${
                    activeTab === status ? "text-white" : "text-text-main/60 hover:text-primary"
                  }`}
                >
                  {activeTab === status && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="absolute inset-0 bg-primary rounded-lg z-0"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    {status === "in-progress" ? "Fulfilling" : status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-neutral-main/30 shadow-xl bg-surface/30 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface/80 text-[10px] uppercase tracking-[0.15em] font-bold text-text-main/40 border-b border-neutral-main/10">
                    <th className="p-6">Proxy ID</th>
                    <th className="p-6">Client & Ancestor</th>
                    <th className="p-6">Ritual Bundle</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-main/10">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-surface/50"
                        key="empty-state"
                      >
                        <td colSpan={6} className="p-24 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                              <Inbox className="size-8" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-playfair font-bold text-text-main">
                                No proxy orders found
                              </p>
                              <p className="text-sm text-text-main/40">
                                Try adjusting your filters or search terms.
                              </p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      filteredOrders.map((request) => (
                        <motion.tr
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          exit={{ opacity: 0, scale: 0.95 }}
                          layout
                          key={request.id}
                          className="group hover:bg-surface/50 transition-colors"
                        >
                          <td className="p-6 align-middle">
                            <span className="font-mono text-sm font-bold text-text-main/50 tracking-tight">
                              {request.id}
                            </span>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="space-y-0.5">
                              <p className="font-bold text-text-main text-base group-hover:text-primary transition-colors">
                                {request.customer}
                              </p>
                              <p className="text-xs text-text-main/60 flex items-center gap-1.5">
                                <Users className="size-3 opacity-50" />
                                <span className="text-primary font-medium">
                                  To: {request.ancestor}
                                </span>
                              </p>
                            </div>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-2 text-sm font-bold text-text-main/70">
                              <CheckCircle2 className="size-3.5 text-secondary opacity-60" />
                              {request.bundle}
                            </div>
                          </td>
                          <td className="p-6 align-middle">{getStatusBadge(request.status)}</td>
                          <td className="p-6 align-middle">
                            <p className="text-sm font-medium text-text-main/60">
                              {new Date(request.date).toLocaleDateString("en-SG", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </td>
                          <td className="p-6 align-middle text-right">
                            {request.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-4 font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all gap-2"
                                onClick={() => updateProxyStatus(request.id, "in-progress")}
                              >
                                <Play className="size-3.5 fill-current" />
                                Start Fulfillment
                              </Button>
                            )}
                            {request.status === "in-progress" && (
                              <div className="flex justify-end items-center gap-3">
                                {completingProxyIds[request.id] ? (
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter animate-pulse">
                                    <Clock className="size-3" /> Processing...
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="h-9 px-6 font-bold shadow-lg shadow-primary/20 gap-2 bg-primary hover:bg-primary/90 text-white"
                                    onClick={() => completeProxyRequest(request.id)}
                                  >
                                    <Video className="size-3.5" />
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            )}
                            {request.status === "completed" && (
                              <Button
                                size="sm"
                                className="h-9 px-4 font-bold gap-2 group transition-all bg-secondary hover:bg-secondary/90 text-white shadow-md shadow-secondary/10"
                                onClick={() => openVideoReview(request)}
                              >
                                <Video className="size-3.5 text-white/80" />
                                Review Video
                                <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Dialog open={videoReviewOpen} onOpenChange={setVideoReviewOpen}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="px-8 pt-8 pb-4 bg-background-main border-b border-neutral-main/10 text-left">
              <DialogTitle className="font-playfair text-2xl flex items-center gap-3">
                <Video className="size-6 text-primary" />
                Proxy Fulfillment Evidence
              </DialogTitle>
            </DialogHeader>
            {reviewingProxy && (
              <div className="p-0">
                <div className="aspect-video w-full bg-slate-955 overflow-hidden flex flex-col justify-center items-center text-white relative group">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={reviewingProxy.videoProof.url}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    loop
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />

                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                    <div className="size-1.5 bg-red-600 rounded-full animate-pulse" />
                    Secure Replay: {reviewingProxy.videoProof.id}
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {!isVideoPlaying ? (
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="size-20 bg-primary/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                      >
                        <Play className="size-8 fill-current translate-x-1" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsVideoPlaying(false)}
                        className="size-20 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Pause className="size-8 fill-current" />
                      </button>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-8 space-y-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-bold tracking-tight">{reviewingProxy.bundle}</p>
                        <p className="text-xs text-white/60">
                          Ancestral Proxy Location: Hin Long Main Altar
                        </p>
                      </div>
                      <p className="text-xs font-mono font-bold text-white/80 transition-all">
                        00:{isVideoPlaying ? "42" : "15"} / 00:
                        {reviewingProxy.videoProof.durationSeconds}
                      </p>
                    </div>
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "25%" }}
                        animate={{ width: isVideoPlaying ? "65%" : "25%" }}
                        transition={{ duration: isVideoPlaying ? 5 : 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-surface">
                  <div className="grid sm:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4 text-left">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 border-b border-neutral-main/20 pb-2">
                        Ceremony Details
                      </h4>
                      <dl className="grid grid-cols-2 gap-y-3 text-sm">
                        <dt className="text-text-main/60 font-medium">Order Reference</dt>
                        <dd className="text-text-main font-bold text-right font-mono">
                          {reviewingProxy.id}
                        </dd>
                        <dt className="text-text-main/60 font-medium">Recipient</dt>
                        <dd className="text-primary font-bold text-right">
                          {reviewingProxy.ancestor}
                        </dd>
                        <dt className="text-text-main/60 font-medium">Bundle</dt>
                        <dd className="text-text-main font-bold text-right">
                          {reviewingProxy.bundle}
                        </dd>
                      </dl>
                    </div>
                    <div className="space-y-4 text-left">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 border-b border-neutral-main/20 pb-2">
                        Verification Meta
                      </h4>
                      <dl className="grid grid-cols-2 gap-y-3 text-sm">
                        <dd className="text-text-main font-bold text-right">
                          {new Date(reviewingProxy.videoProof.completedAt).toLocaleString("en-SG")}
                        </dd>
                        <dt className="text-text-main/60 font-medium">Integrity Stamp</dt>
                        <dd className="text-emerald-600 font-bold text-right flex items-center justify-end gap-1">
                          SHA-256 Valid <CheckCircle2 className="size-3" />
                        </dd>
                        <dt className="text-text-main/60 font-medium">Duration</dt>
                        <dd className="text-text-main font-bold text-right">
                          {reviewingProxy.videoProof.durationSeconds}s
                        </dd>
                      </dl>
                    </div>
                  </div>

                  <div className="p-5 bg-background-main rounded-2xl border border-neutral-main/20 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 mb-3">
                      Operator Completion Note
                    </p>
                    {reviewingProxy.videoProof.proofNote ? (
                      <p className="text-sm italic text-text-main/80 leading-relaxed font-serif">
                        "{reviewingProxy.videoProof.proofNote}"
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-text-main/30 text-xs italic">
                        <AlertCircle className="size-3.5" /> No fulfillment notes provided.
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end gap-4 border-t border-neutral-main/10 pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 h-12 px-8 border-neutral-main/40 font-bold hover:bg-surface"
                      onClick={() => setIsVideoPlaying((prev) => !prev)}
                    >
                      {isVideoPlaying ? (
                        <>
                          <Pause className="size-4" />
                          Pause Proof
                        </>
                      ) : (
                        <>
                          <Play className="size-4 fill-current" />
                          Resume Proof
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      className="h-12 px-8 font-bold shadow-xl shadow-primary/10 transition-transform active:scale-95 bg-primary hover:bg-primary/90 text-white border-primary"
                      onClick={() => {
                        setVideoReviewOpen(false);
                        setIsVideoPlaying(false);
                      }}
                    >
                      Close Review
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
