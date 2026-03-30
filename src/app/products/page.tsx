"use client";

import { useState } from "react";
import { usePreorder } from "@/context/PreorderContext";
import { Check, Filter, ShoppingBag, ShoppingCart } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All",
  "Paper Offerings",
  "Incense & Candles",
  "Food Offerings",
  "Altar Supplies",
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const { addToPreorder } = usePreorder();
  const router = useRouter();

  const filteredProducts =
    activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleQuickAdd = (e: React.MouseEvent, product: (typeof PRODUCTS)[0]) => {
    e.preventDefault();
    e.stopPropagation();

    addToPreorder(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        kind: "product",
      },
      1,
    );

    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant={recentlyAdded[product.id] ? "default" : "secondary"}
                    className={`gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${
                      recentlyAdded[product.id] ? "bg-green-600 hover:bg-green-600" : ""
                    }`}
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    {recentlyAdded[product.id] ? (
                      <>
                        <Check className="size-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="size-4" />
                        Quick Add
                      </>
                    )}
                  </Button>
                </div>

                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-primary backdrop-blur-sm shadow-sm font-bold border border-primary/20"
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 sm:p-5 flex flex-col flex-grow">
                <div className="mb-2">
                  <h3 className="font-playfair text-sm sm:text-lg font-bold text-text-main leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {product.name}
                  </h3>
                </div>

                <p className="font-bold text-lg sm:text-xl text-primary mb-3 sm:mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs sm:text-sm text-text-main/70 line-clamp-2 mb-4 sm:mb-6 flex-grow">
                  {product.description}
                </p>

                <Button
                  variant="outline"
                  className="w-full gap-1 sm:gap-2 mt-auto hover:bg-primary hover:text-white transition-all duration-300 whitespace-normal text-center h-auto py-2 px-2"
                >
                  <ShoppingBag className="size-4" />
                  <span className="sm:hidden">View Details</span>
                  <span className="hidden sm:inline">View Details & Preorder</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
