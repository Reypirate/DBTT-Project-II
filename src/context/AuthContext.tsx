"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CustomerGroup =
  | "Hokkien"
  | "Teochew"
  | "Cantonese"
  | "Hakka"
  | "Hainanese"
  | "Other"
  | "None";

export const CUSTOMER_GROUPS: CustomerGroup[] = [
  "Hokkien",
  "Teochew",
  "Cantonese",
  "Hakka",
  "Hainanese",
  "Other",
  "None",
];

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  tier?: "Free" | "Member";
  customerGroup?: CustomerGroup;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (data: { firstName: string; lastName: string; email: string; password?: string }) => {
    success: boolean;
    message?: string;
  };
  updateMembership: (tier: "Free" | "Member") => void;
  updateCustomerGroup: (group: CustomerGroup) => void;
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
        customerGroup: "None", // Default customer group
      };
    } else {
      return { success: false, message: "User not found. Try rey@gmail.com or admin@gmail.com." };
    }

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const register = (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
  }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: "customer",
      tier: "Free",
      customerGroup: "None",
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateMembership = (tier: "Free" | "Member") => {
    if (user && user.role === "customer") {
      const updatedUser = { ...user, tier };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateCustomerGroup = (group: CustomerGroup) => {
    if (user && user.role === "customer") {
      const updatedUser = { ...user, customerGroup: group };
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
        register,
        updateMembership,
        updateCustomerGroup,
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
