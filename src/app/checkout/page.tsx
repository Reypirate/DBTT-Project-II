"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePreorder } from "@/context/PreorderContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  ShieldCheck,
  Lock,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  MapPin,
  Truck,
  ArrowRight,
} from "lucide-react";

const SUBSCRIPTION_PRICE = 12.9;
const SUBSCRIPTION_GST_RATE = 0.09;
const PREORDER_DELIVERY_FEE = 6;

export default function CheckoutPage() {
  const { user, isAuthenticated, updateTier } = useAuth();
  const { preorderItems, subtotal, updateQuantity, removeFromPreorder, placeOrder } = usePreorder();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Delivery Address State
  const [address, setAddress] = useState({
    street: "Blk 123 Clementi Ave 3",
    unit: "#04-05",
    postalCode: "120123",
  });

  // Subscription Upsell State
  const [addSubscription, setAddSubscription] = useState(false);

  const mode = searchParams.get("mode") === "subscription" ? "subscription" : "preorder";
  const subscriptionGst = Number((SUBSCRIPTION_PRICE * SUBSCRIPTION_GST_RATE).toFixed(2));
  const subscriptionTotal = Number((SUBSCRIPTION_PRICE + subscriptionGst).toFixed(2));

  const preorderDeliveryFee = preorderItems.length > 0 ? PREORDER_DELIVERY_FEE : 0;
  const preorderSubtotal = subtotal;
  const effectivePreorderTotal = Number(
    (preorderSubtotal + preorderDeliveryFee + (addSubscription ? subscriptionTotal : 0)).toFixed(2),
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (mode === "subscription" && user?.tier === "Subscriber" && !isComplete) {
      router.replace("/profile");
    }
  }, [isComplete, mode, router, user?.tier]);

  if (!isAuthenticated) {
    return null;
  }

  if (mode === "subscription" && user?.tier === "Subscriber" && !isComplete) {
    return null;
  }

  const handleSubscriptionCheckout = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateTier("Subscriber");
    setIsProcessing(false);
    setIsComplete(true);
  };

  const handlePreorderCheckout = async () => {
    if (preorderItems.length === 0) return;
    if (!address.street || !address.postalCode) {
      alert("Please provide a valid delivery address.");
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (addSubscription) {
      updateTier("Subscriber");
    }

    const order = placeOrder(preorderDeliveryFee, address);
    setPlacedOrderId(order?.id ?? null);
    setIsProcessing(false);
    setIsComplete(true);
  };

  if (isComplete && mode === "subscription") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
        <Card className="w-full max-w-md text-center border-primary/30 shadow-xl">
          <CardContent className="pt-12 pb-10 space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="size-10 text-green-600" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-text-main mb-2">
                Subscription Active
              </h2>
              <p className="text-text-main/70">
                Your premium plan is now enabled with reminders, proxy services, and video
                confirmations.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => router.push("/profile")} className="font-bold py-5">
                View Profile
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

  if (isComplete && mode === "preorder") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
        <Card className="w-full max-w-md text-center border-primary/30 shadow-xl">
          <CardContent className="pt-12 pb-10 space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="size-10 text-green-600" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-text-main mb-2">Order Placed</h2>
              <p className="text-text-main/70">
                Your order has been submitted and is now marked as Pending.
              </p>
              {placedOrderId && (
                <p className="text-xs text-text-main/50 mt-3 font-medium">
                  Order ID: {placedOrderId}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => router.push("/profile")} className="font-bold py-5">
                View Order Log
              </Button>
              <Button variant="outline" onClick={() => router.push("/bundles")}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-3">
            {mode === "subscription" ? "Complete Your Subscription" : "Complete Your Order"}
          </h1>
          <p className="text-text-main/70">
            {mode === "subscription"
              ? "Secure simulated checkout for plan activation."
              : "Review your delivery details and finalize your order."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {mode === "preorder" && (
              <Card className="border-neutral-main shadow-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                  <CardDescription>Enter where you'd like your items delivered</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="e.g. 123 Jurong West Street 64"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="border-neutral-main"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit Number</Label>
                      <Input
                        id="unit"
                        placeholder="#01-01"
                        value={address.unit}
                        onChange={(e) => setAddress({ ...address, unit: e.target.value })}
                        className="border-neutral-main"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input
                        id="postal"
                        placeholder="123456"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="border-neutral-main"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-neutral-main shadow-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-xl flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  Payment Details
                </CardTitle>
                <CardDescription>Mock credit-card form for prototype checkout flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input
                    id="cardholder"
                    defaultValue={user?.name ?? ""}
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
                  <span>Secure, simulated checkout session for demo purposes</span>
                </div>

                {mode === "subscription" ? (
                  <Button
                    onClick={handleSubscriptionCheckout}
                    disabled={isProcessing}
                    className="w-full font-bold py-6 text-base mt-4"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay $${SUBSCRIPTION_PRICE.toFixed(2)} / month`
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePreorderCheckout}
                    disabled={isProcessing || preorderItems.length === 0}
                    className="w-full font-bold py-6 text-base mt-4"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Submitting Order...
                      </span>
                    ) : (
                      `Place Order — $${effectivePreorderTotal.toFixed(2)}`
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {mode === "preorder" && user?.tier !== "Subscriber" && (
              <Card className="border-primary/30 bg-primary/[0.03] overflow-hidden">
                <div className="flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-wider text-xs">
                      <Crown className="size-4" />
                      Priority Recommendation
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-text-main mb-2">
                      Upgrade to Subscriber Tier
                    </h3>
                    <p className="text-text-main/70 text-xs mb-4">
                      Get free delivery, ritual reminders, and priority sourcing.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "Zero delivery fees on all future orders",
                        "Priority queuing during festive seasons",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-text-main/80">
                          <Check className="size-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-2">
                      <div>
                        <p className="text-[10px] text-text-main/60">Only</p>
                        <p className="text-2xl font-bold text-primary">
                          ${SUBSCRIPTION_PRICE.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-text-main/60">per month</p>
                      </div>
                      <Button
                        variant={addSubscription ? "outline" : "default"}
                        className="font-bold text-sm h-10 px-6"
                        onClick={() => setAddSubscription(!addSubscription)}
                      >
                        {addSubscription ? "Remove Tier" : "Add to Order"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {mode === "subscription" ? (
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
                      <span>${SUBSCRIPTION_PRICE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-text-main/70">
                      <span>GST (9%)</span>
                      <span>${subscriptionGst.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-text-main text-base pt-1">
                      <span>Total</span>
                      <span>${subscriptionTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-primary/20 bg-primary/[0.02] sticky top-24">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg flex items-center gap-2">
                    <ShoppingCart className="size-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preorderItems.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-neutral-main/50 p-6 text-center">
                      <p className="text-sm text-text-main/70 mb-4">No items in your cart.</p>
                      <Button variant="outline" onClick={() => router.push("/bundles")}>
                        Browse Bundles
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[280px] overflow-auto pr-1">
                        {preorderItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-neutral-main/40 bg-surface px-3 py-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-text-main">{item.name}</p>
                                <p className="text-xs text-text-main/60">
                                  ${item.price.toFixed(2)} each
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-text-main/50 hover:text-red-600"
                                onClick={() => removeFromPreorder(item.id)}
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-md border border-neutral-main">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7 rounded-r-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  aria-label={`Decrease ${item.name} quantity`}
                                >
                                  <Minus className="size-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min={1}
                                  max={99}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      item.id,
                                      Number.parseInt(e.target.value || "1", 10) || 1,
                                    )
                                  }
                                  className="h-7 w-14 rounded-none border-y-0 border-x border-neutral-main px-2 text-center text-xs"
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7 rounded-l-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label={`Increase ${item.name} quantity`}
                                >
                                  <Plus className="size-3" />
                                </Button>
                              </div>
                              <p className="text-sm font-bold text-text-main">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-text-main/70">
                          <span>Items Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-text-main/70">
                          <span>Delivery Fee</span>
                          <span>${preorderDeliveryFee.toFixed(2)}</span>
                        </div>
                        {addSubscription && (
                          <div className="flex justify-between text-primary font-medium">
                            <span className="flex items-center gap-1">
                              <Crown className="size-3" />
                              Subscriber Tier
                            </span>
                            <span>${subscriptionTotal.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-text-main text-xl pt-1">
                          <span>Total</span>
                          <span>${effectivePreorderTotal.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 flex items-center gap-2 text-[10px] text-text-main/40 uppercase tracking-widest font-bold">
                          <Truck className="size-3" />
                          Delivery expected within 48 hours
                        </div>
                      </div>
                    </>
                  )}
                  {preorderItems.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-primary/10">
                      <div className="flex gap-4 items-center mb-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Truck className="size-5 text-primary" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-text-main">Standard Delivery Flow</p>
                          <p className="text-text-main/60">
                            Items will be packed and dispatched to your provided address.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-xs gap-1 h-8 text-primary/70 hover:text-primary"
                        onClick={() => router.push("/products")}
                      >
                        Add more items <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
