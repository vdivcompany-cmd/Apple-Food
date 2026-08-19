"use client";

import React, { createContext, useContext, useState } from "react";
import { Order, OrderItem } from "@/types";
import { initialMockOrder } from "@/lib/mock/mockOrder";

interface OrderContextType {
  currentOrder: Order | null;
  placeOrder: (items: OrderItem[]) => void;
  updateOrderStatus: (status: Order["status"]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialMockOrder);

  const placeOrder = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      totalAmount: total,
      status: "placed",
      estimatedMinutes: 20,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setCurrentOrder(newOrder);
  };

  const updateOrderStatus = (status: Order["status"]) => {
    if (!currentOrder) return;
    setCurrentOrder((prev) => (prev ? { ...prev, status } : null));
  };

  return (
    <OrderContext.Provider value={{ currentOrder, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
