import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { BUNDLES } from "@/data/bundles";

import { useAuth } from "@/context/AuthContext";

export function RemembranceCard({ item }: { item: any }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState("Ancestor memory rules suggest traditional setups.");
  const [recommendedBundle, setRecommendedBundle] = useState<any>(null);

  const isBirthday = !!item.birthday;
  const isPassing = !!item.passingDate;

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const type =
          isBirthday && isPassing
            ? "remembrance"
            : isBirthday
              ? "birthday"
              : isPassing
                ? "passing anniversary"
                : "remembrance";
        const prompt = `Provide a 1-sentence respectful ancestral advice/tip for a ${type} honoring ${item.name}. ${item.description ? `Context: ${item.description}` : ""}`;
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            tier: user?.tier || "Free",
          }),
        });
        const result = await res.json();

        if (!res.ok) {
          console.error("RemembranceCard AI Fail:", result);
          throw new Error(result.error || "AI Tip unavailable");
        }

        // Handle TanStack AI response structures
        const aiData = result.output || result.content || result;

        const generatedTip = aiData.message || (aiData.helpfulTips && aiData.helpfulTips[0]);
        if (generatedTip) setTip(generatedTip);

        if (aiData.recommendedBundles && aiData.recommendedBundles.length > 0) {
          const bundle = BUNDLES.find(
            (b) => b.name.toLowerCase() === aiData.recommendedBundles[0]?.toLowerCase(),
          );
          if (bundle) setRecommendedBundle(bundle);
        }
      } catch (err) {
        console.error("AI Tip Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTip();
  }, [item, isBirthday, isPassing]);

  return (
    <Card className="border border-neutral-main shadow-sm overflow-hidden group hover:border-primary/40 transition-all duration-300">
      <CardHeader className="bg-surface pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="font-playfair text-xl text-text-main group-hover:text-primary transition-colors">
            {item.name}
          </CardTitle>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
              Upcoming
            </Badge>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          {item.birthday && (
            <CardDescription className="flex items-center gap-2 text-text-main/60 text-xs">
              <Badge
                variant="outline"
                className="text-[10px] border-primary/30 text-primary py-0 h-4"
              >
                Birthday
              </Badge>
              <Calendar className="size-3" />
              {new Date(item.birthday).toLocaleDateString("en-SG", {
                day: "numeric",
                month: "short",
              })}
            </CardDescription>
          )}
          {item.passingDate && (
            <CardDescription className="flex items-center gap-2 text-text-main/60 text-xs">
              <Badge
                variant="outline"
                className="text-[10px] border-neutral-main text-text-main/60 py-0 h-4"
              >
                Passing
              </Badge>
              <Calendar className="size-3" />
              {new Date(item.passingDate).toLocaleDateString("en-SG", {
                day: "numeric",
                month: "short",
              })}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <p className="text-sm text-text-main/80 leading-relaxed">{item.description}</p>
        <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
          <Sparkles className="size-4 text-primary mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-primary block">AI Adviser Tip</span>
            <span className="text-xs text-text-main/70">
              {loading ? "Typing advisory insight..." : tip}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-surface/50 border-t border-neutral-main/20 p-4 flex gap-3">
        <Button asChild variant="default" className="w-full gap-2 shadow-sm font-bold">
          <Link href={recommendedBundle ? `/bundles/${recommendedBundle.id}` : "/bundles"}>
            {loading
              ? "Loading..."
              : recommendedBundle
                ? `Order ${recommendedBundle.name}`
                : "Order Kit"}
          </Link>
        </Button>
        <Button variant="outline" size="icon" className="group-hover:text-primary">
          <Calendar className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
