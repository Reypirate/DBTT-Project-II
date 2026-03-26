"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Package, AlertTriangle, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
}

interface InventoryFormState {
  name: string;
  category: string;
  price: string;
  stock: string;
  threshold: string;
}

interface DemandPrediction {
  itemId: string;
  itemName: string;
  demandLiftPercent: number;
  horizonDays: number;
  confidencePercent: number;
}

interface StockoutFrequencyRecord {
  itemId: string;
  stockoutEventsLast90d: number;
}

const INVENTORY_STORAGE_KEY = "hinlong_owner_inventory";

const DEFAULT_INVENTORY: InventoryItem[] = [
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

const EMPTY_FORM: InventoryFormState = {
  name: "",
  category: "",
  price: "",
  stock: "",
  threshold: "",
};

const INVENTORY_DEMAND_FORECASTS: DemandPrediction[] = [
  {
    itemId: "INV-001",
    itemName: "Premium Gold Joss Paper",
    demandLiftPercent: 118,
    horizonDays: 14,
    confidencePercent: 88,
  },
  {
    itemId: "INV-002",
    itemName: "Sandalwood Incense (Box)",
    demandLiftPercent: 46,
    horizonDays: 21,
    confidencePercent: 79,
  },
  {
    itemId: "INV-003",
    itemName: "Red Altar Candles (Pair)",
    demandLiftPercent: 52,
    horizonDays: 17,
    confidencePercent: 81,
  },
];

const STOCKOUT_FREQUENCY_HISTORY: StockoutFrequencyRecord[] = [
  { itemId: "INV-001", stockoutEventsLast90d: 1 },
  { itemId: "INV-002", stockoutEventsLast90d: 6 },
  { itemId: "INV-003", stockoutEventsLast90d: 8 },
  { itemId: "INV-004", stockoutEventsLast90d: 2 },
  { itemId: "INV-005", stockoutEventsLast90d: 5 },
];

function safeReadInventory() {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return DEFAULT_INVENTORY;
    const parsed = JSON.parse(raw) as InventoryItem[];
    return Array.isArray(parsed) ? parsed : DEFAULT_INVENTORY;
  } catch {
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
    return DEFAULT_INVENTORY;
  }
}

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<InventoryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setItems(safeReadInventory());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
  }, [hasHydrated, items]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query),
    );
  }, [items, searchTerm]);

  const lowStockCount = useMemo(
    () => items.filter((item) => item.stock <= item.threshold).length,
    [items],
  );

  const totalInventoryInStock = useMemo(
    () => items.reduce((sum, item) => sum + item.stock, 0),
    [items],
  );

  const topDemandPrediction = useMemo(
    () =>
      INVENTORY_DEMAND_FORECASTS.reduce((peak, current) =>
        current.demandLiftPercent > peak.demandLiftPercent ? current : peak,
      ),
    [],
  );

  const highestStockoutItem = useMemo(() => {
    const stockoutById = new Map(
      STOCKOUT_FREQUENCY_HISTORY.map((entry) => [entry.itemId, entry.stockoutEventsLast90d]),
    );
    const rankedItems = items
      .map((item) => ({
        itemId: item.id,
        itemName: item.name,
        stockoutEventsLast90d: stockoutById.get(item.id) ?? 0,
      }))
      .sort((a, b) => b.stockoutEventsLast90d - a.stockoutEventsLast90d);
    return (
      rankedItems[0] ?? {
        itemId: "N/A",
        itemName: "No tracked items",
        stockoutEventsLast90d: 0,
      }
    );
  }, [items]);

  const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const category = form.category.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    const threshold = Number(form.threshold);

    if (
      !name ||
      !category ||
      Number.isNaN(price) ||
      Number.isNaN(stock) ||
      Number.isNaN(threshold)
    ) {
      setFormError("All fields are required.");
      return;
    }

    if (price < 0 || stock < 0 || threshold < 0) {
      setFormError("Price, stock, and threshold must be non-negative.");
      return;
    }

    const nextId = `INV-${String(Date.now()).slice(-6)}`;
    const newItem: InventoryItem = {
      id: nextId,
      name,
      category,
      price: Number(price.toFixed(2)),
      stock: Math.floor(stock),
      threshold: Math.floor(threshold),
    };

    setItems((prev) => [newItem, ...prev]);
    setForm(EMPTY_FORM);
    setFormError(null);
    setAddOpen(false);
  };

  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-main">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-text-main mb-2 flex items-center gap-3">
              Inventory Tracker
              <Badge variant="destructive" className="flex items-center gap-1 font-bold">
                <AlertTriangle className="size-3" /> {lowStockCount} Low Stock
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

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 font-bold">
                  <Plus className="size-4" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[460px]">
                <DialogHeader>
                  <DialogTitle className="font-playfair text-2xl">Add Inventory Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Lotus Incense Bundle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory">Category</Label>
                    <Input
                      id="itemCategory"
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="e.g. Incense"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="itemPrice">Price</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemStock">Stock</Label>
                      <Input
                        id="itemStock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            stock: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemThreshold">Threshold</Label>
                      <Input
                        id="itemThreshold"
                        type="number"
                        min="0"
                        value={form.threshold}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            threshold: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  {formError && <p className="text-xs text-red-600 font-medium">{formError}</p>}
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Create Item
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border border-neutral-main p-5">
            <p className="text-xs uppercase tracking-wider text-text-main/60">
              Total Inventory in Stock
            </p>
            <p className="text-3xl font-playfair font-bold text-primary mt-2">
              {totalInventoryInStock.toLocaleString()}
            </p>
            <p className="text-xs text-text-main/60 mt-2">
              Aggregate units across all active SKUs.
            </p>
          </Card>

          <Card className="border border-neutral-main p-5">
            <p className="text-xs uppercase tracking-wider text-text-main/60">
              Inventory Demand Prediction
            </p>
            <p className="text-lg font-bold text-secondary mt-2">
              High demand expected for {topDemandPrediction.itemName}
            </p>
            <p className="text-xs text-text-main/60 mt-2">
              +{topDemandPrediction.demandLiftPercent}% forecast in{" "}
              {topDemandPrediction.horizonDays} days {topDemandPrediction.confidencePercent}%
              confidence.
            </p>
          </Card>

          <Card className="border border-neutral-main p-5">
            <p className="text-xs uppercase tracking-wider text-text-main/60">Stockout Frequency</p>
            <p className="text-lg font-bold text-primary mt-2">{highestStockoutItem.itemName}</p>
            <p className="text-xs text-text-main/60 mt-2">
              {highestStockoutItem.stockoutEventsLast90d} stockout events in the last 90 days.
            </p>
          </Card>
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
