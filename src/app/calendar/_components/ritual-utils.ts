"use client";

import { BUNDLES } from "@/data/bundles";

export interface Ritual {
  id: string;
  name: string;
  date: string;
  lunarDate: string;
  description: string;
  type: string;
  isUpcoming: boolean;
}

type Bundle = (typeof BUNDLES)[number];

const BUNDLE_BY_ID = new Map<string, Bundle>(BUNDLES.map((bundle) => [bundle.id, bundle]));

function selectBundles(ids: string[]): Bundle[] {
  return ids
    .map((id) => BUNDLE_BY_ID.get(id))
    .filter((bundle): bundle is Bundle => Boolean(bundle));
}

export function getRecommendedBundles(ritual: Ritual): Bundle[] {
  const normalizedName = ritual.name.toLowerCase();

  if (
    ritual.type === "personal" ||
    normalizedName.includes("anniversary") ||
    normalizedName.includes("ancestor")
  ) {
    return selectBundles(["b1", "b2", "b3"]);
  }

  if (ritual.type === "deity" || normalizedName.includes("guan yin")) {
    return selectBundles(["b3", "b5", "b4"]);
  }

  if (
    ritual.type === "festival" ||
    normalizedName.includes("ghost") ||
    normalizedName.includes("qingming")
  ) {
    return selectBundles(["b1", "b2", "b4"]);
  }

  return selectBundles(["b1", "b3", "b5"]);
}
