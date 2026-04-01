"use client";

import { useMemo } from "react";
import { MOCK_INVENTORY } from "@/data/products";
import {
  analyzeFeedbackBatch,
  generateCustomers,
  generateFeedback,
  generateSalesHistory,
  hashSeed,
  runLinearRegressionDemandForecast,
  scoreCustomerChurn,
} from "@/lib/analytics-engine";

export function useAnalyticsEngine() {
  return useMemo(() => {
    const seed = "hinlong-analytics-v1";
    const baseDate = new Date("2026-03-30T00:00:00.000Z");

    const salesHistory = generateSalesHistory({ days: 90, seed, baseDate });
    const regression = runLinearRegressionDemandForecast(salesHistory, 30);
    const historicalFit = regression.projections.filter((row) => row.kind === "historical-fit");
    const forecast = regression.projections.filter((row) => row.kind === "forecast");
    const baseline = historicalFit[historicalFit.length - 1]?.predictedRevenue ?? 1;

    const forecastGrowth = forecast.slice(0, 5).map((row) => {
      const growthPct = baseline > 0 ? ((row.predictedRevenue - baseline) / baseline) * 100 : 0;
      return Math.max(1, Math.round(Math.abs(growthPct)));
    });

    const adaptedSurgingProducts = MOCK_INVENTORY.filter((item) => item.trend === "up")
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        projectedDemand:
          forecastGrowth[index] ?? Math.max(1, Math.round(Math.abs(item.projectedDemand))),
      }));

    const customers = generateCustomers({ count: 180, seed });
    const churnByRegion = customers
      .map((customer) => ({
        customer,
        probability: scoreCustomerChurn(customer).probability,
      }))
      .reduce(
        (acc, row) => {
          const region = hashSeed(`${seed}:${row.customer.id}`) % 4 === 0 ? "overseas" : "local";
          acc[region].sum += row.probability;
          acc[region].count += 1;
          return acc;
        },
        {
          local: { sum: 0, count: 0 },
          overseas: { sum: 0, count: 0 },
        },
      );

    const localChurnProbability =
      churnByRegion.local.count > 0 ? churnByRegion.local.sum / churnByRegion.local.count : 0;
    const overseasChurnProbability =
      churnByRegion.overseas.count > 0
        ? churnByRegion.overseas.sum / churnByRegion.overseas.count
        : 0;
    const churnGapPct =
      localChurnProbability > 0
        ? ((localChurnProbability - overseasChurnProbability) / localChurnProbability) * 100
        : 0;

    const feedback = generateFeedback({
      customers,
      count: 260,
      seed,
      baseDate,
    });
    const sentiment = analyzeFeedbackBatch(feedback);
    const sentimentCounts = sentiment.reduce(
      (acc, row) => {
        acc[row.label] += 1;
        return acc;
      },
      { Positive: 0, Neutral: 0, Negative: 0 },
    );
    const dominantSentiment = (
      Object.entries(sentimentCounts) as Array<[keyof typeof sentimentCounts, number]>
    ).sort((a, b) => b[1] - a[1])[0][0];
    const positiveShare =
      feedback.length > 0 ? (sentimentCounts.Positive / feedback.length) * 100 : 0;

    return {
      adaptedSurgingProducts,
      localChurnProbability,
      overseasChurnProbability,
      churnGapPct,
      dominantSentiment,
      positiveShare,
    };
  }, []);
}
