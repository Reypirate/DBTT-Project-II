"use client";

import { BUNDLES } from "@/data/bundles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FeaturedBundles() {
  const router = useRouter();
  const featuredBundles = BUNDLES.slice(0, 4);

  return (
    <section className="py-24 bg-surface border-y border-neutral-main overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-playfair text-4xl font-bold text-text-main mb-4">
              Curated Offerings
            </h2>
            <p className="text-text-main/70 max-w-xl">
              Swipe through our most popular ceremonial bundles, meticulously prepared for upcoming
              important dates.
            </p>
          </div>
          <Button asChild variant="link" className="hidden md:inline-flex items-center gap-2">
            <Link href="/bundles">
              View All Bundles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-0">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {featuredBundles.map((bundle) => (
                <CarouselItem key={bundle.id} className="md:basis-full">
                  <Card
                    className="overflow-hidden border border-neutral-main shadow-lg flex flex-col md:flex-row h-full group cursor-pointer"
                    onClick={() => router.push(`/bundles/${bundle.id}`)}
                  >
                    <div className="md:w-1/2 h-48 md:h-full relative overflow-hidden">
                      <img
                        src={bundle.image}
                        alt={bundle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-primary backdrop-blur-sm shadow-sm font-bold"
                        >
                          {bundle.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface">
                      <h3 className="font-playfair text-3xl font-bold text-text-main mb-4">
                        {bundle.name}
                      </h3>
                      <p className="font-bold text-2xl text-primary mb-6">
                        ${Number(bundle.price).toFixed(2)}
                      </p>
                      <p className="text-text-main/70 leading-relaxed mb-8 line-clamp-3">
                        {bundle.description}
                      </p>
                      <div className="mt-auto inline-flex items-center gap-2 text-text-main font-bold group-hover:text-primary transition-colors">
                        Explore Bundle
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
