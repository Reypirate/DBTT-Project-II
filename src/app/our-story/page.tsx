"use client";

import dynamic from "next/dynamic";

const OurStoryContent = dynamic(() => import("./OurStoryContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background-main flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  ),
});

export default function OurStoryPage() {
  return <OurStoryContent />;
}
