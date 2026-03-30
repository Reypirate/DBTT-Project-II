"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, ShoppingCart, User, X } from "lucide-react";
import { usePreorder } from "../context/PreorderContext";
import { CartDrawer } from "./CartDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useState } from "react";

export const Navigation = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { preorderItems } = usePreorder();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sharedLinks = isAdmin
    ? [
        { href: "/admin", label: "Overview" },
        { href: "/admin/analytics", label: "Analytics" },
        { href: "/admin/proxy-queue", label: "Proxy Queue" },
        { href: "/admin/orders", label: "Orders" },
        { href: "/admin/inventory", label: "Inventory" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/calendar", label: "Calendar" },
        { href: "/remembrance", label: "Remembrances" },
        { href: "/bundles", label: "Bundles" },
        { href: "/products", label: "Products" },
        { href: "/our-story", label: "Our Story" },
      ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-neutral-main shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="font-playfair text-2xl font-bold text-primary shrink-0"
          onClick={closeMobileMenu}
        >
          Hin Long
        </Link>

        <nav className="hidden md:flex gap-6 items-center min-w-0">
          {sharedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}

          <ThemeToggle />
          <div className="w-px h-5 bg-neutral-main mx-1" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <CartDrawer>
                  <button
                    className="relative p-2 text-text-main/60 hover:text-primary transition-colors"
                    title="View Cart"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {preorderItems.length > 0 && (
                      <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-surface">
                        {preorderItems.reduce((acc: number, item) => acc + item.quantity, 0)}
                      </span>
                    )}
                  </button>
                </CartDrawer>
              )}
              <Link
                href={isAdmin ? "/admin" : "/profile"}
                className="flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors max-w-[200px] truncate"
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">{user?.name}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-text-main/60 hover:text-primary transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-bold text-text-main/70 hover:text-primary"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="font-bold shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg border border-neutral-main/50 text-text-main hover:text-primary transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-main/40 bg-surface px-4 pb-4">
          <div className="flex flex-col gap-1 pt-3">
            {sharedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-main/30 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <CartDrawer>
                    <button
                      className="relative w-fit p-2 text-text-main/60 hover:text-primary transition-colors"
                      title="View Cart"
                      onClick={closeMobileMenu}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {preorderItems.length > 0 && (
                        <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-surface">
                          {preorderItems.reduce((acc: number, item) => acc + item.quantity, 0)}
                        </span>
                      )}
                    </button>
                  </CartDrawer>
                )}
                <Link
                  href={isAdmin ? "/admin" : "/profile"}
                  className="flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors w-fit max-w-full"
                  onClick={closeMobileMenu}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user?.name}</span>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full font-bold">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMobileMenu}>
                  <Button className="w-full font-bold shadow-sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
