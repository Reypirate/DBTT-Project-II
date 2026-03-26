"use client";

import * as React from "react";
import { ArrowLeft, ShoppingCart, CheckCircle2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BUNDLES } from "@/data/bundles";
import { usePreorder } from "@/context/PreorderContext";

export default function BundleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const bundle = BUNDLES.find((b) => b.id === id);
  const { addToPreorder, preorderItems } = usePreorder();
  const [quantityInput, setQuantityInput] = React.useState("1");
  const [recentlyAdded, setRecentlyAdded] = React.useState(false);

  const quantity = React.useMemo(() => {
    const parsed = Number.parseInt(quantityInput, 10);
    if (Number.isNaN(parsed)) return 1;
    return Math.max(1, Math.min(99, parsed));
  }, [quantityInput]);

  const updateQuantity = (next: number) => {
    setQuantityInput(String(Math.max(1, Math.min(99, Math.floor(next)))));
  };

  const handleAddToOrder = () => {
    if (!bundle) return;
    addToPreorder(
      {
        id: bundle.id,
        name: bundle.name,
        price: bundle.price,
        image: bundle.image,
        kind: "bundle",
      },
      quantity,
    );
    setRecentlyAdded(true);
  };

  if (!bundle) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-bold text-text-main mb-4">Bundle not found</h2>
          <Button asChild variant="link">
            <Link href="/bundles">Return to Bundles</Link>
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
            href="/bundles"
            className="inline-flex items-center gap-2 text-text-main/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to all bundles
          </Link>
        </Button>

        <div className="bg-white rounded-3xl overflow-hidden border border-neutral-main shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Image Section */}
            <div className="bg-surface relative aspect-square md:aspect-auto">
              <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-primary backdrop-blur-sm shadow-sm font-bold"
                >
                  {bundle.category}
                </Badge>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h1 className="font-playfair text-4xl font-bold text-text-main mb-2">
                {bundle.name}
              </h1>
              <div className="text-3xl font-bold text-primary mb-6">${bundle.price.toFixed(2)}</div>

              <div className="prose prose-stone mb-8">
                <p className="text-text-main/80 text-lg leading-relaxed">{bundle.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-secondary" />
                  What&apos;s inside this bundle:
                </h3>
                <ul className="space-y-3">
                  {bundle.items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-text-main/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-3">
                  {!recentlyAdded && (
                    <div className="inline-flex items-center rounded-lg border border-neutral-main bg-surface">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-r-none"
                        onClick={() => updateQuantity(quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={99}
                        value={quantityInput}
                        onChange={(e) => setQuantityInput(e.target.value)}
                        onBlur={() => updateQuantity(quantity)}
                        className="w-20 text-center border-y-0 border-x border-neutral-main rounded-none h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Quantity"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => updateQuantity(quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  )}
                  {recentlyAdded ? (
                    <Button
                      asChild
                      variant="secondary"
                      className="flex-1 gap-3 font-bold text-lg h-10"
                    >
                      <Link href="/checkout">
                        <ShoppingCart className="size-5" />
                        Go to Checkout
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToOrder}
                      className="flex-1 gap-3 font-bold text-lg h-10"
                    >
                      <ShoppingCart className="size-5" />
                      Add to Order
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-text-main/60">
                  <span>{preorderItems.length} item(s) in cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
