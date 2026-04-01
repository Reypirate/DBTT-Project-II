"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MOCK_INVENTORY } from "@/data/products";

export function ProductVelocityTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-main/20">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface border-b border-neutral-main/20 text-text-main/60 text-xs uppercase tracking-wider">
            <th className="p-4 text-left font-bold min-w-[220px]">Product Name</th>
            <th className="p-4 text-left font-bold">Category</th>
            <th className="p-4 text-right font-bold">Stock</th>
            <th className="p-4 text-right font-bold text-secondary">Velocity (Wk)</th>
            <th className="p-4 text-right font-bold text-primary">Demand Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-main/10">
          {MOCK_INVENTORY.sort((a, b) => b.velocity - a.velocity).map((item) => (
            <tr key={item.id} className="hover:bg-surface/50 transition-colors">
              <td className="p-4">
                <p className="font-bold text-text-main">{item.name}</p>
                <p className="text-[10px] text-text-main/50">{item.id}</p>
              </td>
              <td className="p-4 text-text-main/80 font-medium">{item.category}</td>
              <td className="p-4 text-right">
                <span
                  className={`font-bold ${item.stock <= item.threshold ? "text-red-600" : "text-text-main"}`}
                >
                  {item.stock}
                </span>
              </td>
              <td className="p-4 text-right font-bold text-text-main">{item.velocity} units</td>
              <td className="p-4 text-right font-medium flex items-center justify-end gap-2">
                {item.trend === "up" ? (
                  <span className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded border border-green-200">
                    <TrendingUp className="size-3.5" /> +{item.projectedDemand}%
                  </span>
                ) : item.trend === "down" ? (
                  <span className="flex items-center gap-1.5 text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200">
                    <TrendingDown className="size-3.5" /> {item.projectedDemand}%
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-text-main/60 font-bold bg-surface px-2.5 py-1 rounded border border-neutral-main/30">
                    <Minus className="size-3.5" /> Flat
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
