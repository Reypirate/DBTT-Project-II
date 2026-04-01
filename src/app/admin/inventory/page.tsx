"use client";

import { AlertTriangle, Plus, Search, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useInventoryManager } from "./_hooks/useInventoryManager";
import { InventoryStats } from "./_components/InventoryStats";
import { InventoryTable } from "./_components/InventoryTable";
import { InventoryDialog } from "./_components/InventoryDialogs";
import { type InventoryItem } from "@/data/products";

export default function AdminInventoryPage() {
  const {
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
    setEditTargetId,
    editForm,
    setEditForm,
    editError,
    handleUpdateItem,
    handleExportCSV,
    lowStockCount,
    items,
  } = useInventoryManager();

  const openEditDialog = (item: InventoryItem) => {
    setEditTargetId(item.id);
    setEditForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      stock: String(item.stock),
      threshold: String(item.threshold),
    });
    setEditOpen(true);
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
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-main/40" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-neutral-main rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2 font-bold whitespace-nowrap hidden sm:flex border-neutral-main bg-surface"
            >
              <Download className="size-4" /> Export CSV
            </Button>

            <InventoryDialog
              open={addOpen}
              onOpenChange={setAddOpen}
              title="Add Inventory Item"
              submitLabel="Create Item"
              form={form}
              setForm={setForm}
              onSubmit={handleAddItem}
              error={formError}
            />

            <Button
              className="gap-2 font-bold w-full sm:w-auto"
              onClick={() => {
                setForm({ name: "", category: "", price: "", stock: "", threshold: "" });
                setAddOpen(true);
              }}
            >
              <Plus className="size-4" /> Add Item
            </Button>
          </div>
        </div>

        <InventoryStats items={items} />

        <Card className="border border-neutral-main rounded-2xl shadow-sm overflow-hidden">
          <InventoryTable items={filteredItems} onUpdate={openEditDialog} />
        </Card>

        <InventoryDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Update Inventory Item"
          submitLabel="Save Changes"
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleUpdateItem}
          error={editError}
        />
      </div>
    </div>
  );
}
