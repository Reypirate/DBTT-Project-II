import { BellRing } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UPCOMING_RITUALS } from "@/data/rituals";
import RitualCard from "./_components/RitualCard";

export default function RitualCalendarPage() {
  const rituals = UPCOMING_RITUALS;

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
