"use client";

import { type FormEvent, useState } from "react";
import { Heart, UserPlus, Bell, Flame, Trash2 } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

const REMEMBRANCE_STORAGE_KEY = "hinlong_remembrances";

interface RemembranceEntry {
  id: string;
  name: string;
  birthday: string | null;
  passingDate: string | null;
  lunarDate: string;
  description: string;
  type: "personal";
  isUpcoming: boolean;
}

interface RemembranceFormState {
  name: string;
  relation: string;
  description: string;
  birthday: string;
  passingDate: string;
  dialect: string;
}

const INITIAL_FORM_STATE: RemembranceFormState = {
  name: "",
  relation: "",
  description: "",
  birthday: "",
  passingDate: "",
  dialect: "",
};

const DEFAULT_REMEMBRANCES: RemembranceEntry[] = [
  {
    id: "personal-grandpa-lim",
    name: "Grandpa Lim (Grandfather)",
    birthday: "1934-03-11",
    passingDate: "2012-05-12",
    lunarDate: "4th Month, 26th Day",
    description: "Annual remembrance for Grandpa Lim (Hokkien tradition).",
    type: "personal",
    isUpcoming: true,
  },
  {
    id: "personal-grandmother-tan",
    name: "Grandmother Tan (Grandmother)",
    birthday: "1938-09-02",
    passingDate: "2018-10-22",
    lunarDate: "9th Month, 14th Day",
    description: "Family remembrance for Grandmother Tan with Teochew tradition offerings.",
    type: "personal",
    isUpcoming: true,
  },
];

function isRemembranceEntry(value: unknown): value is RemembranceEntry {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RemembranceEntry>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (candidate.birthday === null ||
      typeof candidate.birthday === "string" ||
      candidate.birthday === undefined) &&
    (candidate.passingDate === null ||
      typeof candidate.passingDate === "string" ||
      candidate.passingDate === undefined) &&
    typeof candidate.description === "string" &&
    typeof candidate.lunarDate === "string" &&
    candidate.type === "personal"
  );
}

export default function RemembrancePage() {
  const { user } = useAuth();
  const isMember = user?.tier === "Member";

  const [remembrances, setRemembrances] = useState<RemembranceEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<RemembranceFormState>(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);

    const persistDefaults = () => {
      localStorage.setItem(REMEMBRANCE_STORAGE_KEY, JSON.stringify(DEFAULT_REMEMBRANCES));
      setRemembrances(DEFAULT_REMEMBRANCES);
    };

    try {
      const saved = localStorage.getItem(REMEMBRANCE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (Array.isArray(parsed) && parsed.every(isRemembranceEntry)) {
          setRemembrances(parsed);
          return;
        }
      }
      persistDefaults();
    } catch {
      persistDefaults();
    }
  }, []);

  if (!mounted) return null;

  if (!isMember) {
    return <RemembranceGate />;
  }

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.relation) {
      setFormError("Name and relation are required.");
      return;
    }

    const newEntry = {
      id: `personal-${Date.now()}`,
      name: `${form.name.trim()} (${form.relation})`,
      birthday: form.birthday || null,
      passingDate: form.passingDate || null,
      lunarDate: "Lunar details updated periodically",
      description:
        form.description.trim() ||
        `${form.dialect ? `${form.dialect} tradition.` : "Family tradition."}`,
      type: "personal",
      isUpcoming: true,
    } satisfies RemembranceEntry;

    setRemembrances((prev) => {
      const updated = [...prev, newEntry];
      localStorage.setItem(REMEMBRANCE_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setFormError(null);
    setOpen(false);
    setForm(INITIAL_FORM_STATE);
  };

  const removeAncestor = (id: string) => {
    setRemembrances((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      localStorage.setItem(REMEMBRANCE_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
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
              Build your family's ancestral calendar. We track the dates and recommend culturally
              accurately sets to honor your loved ones respectfully.
            </p>
            {isMember && (
              <Badge
                variant="default"
                className="mt-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                Member Advantage: Proxy Services Enabled
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
              <form onSubmit={handleAdd}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name / Ancestor Title</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Grandfather Lim"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="relation">Relation</Label>
                    <Select
                      value={form.relation}
                      onValueChange={(relation) =>
                        setForm((prev) => ({
                          ...prev,
                          relation,
                        }))
                      }
                    >
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
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={form.birthday}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            birthday: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="passingDate">Passing Anniversary</Label>
                      <Input
                        id="passingDate"
                        type="date"
                        value={form.passingDate}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            passingDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dialect">Dialect Group (Optional)</Label>
                    <Select
                      value={form.dialect}
                      onValueChange={(dialect) =>
                        setForm((prev) => ({
                          ...prev,
                          dialect,
                        }))
                      }
                    >
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
                  {formError && <p className="text-xs font-medium text-red-600">{formError}</p>}
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Create Profile
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Remembrances Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {remembrances.map((item) => (
            <div key={item.id} className="space-y-4">
              <RemembranceCard item={item} />
              {isMember && (
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
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                      onClick={() => removeAncestor(item.id)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold text-text-main/40"
                  >
                    Member Tier
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

function RemembranceGate() {
  return (
    <div className="bg-background-main min-h-screen py-10 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
        <div className="p-12 bg-surface border border-neutral-main rounded-3xl shadow-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
            <Heart className="size-10 fill-primary/20" />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-4">
            Ancestor Remembrance Dashboard
          </h1>
          <p className="text-xl text-text-main/70 mb-8 max-w-2xl mx-auto">
            Build a legacy calendar for your loved ones. Members can track important dates, receive
            reminders, and book proxy burning services for birthdays and anniversaries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button size="lg" className="px-10 font-bold text-lg h-14">
                Get Notified
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-10 font-bold text-lg h-14">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
