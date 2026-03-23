"use client";

import { useState } from "react";
import { Heart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
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

const INITIAL_REMEMBRANCES = UPCOMING_RITUALS.filter((r) => r.type === "personal");

export default function RemembrancePage() {
  const [remembrances, setRemembrances] = useState(INITIAL_REMEMBRANCES);
  const [open, setOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [date, setDate] = useState("");
  const [dialect, setDialect] = useState("");

  const handleAdd = () => {
    if (!name || !relation || !date) return;

    const newEntry = {
      id: `personal-${Date.now()}`,
      name: `${name} (${relation})`,
      date,
      lunarDate: "Calculated automatically",
      description: `${dialect ? `${dialect} tradition.` : "Family tradition."}`,
      type: "personal",
      isUpcoming: true,
    };

    setRemembrances([...remembrances, newEntry]);
    setOpen(false);
    // Reset Form
    setName("");
    setRelation("");
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
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 font-bold shadow-sm">
                <UserPlus className="size-5" />
                Add Ancestor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-playfair text-2xl">Add Ancestral Profile</DialogTitle>
                <CardDescription>
                  Inscribe important dates for personalized subscription setups.
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
                      <SelectItem value="Other">Other Relation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Important Date (Passing or Birthday)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
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
            <RemembranceCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
