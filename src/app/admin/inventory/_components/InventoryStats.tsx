"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { InventoryItem } from "@/data/products";

interface InventoryStatsProps {
  items: InventoryItem[];
}

export function InventoryStats({ items }: InventoryStatsProps) {
  const totalInStock = useMemo(() => items.reduce((sum, item) => sum + item.stock, 0), [items]);

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card className="border border-neutral-main p-5">
        <p className="text-xs uppercase tracking-wider text-text-main/60">
          Total Inventory in Stock
        </p>
        <p className="text-3xl font-playfair font-bold text-primary mt-2">
          {totalInStock.toLocaleString()}
        </p>
        <p className="text-xs text-text-main/60 mt-2">Aggregate units across all active SKUs.</p>
      </Card>

      <Card className="border border-neutral-main p-5">
        <p className="text-xs uppercase tracking-wider text-text-main/60">Demand Forecast (Top)</p>
        <p className="text-lg font-bold text-secondary mt-2">
          High demand expected for Lotus Incense Bundle
        </p>
        <p className="text-xs text-text-main/60 mt-2">+118% forecast in 14 days 88% confidence.</p>
      </Card>

      <Card className="border border-neutral-main p-5">
        <p className="text-xs uppercase tracking-wider text-text-main/60">Stockout Frequency</p>
        <p className="text-lg font-bold text-primary mt-2">Premium Gold Joss Paper</p>
        <p className="text-xs text-text-main/60 mt-2">8 stockout events in the last 90 days.</p>
      </Card>
    </div>
  );
}
