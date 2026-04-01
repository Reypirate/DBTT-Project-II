"use client";

import { Megaphone, Target, RotateCcw } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ageDemographicData, THEME_COLORS } from "./analytics-data";

interface DemographicAnalysisProps {
  mlAdapters: {
    dominantSentiment: string;
    positiveShare: number;
  };
}

export function DemographicAnalysis({ mlAdapters }: DemographicAnalysisProps) {
  return (
    <CardContent className="p-0 sm:p-6">
      <div className="flex flex-col gap-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="h-[280px] w-full">
            <ChartContainer
              config={{
                proxyBookings: { label: "Proxy Bookings", color: THEME_COLORS.primary },
                diyBundles: { label: "DIY Bundles", color: THEME_COLORS.secondary },
                memberships: { label: "Memberships", color: THEME_COLORS.chart1 },
              }}
              className="aspect-none h-full w-full"
            >
              <BarChart
                data={ageDemographicData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="bracket"
                  tickLine={false}
                  axisLine={false}
                  className="text-[10px] sm:text-[11px]"
                />
                <YAxis tickLine={false} axisLine={false} className="text-[11px]" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="proxyBookings"
                  stackId="a"
                  fill={THEME_COLORS.primary}
                  radius={[0, 0, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="diyBundles"
                  stackId="a"
                  fill={THEME_COLORS.secondary}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="memberships"
                  stackId="a"
                  fill={THEME_COLORS.chart1}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="space-y-6">
            <Alert className="bg-primary/5 border-primary/20">
              <Megaphone className="h-4 w-4 text-primary" />
              <AlertTitle className="text-sm font-bold text-primary">Sentiment Signal</AlertTitle>
              <AlertDescription className="text-xs mt-1.5 text-text-main/80 leading-relaxed">
                Feedback classification is currently{" "}
                <strong>{mlAdapters.dominantSentiment.toLowerCase()}</strong>, with{" "}
                <strong>{mlAdapters.positiveShare.toFixed(1)}% positive sentiment</strong> across
                deterministic customer responses.
              </AlertDescription>
            </Alert>

            <div className="p-5 border border-neutral-main/20 rounded-xl bg-surface">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-main/50 mb-4">
                Strategic Marketing Responses
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="justify-start gap-3 h-11 border-neutral-main/30 hover:bg-primary/5 hover:text-primary transition-all group"
                >
                  <Target className="size-4 opacity-50 group-hover:opacity-100" />
                  <span className="text-xs font-semibold">Run "Convenience" Ads (Ages 18-40)</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3 h-11 border-neutral-main/30 hover:bg-secondary/5 hover:text-secondary transition-all group"
                >
                  <RotateCcw className="size-4 opacity-50 group-hover:opacity-100" />
                  <span className="text-xs font-semibold">Launch "How-To" Ritual Email Series</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
