"use client";

import { motion } from "framer-motion";
import { DashboardStats } from "./_components/DashboardStats";
import { ProxyQueueOverview } from "./_components/ProxyQueueOverview";
import { RecentOrdersList } from "./_components/RecentOrdersList";
import { UpcomingDemandCard } from "./_components/UpcomingDemandCard";

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
  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <header className="mb-10 pb-6 border-b border-neutral-main flex justify-between items-end">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-text-main mb-2">
              Owner Dashboard
            </h1>
            <p className="text-text-main/70">Performance overview</p>
          </div>
          <div className="text-sm font-medium text-text-main/60 bg-surface px-4 py-2 rounded-lg border border-neutral-main">
            Today: {new Date().toLocaleDateString("en-SG", { dateStyle: "long" })}
          </div>
        </header>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <DashboardStats />
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-10"
        >
          <ProxyQueueOverview />
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <RecentOrdersList />
          </motion.div>

          <motion.div variants={itemVariants}>
            <UpcomingDemandCard />
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
