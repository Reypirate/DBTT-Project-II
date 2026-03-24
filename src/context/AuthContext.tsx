"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  tier?: "Free" | "Subscriber";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  updateTier: (tier: "Free" | "Subscriber") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "hinlong_auth_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persistence: Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password?: string) => {
    // Simulated credential check for prototype
    const isValid = password === "test123";

    if (!isValid) {
      return { success: false, message: "Invalid credentials. Use 'test123'." };
    }

    let newUser: User;

    if (email === "admin@gmail.com") {
      newUser = {
        id: "admin-1",
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin",
      };
    } else if (email === "rey@gmail.com") {
      newUser = {
        id: "rey-1",
        name: "Rey",
        email: "rey@gmail.com",
        role: "customer",
        tier: "Free", // Default tier for customer
      };
    } else {
      return { success: false, message: "User not found. Try rey@gmail.com or admin@gmail.com." };
    }

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateTier = (tier: "Free" | "Subscriber") => {
    if (user && user.role === "customer") {
      const updatedUser = { ...user, tier };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        logout,
        login,
        updateTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
