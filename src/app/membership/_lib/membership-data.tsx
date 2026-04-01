import React from "react";
import { Flame, Video, Bell, Sparkles, Crown } from "lucide-react";

export const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Explore our heritage calendar and browse products.",
    features: [
      { text: "Ritual calendar access", included: true },
      { text: "View upcoming dates & significance", included: true },
      { text: "Browse products & bundles", included: true },
      { text: "Basic AI Advisor", included: true },
      { text: "Date reminders & notifications", included: false },
      { text: "AI-personalized bundle recommendations", included: false },
      { text: "Proxy burning service", included: false },
      { text: "Video confirmation", included: false },
      { text: "Saved preferences & history", included: false },
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Member",
    price: "$12.90",
    period: "/ month",
    description: "Full heritage experience with proxy services and personalized guidance.",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Date reminders & actual-day notifications", included: true },
      { text: "AI-personalized bundle recommendations", included: true },
      { text: "Proxy burning service", included: true },
      { text: "Video confirmation after ritual", included: true },
      { text: "Saved preferences & dashboard history", included: true },
      { text: "Premium AI Heritage Advisor", included: true },
      { text: "Priority customer support", included: true },
    ],
    cta: "Join Membership",
    highlighted: true,
  },
];

export const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "Proxy burning service": <Flame className="size-4" />,
  "Video confirmation after ritual": <Video className="size-4" />,
  "Date reminders & actual-day notifications": <Bell className="size-4" />,
  "AI-personalized bundle recommendations": <Sparkles className="size-4" />,
  "Premium AI Heritage Advisor": <Crown className="size-4" />,
};
