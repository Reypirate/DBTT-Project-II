"use client";

import { customerGroupRevenueData } from "./analytics-data";

export function RegionalInsightsTable() {
  return (
    <div className="pt-8 mt-2 border-t border-neutral-main/10">
      <h4 className="text-sm font-semibold text-text-main/80 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-secondary" />
        Purchasing Breakdown by Customer Group
      </h4>
      <div className="overflow-x-auto rounded-xl border border-neutral-main/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-text-main/60 text-xs uppercase tracking-wider">
              <th className="p-3 text-left font-bold w-1/4">Group</th>
              <th className="p-3 text-right font-bold w-1/6">Retention</th>
              <th className="p-3 text-left font-bold min-w-[200px]">Top Product</th>
              <th className="p-3 text-right font-bold w-[100px]">Orders</th>
              <th className="p-3 text-right font-bold w-[100px]">Avg Order</th>
              <th className="p-3 text-right font-bold w-1/6">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-main/10">
            {customerGroupRevenueData.map((item) => (
              <tr key={item.group} className="hover:bg-surface/50 transition-colors">
                <td className="p-3 font-bold text-text-main">{item.group}</td>
                <td className="p-3 text-right font-semibold text-secondary">
                  {item.retentionRate}%
                </td>
                <td className="p-3 text-text-main/70">{item.topProduct}</td>
                <td className="p-3 text-right font-medium text-text-main">{item.orders}</td>
                <td className="p-3 text-right font-medium text-text-main">
                  ${item.avgOrderValue.toFixed(2)}
                </td>
                <td className="p-3 text-right font-bold text-primary">
                  ${item.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
