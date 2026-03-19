import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronRight, Info, Moon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface Ritual {
  id: string;
  name: string;
  date: string;
  lunarDate: string;
  description: string;
  type: string;
  isUpcoming: boolean;
}

export default function RitualCard({ ritual }: { ritual: Ritual }) {
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${ritual.isUpcoming ? "border-primary/30 shadow-sm" : "border-neutral-main"}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Date Block */}
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

        {/* Details Block */}
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
              We recommend preordering 7 days in advance.
            </div>

            <Link
              href="/bundles"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium group"
            >
              View Recommended Bundles
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
