"use client";

import * as React from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { usePreorder } from "@/context/PreorderContext";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/data/products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const { addToPreorder } = usePreorder();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-bold text-text-main mb-4">
            Product not found
          </h2>
          <Button asChild variant="link">
            <Link href="/products">Return to Catalogue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <Button asChild variant="ghost" className="mb-8 p-0 hover:bg-transparent">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-text-main/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to catalogue
          </Link>
        </Button>

        <div className="bg-surface rounded-3xl overflow-hidden border border-neutral-main shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Image Section */}
            <div className="bg-background-main relative aspect-square md:aspect-auto">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-primary backdrop-blur-sm shadow-sm font-bold border border-primary/20"
                >
                  {product.category}
                </Badge>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h1 className="font-playfair text-4xl font-bold text-text-main mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="text-3xl font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </div>

              <div className="prose prose-stone mb-8">
                <p className="text-text-main/80 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="mt-auto space-y-6">
                <div className="flex items-center justify-between bg-background-main p-4 rounded-xl border border-neutral-main">
                  <span className="font-bold text-text-main">Set Quantity</span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-main overflow-hidden">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-10 rounded-none hover:bg-neutral-main/20"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-10 w-16 rounded-none border-y-0 border-x border-neutral-main px-2 text-center text-lg font-bold bg-transparent"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-10 rounded-none hover:bg-neutral-main/20"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                {isAdded ? (
                  <Button
                    className="w-full gap-3 font-bold text-lg h-16 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                    variant="secondary"
                    asChild
                  >
                    <Link href="/checkout">
                      <ShoppingBag className="size-6" />
                      Go to Checkout
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-3 font-bold text-lg h-16 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                    onClick={() => {
                      addToPreorder({ ...product, kind: "product" }, quantity);
                      setIsAdded(true);
                    }}
                  >
                    <ShoppingBag className="size-6" />
                    Add to Order — ${(product.price * quantity).toFixed(2)}
                  </Button>
                )}
                <p className="text-xs text-center text-text-main/50 font-medium">
                  Available for Delivery in 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
