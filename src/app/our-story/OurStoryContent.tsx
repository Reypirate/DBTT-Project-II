"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OurStoryHero } from "./_components/OurStoryHero";
import { OurStoryStoreLocation } from "./_components/OurStoryStoreLocation";
import { OurStoryGallery } from "./_components/OurStoryGallery";
import { OurStoryContactForm } from "./_components/OurStoryContactForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OurStoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
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
      if (galleryRef.current) {
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
      }

      // Form Animation
      if (formRef.current) {
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-background-main selection:bg-primary selection:text-white overflow-x-hidden"
    >
      <OurStoryHero />
      <OurStoryStoreLocation />
      <OurStoryGallery galleryRef={galleryRef} />
      <OurStoryContactForm formRef={formRef} />
    </div>
  );
}
