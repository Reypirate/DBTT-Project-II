"use client";

import { useAuth } from "@/context/AuthContext";
import { CUSTOMER_GROUPS, type CustomerGroup } from "@/context/AuthContext";
import { usePreorder } from "@/context/PreorderContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Crown,
  Clock,
  Zap,
  Video,
  History,
  Bell,
  Flame,
  PlayCircle,
  Settings2,
  Users2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateTier, updateCustomerGroup } = useAuth();
  const { orderLog } = usePreorder();
  const router = useRouter();
  const [reminderOpen, setReminderOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [orderLogOpen, setOrderLogOpen] = useState(false);
  const [reminders, setReminders] = useState({
    rituals: true,
    ancestors: true,
    marketing: false,
  });

  const fallbackOrderHistory = useMemo(
    () => [
      {
        id: "ORD-2026-910",
        createdAt: "2026-03-11T10:30:00.000Z",
        status: "Complete",
        total: 76.0,
        items: ["Qingming Essential Kit x2"],
      },
      {
        id: "ORD-2026-922",
        createdAt: "2026-03-24T15:00:00.000Z",
        status: "Pending",
        total: 45.0,
        items: ["7th Month Hungry Ghost Bundle x1"],
      },
    ],
    [],
  );

  const orderHistory = orderLog.length
    ? orderLog.map((entry) => ({
        id: entry.id,
        createdAt: entry.createdAt,
        status: entry.status,
        total: entry.total,
        items: entry.items.map((item) => `${item.name} x${item.quantity}`),
      }))
    : fallbackOrderHistory;

  const statusStyle: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Preparing: "bg-blue-100 text-blue-700 border-blue-200",
    Ready: "bg-purple-100 text-purple-700 border-purple-200",
    Complete: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  };

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
            {/* Dialect Group Selector */}
            <Card className="border-neutral-main border-2 border-secondary/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-playfair text-xl flex items-center gap-2">
                    <Users2 className="size-5 text-secondary" />
                    Dialect Group
                  </CardTitle>
                  {user.customerGroup && user.customerGroup !== "None" && (
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/10">
                      {user.customerGroup}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Select your dialect group to help us personalize your experience and product
                  recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={user.customerGroup || "None"}
                  onValueChange={(value: string) => updateCustomerGroup(value as CustomerGroup)}
                >
                  <SelectTrigger className="w-full border-neutral-main">
                    <SelectValue placeholder="Select your dialect group" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-text-main/50 mt-3 italic">
                  This helps the shop owner understand customer preferences and tailor seasonal
                  bundles.
                </p>
              </CardContent>
            </Card>

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
                      <div className="text-xs p-2 bg-green-50 rounded border border-green-100 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span>Ancestor Veneration</span>
                          <span className="text-[10px] text-green-600 font-medium">
                            Video Ready
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-primary gap-1"
                          onClick={() => setVideoOpen(true)}
                        >
                          <PlayCircle className="size-3" />
                          Watch
                        </Button>
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
                <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-sm" disabled={!isSubscriber}>
                      <Settings2 className="size-4 mr-2" />
                      Configure Reminders
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle className="font-playfair text-2xl">
                        Notification Settings
                      </DialogTitle>
                      <CardDescription>Choose which alerts you'd like to receive.</CardDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Major Ritual Dates</Label>
                          <p className="text-xs text-text-main/60">
                            Reminders for Qingming, Hungry Ghost, etc.
                          </p>
                        </div>
                        <Switch
                          checked={reminders.rituals}
                          onCheckedChange={(checked: boolean) =>
                            setReminders({ ...reminders, rituals: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Ancestor Anniversaries</Label>
                          <p className="text-xs text-text-main/60">
                            Birthdays and passing dates of your loved ones.
                          </p>
                        </div>
                        <Switch
                          checked={reminders.ancestors}
                          onCheckedChange={(checked: boolean) =>
                            setReminders({ ...reminders, ancestors: checked })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setReminderOpen(false)} className="w-full">
                        Save Preferences
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  Review your past orders and proxy burning service video recordings.
                </p>
                <Dialog open={orderLogOpen} onOpenChange={setOrderLogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-sm">
                      View Order Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[620px]">
                    <DialogHeader>
                      <DialogTitle className="font-playfair text-2xl">Order Log</DialogTitle>
                      <CardDescription>
                        Historical orders and their latest fulfillment statuses.
                      </CardDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-auto pr-1 space-y-3 py-2">
                      {orderHistory.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-xl border border-neutral-main/40 bg-surface p-4"
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="font-bold text-sm text-primary">{order.id}</p>
                            <Badge
                              variant="secondary"
                              className={`border text-[10px] ${statusStyle[order.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-main/60 mb-2">
                            {new Date(order.createdAt).toLocaleDateString("en-SG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <ul className="text-xs text-text-main/80 space-y-1 mb-2">
                            {order.items.map((item, index) => (
                              <li key={`${order.id}-${index}`}>{item}</li>
                            ))}
                          </ul>
                          <p className="text-sm font-semibold text-text-main">
                            Total: ${order.total.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setOrderLogOpen(false)} className="w-full">
                        Close Log
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Confirmation Modal */}
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-black">
            <div className="aspect-video w-full bg-neutral-900 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col text-white/40 gap-4">
                <Video className="size-16 opacity-20" />
                <p className="text-sm font-playfair italic">
                  Video Confirmation: Ancestor Veneration Ritual
                </p>
                <div className="mt-4 px-4 py-2 border border-white/20 rounded-full text-xs font-bold bg-white/5">
                  SIMULATED PLAYBACK ENABLED
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3" />
              </div>
            </div>
            <div className="p-6 bg-surface border-t border-neutral-main">
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="font-playfair text-2xl">Ritual Recording</DialogTitle>
                    <CardDescription>
                      Performed by Hin Long Master on March 15, 2026
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
              </DialogHeader>
              <div className="mt-4 text-sm text-text-main/70 italic">
                "We have respectfully offered the Respect Bundle for your ancestors. May their
                blessings be with you."
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => setVideoOpen(false)} className="w-full">
                  Close Recording
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
