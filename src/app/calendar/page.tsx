"use client";

import { BellRing } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UPCOMING_RITUALS } from "@/data/rituals";
import RitualCard from "./_components/RitualCard";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function RitualCalendarPage() {
  const { user } = useAuth();
  const isSubscriber = user?.tier === "Subscriber";
  const [rituals, setRituals] = useState(UPCOMING_RITUALS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isSubscriber) {
      const saved = localStorage.getItem("hinlong_remembrances");
      if (saved) {
        const ancestors = JSON.parse(saved);
        const ancestorRituals = ancestors.flatMap((a: any) => {
          const events = [];
          if (a.birthday) {
            events.push({
              id: `bday-${a.id}`,
              name: `${a.name}'s Birthday`,
              date: a.birthday,
              lunarDate: "Family Occasion",
              description: `A special day to honor the life of ${a.name}.`,
              type: "personal",
              isUpcoming: true,
            });
          }
          if (a.passingDate) {
            events.push({
              id: `passing-${a.id}`,
              name: `${a.name}'s Passing Anniversary`,
              date: a.passingDate,
              lunarDate: "Family Occasion",
              description: `A respectful day of remembrance for ${a.name}.`,
              type: "personal",
              isUpcoming: true,
            });
          }
          return events;
        });

        // Merge and sort
        const combined = [...UPCOMING_RITUALS, ...ancestorRituals].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        setRituals(combined);
      }
    } else {
      setRituals(UPCOMING_RITUALS);
    }
  }, [isSubscriber]);

  if (!mounted) return null;

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-text-main mb-3">
              Ritual Calendar
            </h1>
            <p className="text-text-main/70 max-w-xl">
              Stay prepared for important dates. We automatically track both Gregorian and Lunar
              dates so you never miss a meaningful occasion.
            </p>
          </div>
          <Button asChild>
            <Link href="/subscribe" className="inline-flex items-center gap-2">
              <BellRing className="size-5" />
              Subscribe to Reminders
            </Link>
          </Button>
        </div>

        {/* Calendar List */}
        <div className="space-y-6">
          {rituals.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      </div>
    </div>
  );
}
