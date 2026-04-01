"use client";

import { Check, ArrowRight, Package, Flame } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function Step1({
  ancestorName,
  setAncestorName,
  ritualDate,
  setRitualDate,
  ritualType,
  setRitualType,
  onNext,
  isValid,
}: any) {
  return (
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
        <Button onClick={onNext} disabled={!isValid} className="gap-2">
          Next <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function Step2({ bundle, setBundle, onNext, onBack, isValid }: any) {
  const bundles = [
    { id: "qingming-kit", name: "Qingming Essential Kit", price: "$38.00" },
    { id: "hungry-ghost", name: "7th Month Hungry Ghost Bundle", price: "$45.00" },
    { id: "deity-set", name: "Everyday Deity Offering Set", price: "$15.50" },
    { id: "cny-wealth", name: "CNY Wealth & Prosperity Set", price: "$55.00" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="font-playfair text-xl mb-1">Offering Selection</CardTitle>
        <CardDescription>Choose a bundle for the ceremony</CardDescription>
      </div>
      <div className="grid gap-3">
        {bundles.map((b) => (
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="gap-2">
          Next <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function Step3({
  ancestorName,
  ritualDate,
  instructions,
  setInstructions,
  onBack,
  onSubmit,
}: any) {
  return (
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
            {ritualDate &&
              new Date(ritualDate).toLocaleDateString("en-SG", {
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} className="gap-2 font-bold">
          <Flame className="size-4" />
          Confirm & Submit
        </Button>
      </div>
    </div>
  );
}
