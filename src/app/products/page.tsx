"use client";

import { useState } from "react";
import { usePreorder } from "@/context/PreorderContext";
import { PRODUCTS } from "@/data/products";
import { ProductFilters } from "./_components/ProductFilters";
import { ProductCard } from "./_components/ProductCard";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const { addToPreorder } = usePreorder();

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

        <ProductFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isRecentlyAdded={!!recentlyAdded[product.id]}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
