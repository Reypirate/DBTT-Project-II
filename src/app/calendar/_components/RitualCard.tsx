"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Info, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BUNDLES } from "@/data/bundles";
import { useAuth } from "@/context/AuthContext";
import { usePreorder } from "@/context/PreorderContext";
import type { Ritual } from "./ritual-utils";
import { getRecommendedBundles } from "./ritual-utils";
import { RitualRecommendations } from "./RitualRecommendations";

type Bundle = (typeof BUNDLES)[number];

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

        <div className="p-6 md:grow flex flex-col justify-between">
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
              <RitualRecommendations
                ritual={ritual}
                recommendedBundles={recommendedBundles}
                recentlyAdded={recentlyAdded}
                onAdd={handleAddToOrder}
                isOpen={isRecommendationsOpen}
                onOpenChange={setIsRecommendationsOpen}
              />
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
