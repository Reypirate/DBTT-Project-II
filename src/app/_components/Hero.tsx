import { Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typewriter from "@/components/ui/typewriter-wrapper";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543834571-3d75c0211f4c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-multiply"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary mb-8 font-medium text-sm animate-fade-in-up">
          <Award className="w-4 h-4" />
          <span>Since 1978 &bull; Hin Long Joss Sticks & Papers</span>
        </div>

        <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-text-main mb-6 leading-tight max-w-4xl tracking-tight">
          Honoring traditions, <br className="hidden md:block" />
          <Typewriter
            options={{
              strings: [
                "simplified for today.",
                "made easier for you.",
                "never miss a date again.",
              ],
              autoStart: true,
              loop: true,
              wrapperClassName:
                "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary inline-block",
              cursorClassName: "text-primary",
            }}
          />
        </h1>

        <p className="text-lg lg:text-xl text-text-main/70 max-w-2xl mb-10 font-inter">
          Never miss an important ceremonial date again. Set gentle reminders, discover curated
          ritual bundles, and order seamlessly for delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/calendar" className="inline-flex items-center gap-2">
              Set Up Reminders
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/bundles">Explore Bundles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
