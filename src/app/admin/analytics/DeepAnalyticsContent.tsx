"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { SurgingProductCard } from "./_components/SurgingProductCard";
import { CartGapAnalysisCard, GeographicSummary } from "./_components/InsightCards";
import { OperationalAnalytics } from "./_components/OperationalAnalytics";
import { DemographicAnalysis } from "./_components/DemographicAnalysis";
import { CustomerGroupStats } from "./_components/CustomerGroupStats";
import { RegionalInsightsTable } from "./_components/RegionalInsightsTable";
import { ProductVelocityTable } from "./_components/ProductVelocityTable";
import { useAnalyticsEngine } from "./_hooks/useAnalyticsEngine";
import { handleExportCSV } from "./_lib/export-utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

export default function DeepAnalyticsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const mlAdapters = useAnalyticsEngine();

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
              <SurgingProductCard products={mlAdapters.adaptedSurgingProducts} />
              <CartGapAnalysisCard />
            </div>

            <Card className="p-6">
              <OperationalAnalytics />
            </Card>

            <Card className="p-6">
              <DemographicAnalysis
                mlAdapters={{
                  dominantSentiment: mlAdapters.dominantSentiment,
                  positiveShare: mlAdapters.positiveShare,
                }}
              />
            </Card>

            <Card className="p-6">
              <div className="flex flex-col gap-8">
                <CustomerGroupStats />
                <RegionalInsightsTable />
              </div>
            </Card>

            <Card className="p-6">
              <GeographicSummary />
            </Card>

            <Card className="p-6">
              <ProductVelocityTable />
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
