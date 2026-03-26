import { CalendarHeart, Package, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  const steps = [
    {
      icon: CalendarHeart,
      title: "1. Set Reminders",
      description:
        "Save important dates like Qingming, ancestors' death anniversaries, and deities' birthdays. We automatically convert Lunar dates for you.",
      color: "bg-primary",
      shadow: "shadow-primary/20",
    },
    {
      icon: Package,
      title: "2. Get Recommendations",
      description:
        "Receive curated bundle recommendations tailored to your specific occasion and dialect group requirements.",
      color: "bg-secondary",
      shadow: "shadow-secondary/20",
    },
    {
      icon: ShoppingBag,
      title: "3. Order & Delivery",
      description:
        "Skip the retail queues. Secure your items online and get them delivered to your doorstep.",
      color: "bg-primary",
      shadow: "shadow-primary/20",
    },
  ];

  return (
    <section className="py-24 bg-background-main">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-text-main mb-4">
            How MyLegacy Works
          </h2>
          <p className="text-text-main/70 max-w-2xl mx-auto">
            A seamless O2O experience bridging generations and ensuring you're always prepared for
            the moments that matter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 z-0"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card
                key={idx}
                className={`relative z-10 flex flex-col items-center text-center p-6 border-neutral-main backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${idx === 1 ? "md:translate-y-8" : ""}`}
              >
                <CardContent className="pt-6 flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-lg ${step.shadow} mb-6 group`}
                  >
                    <Icon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-text-main/70 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
