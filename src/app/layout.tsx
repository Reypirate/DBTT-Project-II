import "../globals.css";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AIAdvisor } from "@/components/AIAdvisor";
import { RouteFooter } from "@/components/RouteFooter";
import { Analytics } from "@vercel/analytics/next";
import React from "react";

export const metadata = {
  title: "MyLegacy",
  description: "Traditional Ceremonial Offerings O2O Planner",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen bg-background-main font-inter text-text-main flex flex-col transition-colors duration-200">
            <Navigation />
            <SmoothScroll />
            <main className="flex-grow">{children}</main>
            <RouteFooter />
            <AIAdvisor />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
