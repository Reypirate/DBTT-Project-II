import * as React from "react";
import { ArrowLeft, ShoppingCart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUNDLES } from "@/data/bundles";

export default function BundleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const bundle = BUNDLES.find((b) => b.id === id);

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
                  What's inside this bundle:
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

              <Button className="w-full gap-3 font-bold text-lg h-14 mt-auto">
                <ShoppingCart className="size-5" />
                Add to Preorder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
