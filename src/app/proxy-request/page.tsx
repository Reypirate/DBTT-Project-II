"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Flame, Check, ArrowRight, Package } from "lucide-react";

export default function ProxyRequestPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isMember = user?.tier === "Member";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [ancestorName, setAncestorName] = useState("");
  const [ritualDate, setRitualDate] = useState("");
  const [ritualType, setRitualType] = useState("");
  const [bundle, setBundle] = useState("");
  const [instructions, setInstructions] = useState("");

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (!isMember) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
        <Card className="w-full max-w-md text-center border-neutral-main">
          <CardContent className="pt-12 pb-10 space-y-6">
            <Flame className="size-12 text-primary/30 mx-auto" />
            <div>
              <h2 className="font-playfair text-2xl font-bold text-text-main mb-2">
                Member Exclusive
              </h2>
              <p className="text-text-main/70 text-sm">
                The Proxy Burning Service is available only for Members. Join our membership to
                access this feature.
              </p>
            </div>
            <Button onClick={() => router.push("/membership")} className="font-bold">
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
        <Card className="w-full max-w-md text-center border-primary/30 shadow-xl">
          <CardContent className="pt-12 pb-10 space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="size-10 text-green-600" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-text-main mb-2">
                Request Submitted!
              </h2>
              <p className="text-text-main/70">
                Your proxy burning request for <strong>{ancestorName}</strong> on{" "}
                <strong>
                  {new Date(ritualDate).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>{" "}
                has been received. We'll send you a video confirmation once the ceremony is
                complete.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => router.push("/profile")} className="font-bold py-5">
                View in Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Flame className="size-3 mr-1" />
            Member Service
          </Badge>
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-3">
            Request Proxy Burning
          </h1>
          <p className="text-text-main/70 max-w-xl mx-auto">
            Let Hin Long perform the ritual on your behalf. Fill in the details below and we'll take
            care of the rest.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-neutral-main/20 text-text-main/40"
                }`}
              >
                {step > s ? <Check className="size-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-neutral-main/20"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-neutral-main shadow-sm">
          <CardContent className="p-8">
            {/* Step 1: Ancestor Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="font-playfair text-xl mb-1">Ancestor Details</CardTitle>
                  <CardDescription>Who is this ritual for?</CardDescription>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ancestorName">Ancestor Name</Label>
                    <Input
                      id="ancestorName"
                      placeholder="e.g., Grandfather Lim Ah Kow"
                      value={ancestorName}
                      onChange={(e) => setAncestorName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ritualDate">Preferred Ritual Date</Label>
                    <Input
                      id="ritualDate"
                      type="date"
                      value={ritualDate}
                      onChange={(e) => setRitualDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ritualType">Occasion</Label>
                    <Select value={ritualType} onValueChange={setRitualType}>
                      <SelectTrigger id="ritualType">
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="death-anniversary">Death Anniversary</SelectItem>
                        <SelectItem value="qingming">Qingming / Tomb Sweeping</SelectItem>
                        <SelectItem value="hungry-ghost">Hungry Ghost Festival</SelectItem>
                        <SelectItem value="birthday-remembrance">Birthday Remembrance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!ancestorName || !ritualDate || !ritualType}
                    className="gap-2"
                  >
                    Next <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Bundle Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="font-playfair text-xl mb-1">Offering Selection</CardTitle>
                  <CardDescription>Choose a bundle for the ceremony</CardDescription>
                </div>
                <div className="grid gap-3">
                  {[
                    { id: "qingming-kit", name: "Qingming Essential Kit", price: "$38.00" },
                    { id: "hungry-ghost", name: "7th Month Hungry Ghost Bundle", price: "$45.00" },
                    { id: "deity-set", name: "Everyday Deity Offering Set", price: "$15.50" },
                    { id: "cny-wealth", name: "CNY Wealth & Prosperity Set", price: "$55.00" },
                  ].map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setBundle(b.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        bundle === b.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-neutral-main hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Package className="size-5 text-primary/60" />
                        <div>
                          <p className="font-bold text-text-main text-sm">{b.name}</p>
                          <p className="text-xs text-text-main/60">{b.price}</p>
                        </div>
                      </div>
                      {bundle === b.id && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="size-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!bundle} className="gap-2">
                    Next <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Special Instructions & Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="font-playfair text-xl mb-1">Special Instructions</CardTitle>
                  <CardDescription>Any specific requests for the ceremony?</CardDescription>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="instructions">Instructions (Optional)</Label>
                    <Input
                      id="instructions"
                      placeholder="e.g., Please include extra gold paper, face offerings north"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-surface border border-neutral-main rounded-xl p-5 space-y-3">
                  <p className="text-[10px] font-bold uppercase text-text-main/40">Order Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-main/70">Ancestor</span>
                    <span className="font-bold">{ancestorName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-main/70">Date</span>
                    <span className="font-bold">
                      {new Date(ritualDate).toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-main/70">Video Confirmation</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[9px]">
                      Included
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={() => setSubmitted(true)} className="gap-2 font-bold">
                    <Flame className="size-4" />
                    Confirm & Submit
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
