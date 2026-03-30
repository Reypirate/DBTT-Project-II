"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { usePreorder } from "../context/PreorderContext";
import { CartDrawer } from "./CartDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export const Navigation = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { preorderItems } = usePreorder();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-neutral-main p-4 flex justify-between items-center shadow-sm">
      <Link
        href={isAdmin ? "/admin" : "/"}
        className="font-playfair text-2xl font-bold text-primary"
      >
        Hin Long
      </Link>
      <nav className="flex gap-6 items-center">
        {!isAdmin && (
          <>
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/calendar" className="hover:text-primary transition-colors font-medium">
              Calendar
            </Link>
            <Link href="/remembrance" className="hover:text-primary transition-colors font-medium">
              Remembrances
            </Link>
            <Link href="/bundles" className="hover:text-primary transition-colors font-medium">
              Bundles
            </Link>
            <Link href="/products" className="hover:text-primary transition-colors font-medium">
              Products
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link href="/admin" className="hover:text-primary transition-colors font-medium">
              Overview
            </Link>
            <Link
              href="/admin/analytics"
              className="hover:text-primary transition-colors font-medium"
            >
              Analytics
            </Link>
            <Link
              href="/admin/proxy-orders"
              className="hover:text-primary transition-colors font-medium"
            >
              Proxy Queue
            </Link>
            <Link href="/admin/orders" className="hover:text-primary transition-colors font-medium">
              Orders
            </Link>
            <Link
              href="/admin/inventory"
              className="hover:text-primary transition-colors font-medium"
            >
              Inventory
            </Link>
          </>
        )}

        <ThemeToggle />
        <div className="w-px h-5 bg-neutral-main mx-2"></div>

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
              className="flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
            >
              <User className="w-4 h-4" />
              {user?.name}
            </Link>
            <button
              onClick={logout}
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
    </header>
  );
};
