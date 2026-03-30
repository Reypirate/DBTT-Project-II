"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { AdminFooter } from "@/components/AdminFooter";

export const RouteFooter = () => {
  const pathname = usePathname() ?? "";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return isAdminRoute ? <AdminFooter /> : <Footer />;
};
