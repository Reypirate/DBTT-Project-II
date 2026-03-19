"use client";

import { useState } from "react";
import { Calendar, Clock, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BUNDLES } from "@/data/bundles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"paynow" | "card">("paynow");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Hardcoded for prototype representation
  const cartItem = BUNDLES.length > 0 ? BUNDLES[0] : null;
  const total = cartItem ? cartItem.price : 0;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center py-12 px-6">
        <Card className="max-w-md w-full border border-neutral-main shadow-xl text-center p-8 md:p-12 animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="font-playfair text-3xl font-bold text-text-main mb-4">
              Payment Successful
            </h2>
            <p className="text-text-main/70 mb-8">
              Your preorder for pickup has been confirmed. You will receive an SMS reminder on the
              day of pickup.
            </p>
            <div className="animate-pulse w-full h-2 bg-neutral-main rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-primary rounded-full"></div>
            </div>
            <p className="text-xs text-text-main/50 mt-4">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cartItem) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <p className="text-text-main/70">Cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <h1 className="font-playfair text-4xl font-bold text-text-main mb-8">Preorder Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pickup Details */}
            <Card className="border border-neutral-main shadow-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">In-Store Pickup Details</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Tan" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2">
                        <Calendar className="size-4" /> Date
                      </Label>
                      <Input id="date" type="date" defaultValue="2026-04-01" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="size-4" /> Time
                      </Label>
                      <Select defaultValue="Morning">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Pickup Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning (09:00 AM - 12:00 PM)</SelectItem>
                          <SelectItem value="Afternoon">Afternoon (12:00 PM - 03:00 PM)</SelectItem>
                          <SelectItem value="Late Afternoon">
                            Late Afternoon (03:00 PM - 06:00 PM)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border border-neutral-main shadow-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Payment Method</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "paynow" ? "border-primary bg-primary/5" : "border-neutral-main bg-surface"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="paynow"
                      checked={paymentMethod === "paynow"}
                      onChange={() => setPaymentMethod("paynow")}
                      className="size-5 text-primary focus:ring-primary"
                    />
                    <span className="font-bold text-text-main">PayNow / QR Code</span>
                  </div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/PayNow_logo.svg/512px-PayNow_logo.svg.png"
                    alt="PayNow"
                    className="h-6 object-contain"
                  />
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-neutral-main bg-surface"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="size-5 text-primary focus:ring-primary"
                    />
                    <span className="font-bold text-text-main">Credit / Debit Card</span>
                  </div>
                  <CreditCard className="size-6 text-text-main/70" />
                </label>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4 animate-fade-in-up">
                    <Input placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVC" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border border-neutral-main shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Order Summary</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface flex-shrink-0">
                    <img
                      src={cartItem.image}
                      alt={cartItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main line-clamp-2">{cartItem.name}</h4>
                    <p className="text-sm text-text-main/60 mb-1">Qty: 1</p>
                    <p className="font-bold text-primary">${cartItem.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-neutral-main border-dashed">
                  <div className="flex justify-between text-text-main/80">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-main/80">
                    <span>GST (9%)</span>
                    <span>${(total * 0.09).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center mb-8 pt-4">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    ${(total * 1.09).toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full h-14 rounded-xl font-bold text-lg gap-2"
                >
                  Confirm Preorder
                  <ChevronRight className="size-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
