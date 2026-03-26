"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type PreorderItemKind = "bundle" | "product";

export interface PreorderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  kind: PreorderItemKind;
  quantity: number;
}

export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Complete";

export interface OrderLogEntry {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: PreorderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address?: {
    street: string;
    unit: string;
    postalCode: string;
  };
}

interface AddToPreorderPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  kind: PreorderItemKind;
}

interface PreorderContextType {
  preorderItems: PreorderItem[];
  orderLog: OrderLogEntry[];
  subtotal: number;
  addToPreorder: (item: AddToPreorderPayload, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromPreorder: (id: string) => void;
  clearPreorder: () => void;
  placeOrder: (
    deliveryFee: number,
    address?: { street: string; unit: string; postalCode: string },
  ) => OrderLogEntry | null;
}

const PREORDER_STORAGE_KEY = "hinlong_preorder_items";
const ORDER_LOG_STORAGE_KEY = "hinlong_order_log";

const PreorderContext = createContext<PreorderContextType | undefined>(undefined);

function clampQuantity(quantity: number) {
  return Math.max(1, Math.min(99, Math.floor(quantity)));
}

function safeRead<T>(storageKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(storageKey);
    return fallback;
  }
}

export function PreorderProvider({ children }: { children: React.ReactNode }) {
  const [preorderItems, setPreorderItems] = useState<PreorderItem[]>([]);
  const [orderLog, setOrderLog] = useState<OrderLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedPreorders = safeRead<PreorderItem[]>(PREORDER_STORAGE_KEY, []);
    const storedOrders = safeRead<OrderLogEntry[]>(ORDER_LOG_STORAGE_KEY, []);
    setPreorderItems(storedPreorders);
    setOrderLog(storedOrders);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PREORDER_STORAGE_KEY, JSON.stringify(preorderItems));
  }, [hydrated, preorderItems]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ORDER_LOG_STORAGE_KEY, JSON.stringify(orderLog));
  }, [hydrated, orderLog]);

  const subtotal = useMemo(
    () => preorderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [preorderItems],
  );

  const addToPreorder = (item: AddToPreorderPayload, quantity = 1) => {
    const safeQuantity = clampQuantity(quantity);
    setPreorderItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: clampQuantity(entry.quantity + safeQuantity) }
            : entry,
        );
      }
      return [...prev, { ...item, quantity: safeQuantity }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    const normalized = Math.floor(quantity);
    if (Number.isNaN(normalized) || normalized < 1) {
      setPreorderItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setPreorderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: clampQuantity(normalized) } : item,
      ),
    );
  };

  const removeFromPreorder = (id: string) => {
    setPreorderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearPreorder = () => {
    setPreorderItems([]);
  };

  const placeOrder = (
    deliveryFee: number,
    address?: { street: string; unit: string; postalCode: string },
  ) => {
    if (preorderItems.length === 0) return null;

    const subtotalAmount = preorderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const safeDeliveryFee = Math.max(0, deliveryFee);
    const order: OrderLogEntry = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      items: preorderItems,
      subtotal: subtotalAmount,
      deliveryFee: safeDeliveryFee,
      total: subtotalAmount + safeDeliveryFee,
      address,
    };

    setOrderLog((prev) => [order, ...prev]);
    setPreorderItems([]);
    return order;
  };

  return (
    <PreorderContext.Provider
      value={{
        preorderItems,
        orderLog,
        subtotal,
        addToPreorder,
        updateQuantity,
        removeFromPreorder,
        clearPreorder,
        placeOrder,
      }}
    >
      {children}
    </PreorderContext.Provider>
  );
}

export function usePreorder() {
  const context = useContext(PreorderContext);
  if (!context) {
    throw new Error("usePreorder must be used within a PreorderProvider");
  }
  return context;
}
