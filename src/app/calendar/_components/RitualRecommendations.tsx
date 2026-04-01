"use client";

import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Ritual } from "./ritual-utils";
import { BUNDLES } from "@/data/bundles";

type Bundle = (typeof BUNDLES)[number];

interface RecommendationsProps {
  ritual: Ritual;
  recommendedBundles: Bundle[];
  recentlyAdded: Record<string, boolean>;
  onAdd: (bundle: Bundle) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RitualRecommendations({
  ritual,
  recommendedBundles,
  recentlyAdded,
  onAdd,
  isOpen,
  onOpenChange,
}: RecommendationsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium group"
        >
          View Recommended Bundles
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Recommended Bundles</DialogTitle>
          <DialogDescription>Contextual recommendations for {ritual.name}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
          {recommendedBundles.map((bundle) => (
            <div
              key={bundle.id}
              className="rounded-xl border border-neutral-main/40 bg-surface p-4 flex items-start gap-3"
            >
              <img
                src={bundle.image}
                alt={bundle.name}
                className="h-16 w-16 rounded-md object-cover border border-neutral-main/30"
              />
              <div className="grow min-w-0">
                <p className="font-semibold text-text-main">{bundle.name}</p>
                <p className="text-xs text-text-main/70 line-clamp-2 mb-2">{bundle.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-primary">${bundle.price.toFixed(2)}</p>
                  <Button
                    size="sm"
                    variant={recentlyAdded[bundle.id] ? "default" : "outline"}
                    disabled={Boolean(recentlyAdded[bundle.id])}
                    onClick={() => onAdd(bundle)}
                    className="inline-flex items-center gap-1"
                  >
                    {recentlyAdded[bundle.id] ? (
                      <>
                        <Check className="size-3.5" />
                        Added
                      </>
                    ) : (
                      "Add to Order"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
