"use client";

import { BellRing } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UPCOMING_RITUALS } from "@/data/rituals";
import RitualCard from "./_components/RitualCard";
import type { Ritual } from "./_components/ritual-utils";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

interface StoredAncestor {
  id: string;
  name: string;
  birthday?: string | null;
  passingDate?: string | null;
}

const REMEMBRANCE_STORAGE_KEY = "hinlong_remembrances";

function isStoredAncestor(value: unknown): value is StoredAncestor {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredAncestor>;
  return typeof candidate.id === "string" && typeof candidate.name === "string";
}

function buildAncestorRituals(ancestors: StoredAncestor[]): Ritual[] {
  return ancestors.flatMap((ancestor) => {
    const events: Ritual[] = [];

    if (ancestor.birthday) {
      events.push({
        id: `bday-${ancestor.id}`,
        name: `${ancestor.name}'s Birthday`,
        date: ancestor.birthday,
        lunarDate: "Family Occasion",
        description: `A special day to honor the life of ${ancestor.name}.`,
        type: "personal",
        isUpcoming: true,
      });
    }

    if (ancestor.passingDate) {
      events.push({
        id: `passing-${ancestor.id}`,
        name: `${ancestor.name}'s Passing Anniversary`,
        date: ancestor.passingDate,
        lunarDate: "Family Occasion",
        description: `A respectful day of remembrance for ${ancestor.name}.`,
        type: "personal",
        isUpcoming: true,
      });
    }

    return events;
  });
}

function sortByDateAscending(rituals: Ritual[]) {
  return [...rituals].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function RitualCalendarPage() {
  const { user } = useAuth();
  const isMember = user?.tier === "Member";
  const [rituals, setRituals] = useState<Ritual[]>(UPCOMING_RITUALS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isMember) {
      setRituals(UPCOMING_RITUALS);
      return;
    }

    try {
      const raw = localStorage.getItem(REMEMBRANCE_STORAGE_KEY);
      if (!raw) {
        setRituals(UPCOMING_RITUALS);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;
      const ancestors = Array.isArray(parsed) ? parsed.filter(isStoredAncestor) : [];
      const ancestorRituals = buildAncestorRituals(ancestors);
      const combined = sortByDateAscending([...UPCOMING_RITUALS, ...ancestorRituals]);
      setRituals(combined);
    } catch {
      setRituals(UPCOMING_RITUALS);
    }
  }, [isMember]);

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
            <Link href="/membership" className="inline-flex items-center gap-2">
              <BellRing className="size-5" />
              Get Notified
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {rituals.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      </div>
    </div>
  );
}
