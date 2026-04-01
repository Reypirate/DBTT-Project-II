"use client";

import { Check, ShoppingBag, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  isRecentlyAdded: boolean;
  onQuickAdd: (e: React.MouseEvent, product: Product) => void;
}

export function ProductCard({ product, isRecentlyAdded, onQuickAdd }: ProductCardProps) {
  const router = useRouter();

  return (
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
            variant={isRecentlyAdded ? "default" : "secondary"}
            className={`gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${
              isRecentlyAdded ? "bg-green-600 hover:bg-green-600 font-bold" : ""
            }`}
            onClick={(e) => onQuickAdd(e, product)}
          >
            {isRecentlyAdded ? (
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
  );
}
