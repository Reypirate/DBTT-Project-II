"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CalendarHeart, Flame, Bell } from "lucide-react";
import { UPCOMING_RITUALS } from "@/data/rituals";
import { useAuth } from "@/context/AuthContext";

export default function UpcomingRituals() {
  const { user } = useAuth();
  const upcomingRituals = UPCOMING_RITUALS.filter((r) => r.isUpcoming).slice(0, 3);
  const isSubscriber = user?.tier === "Subscriber";

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

                {isSubscriber && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-2 bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20"
                    >
                      <Bell className="size-4" />
                      Reminders Active
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                    >
                      <Flame className="size-4" />
                      Request Proxy Burning
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 self-start md:self-center w-full md:w-auto flex flex-col gap-2">
                <Button asChild variant={isSubscriber ? "ghost" : "outline"}>
                  <Link href="/calendar">{isSubscriber ? "View Management" : "Set Reminder"}</Link>
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
