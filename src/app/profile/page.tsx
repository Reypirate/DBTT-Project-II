"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Clock, Zap, Video, History, Bell, Flame } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateTier } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const isSubscriber = user.tier === "Subscriber";

  const freeBenefits = [
    { icon: <Clock className="size-4" />, text: "Ritual calendar access" },
    { icon: <Check className="size-4" />, text: "View upcoming important dates" },
    { icon: <Check className="size-4" />, text: "Significance of ritual dates" },
    { icon: <Check className="size-4" />, text: "Browse products & bundles" },
  ];

  const subscriberBenefits = [
    { icon: <Bell className="size-4" />, text: "Date reminders & actual-day notifications" },
    { icon: <Zap className="size-4" />, text: "AI-recommended bundles based on preferences" },
    { icon: <Crown className="size-4" />, text: "Proxy burning service (offering on your behalf)" },
    { icon: <Video className="size-4" />, text: "Video confirmation after ritual completion" },
    { icon: <History className="size-4" />, text: "Access to saved preferences & history" },
  ];

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-playfair text-4xl font-bold text-text-main">Customer Profile</h1>
              <Badge variant={isSubscriber ? "default" : "secondary"} className="py-1 px-3">
                {user.tier || "Free"} Tier
              </Badge>
            </div>
            <p className="text-text-main/70">Manage your subscription and ritual preferences</p>
          </div>
          <div className="p-4 bg-surface border border-neutral-main rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-text-main">{user.name}</p>
              <p className="text-sm text-text-main/60">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subscription Tier Card */}
          <Card
            className={`border-2 transition-all duration-300 ${isSubscriber ? "border-primary shadow-lg shadow-primary/5" : "border-neutral-main"}`}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-playfair text-2xl">Current Plan</CardTitle>
                {isSubscriber && <Crown className="size-6 text-primary" />}
              </div>
              <CardDescription>
                {isSubscriber
                  ? "You are currently on our premium legacy plan"
                  : "Enjoy standard access to our heritage guidelines"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <p className="text-3xl font-bold mb-1">
                  {isSubscriber ? "$12.90" : "$0"}
                  <span className="text-sm font-normal text-text-main/60 inline-block ml-1">
                    / month
                  </span>
                </p>
                <p className="text-sm text-green-600 font-medium">Auto-renewal active</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-sm font-bold uppercase tracking-wider text-text-main/40">
                  Tier Benefits
                </p>
                <div className="grid gap-3">
                  {(isSubscriber ? [...freeBenefits, ...subscriberBenefits] : freeBenefits).map(
                    (benefit, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 text-primary bg-primary/10 p-1 rounded-full">
                          {benefit.icon}
                        </div>
                        <span className="text-text-main/80">{benefit.text}</span>
                      </div>
                    ),
                  )}
                  {!isSubscriber &&
                    subscriberBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm opacity-40">
                        <div className="mt-0.5 text-text-main p-1 rounded-full border border-neutral-main">
                          {benefit.icon}
                        </div>
                        <span className="text-text-main/80 italic">{benefit.text} (Pro)</span>
                      </div>
                    ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  if (isSubscriber) {
                    updateTier("Free");
                  } else {
                    router.push("/subscribe");
                  }
                }}
                variant={isSubscriber ? "outline" : "default"}
                className="w-full font-bold py-6 text-lg"
              >
                {isSubscriber ? "Downgrade to Free" : "Upgrade to Subscriber"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions / Preferences */}
          <div className="space-y-6">
            <Card className="border-neutral-main">
              <CardHeader>
                <CardTitle className="font-playfair text-xl flex items-center gap-2">
                  <Flame className="size-5 text-primary" />
                  Proxy Burning Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-main/70 mb-4 italic">
                  Have Hin Long perform rituals on your behalf. Includes video confirmation of the
                  ceremony.
                </p>
                <div className="space-y-3">
                  <Link href="/proxy-request">
                    <Button variant="outline" className="w-full text-sm" disabled={!isSubscriber}>
                      Book New Service
                    </Button>
                  </Link>
                  {isSubscriber && (
                    <div className="pt-4 border-t border-neutral-main/20 space-y-2">
                      <p className="text-[10px] font-bold uppercase text-text-main/40 mb-2">
                        Recent Proxy Services
                      </p>
                      <div className="text-xs p-2 bg-blue-50 rounded border border-blue-100 flex justify-between items-center">
                        <span>Qingming Offering — Grandfather Lim</span>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[9px] h-4">
                          In Progress
                        </Badge>
                      </div>
                      <div className="text-xs p-2 bg-primary/5 rounded border border-primary/10 flex justify-between items-center">
                        <span>Ancestor Veneration</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[9px] h-4">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                {!isSubscriber && (
                  <p className="text-[10px] text-red-500 mt-2 text-center uppercase font-bold">
                    Requires Subscriber Tier
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-neutral-main">
              <CardHeader>
                <CardTitle className="font-playfair text-xl flex items-center gap-2">
                  <Bell className="size-5 text-secondary" />
                  Notification Prefs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-main/70 mb-4 italic">
                  Manage how we remind you of upcoming rituals for ancestor remembrance and major
                  festivals.
                </p>
                <Button variant="outline" className="w-full text-sm" disabled={!isSubscriber}>
                  Configure Reminders
                </Button>
                {!isSubscriber && (
                  <p className="text-[10px] text-red-500 mt-2 text-center uppercase font-bold">
                    Requires Subscriber Tier
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-neutral-main">
              <CardHeader>
                <CardTitle className="font-playfair text-xl flex items-center gap-2">
                  <History className="size-5 text-secondary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-main/70 mb-4 italic">
                  Review your past preorders and proxy burning service video recordings.
                </p>
                <Button variant="outline" className="w-full text-sm">
                  View Order Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
