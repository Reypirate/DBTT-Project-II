"use client";

import { ShoppingBag, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cartGapData, geographicData } from "./analytics-data";

export function CartGapAnalysisCard() {
  return (
    <Card className="p-6 flex flex-col h-full border-secondary/30 bg-secondary/5 col-span-1">
      <div className="flex flex-col gap-4 h-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="size-5 text-secondary" />
            <h3 className="font-playfair text-lg font-bold text-text-main">Cart-Gap Analysis</h3>
          </div>
          <p className="text-[11px] text-text-main/70">
            Missed cross-sell opportunities based on dialect grouping logic.
          </p>
        </div>
        <div className="space-y-3 grow overflow-auto">
          {cartGapData.map((gap, i) => (
            <div key={i} className="text-xs border-l-2 border-secondary/40 pl-3">
              <span className="font-bold text-text-main">{gap.missingProduct}</span> missed in{" "}
              {gap.affectedOrders} orders <span className="opacity-70">({gap.dialectGroup})</span>
              <div className="text-secondary font-medium mt-0.5">
                +${gap.potentialRevenue.toFixed(2)} potential MRR
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2 pt-4 border-t border-neutral-main/10">
          <Button size="sm" className="w-full text-[10px] h-7 px-2" variant="outline">
            Auto-Upsell
          </Button>
          <Button size="sm" className="w-full text-[10px] h-7 px-2" variant="outline">
            SMS Reminder
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PropensityUpgradeCard() {
  return (
    <div className="bg-surface border border-secondary/30 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-5">
        <ShoppingBag className="size-6 text-secondary shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-text-main text-sm leading-relaxed">
            34 non-members have purchased 3+ remembrance bundles this year.
          </p>
          <p className="text-xs text-secondary font-bold mt-1.5 flex items-center gap-1.5 w-fit bg-secondary/10 px-2 py-1 rounded">
            <TrendingUp className="size-3" /> 85% conversion probability
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 border-t border-neutral-main/10 pt-5">
        <Button
          size="sm"
          className="h-9 text-xs px-4 sm:w-auto bg-secondary hover:bg-secondary/90 text-white shadow-sm"
        >
          Deploy Target Discount
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 text-xs px-4 sm:w-auto border-neutral-main/40"
        >
          Export Target List
        </Button>
      </div>
    </div>
  );
}

export function GeographicSummary() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {geographicData.map((geo) => (
        <div key={geo.segment} className="rounded-xl border border-neutral-main/30 bg-surface p-5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-wider text-text-main/60">{geo.segment}</p>
            <Badge className={geo.segment === "Overseas" ? "bg-secondary" : "bg-primary"}>
              {geo.totalCustomers} Customers
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-text-main/50 uppercase">Avg Order Value</p>
              <p className="text-xl font-bold text-text-main">${geo.avgOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-main/50 uppercase">Retention Rate</p>
              <p className="text-xl font-bold text-text-main">{geo.retentionRate}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
