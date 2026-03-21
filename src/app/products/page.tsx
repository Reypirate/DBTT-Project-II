"use client";

import { useState } from "react";
import { Filter, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CATEGORIES = ["All", "Paper Offerings", "Incense", "Candles", "Food Offerings"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  const filteredProducts =
    activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-4">
            Product Catalogue
          </h1>
          <p className="text-text-main/70 max-w-2xl mx-auto">
            Browse our individual ceremonial items to complement your specific ritual needs and
            offerings.
          </p>
        </div>

        {/* Filters */}
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

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border border-neutral-main shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className="aspect-square relative overflow-hidden bg-surface">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-primary backdrop-blur-sm shadow-sm font-bold border border-primary/20"
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                  <h3 className="font-playfair text-lg font-bold text-text-main leading-snug line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                </div>

                <p className="font-bold text-xl text-primary mb-4">${product.price.toFixed(2)}</p>
                <p className="text-sm text-text-main/70 line-clamp-2 mb-6 flex-grow">
                  {product.description}
                </p>

                <Button variant="outline" className="w-full gap-2 mt-auto">
                  <ShoppingBag className="size-4" />
                  Add to Preorder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
