"use client";

import { useMemo } from "react";
import { ShoppingBag, TrendingUp, Users, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { revenueData, customerGroupRevenueData } from "./dashboard-data";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
} as const;

export function DashboardStats() {
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

  const stats = [
    {
      label: "Active Preorders",
      value: "42",
      change: "+12%",
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Weekly Revenue",
      value: `$${weeklyRevenue.toLocaleString()}`,
      change: "+8.4%",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Avg Segment Retention",
      value: `${averageRetentionRate}%`,
      change: "+24 this week",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Members",
      value: "128",
      change: "+15%",
      icon: Crown,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="size-6" />
              </div>
              <span className="inline-flex text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-main/60 mb-1">{stat.label}</p>
              <h3 className="font-playfair text-3xl font-bold text-text-main">{stat.value}</h3>
            </div>
          </Card>
        </motion.div>
      ))}
    </>
  );
}
