import * as React from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/data/products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
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

              <div className="mt-auto space-y-4">
                <Button className="w-full gap-3 font-bold text-lg h-14">
                  <ShoppingBag className="size-5" />
                  Add to Preorder
                </Button>
                <p className="text-xs text-center text-text-main/50">
                  Pickup at 638 Jurong West Street 61 #01-05
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
