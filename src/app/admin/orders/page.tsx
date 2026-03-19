"use client";

import { useState } from "react";
import { Search, Filter, Clock, Package, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for Admin Orders
const MOCK_ORDERS = [
  {
    id: "ORD-2026-892",
    customer: "John Tan",
    status: "pending",
    items: ["Qingming Essential Kit x1"],
    total: 38.0,
    pickupDate: "2026-04-01",
    time: "Morning",
  },
  {
    id: "ORD-2026-893",
    customer: "Mary Lim",
    status: "preparing",
    items: ["Everyday Deity Offering Set x2", "Sandalwood Incense x1"],
    total: 45.5,
    pickupDate: "2026-04-02",
    time: "Afternoon",
  },
  {
    id: "ORD-2026-894",
    customer: "David Wong",
    status: "ready",
    items: ["7th Month Hungry Ghost Bundle x1"],
    total: 45.0,
    pickupDate: "2026-04-01",
    time: "Late Afternoon",
  },
  {
    id: "ORD-2026-880",
    customer: "Sarah Lee",
    status: "completed",
    items: ["Qingming Essential Kit x2"],
    total: 76.0,
    pickupDate: "2026-03-28",
    time: "Morning",
  },
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders =
    activeTab === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-main">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-text-main mb-2">
              Orders Management
            </h1>
            <p className="text-text-main/70">
              Track preorders, manage fulfillment, and view pickup schedules.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-main/40" />
              <Input
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-neutral-main rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {["all", "pending", "preparing", "ready", "completed"].map((status) => (
            <Button
              key={status}
              onClick={() => setActiveTab(status)}
              variant={activeTab === status ? "default" : "outline"}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Orders Table */}
        <Card className="border border-neutral-main rounded-2xl shadow-sm overflow-hidden text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-neutral-main text-text-main/60 uppercase tracking-wider text-xs">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Pickup Schedule</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-main">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-bold text-primary">{order.id}</td>
                    <td className="p-4 font-medium">{order.customer}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="size-3" /> {order.pickupDate}
                        </span>
                        <span className="text-text-main/60 text-xs">{order.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={`capitalize font-bold border ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold">${order.total.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="size-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-text-main/50 flex flex-col items-center">
              <Package className="size-12 mb-4 opacity-50" />
              <p>No orders found for this status.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
