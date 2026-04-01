"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const CheckoutContent = dynamic(() => import("./CheckoutContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background-main">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  ),
});

export default function CheckoutPage() {
  return <CheckoutContent />;
}
