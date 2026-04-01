"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/data/mock-orders";

export function RecentOrdersList() {
  return (
    <Card className="h-full border-neutral-main">
      <CardHeader className="pb-3 border-b border-neutral-main/10">
        <CardTitle className="font-playfair text-xl flex justify-between items-center">
          Recent Orders
          <Button variant="link" size="sm" asChild className="p-0 h-auto font-medium text-primary">
            <Link href="/admin/orders">View All</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 sm:pb-4 pt-1">
        <div className="divide-y divide-neutral-main/10">
          {MOCK_ORDERS.slice(0, 4).map((order) => (
            <div
              key={order.id}
              className="p-4 sm:px-6 hover:bg-surface/50 transition-colors flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-sm text-text-main mb-1">
                  {order.id} &bull; {order.customer}
                </p>
                <p className="text-[11px] text-text-main/60">
                  {order.items.length} item(s) &bull; Pickup:{" "}
                  {new Date(order.pickupDate).toLocaleDateString("en-SG", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="font-bold text-sm text-primary mb-1">${order.total.toFixed(2)}</p>
                <Badge
                  className={`text-[9px] uppercase px-1.5 py-0 border-neutral-main/30 bg-surface text-text-main hover:bg-surface`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
