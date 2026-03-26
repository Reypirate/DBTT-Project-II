"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function ForecastModelPage() {
  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <Card className="border-neutral-main">
          <CardHeader>
            <CardTitle className="font-playfair text-3xl flex items-center gap-2">
              <TrendingUp className="size-7 text-secondary" />
              Forecast Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-text-main/70">
              Placeholder forecast workspace for demand-planning simulations and seasonal reorder
              projections.
            </p>
            <div className="rounded-xl border border-dashed border-neutral-main/40 bg-surface p-8 text-center">
              <p className="font-semibold text-text-main">Model output panel coming soon</p>
              <p className="text-sm text-text-main/60 mt-2">
                Use this page to host forecasting charts and scenario controls.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
