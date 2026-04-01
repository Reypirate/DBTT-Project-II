"use client";

import { Package, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/data/products";

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onUpdate }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="p-12 text-center text-text-main/50 flex flex-col items-center">
        <Package className="size-12 mb-4 opacity-50" />
        <p>No inventory items match your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-surface border-b border-neutral-main text-text-main/60 uppercase tracking-wider text-xs">
            <th className="p-4 font-bold">Item Name</th>
            <th className="p-4 font-bold">Category</th>
            <th className="p-4 font-bold">Price</th>
            <th className="p-4 font-bold">Stock Level</th>
            <th className="p-4 font-bold">Status</th>
            <th className="p-4 font-bold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-main">
          {items.map((item) => {
            const isLow = item.stock <= item.threshold;
            return (
              <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-text-main">{item.name}</div>
                  <div className="text-xs text-text-main/50">{item.id}</div>
                </td>
                <td className="p-4 text-text-main/80">{item.category}</td>
                <td className="p-4 font-medium">${item.price.toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isLow ? "text-red-600" : "text-text-main"}`}>
                      {item.stock}
                    </span>
                    <span className="text-text-main/50 text-xs">/ min {item.threshold}</span>
                  </div>
                </td>
                <td className="p-4">
                  {isLow ? (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 font-bold bg-red-100 text-red-600 border border-red-200"
                    >
                      <AlertTriangle className="size-3" /> Low Stock
                    </Badge>
                  ) : (
                    <Badge className="font-bold bg-green-100 text-green-600 border border-green-200">
                      Healthy
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-primary font-bold"
                    onClick={() => onUpdate(item)}
                  >
                    Update
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
