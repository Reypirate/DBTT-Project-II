"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { PreorderProvider } from "@/context/PreorderContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem suppressHydrationWarning>
      <AuthProvider>
        <PreorderProvider>{children}</PreorderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
