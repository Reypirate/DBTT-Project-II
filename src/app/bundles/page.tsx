"use client";

import { useState } from "react";
import { Filter, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { BUNDLES } from "@/data/bundles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Ancestors", "Deities", "Occasion"];

export default function BundleListPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBundles =
    activeCategory === "All" ? BUNDLES : BUNDLES.filter((b) => b.category === activeCategory);

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-4">Curated Bundles</h1>
          <p className="text-text-main/70 max-w-2xl mx-auto">
            Discover thoughtfully assembled offering packages. Tailored for specific occasions,
            dialects, and intents so you don't have to guess what's required.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-neutral-main">
          <div className="flex items-center gap-2 mb-4 sm:mb-0 text-text-main/70">
            <Filter className="size-5" />
            <span className="font-medium">Filter by Occasion:</span>
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

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBundles.map((bundle) => (
            <Card
              key={bundle.id}
              className="overflow-hidden border border-neutral-main shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-surface">
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-primary backdrop-blur-sm shadow-sm font-bold"
                  >
                    {bundle.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-playfair text-xl font-bold text-text-main line-clamp-2">
                    {bundle.name}
                  </h3>
                  <span className="font-bold text-lg text-primary">${bundle.price.toFixed(2)}</span>
                </div>

                <p className="text-text-main/70 text-sm mb-6 flex-grow">{bundle.description}</p>

                <Button asChild variant="outline" className="w-full gap-2 mt-auto">
                  <Link href={`/bundles/${bundle.id}`}>
                    <ShoppingBag className="size-4" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
