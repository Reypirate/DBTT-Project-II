"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-neutral-main py-12 mt-auto">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section 1 - Sitemap */}
          <div className="flex flex-col gap-4">
            <h4 className="font-playfair text-xl font-bold text-text-main mb-2">Sitemap</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-text-main/70 hover:text-primary transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/bundles"
                className="text-text-main/70 hover:text-primary transition-colors text-sm"
              >
                Bundles
              </Link>
              <Link
                href="/products"
                className="text-text-main/70 hover:text-primary transition-colors text-sm"
              >
                Products
              </Link>
              <Link
                href="/remembrance"
                className="text-text-main/70 hover:text-primary transition-colors text-sm"
              >
                Remembrance
              </Link>
              <Link
                href="/our-story"
                className="text-text-main/70 hover:text-primary transition-colors text-sm"
              >
                Our Story
              </Link>
            </nav>
          </div>

          {/* Section 2 - Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-playfair text-xl font-bold text-text-main mb-2">Newsletter</h4>
            <p className="text-text-main/70 text-sm leading-relaxed">
              Enter your email for updates on our latest updates and happenings!
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background-main border-neutral-main"
              />
              <Button className="font-bold">Subscribe</Button>
            </div>
          </div>

          {/* Section 3 - About & Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-playfair text-xl font-bold text-text-main mb-2">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-text-main/70 group">
                <MapPin className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm">638 Jurong West Street 61 #01-05</span>
              </div>
              <div className="flex items-center gap-3 text-text-main/70 group">
                <Phone className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+65 6793 9005</span>
              </div>
            </div>
          </div>

          {/* Section 4 - Operating Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="font-playfair text-xl font-bold text-text-main mb-2">Operating Hours</h4>
            <div className="flex flex-col gap-2 text-sm text-text-main/70">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-main/30">
                <span>Mon - Sat</span>
                <span className="font-bold text-text-main">09:00 - 19:30</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Sunday</span>
                <span className="font-bold text-text-main">09:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-main/30 text-center">
          <p className="text-xs text-text-main/50 font-medium tracking-wide">
            © {new Date().getFullYear()} Hin Long Ceremonial Offerings. Serving with Tradition.
          </p>
        </div>
      </div>
    </footer>
  );
};
