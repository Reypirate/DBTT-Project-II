import type { CustomerGroup } from "@/context/AuthContext";

export interface SalesRecord {
  dayIndex: number;
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  customerGroup: CustomerGroup;
  recencyDays: number;
  frequency90d: number;
  avgSpend: number;
  totalSpend: number;
  orderCount: number;
}

export interface FeedbackRecord {
  id: string;
  customerId: string;
  text: string;
  createdAt: string;
}

export interface RegressionProjection {
  dayIndex: number;
  date: string;
  predictedRevenue: number;
  kind: "historical-fit" | "forecast";
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  projections: RegressionProjection[];
}

export interface ChurnRiskResult {
  customerId: string;
  probability: number;
  riskLevel: "Low" | "Medium" | "High";
}

export type SentimentLabel = "Positive" | "Neutral" | "Negative";

export interface SentimentResult {
  feedbackId: string;
  score: number;
  label: SentimentLabel;
}

export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seedInt: number): () => number {
  let t = seedInt >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = t;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

export function randRange(random: () => number, min: number, max: number): number {
  return min + (max - min) * random();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function weightedChoice<T>(
  random: () => number,
  weightedItems: Array<{ value: T; weight: number }>,
): T {
  const totalWeight = weightedItems.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * totalWeight;
  for (const item of weightedItems) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }
  return weightedItems[weightedItems.length - 1].value;
}

function formatISODateUTC(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDaysUTC(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toTitleCase(raw: string): string {
  return raw
    .toLowerCase()
    .split(" ")
    .map((word) => (word.length === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join(" ");
}

interface GenerateSalesHistoryOptions {
  days?: number;
  seed: string;
  baseDate?: Date;
}

export function generateSalesHistory({
  days = 90,
  seed,
  baseDate = new Date(),
}: GenerateSalesHistoryOptions): SalesRecord[] {
  const safeDays = Math.max(2, Math.floor(days));
  const random = mulberry32(hashSeed(`${seed}:sales`));
  const firstDate = addDaysUTC(baseDate, -safeDays + 1);

  const history: SalesRecord[] = [];

  for (let i = 0; i < safeDays; i += 1) {
    const currentDate = addDaysUTC(firstDate, i);
    const weeklyWave = Math.sin((2 * Math.PI * (i % 7)) / 7);
    const trend = i * randRange(random, 7.8, 11.6);
    const stochasticNoise = randRange(random, -220, 220);
    const weekendPenalty = [0, 6].includes(currentDate.getUTCDay()) ? -150 : 0;

    const baselineRevenue = 2800 + trend + weeklyWave * 190 + stochasticNoise + weekendPenalty;
    const avgOrderValue = clamp(58 + weeklyWave * 5 + randRange(random, -7, 7), 35, 145);
    const revenue = Math.max(120, round2(baselineRevenue));
    const orders = Math.max(1, Math.round(revenue / avgOrderValue));

    history.push({
      dayIndex: i,
      date: formatISODateUTC(currentDate),
      orders,
      revenue,
      avgOrderValue: round2(avgOrderValue),
    });
  }

  return history;
}

interface GenerateCustomersOptions {
  count?: number;
  seed: string;
}

export function generateCustomers({
  count = 120,
  seed,
}: GenerateCustomersOptions): CustomerProfile[] {
  const safeCount = Math.max(1, Math.floor(count));
  const random = mulberry32(hashSeed(`${seed}:customers`));

  const firstNames = [
    "Wei Jie",
    "Jia Yi",
    "Marcus",
    "Audrey",
    "Darren",
    "Sarah",
    "Ethan",
    "Lydia",
    "Kai",
    "Mei Lin",
    "John",
    "Jasmine",
    "Ivan",
    "Hui Min",
    "Aaron",
    "Gerald",
    "Alicia",
    "Bryan",
    "Felicia",
    "Daniel",
  ];

  const lastNames = [
    "Tan",
    "Lim",
    "Ng",
    "Wong",
    "Koh",
    "Chua",
    "Teo",
    "Lee",
    "Yeo",
    "Goh",
    "Ho",
    "Chew",
    "Lau",
    "Chan",
  ];

  const groups: Array<{ value: CustomerGroup; weight: number }> = [
    { value: "Hokkien", weight: 28 },
    { value: "Teochew", weight: 21 },
    { value: "Cantonese", weight: 16 },
    { value: "Hakka", weight: 12 },
    { value: "Hainanese", weight: 8 },
    { value: "Other", weight: 10 },
    { value: "None", weight: 5 },
  ];

  const customers: CustomerProfile[] = [];

  for (let i = 0; i < safeCount; i += 1) {
    const firstName = firstNames[Math.floor(randRange(random, 0, firstNames.length))];
    const lastName = lastNames[Math.floor(randRange(random, 0, lastNames.length))];
    const name = `${firstName} ${lastName}`;

    const recencySkew = Math.pow(random(), 0.9);
    const frequencySkew = Math.pow(random(), 1.15);
    const spendSkew = Math.pow(random(), 0.75);

    const recencyDays = Math.round(clamp(recencySkew * 160, 0, 180));
    const frequency90d = Math.max(1, Math.round(1 + (1 - frequencySkew) * 22));
    const avgSpend = round2(clamp(35 + spendSkew * 220 + randRange(random, -15, 22), 18, 320));
    const orderCount = Math.max(frequency90d, Math.round(frequency90d + randRange(random, 0, 36)));
    const totalSpend = round2(avgSpend * orderCount);

    customers.push({
      id: `CUST-${String(i + 1).padStart(4, "0")}`,
      name,
      customerGroup: weightedChoice(random, groups),
      recencyDays,
      frequency90d,
      avgSpend,
      totalSpend,
      orderCount,
    });
  }

  return customers;
}

interface GenerateFeedbackOptions {
  customers: CustomerProfile[];
  count?: number;
  seed: string;
  baseDate?: Date;
}

export function generateFeedback({
  customers,
  count = 240,
  seed,
  baseDate = new Date(),
}: GenerateFeedbackOptions): FeedbackRecord[] {
  const safeCount = Math.max(1, Math.floor(count));
  const random = mulberry32(hashSeed(`${seed}:feedback`));

  const positiveFragments = [
    "fast delivery",
    "excellent quality",
    "very respectful service",
    "smooth checkout",
    "reliable support",
    "clear ritual instructions",
    "great value",
    "helpful team",
  ];

  const neutralFragments = [
    "order arrived on time",
    "packaging was standard",
    "items matched description",
    "process was straightforward",
    "service was okay",
    "response time was average",
    "quality was acceptable",
    "no issues so far",
  ];

  const negativeFragments = [
    "delivery was delayed",
    "items were missing",
    "support was slow",
    "quality felt poor",
    "checkout was confusing",
    "packaging was damaged",
    "instructions were unclear",
    "price felt high",
  ];

  const sentimentPrefixes = {
    positive: ["very", "really", "consistently", "exceptionally"],
    neutral: ["generally", "overall", "mostly", "fairly"],
    negative: ["quite", "really", "extremely", "unexpectedly"],
  } as const;

  const records: FeedbackRecord[] = [];

  for (let i = 0; i < safeCount; i += 1) {
    const customer = customers[Math.floor(randRange(random, 0, customers.length))];
    const roll = random();
    const sentimentBucket = roll < 0.5 ? "positive" : roll < 0.78 ? "neutral" : "negative";

    const fragments =
      sentimentBucket === "positive"
        ? positiveFragments
        : sentimentBucket === "negative"
          ? negativeFragments
          : neutralFragments;
    const fragment = fragments[Math.floor(randRange(random, 0, fragments.length))];
    const prefixPool = sentimentPrefixes[sentimentBucket];
    const prefix = prefixPool[Math.floor(randRange(random, 0, prefixPool.length))];

    const optionalClause =
      random() > 0.58
        ? ` and ${neutralFragments[Math.floor(randRange(random, 0, neutralFragments.length))]}`
        : "";

    const text = toTitleCase(`${prefix} ${fragment}${optionalClause}.`);
    const createdAtDate = addDaysUTC(baseDate, -Math.floor(randRange(random, 0, 75)));

    records.push({
      id: `FDB-${String(i + 1).padStart(4, "0")}`,
      customerId: customer.id,
      text,
      createdAt: createdAtDate.toISOString(),
    });
  }

  return records;
}

export function runLinearRegressionDemandForecast(
  history: SalesRecord[],
  forecastDays = 30,
): RegressionResult {
  if (history.length === 0) {
    return { slope: 0, intercept: 0, projections: [] };
  }

  const safeForecastDays = Math.max(1, Math.floor(forecastDays));
  const n = history.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const point of history) {
    const x = point.dayIndex;
    const y = point.revenue;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const projections: RegressionProjection[] = history.map((point) => ({
    dayIndex: point.dayIndex,
    date: point.date,
    predictedRevenue: round2(Math.max(0, slope * point.dayIndex + intercept)),
    kind: "historical-fit",
  }));

  const last = history[history.length - 1];
  const lastDate = new Date(`${last.date}T00:00:00.000Z`);

  for (let i = 1; i <= safeForecastDays; i += 1) {
    const nextIndex = last.dayIndex + i;
    projections.push({
      dayIndex: nextIndex,
      date: formatISODateUTC(addDaysUTC(lastDate, i)),
      predictedRevenue: round2(Math.max(0, slope * nextIndex + intercept)),
      kind: "forecast",
    });
  }

  return {
    slope: round2(slope),
    intercept: round2(intercept),
    projections,
  };
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function scoreCustomerChurn(customer: CustomerProfile): ChurnRiskResult {
  const r = clamp(customer.recencyDays / 90, 0, 1);
  const f = clamp(customer.frequency90d / 20, 0, 1);
  const s = clamp(customer.avgSpend / 250, 0, 1);

  const z = -1.35 + 3.1 * r - 2.25 * f - 1.1 * s;
  const probability = clamp(sigmoid(z), 0, 1);

  const riskLevel =
    probability >= 0.7 ? "High" : probability >= 0.4 && probability < 0.7 ? "Medium" : "Low";

  return {
    customerId: customer.id,
    probability: round2(probability),
    riskLevel,
  };
}

const POSITIVE_WORDS = new Set([
  "fast",
  "excellent",
  "great",
  "smooth",
  "reliable",
  "helpful",
  "clear",
  "respectful",
  "good",
  "satisfied",
  "love",
  "amazing",
  "prompt",
  "friendly",
]);

const NEGATIVE_WORDS = new Set([
  "delayed",
  "missing",
  "slow",
  "poor",
  "confusing",
  "damaged",
  "unclear",
  "high",
  "bad",
  "late",
  "issue",
  "problem",
  "frustrating",
  "disappointed",
]);

const INTENSIFIERS = new Set(["very", "really", "extremely", "highly", "so", "too", "quite"]);
const NEGATIONS = new Set(["not", "never", "no", "hardly", "barely"]);

export function analyzeSentiment(text: string): { score: number; label: SentimentLabel } {
  const tokens = (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).map((token) =>
    token.replace(/'/g, ""),
  );

  if (tokens.length === 0) {
    return { score: 0, label: "Neutral" };
  }

  let score = 0;
  let hits = 0;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : "";

    let value = 0;
    if (POSITIVE_WORDS.has(token)) value = 1;
    if (NEGATIVE_WORDS.has(token)) value = -1;
    if (value === 0) continue;

    if (INTENSIFIERS.has(prev)) value *= 1.5;
    if (NEGATIONS.has(prev)) value *= -1;

    score += value;
    hits += 1;
  }

  const normalized = hits === 0 ? 0 : score / hits;
  const rounded = round2(normalized);

  if (rounded > 0.5) return { score: rounded, label: "Positive" };
  if (rounded < -0.5) return { score: rounded, label: "Negative" };
  return { score: rounded, label: "Neutral" };
}

export function analyzeFeedbackBatch(feedback: FeedbackRecord[]): SentimentResult[] {
  return feedback.map((item) => {
    const analyzed = analyzeSentiment(item.text);
    return {
      feedbackId: item.id,
      score: analyzed.score,
      label: analyzed.label,
    };
  });
}
