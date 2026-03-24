"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, ShieldCheck, Lock, Check, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { user, isAuthenticated, updateTier } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Redirect if not logged in
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // If already a subscriber
  if (user?.tier === "Subscriber" && !isComplete) {
    router.push("/profile");
    return null;
  }

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    updateTier("Subscriber");
    setIsProcessing(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
        <Card className="w-full max-w-md text-center border-primary/30 shadow-xl">
          <CardContent className="pt-12 pb-10 space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="size-10 text-green-600" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-text-main mb-2">
                Welcome to Premium!
              </h2>
              <p className="text-text-main/70">
                Your subscription is now active. Enjoy personalized heritage guidance, proxy
                services, and more.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => router.push("/profile")} className="font-bold py-5">
                View Your Profile
              </Button>
              <Button variant="outline" onClick={() => router.push("/calendar")}>
                Explore Ritual Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-3">
            Complete Your Subscription
          </h1>
          <p className="text-text-main/70">
            You're one step away from the full heritage experience
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-3">
            <Card className="border-neutral-main shadow-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-xl flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  Payment Details
                </CardTitle>
                <CardDescription>Simulated checkout for prototype demonstration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input
                    id="cardholder"
                    defaultValue={user?.name || ""}
                    placeholder="Name on card"
                    className="border-neutral-main"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardnumber">Card Number</Label>
                  <Input
                    id="cardnumber"
                    defaultValue="4242 4242 4242 4242"
                    placeholder="1234 5678 9012 3456"
                    className="border-neutral-main font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      defaultValue="12/28"
                      placeholder="MM/YY"
                      className="border-neutral-main font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      defaultValue="123"
                      placeholder="123"
                      className="border-neutral-main font-mono"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-2 text-xs text-text-main/50">
                  <ShieldCheck className="size-4 text-green-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full font-bold py-6 text-base mt-4"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    "Pay $12.90 / month"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card className="border-primary/20 bg-primary/[0.02] sticky top-24">
              <CardHeader>
                <CardTitle className="font-playfair text-lg flex items-center gap-2">
                  <Crown className="size-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-text-main">Subscriber Plan</p>
                    <p className="text-xs text-text-main/60">Monthly billing</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                    Premium
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-main/70">
                    <span>Subtotal</span>
                    <span>$12.90</span>
                  </div>
                  <div className="flex justify-between text-text-main/70">
                    <span>GST (9%)</span>
                    <span>$1.16</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-text-main text-base pt-1">
                    <span>Total</span>
                    <span>$14.06</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-main/20">
                  <p className="text-[10px] text-text-main/40 uppercase font-bold mb-2">
                    What you'll get
                  </p>
                  <ul className="space-y-1.5 text-xs text-text-main/70">
                    <li className="flex items-center gap-2">
                      <Check className="size-3 text-primary" /> Proxy burning service
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3 text-primary" /> Video confirmations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3 text-primary" /> AI-personalized bundles
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3 text-primary" /> Priority reminders
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
