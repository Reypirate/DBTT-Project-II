"use client";

import { Activity, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem } from "@/data/products";

interface SurgingProductCardProps {
  products: (InventoryItem & { projectedDemand: number })[];
}

export function SurgingProductCard({ products }: SurgingProductCardProps) {
  return (
    <Card className="p-6 border-primary/20 bg-primary/5 col-span-1 lg:col-span-2 flex flex-col h-full gap-6">
      <div className="flex items-start md:items-center gap-4 w-full shrink-0">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Activity className="size-6" />
        </div>
        <div>
          <h3 className="font-playfair text-xl font-bold text-text-main mb-1">
            Surging Product Demand
          </h3>
          <p className="text-sm text-text-main/70">
            High-velocity items requiring immediate restocking attention based on projected
            forecast.
          </p>
        </div>
      </div>

      <div className="grow flex flex-col justify-between py-2">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between group hover:bg-primary/5 p-2 rounded-lg transition-colors"
          >
            <span className="font-medium text-text-main group-hover:text-primary transition-colors">
              {item.name}
            </span>
            <Badge className="bg-primary hover:bg-primary/90 text-white font-medium py-1 px-3 flex items-center gap-2">
              <ArrowUpRight className="size-3 text-white/80" /> +{item.projectedDemand}%
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
