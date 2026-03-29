"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Sparkles, CalendarHeart, Bell, Flame, Video } from "lucide-react";

const TIERS = [
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

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "Proxy burning service": <Flame className="size-4" />,
  "Video confirmation after ritual": <Video className="size-4" />,
  "Date reminders & actual-day notifications": <Bell className="size-4" />,
  "AI-personalized bundle recommendations": <Sparkles className="size-4" />,
  "Premium AI Heritage Advisor": <Crown className="size-4" />,
};

export default function MembershipPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isMember = user?.tier === "Member";

  return (
    <div className="bg-background-main min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <CalendarHeart className="size-3 mr-1" />
            Heritage Plans
          </Badge>
          <h1 className="font-playfair text-5xl font-bold text-text-main mb-4">Choose Your Plan</h1>
          <p className="text-text-main/70 max-w-xl mx-auto text-lg">
            Select the plan that best supports your family's heritage rituals. Upgrade anytime for
            full access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {TIERS.map((tier) => {
            const isCurrent =
              (tier.name === "Free" && !isMember) || (tier.name === "Member" && isMember);

            return (
              <Card
                key={tier.name}
                className={`relative overflow-hidden transition-all duration-300 ${
                  tier.highlighted
                    ? "border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-neutral-main"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-xs font-bold uppercase tracking-widest py-1.5">
                    Most Popular
                  </div>
                )}

                <CardHeader className={`${tier.highlighted ? "pt-10" : "pt-6"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {tier.highlighted && <Crown className="size-5 text-primary" />}
                    <CardTitle className="font-playfair text-2xl">{tier.name}</CardTitle>
                    {isCurrent && (
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Current
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-text-main">{tier.price}</span>
                    <span className="text-text-main/60 ml-1">{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 text-sm ${
                          feature.included ? "text-text-main" : "text-text-main/30"
                        }`}
                      >
                        <div
                          className={`mt-0.5 p-0.5 rounded-full ${
                            feature.included
                              ? "text-primary bg-primary/10"
                              : "text-text-main/20 bg-neutral-main/20"
                          }`}
                        >
                          {feature.included ? (
                            FEATURE_ICONS[feature.text] || <Check className="size-3.5" />
                          ) : (
                            <X className="size-3.5" />
                          )}
                        </div>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full font-bold py-6 text-base ${
                      tier.highlighted && !isCurrent
                        ? "bg-primary hover:bg-primary/90 shadow-md"
                        : ""
                    }`}
                    variant={isCurrent ? "outline" : tier.highlighted ? "default" : "secondary"}
                    disabled={isCurrent}
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/login");
                      } else if (tier.name === "Member") {
                        router.push("/checkout?mode=membership");
                      }
                    }}
                  >
                    {isCurrent ? "✓ Current Plan" : tier.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ / Trust */}
        <div className="mt-20 text-center">
          <p className="text-sm text-text-main/40">
            Cancel anytime · No hidden fees · Secure payment
          </p>
        </div>
      </div>
    </div>
  );
}
