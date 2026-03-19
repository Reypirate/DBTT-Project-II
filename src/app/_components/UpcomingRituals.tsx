import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import { UPCOMING_RITUALS } from "@/data/rituals";

export default function UpcomingRituals() {
  const upcomingRituals = UPCOMING_RITUALS.filter((r) => r.isUpcoming).slice(0, 3);

  return (
    <section className="py-24 bg-background-main">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-text-main mb-4">
            Upcoming Occasions
          </h2>
          <p className="text-text-main/70 max-w-2xl mx-auto">
            Stay prepared for important dates. Here is what is coming up in the lunar calendar.
          </p>
        </div>

        <div className="space-y-6">
          {upcomingRituals.map((ritual, idx) => (
            <Card
              key={ritual.id || idx}
              className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg hover:border-primary/30 transition-all group border-neutral-main"
            >
              <div className="flex-shrink-0 w-full md:w-48 p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
                <p className="text-sm font-bold tracking-widest text-primary uppercase mb-1">
                  Gregorian
                </p>
                <p className="font-playfair text-2xl font-bold text-text-main mb-3">
                  {new Date(ritual.date).toLocaleDateString("en-SG", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="border-t border-primary/10 pt-3">
                  <p className="text-xs font-medium text-text-main/50 uppercase">Lunar</p>
                  <p className="text-sm font-bold text-secondary">{ritual.lunarDate}</p>
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="font-playfair text-2xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                  {ritual.name}
                </h3>
                <p className="text-text-main/70 leading-relaxed mb-4">{ritual.description}</p>
              </div>

              <div className="flex-shrink-0 self-start md:self-center w-full md:w-auto">
                <Button asChild variant="outline">
                  <Link href="/calendar">Set Reminder</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/calendar" className="inline-flex items-center gap-2">
              View Full Lunar Calendar
              <CalendarHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
