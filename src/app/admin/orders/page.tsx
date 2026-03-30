"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

import { MOCK_ORDERS } from "@/data/mock-orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Order = (typeof MOCK_ORDERS)[number];
type OrderStatus = "all" | Order["status"];

const STATUS_OPTIONS: ReadonlyArray<{ label: string; value: OrderStatus }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "completed" },
];

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 24 } },
} as const;

function formatCustomerEmail(name: string): string {
  const localPart = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return `${localPart}@example.com`;
}

function getStatusBadgeClass(status: Order["status"]): string {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
    case "preparing":
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
    case "ready":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
    case "completed":
      return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100";
  }
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const customerEmail = formatCustomerEmail(order.customer);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.customer.toLowerCase().includes(normalizedQuery) ||
        customerEmail.includes(normalizedQuery) ||
        order.items.join(", ").toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [normalizedQuery, statusFilter]);

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-text-main">Orders</h1>
          <p className="text-text-main/70 mt-1">Manage and track customer orders</p>
        </div>

        <motion.div
          className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full md:max-w-md"
          />
          <div className="flex bg-surface border border-neutral-main/20 rounded-xl p-1 shadow-sm overflow-x-auto w-full md:w-auto">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                aria-pressed={statusFilter === option.value}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap relative ${
                  statusFilter === option.value
                    ? "text-white"
                    : "text-text-main/60 hover:text-primary"
                }`}
              >
                {statusFilter === option.value && (
                  <motion.div
                    layoutId="ordersStatusIndicator"
                    className="absolute inset-0 bg-primary rounded-lg"
                    transition={{ type: "spring", bounce: 0.22, duration: 0.45 }}
                  />
                )}
                <span className="relative z-10">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="border border-neutral-main/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.length === 0 ? (
                      <motion.tr
                        key="orders-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b"
                      >
                        <TableCell colSpan={6} className="text-center text-text-main/60 py-10">
                          No orders match your filters.
                        </TableCell>
                      </motion.tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const customerEmail = formatCustomerEmail(order.customer);

                        return (
                          <motion.tr
                            key={order.id}
                            layout
                            variants={rowVariants}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: -8 }}
                            className="hover:bg-muted/50 border-b transition-colors"
                          >
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold text-text-main">
                                  {order.customer}
                                </span>
                                <span className="text-xs text-text-main/60">{customerEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[460px] whitespace-normal">
                              {order.items.join(", ")}
                            </TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusBadgeClass(order.status)}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`More actions for ${order.id}`}
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
