"use client";

import { Check } from "lucide-react";
import { FEATURE_ICONS } from "../_lib/membership-data";
import { Button } from "@/components/ui/button";

interface Tier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  highlighted: boolean;
}

interface MembershipTierCardProps {
  tier: Tier;
  isCurrent: boolean;
  onSelect: () => void;
}

export function MembershipTierCard({ tier, isCurrent, onSelect }: MembershipTierCardProps) {
  return (
    <div
      key={tier.name}
      className={`relative group h-full flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
        tier.highlighted
          ? "bg-surface border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary"
          : "bg-background-main border-neutral-main hover:border-text-main/20 hover:shadow-xl"
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
          MOST POPULAR
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-text-main mb-2">{tier.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
          <span className="text-text-main/50 font-medium">{tier.period}</span>
        </div>
        <p className="mt-4 text-text-main/70 text-sm leading-relaxed">{tier.description}</p>
      </div>

      <div className="space-y-4 flex-grow mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-text-main/40">
          What&apos;s included
        </p>
        <ul className="space-y-3">
          {tier.features.map((feature, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 transition-colors duration-200 ${
                feature.included ? "text-text-main" : "text-text-main/30"
              }`}
            >
              <div className="mt-1 shrink-0">
                {feature.included ? (
                  <Check className="size-4 text-primary" />
                ) : (
                  <div className="size-4 border border-current rounded-full flex items-center justify-center opacity-20">
                    <div className="size-1 bg-current rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>{feature.text}</span>
                {feature.included && FEATURE_ICONS[feature.text]}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={`w-full py-6 rounded-2xl font-bold transition-all duration-300 ${
          tier.highlighted && !isCurrent
            ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
            : "bg-neutral-main/10 text-text-main hover:bg-neutral-main/20 border border-neutral-main/50 hover:border-text-main/20"
        }`}
        variant={isCurrent ? "outline" : tier.highlighted ? "default" : "secondary"}
        disabled={isCurrent}
        onClick={onSelect}
      >
        {isCurrent ? "✓ Current Plan" : tier.cta}
      </Button>
    </div>
  );
}
