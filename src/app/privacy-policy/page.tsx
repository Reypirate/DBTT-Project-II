"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background-main min-h-screen py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="border-b border-neutral-main pb-8">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-text-main mb-4 text-center sm:text-left">
              Privacy Policy
            </h1>
            <p className="text-text-main/60 text-sm italic text-center sm:text-left">
              Last Updated: March 30, 2026
            </p>
          </div>

          <div className="prose prose-neutral max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-text-main">
                1. Information Collection
              </h2>
              <p className="text-text-main/70 leading-relaxed">
                Hin Long Ceremonial Offerings collects personal information necessary to provide our
                services and products. This includes:
              </p>
              <ul className="list-disc pl-6 text-text-main/70 space-y-2">
                <li>Identification data: Name, email address, and phone number.</li>
                <li>Fulfillment data: Physical shipping addresses for product delivery.</li>
                <li>Order history: Records of past ceremonial offerings and proxy bookings.</li>
                <li>
                  Digital preferences: Subscription status for newsletters and ritual reminders.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-text-main">2. Use of Data</h2>
              <p className="text-text-main/70 leading-relaxed">
                The data we collect is utilized strictly for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-text-main/70 space-y-2">
                <li>
                  <strong>Fulfillment:</strong> To deliver physical ceremonial products and joss
                  paper to your specified location.
                </li>
                <li>
                  <strong>Proxy Services:</strong> To execute proxy burning rituals and veneration
                  services on your behalf with accuracy and reverence.
                </li>
                <li>
                  <strong>Reminders:</strong> To send ritual notifications based on the lunar
                  calendar and your ancestor profiles.
                </li>
                <li>
                  <strong>Updates:</strong> To keep you informed of heritage happenings and product
                  updates via our newsletter (opt-in only).
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-text-main">
                3. Data Protection & Consent
              </h2>
              <p className="text-text-main/70 leading-relaxed">
                We implement robust security measures to protect your data from unauthorized access,
                alteration, or disclosure. We do not sell or trade your personal information to
                third parties.
              </p>
              <p className="text-text-main/70 leading-relaxed">
                By creating an account on the Hin Long platform, you consent to the collection and
                processing of your data as outlined in this policy. You retain the right to request
                the deletion of your account and personal data at any time through our contact
                channels.
              </p>
            </section>

            <section className="space-y-4 pt-10 border-t border-neutral-main/30">
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-text-main">Questions?</h3>
                  <p className="text-text-main/60 text-sm">Contact our data protection officer.</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/signup">Back to Sign Up</Link>
                </Button>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
