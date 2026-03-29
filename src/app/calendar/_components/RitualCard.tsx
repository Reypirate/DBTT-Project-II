"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Check, ChevronRight, Info, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { BUNDLES } from "@/data/bundles";
import { useAuth } from "@/context/AuthContext";
import { usePreorder } from "@/context/PreorderContext";

export interface Ritual {
  id: string;
  name: string;
  date: string;
  lunarDate: string;
  description: string;
  type: string;
  isUpcoming: boolean;
}

type Bundle = (typeof BUNDLES)[number];

const BUNDLE_BY_ID = new Map<string, Bundle>(BUNDLES.map((bundle) => [bundle.id, bundle]));

function selectBundles(ids: string[]): Bundle[] {
  return ids
    .map((id) => BUNDLE_BY_ID.get(id))
    .filter((bundle): bundle is Bundle => Boolean(bundle));
}

function getRecommendedBundles(ritual: Ritual): Bundle[] {
  const normalizedName = ritual.name.toLowerCase();

  if (
    ritual.type === "personal" ||
    normalizedName.includes("anniversary") ||
    normalizedName.includes("ancestor")
  ) {
    return selectBundles(["b1", "b2", "b3"]);
  }

  if (ritual.type === "deity" || normalizedName.includes("guan yin")) {
    return selectBundles(["b3", "b5", "b4"]);
  }

  if (
    ritual.type === "festival" ||
    normalizedName.includes("ghost") ||
    normalizedName.includes("qingming")
  ) {
    return selectBundles(["b1", "b2", "b4"]);
  }

  return selectBundles(["b1", "b3", "b5"]);
}

export default function RitualCard({ ritual }: { ritual: Ritual }) {
  const { user } = useAuth();
  const { addToPreorder } = usePreorder();
  const isMember = user?.tier === "Member";
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const resetTimers = useRef<Record<string, number>>({});

  const recommendedBundles = useMemo(() => getRecommendedBundles(ritual), [ritual]);

  useEffect(() => {
    return () => {
      Object.values(resetTimers.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleAddToOrder = (bundle: Bundle) => {
    addToPreorder(
      {
        id: bundle.id,
        name: bundle.name,
        price: bundle.price,
        image: bundle.image,
        kind: "bundle",
      },
      1,
    );

    setRecentlyAdded((prev) => ({ ...prev, [bundle.id]: true }));

    const existingTimeout = resetTimers.current[bundle.id];
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    resetTimers.current[bundle.id] = window.setTimeout(() => {
      setRecentlyAdded((prev) => {
        if (!prev[bundle.id]) return prev;
        const next = { ...prev };
        delete next[bundle.id];
        return next;
      });
      delete resetTimers.current[bundle.id];
    }, 1500);
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${ritual.isUpcoming ? "border-primary/30 shadow-sm" : "border-neutral-main"}`}
    >
      <div className="flex flex-col md:flex-row">
        <div
          className={`p-6 md:w-64 flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-main ${ritual.isUpcoming ? "bg-primary/5" : "bg-surface"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <CalendarIcon className="size-5" />
              <span>Gregorian</span>
            </div>
          </div>
          <div className="font-playfair text-3xl font-bold text-text-main mb-1">
            {new Date(ritual.date).toLocaleDateString("en-SG", {
              day: "numeric",
              month: "long",
            })}
          </div>
          <div className="text-text-main/60 text-sm mb-4">
            {new Date(ritual.date).toLocaleDateString("en-SG", {
              year: "numeric",
              weekday: "long",
            })}
          </div>

          <div className="pt-4 border-t border-neutral-main/50">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Moon className="size-4" />
              <span className="text-sm font-medium">Lunar Date</span>
            </div>
            <div className="font-medium text-text-main">{ritual.lunarDate}</div>
          </div>
        </div>

        <div className="p-6 md:flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-playfair text-2xl font-bold text-text-main">{ritual.name}</h3>
              <Badge
                variant="secondary"
                className="bg-secondary/10 text-secondary border border-secondary/20"
              >
                {ritual.type.charAt(0).toUpperCase() + ritual.type.slice(1)}
              </Badge>
            </div>
            <p className="text-text-main/70">{ritual.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-text-main/60 bg-surface px-3 py-1.5 rounded-lg border border-neutral-main">
              <Info className="size-4" />
              We recommend ordering 7 days in advance.
            </div>

            {isMember ? (
              <Dialog open={isRecommendationsOpen} onOpenChange={setIsRecommendationsOpen}>
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
                    <DialogTitle className="font-playfair text-2xl">
                      Recommended Bundles
                    </DialogTitle>
                    <DialogDescription>
                      Contextual recommendations for {ritual.name}.
                    </DialogDescription>
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
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-text-main">{bundle.name}</p>
                          <p className="text-xs text-text-main/70 line-clamp-2 mb-2">
                            {bundle.description}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-primary">
                              ${bundle.price.toFixed(2)}
                            </p>
                            <Button
                              size="sm"
                              variant={recentlyAdded[bundle.id] ? "default" : "outline"}
                              disabled={Boolean(recentlyAdded[bundle.id])}
                              onClick={() => handleAddToOrder(bundle)}
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
                    <Button onClick={() => setIsRecommendationsOpen(false)} className="w-full">
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold text-primary/40 border-primary/20"
              >
                Member Feature: Bundle Recommendations
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
