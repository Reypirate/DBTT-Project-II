"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import { type InventoryItem, MOCK_INVENTORY } from "@/data/products";

export interface InventoryFormState {
  name: string;
  category: string;
  price: string;
  stock: string;
  threshold: string;
}

const INVENTORY_STORAGE_KEY = "hinlong_owner_inventory";

const EMPTY_FORM: InventoryFormState = {
  name: "",
  category: "",
  price: "",
  stock: "",
  threshold: "",
};

function safeReadInventory() {
  if (typeof window === "undefined") return MOCK_INVENTORY;
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return MOCK_INVENTORY;
    const parsed = JSON.parse(raw) as InventoryItem[];
    if (parsed.length > 0 && typeof parsed[0].velocity !== "number") {
      localStorage.removeItem(INVENTORY_STORAGE_KEY);
      return MOCK_INVENTORY;
    }
    return Array.isArray(parsed) ? parsed : MOCK_INVENTORY;
  } catch {
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
    return MOCK_INVENTORY;
  }
}

export function useInventoryManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<InventoryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InventoryFormState>(EMPTY_FORM);
  const [editError, setEditError] = useState<string | null>(null);

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

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
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
      setFormError("Values must be non-negative.");
      return;
    }

    const newItem: InventoryItem = {
      id: `INV-${String(Date.now()).slice(-6)}`,
      name,
      category,
      price: Number(price.toFixed(2)),
      stock: Math.floor(stock),
      threshold: Math.floor(threshold),
      description: "Manually added proxy item",
      image: "/images/placeholder-item.png",
      velocity: 0,
      projectedDemand: 0,
      trend: "flat",
    };

    setItems((prev) => [newItem, ...prev]);
    setForm(EMPTY_FORM);
    setFormError(null);
    setAddOpen(false);
  };

  const handleUpdateItem = (e: FormEvent) => {
    e.preventDefault();
    if (!editTargetId) return;

    const name = editForm.name.trim();
    const category = editForm.category.trim();
    const price = Number(editForm.price);
    const stock = Number(editForm.stock);
    const threshold = Number(editForm.threshold);

    if (
      !name ||
      !category ||
      Number.isNaN(price) ||
      Number.isNaN(stock) ||
      Number.isNaN(threshold)
    ) {
      setEditError("All fields are required.");
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === editTargetId
          ? {
              ...item,
              name,
              category,
              price,
              stock: Math.floor(stock),
              threshold: Math.floor(threshold),
            }
          : item,
      ),
    );
    setEditOpen(false);
  };

  const handleExportCSV = () => {
    if (!items.length) return;
    const headers = [
      "ID",
      "Name",
      "Category",
      "Price",
      "Stock",
      "Threshold",
      "Velocity",
      "Projected Demand",
      "Trend",
    ];
    const csvRows = [
      headers.join(","),
      ...items.map((item) =>
        [
          item.id,
          `"${item.name}"`,
          `"${item.category}"`,
          item.price,
          item.stock,
          item.threshold,
          item.velocity,
          item.projectedDemand,
          item.trend,
        ].join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `hinlong_inventory_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
    addOpen,
    setAddOpen,
    form,
    setForm,
    formError,
    handleAddItem,
    editOpen,
    setEditOpen,
    editTargetId,
    setEditTargetId,
    editForm,
    setEditForm,
    editError,
    handleUpdateItem,
    handleExportCSV,
    lowStockCount: items.filter((item) => item.stock <= item.threshold).length,
  };
}
