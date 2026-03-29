"use client";

import { useState } from "react";
import { Sparkles, Send, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BUNDLES } from "@/data/bundles";
import { PRODUCTS } from "@/data/products";

import { useAuth } from "@/context/AuthContext";

const INITIAL_SUGGESTIONS = [
  "Grandparents' death anniversary offerings",
  "Qingming Festival preparations",
  "Best bundle for monthly veneration",
];

interface AdvisorMessage {
  role: "user" | "advisor";
  text: string;
  data?: {
    recommendedBundles?: string[];
    recommendedProducts?: string[];
    helpfulTips?: string[];
  };
}

async function safeReadJson(res: Response) {
  const raw = await res.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return { error: raw };
  }
}

function getApiErrorMessage(payload: any, status: number) {
  const message =
    payload?.error?.message ||
    payload?.error ||
    payload?.providerMessage ||
    payload?.message ||
    `Request failed with status ${status}.`;
  const retryAfter = payload?.retryAfterSeconds;

  if (status === 429) {
    return retryAfter
      ? `I am temporarily rate-limited. Please retry in about ${retryAfter} seconds.`
      : "I am temporarily rate-limited. Please retry in a short while.";
  }

  return typeof message === "string" ? message : "AI Advisor temporarily unavailable.";
}

export function AIAdvisor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      role: "advisor",
      text: "Greetings. I am your Heritage Advisor. How may I guide your offering preparations today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          tier: user?.tier || "Free",
        }),
      });

      const result = await safeReadJson(res);

      if (!res.ok) {
        const message = getApiErrorMessage(result, res.status);
        console.error("AI Advisor request failed:", result, "status:", res.status);
        setMessages((prev) => [
          ...prev,
          {
            role: "advisor",
            text: message,
          },
        ]);
        return;
      }

      // Handle TanStack AI response structures
      const aiData = result.output || result.content || result;
      if (aiData?.fallback) {
        console.error("AI Advisor live model unavailable. Using fallback response.", aiData);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "advisor",
          text: aiData.message || "Here are my recommendations:",
          data: {
            recommendedBundles: aiData.recommendedBundles || [],
            recommendedProducts: aiData.recommendedProducts || [],
            helpfulTips: aiData.helpfulTips || [],
          },
        },
      ]);
    } catch (error) {
      console.error("AI Advisor unexpected error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "advisor",
          text:
            error instanceof Error
              ? error.message
              : "I ran into an issue while preparing advice. Please try again shortly.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="rounded-full size-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center animate-bounce hover:animate-none scale-100 active:scale-95 transition-transform"
          >
            <Sparkles className="size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] bg-surface border-neutral-main/40">
          <DrawerHeader className="border-b border-neutral-main/20 pb-4">
            <DrawerTitle className="font-playfair text-2xl text-primary flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5" />
                The Heritage Advisor
              </div>
              {user?.tier === "Member" && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                  <Crown className="size-3" />
                  Premium
                </div>
              )}
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto h-[400px] flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-neutral-main/10 text-text-main border border-neutral-main/20 rounded-bl-none"
                    }`}
                  >
                    <p
                      className="text-sm prose dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />

                    {msg.data && (
                      <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-neutral-main/10">
                        {msg.data.recommendedBundles && msg.data.recommendedBundles.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50">
                              Suggested Bundles
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {msg.data.recommendedBundles.map((b, i) => {
                                const bundle = BUNDLES.find(
                                  (item) => item.name.toLowerCase() === b.toLowerCase(),
                                );
                                if (bundle) {
                                  return (
                                    <Link
                                      key={i}
                                      href={`/bundles/${bundle.id}`}
                                      className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary hover:bg-secondary/20 font-medium rounded-full border border-secondary/20 transition-colors cursor-pointer"
                                    >
                                      {b}
                                    </Link>
                                  );
                                }
                                return (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary font-medium rounded-full border border-secondary/20"
                                  >
                                    {b}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {msg.data.recommendedProducts &&
                          msg.data.recommendedProducts.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50">
                                Suggested Products
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {msg.data.recommendedProducts.map((p, i) => {
                                  const product = PRODUCTS.find(
                                    (item) => item.name.toLowerCase() === p.toLowerCase(),
                                  );
                                  if (product) {
                                    return (
                                      <Link
                                        key={i}
                                        href={`/products/${product.id}`}
                                        className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-medium rounded-full border border-primary/20 transition-colors cursor-pointer"
                                      >
                                        {p}
                                      </Link>
                                    );
                                  }
                                  return (
                                    <span
                                      key={i}
                                      className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-medium rounded-full border border-primary/20"
                                    >
                                      {p}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        {msg.data.helpfulTips && msg.data.helpfulTips.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50">
                              Pro Tips
                            </span>
                            <ul className="list-disc list-inside text-xs text-text-main/80 mt-1 space-y-0.5">
                              {msg.data.helpfulTips.map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-neutral-main/10 text-text-main border border-neutral-main/20 p-3 rounded-2xl rounded-bl-none">
                  <span className="flex gap-1">
                    <span className="size-1.5 bg-text-main/40 rounded-full animate-bounce" />
                    <span className="size-1.5 bg-text-main/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="size-1.5 bg-text-main/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <DrawerFooter className="border-t border-neutral-main/20 p-4">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {INITIAL_SUGGESTIONS.map((prompt: string, idx: number) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full border-primary/20 hover:bg-primary/5 text-primary"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Ask your advisor about a ritual..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                className="bg-background border-neutral-main/30"
              />
              <Button size="icon" onClick={() => handleSend(input)}>
                <Send className="size-4" />
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
