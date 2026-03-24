"use client";

import { useState } from "react";
import { Heart, UserPlus, Bell, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RemembranceCard } from "./_components/RemembranceCard";
import { UPCOMING_RITUALS } from "@/data/rituals";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

const INITIAL_REMEMBRANCES = UPCOMING_RITUALS.filter((r) => r.type === "personal");

export default function RemembrancePage() {
  const { user } = useAuth();
  const isSubscriber = user?.tier === "Subscriber";
  const [remembrances, setRemembrances] = useState(INITIAL_REMEMBRANCES);
  const [open, setOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [description, setDescription] = useState("");
  const [dateType, setDateType] = useState("");
  const [date, setDate] = useState("");
  const [dialect, setDialect] = useState("");

  const handleAdd = () => {
    if (!name || !relation || !date || !dateType) return;

    const newEntry = {
      id: `personal-${Date.now()}`,
      name: `${name} (${relation})`,
      date,
      lunarDate: "Calculated automatically",
      description:
        description ||
        `${dialect ? `${dialect} tradition.` : "Family tradition."} ${dateType === "passing" ? "Passing anniversary." : "Birthday remembrance."}`,
      type: "personal",
      isUpcoming: true,
    };

    setRemembrances([...remembrances, newEntry]);
    setOpen(false);
    // Reset Form
    setName("");
    setRelation("");
    setDescription("");
    setDateType("");
    setDate("");
    setDialect("");
  };

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-text-main mb-3 flex items-center gap-2">
              <Heart className="size-8 text-secondary fill-secondary/20" />
              My Remembrances
            </h1>
            <p className="text-text-main/70 max-w-xl">
              Build your family’s ancestral calendar. We track the dates and recommend culturally
              accurately sets to honor your loved ones respectfully.
            </p>
            {isSubscriber && (
              <Badge
                variant="default"
                className="mt-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                Subscriber Advantage: Proxy Services Enabled
              </Badge>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 font-bold shadow-sm">
                <UserPlus className="size-5" />
                Add Ancestor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="font-playfair text-2xl">Add Ancestral Profile</DialogTitle>
                <CardDescription>
                  Inscribe important dates and details for personalized ritual preparation and
                  remembrance services.
                </CardDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name / Ancestor Title</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Grandfather Lim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="relation">Relation</Label>
                  <Select value={relation} onValueChange={setRelation}>
                    <SelectTrigger id="relation">
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grandfather">Grandfather</SelectItem>
                      <SelectItem value="Grandmother">Grandmother</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Uncle">Uncle</SelectItem>
                      <SelectItem value="Aunt">Aunt</SelectItem>
                      <SelectItem value="Other">Other Relation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Loved gardening and cooking Hokkien recipes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dateType">Date Type</Label>
                    <Select value={dateType} onValueChange={setDateType}>
                      <SelectTrigger id="dateType">
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passing">Passing Anniversary</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">
                      {dateType === "birthday"
                        ? "Birthday"
                        : dateType === "passing"
                          ? "Passing Date"
                          : "Date"}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dialect">Dialect Group (Optional)</Label>
                  <Select value={dialect} onValueChange={setDialect}>
                    <SelectTrigger id="dialect">
                      <SelectValue placeholder="Select Dialect (for ritual guides)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hokkien">Hokkien</SelectItem>
                      <SelectItem value="Cantonese">Cantonese</SelectItem>
                      <SelectItem value="Teochew">Teochew</SelectItem>
                      <SelectItem value="Hakka">Hakka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} className="w-full">
                  Create Profile
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Remembrances Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {remembrances.map((item) => (
            <div key={item.id} className="space-y-4">
              <RemembranceCard item={item} />
              {isSubscriber && (
                <div className="bg-surface border border-neutral-main rounded-xl p-4 flex justify-between items-center shadow-sm">
                  <div className="flex gap-4">
                    <Button size="sm" variant="ghost" className="gap-2 text-secondary px-2">
                      <Bell className="size-4" />
                      Active
                    </Button>
                    <Link href="/proxy-request">
                      <Button size="sm" variant="ghost" className="gap-2 text-primary px-2">
                        <Flame className="size-4" />
                        Book Proxy
                      </Button>
                    </Link>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold text-text-main/40"
                  >
                    Sub Access
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
