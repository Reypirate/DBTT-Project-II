"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Send, Phone, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OurStoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 2. GSAP Animations
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Gallery Animation (ScrollTrigger)
      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Form Animation
      gsap.from(".form-section", {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for mock submission
    setIsSubmitted(true);
    console.log("Form Submitted:", formData);

    // Reset after some time
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        subscribe: false,
      });
    }, 3000);
  };

  return (
    <div
      ref={containerRef}
      className="bg-background-main selection:bg-primary selection:text-white overflow-x-hidden"
    >
      {/* 1. Brand Heritage (Hero) */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div ref={heroRef}>
          <span className="hero-text inline-block text-primary font-bold tracking-widest text-sm uppercase mb-4">
            Established 2006
          </span>
          <h1 className="hero-text font-playfair text-5xl md:text-7xl font-bold text-text-main mb-8 leading-tight">
            Our Heritage <br /> of Reverence
          </h1>
          <p className="hero-text text-text-main/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            Established in 2006 at Pioneer Mall, Hin Long Joss Sticks & Papers has been a trusted
            cornerstone of the community for nearly two decades. For over 17 years, we have proudly
            provided authentic joss paper and ceremonial products with a commitment to tradition and
            deep respect for cultural rituals. Registered in July 2006, our journey continues to
            serve generations with high-quality spiritual offerings.
          </p>
        </div>
      </section>

      {/* 2. Locate Us (Moved up before images) */}
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
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">Location</h4>
                  <p className="text-text-main/70 text-sm">
                    638 Jurong West Street 61 #01-05 Pioneer Mall, Singapore 640638
                  </p>
                </div>
              </div>

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

          <div className="bg-neutral-main/20 rounded-2xl aspect-video lg:aspect-[4/3] flex flex-col items-center justify-center border border-neutral-main group overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80')] bg-cover opacity-10 group-hover:scale-105 transition-transform duration-1000 grayscale" />
            <MapPin className="w-12 h-12 text-primary mb-3 animate-bounce" />
            <p className="text-text-main font-bold relative z-10 text-center px-6 text-sm">
              638 Jurong West Street 61 #01-05 Pioneer Mall
            </p>
          </div>
        </div>
      </section>

      {/* 3. Visual Gallery (Product Imagery) */}
      <section ref={galleryRef} className="py-20 px-6 container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Item 1 */}
          <div className="gallery-item group relative overflow-hidden rounded-xl aspect-[4/3] shadow-md border border-neutral-main/10">
            <Image
              src="/images/joss_paper.png"
              alt="Authentic Joss Paper"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Item 2 */}
          <div className="gallery-item group relative overflow-hidden rounded-xl aspect-[4/3] shadow-md border border-neutral-main/10 sm:translate-y-8">
            <Image
              src="/images/deity_offering_set.png"
              alt="Deity Offering Set"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Item 3 */}
          <div className="gallery-item group relative overflow-hidden rounded-xl aspect-[4/3] shadow-md border border-neutral-main/10">
            <Image
              src="/images/aromatic_wood_powder.png"
              alt="Aromatic Wood Powder"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Item 4 */}
          <div className="gallery-item group relative overflow-hidden rounded-xl aspect-[4/3] shadow-md border border-neutral-main/10 sm:translate-y-8">
            <Image
              src="/images/sandalwood_incense.png"
              alt="Sandalwood Incense"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 4. Get in touch with Us Form */}
      <section className="py-32 px-6 bg-surface border-t border-neutral-main/20 mt-16">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 form-section">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-text-main mb-4">
              Get in touch with Us
            </h2>
            <p className="text-text-main/70 text-base max-w-lg mx-auto">
              Email us with any questions and enquiries. We would be happy to answer to your
              questions and we’ll be in touch.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="form-section grid grid-cols-1 md:grid-cols-2 gap-5 bg-background-main p-8 rounded-2xl shadow-xl border border-neutral-main/30"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Contact No.</Label>
              <Input
                id="phone"
                placeholder="+65 9123 4567"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Query about Proxy Burning"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your query here..."
                required
                className="min-h-[120px]"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <Checkbox
                id="newsletter"
                checked={formData.subscribe}
                onChange={(e: any) => setFormData({ ...formData, subscribe: e.target.checked })}
              />
              <Label htmlFor="newsletter" className="text-sm text-text-main/70 cursor-pointer">
                Subscribe to our newsletter for heritage happenings.
              </Label>
            </div>

            <div className="md:col-span-2 pt-2">
              <Button
                type="submit"
                className="w-full py-6 text-base font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
              >
                {isSubmitted ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Submitted Successfully!
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message <Send className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
