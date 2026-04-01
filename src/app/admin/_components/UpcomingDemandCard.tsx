"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UpcomingDemandCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl">Upcoming Ritual Demand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <h3 className="font-bold text-primary mb-2">Qingming Festival Approaching</h3>
          <p className="text-sm text-text-main/80 mb-4">
            Expected surge in bundle requests in 14 days based on your customer member base.
          </p>
          <Button size="sm" asChild>
            <Link href="/admin/inventory">Review Inventory</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
