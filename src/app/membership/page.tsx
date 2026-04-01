"use client";

import { Sparkles, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TIERS } from "./_lib/membership-data";
import { MembershipTierCard } from "./_components/MembershipTierCard";

export default function MembershipPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isMember = user?.tier === "Member";

  const handleSelect = (tierName: string) => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (tierName === "Member") {
      router.push("/checkout?mode=membership");
    }
  };

  return (
    <div className="min-h-screen bg-background-main pb-32 selection:bg-primary selection:text-white overflow-hidden">
      {/* Background Decor/Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay bg-[url('/images/grain.png')] bg-repeat" />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 text-center container mx-auto max-w-4xl">
        {/* Glowing Aura Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-primary/20 text-primary text-sm font-bold shadow-md shadow-primary/5 animate-fade-in">
            <Sparkles className="size-4" />
            <span>Premium Heritage Access</span>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-text-main leading-tight tracking-tight">
            Connect with Your <br />
            <span className="text-primary italic">Heritage</span>
          </h1>

          <p className="text-lg md:text-xl text-text-main/70 max-w-2xl mx-auto leading-relaxed font-medium">
            Join our community to preserve traditions and ensure your reverence rituals are
            performed with meticulous care and modern convenience.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="px-6 container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {TIERS.map((tier) => {
            const isCurrent =
              (tier.name === "Free" && !isMember) || (tier.name === "Member" && isMember);

            return (
              <MembershipTierCard
                key={tier.name}
                tier={tier}
                isCurrent={isCurrent}
                onSelect={() => handleSelect(tier.name)}
              />
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 p-10 rounded-3xl bg-surface border border-primary/20 shadow-xl text-center max-w-4xl mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown className="size-32 text-primary rotate-12" />
          </div>

          <h4 className="text-2xl font-bold text-text-main mb-4 relative z-10">
            For Large Ceremonies & Businesses
          </h4>
          <p className="text-text-main/70 max-w-xl mx-auto mb-8 relative z-10">
            Dedicated concierge support for corporate offerings, large-scale temple donations, and
            customized heritage programs. Contact our concierge for a bespoke arrangement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 font-bold">
            <a
              href="mailto:concierge@hinlong.sg"
              className="underline decoration-primary/40 hover:decoration-primary transition-all"
            >
              concierge@hinlong.sg
            </a>
            <span className="hidden sm:inline text-neutral-main/30">|</span>
            <span className="text-text-main/80">+65 6793 9005</span>
          </div>
        </div>
      </section>

      {/* Decorative Ornaments */}
      <div className="absolute top-1/4 -left-20 size-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 size-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
