"use client";

import { useMemo } from "react";
import { customerGroupRevenueData } from "./analytics-data";

export function CustomerGroupStats() {
  const averageRetentionRate = useMemo(
    () =>
      Math.round(
        customerGroupRevenueData.reduce((sum, group) => sum + group.retentionRate, 0) /
          customerGroupRevenueData.length,
      ),
    [],
  );

  const topRetentionSegment = useMemo(
    () =>
      customerGroupRevenueData.reduce((best, current) =>
        current.retentionRate > best.retentionRate ? current : best,
      ),
    [],
  );

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-neutral-main/30 bg-surface p-5">
        <p className="text-xs uppercase tracking-wider text-text-main/60">Avg Retention Rate</p>
        <p className="text-3xl font-bold text-primary mt-1">{averageRetentionRate}%</p>
      </div>
      <div className="rounded-xl border border-neutral-main/30 bg-surface p-5">
        <p className="text-xs uppercase tracking-wider text-text-main/60">Top Retained Segment</p>
        <p className="text-3xl font-bold text-primary mt-1">{topRetentionSegment.group}</p>
        <p className="text-xs text-text-main/60 mt-1">
          {topRetentionSegment.retentionRate}% returning customers
        </p>
      </div>
    </div>
  );
}
