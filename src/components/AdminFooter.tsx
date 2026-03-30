"use client";

import Link from "next/link";
import { ShieldCheck, Clock3 } from "lucide-react";

export const AdminFooter = () => {
  return (
    <footer className="bg-surface border-t border-neutral-main/40 py-6 mt-auto">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-main">Hin Long Admin Console</p>
              <p className="text-xs text-text-main/60">
                Internal operations and order management dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-main/60">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              Last updated: {new Date().toLocaleDateString("en-SG")}
            </span>
            <Link href="/admin" className="font-semibold text-primary hover:underline">
              Admin Overview
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
