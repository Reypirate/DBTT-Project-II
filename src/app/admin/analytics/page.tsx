"use client";

import dynamic from "next/dynamic";

const DeepAnalyticsContent = dynamic(() => import("./DeepAnalyticsContent"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-background-main">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-main/60 font-medium font-playfair animate-pulse">
          Loading Analytics Engine...
        </p>
      </div>
    </div>
  ),
});

export default function AnalyticsPage() {
  return <DeepAnalyticsContent />;
}
