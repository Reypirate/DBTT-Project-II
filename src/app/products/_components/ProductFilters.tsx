"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All",
  "Paper Offerings",
  "Incense & Candles",
  "Food Offerings",
  "Altar Supplies",
];

interface ProductFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function ProductFilters({ activeCategory, setActiveCategory }: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-neutral-main">
      <div className="flex items-center gap-2 mb-4 sm:mb-0 text-text-main/70">
        <Filter className="size-5" />
        <span className="font-medium">Filter by Category:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
