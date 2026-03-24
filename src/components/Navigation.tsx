"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

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
          <Link
            href="/login"
            className="text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};
