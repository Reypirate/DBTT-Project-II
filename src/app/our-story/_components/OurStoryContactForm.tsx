"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import logger from "@/lib/pino";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OurStoryContactFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
}

export function OurStoryContactForm({ formRef }: OurStoryContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    logger.info({ formData }, "Form Submitted");

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
    <section className="py-32 px-6 bg-surface border-t border-neutral-main/20 mt-16">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 form-section">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-text-main mb-4">
            Get in touch with Us
          </h2>
          <p className="text-text-main/70 text-base max-w-lg mx-auto">
            Email us with any questions and enquiries. We would be happy to answer to your questions
            and we’ll be in touch.
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, subscribe: e.target.checked })
              }
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
  );
}
