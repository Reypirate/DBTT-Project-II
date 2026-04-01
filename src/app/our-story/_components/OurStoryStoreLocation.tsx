"use client";

import { MapPin, Phone, Clock } from "lucide-react";

export function OurStoryStoreLocation() {
  return (
    <section className="py-20 px-6 container mx-auto max-w-5xl border-t border-neutral-main/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-text-main mb-4">
              Visit Our Store
            </h2>
            <p className="text-text-main/70">
              Experience the authentic atmosphere of Hin Long. Our doors are open to serve your
              ritual needs daily.
            </p>
          </div>

          <div className="space-y-6">
            <a
              href="https://www.google.com/maps/search/?api=1&query=638+Jurong+West+Street+61+%2301-05+Pioneer+Mall+Singapore+640638"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 group/loc cursor-pointer"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover/loc:bg-primary/20 transition-colors">
                <MapPin className="text-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-text-main group-hover/loc:text-primary transition-colors">
                  Location
                </h4>
                <p className="text-text-main/70 text-sm">
                  638 Jurong West Street 61 #01-05 Pioneer Mall, Singapore 640638
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="text-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-text-main">Phone</h4>
                <p className="text-text-main/70 text-sm">+65 6793 9005</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="text-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-text-main">Operating Hours</h4>
                <p className="text-text-main/70 text-sm">
                  Mon - Sat: 09:00 - 19:30 | Sun: 09:00 - 18:00
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl aspect-video lg:aspect-4/3 border border-neutral-main overflow-hidden relative shadow-md">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Hin+Long+Joss+Sticks+%26+Papers+638+Jurong+West+Street+61+%2301-05+Pioneer+Mall+Singapore+640638`}
          />
        </div>
      </div>
    </section>
  );
}
