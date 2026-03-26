import { Award, CheckCircle2, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TrustSignals() {
  return (
    <section className="border-y border-neutral-main bg-surface py-12">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        <div className="flex items-center gap-4 text-text-main/80">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-text-main">3rd Generation</p>
            <p className="text-sm">Heritage Family Business</p>
          </div>
        </div>

        <Separator className="hidden md:block h-12" orientation="vertical" />

        <div className="flex items-center gap-4 text-text-main/80">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-text-main">638 Jurong West Street 61 #01-05</p>
            <p className="text-sm">In-Store Pickup</p>
          </div>
        </div>

        <Separator className="hidden md:block h-12" orientation="vertical" />

        <div className="flex items-center gap-4 text-text-main/80">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-text-main">Authentic Quality</p>
            <p className="text-sm">Curated Ceremonial Goods</p>
          </div>
        </div>
      </div>
    </section>
  );
}
