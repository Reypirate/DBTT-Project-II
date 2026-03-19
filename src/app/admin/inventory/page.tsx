"use client";

import { useState } from "react";
import { Package, AlertTriangle, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for Admin Inventory
const MOCK_INVENTORY = [
  {
    id: "INV-001",
    name: "Premium Gold Joss Paper",
    category: "Paper Offerings",
    price: 5.5,
    stock: 120,
    threshold: 50,
  },
  {
    id: "INV-002",
    name: "Sandalwood Incense (Box)",
    category: "Incense",
    price: 12.0,
    stock: 35,
    threshold: 40,
  },
  {
    id: "INV-003",
    name: "Red Altar Candles (Pair)",
    category: "Candles",
    price: 4.5,
    stock: 15,
    threshold: 20,
  },
  {
    id: "INV-004",
    name: "Paper Ancestor Clothing",
    category: "Paper Offerings",
    price: 18.0,
    stock: 60,
    threshold: 25,
  },
  {
    id: "INV-005",
    name: "Huat Kueh (Trad. Cake)",
    category: "Food Offerings",
    price: 3.5,
    stock: 8,
    threshold: 10,
  },
];

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = MOCK_INVENTORY.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-main">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-text-main mb-2 flex items-center gap-3">
              Inventory Tracker
              <Badge variant="destructive" className="flex items-center gap-1 font-bold">
                <AlertTriangle className="size-3" /> 3 Low Stock
              </Badge>
            </h1>
            <p className="text-text-main/70">
              Manage stock levels for individual ceremonial goods.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-main/40" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-neutral-main rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
              />
            </div>
            <Button className="gap-2 font-bold">
              <Plus className="size-4" /> Add Item
            </Button>
          </div>
        </div>

        <Card className="border border-neutral-main rounded-2xl shadow-sm overflow-hidden text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
                {filteredItems.map((item) => {
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
                          <span
                            className={`font-bold ${isLow ? "text-red-600" : "text-text-main"}`}
                          >
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
                        <Button variant="link" size="sm" className="p-0 text-primary">
                          Update
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-text-main/50 flex flex-col items-center">
              <Package className="size-12 mb-4 opacity-50" />
              <p>No inventory items match your search.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
