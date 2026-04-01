"use client";

import { Flame, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProxyQueueOverview() {
  return (
    <Card className="border-primary/10 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="font-playfair text-xl flex items-center gap-2">
          <Flame className="size-5 text-primary" />
          Proxy Queue Overview
        </CardTitle>
        <Button
          size="sm"
          asChild
          variant="ghost"
          className="text-primary hover:text-primary hover:bg-primary/5"
        >
          <Link href="/admin/proxy-queue" className="flex items-center gap-1 font-bold">
            Manage Queue <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 mb-1">
              Awaiting Action
            </p>
            <p className="text-3xl font-bold text-text-main font-playfair">12</p>
          </div>
          <div className="w-px h-12 bg-primary/10" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 mb-1">
              In Fulfillment
            </p>
            <p className="text-3xl font-bold text-primary font-playfair">08</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-text-main/60 mt-4 italic">
              All proxy service orders require video proof upon completion.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
