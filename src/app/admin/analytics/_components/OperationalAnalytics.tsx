"use client";

import { TrendingUp } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Line, ComposedChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  revenueData,
  topBundleSalesData,
  peakSeasonForecastData,
  bundleDemandData,
  proxyCapacityData,
  THEME_COLORS,
} from "./analytics-data";

const chartConfig = {
  revenue: { label: "Revenue ($)", color: THEME_COLORS.primary },
  orders: { label: "Orders Count", color: THEME_COLORS.secondary },
} satisfies ChartConfig;

export function OperationalAnalytics() {
  return (
    <CardContent className="p-0 sm:p-6">
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Annual Revenue Trend & Festival Peaks
          </h4>
          <div className="h-[240px] w-full">
            <ChartContainer config={chartConfig} className="aspect-none h-full w-full">
              <AreaChart data={revenueData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME_COLORS.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={THEME_COLORS.primary} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-[11px] text-text-main/60"
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#revenueGrad)"
                  stroke={THEME_COLORS.primary}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-neutral-main/10">
          <div>
            <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Top Product Bundles
            </h4>
            <div className="h-[180px]">
              <ChartContainer
                config={{
                  sales: { label: "Total Sales", color: THEME_COLORS.secondary },
                }}
                className="aspect-none h-full w-full"
              >
                <BarChart
                  data={topBundleSalesData}
                  layout="vertical"
                  margin={{ left: 0, right: 10, top: 0, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="label"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    className="text-[10px] text-text-main/60"
                    width={110}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="sales"
                    fill={THEME_COLORS.secondary}
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-6 space-y-4">
              <Alert className="bg-primary/5 border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-bold text-primary">Surge Alert</AlertTitle>
                <AlertDescription className="text-xs mt-1.5 text-text-main/80 leading-relaxed">
                  The <strong>'Qingming Essential Kit'</strong> is seeing a{" "}
                  <strong>45% week-over-week increase</strong> in pre-orders. Recommend increasing
                  inventory allocation.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              Peak Season Forecast
            </h4>
            <div className="bg-surface border border-neutral-main/20 rounded-xl p-5 h-full flex flex-col justify-center">
              <div className="space-y-4">
                {peakSeasonForecastData.map((forecast) => (
                  <div key={forecast.season} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-main/70">{forecast.season}</span>
                      <span className="font-bold text-secondary">
                        +{forecast.demandLiftPercent}% Demand
                      </span>
                    </div>
                    <div className="text-xs text-text-main/60">
                      {forecast.focusItem} {forecast.daysUntil} days {forecast.confidencePercent}%
                      confidence
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-main/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 mb-3">
                Growth Projections
              </p>
              <div className="space-y-2">
                {bundleDemandData.slice(0, 2).map((bundle) => (
                  <div
                    key={bundle.bundleName}
                    className="flex justify-between items-center text-[11px]"
                  >
                    <span className="text-text-main/70">{bundle.bundleName}</span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-100 bg-green-50 text-[9px] py-0 h-4"
                    >
                      +{bundle.projectedGrowth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proxy Capacity */}
        <div className="pt-8 mt-2 border-t border-neutral-main/10">
          <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Proxy Capacity Risk Forecasting
          </h4>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="h-[220px] w-full">
              <ChartContainer
                config={{
                  requests: { label: "Projected", color: THEME_COLORS.primary },
                  capacity: { label: "Limit", color: "#ef4444" },
                }}
                className="aspect-none h-full w-full"
              >
                <ComposedChart
                  data={proxyCapacityData}
                  margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-[11px] text-text-main/60"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Area
                    dataKey="projectedRequests"
                    type="monotone"
                    fill={THEME_COLORS.primary}
                    fillOpacity={0.15}
                    stroke={THEME_COLORS.primary}
                    strokeWidth={2}
                  />
                  <Line
                    dataKey="capacityLimit"
                    type="step"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
