"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient, PlacedOrderData, PlaceOrderItemInput } from "@/lib/api/client";
import { useSession } from "./SessionContext";
import { usePolling } from "@/lib/hooks/usePolling";

interface OrderContextType {
  currentOrder: PlacedOrderData | null;
  orderHistory: PlacedOrderData[];
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
  fetchOrderHistory: () => Promise<void>;
  placeNewOrder: (items: PlaceOrderItemInput[]) => Promise<PlacedOrderData | null>;
  reorderLastOrder: (orderId: string) => Promise<PlacedOrderData | null>;
  setCurrentOrder: (order: PlacedOrderData | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const [currentOrder, setCurrentOrder] = useState<PlacedOrderData | null>(null);
  const [orderHistory, setOrderHistory] = useState<PlacedOrderData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch table order history
  const fetchOrderHistory = useCallback(async () => {
    if (!session.tableId || !session.tenantId) return;

    try {
      setIsLoading(true);
      const res = await apiClient.getTableOrderHistory(session.tableId, session.tenantId, 50);
      if (res.success && res.data) {
        setOrderHistory(res.data);
        // If there's an active (non-delivered) order, set as currentOrder
        const active = res.data.find(
          (o) => o.status === "placed" || o.status === "preparing" || o.status === "ready"
        );
        if (active && !currentOrder) {
          setCurrentOrder(active);
        }
      }
    } catch (err: any) {
      console.warn("[OrderProvider] Error fetching order history:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [session.tableId, session.tenantId, currentOrder]);

  useEffect(() => {
    if (session.tableId && session.tenantId) {
      fetchOrderHistory();
    }
  }, [session.tableId, session.tenantId, fetchOrderHistory]);

  // 2. Auto-polling single order status every ~5s if current order is in progress
  const isTerminalState =
    !currentOrder || currentOrder.status === "delivered" || currentOrder.status === "cancelled";

  const pollStatus = useCallback(async () => {
    if (!currentOrder?._id || !session.tenantId) return;

    try {
      const res = await apiClient.getOrderStatus(currentOrder._id, session.tenantId);
      if (res.success && res.data) {
        setCurrentOrder(res.data);
      }
    } catch (err) {
      console.warn("[OrderProvider] Polling error:", err);
    }
  }, [currentOrder?._id, session.tenantId]);

  usePolling(pollStatus, 5000, !isTerminalState);

  // 3. Place order strictly following backend rules (no price sent)
  const placeNewOrder = async (items: PlaceOrderItemInput[]): Promise<PlacedOrderData | null> => {
    if (!session.tableId || !session.tenantId || !session.tableSessionId) {
      setError("Active table session missing.");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await apiClient.placeOrder({
        tenantId: session.tenantId,
        branchId: session.branchId,
        tableId: session.tableId,
        tableSessionId: session.tableSessionId,
        items,
      });

      if (res.success && res.data) {
        setCurrentOrder(res.data);
        setOrderHistory((prev) => [res.data!, ...prev]);
        return res.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Reorder flow matching n8n automation
  const reorderLastOrder = async (orderId: string): Promise<PlacedOrderData | null> => {
    try {
      const oldOrderRes = await apiClient.getOrderStatus(orderId, session.tenantId);
      if (!oldOrderRes.success || !oldOrderRes.data) {
        throw new Error("Previous order details could not be retrieved.");
      }

      const items: PlaceOrderItemInput[] = oldOrderRes.data.items.map((i) => {
        const prodId = typeof i.productId === "object" ? (i.productId as any)._id : i.productId;
        const v = Array.isArray(i.selectedVariants) && i.selectedVariants[0] ? i.selectedVariants[0] : null;

        return {
          productId: prodId,
          quantity: i.quantity,
          ...(v?.variantId ? { variantId: v.variantId } : {}),
          ...(v?.selectedOptionNames ? { selectedOptionNames: v.selectedOptionNames } : {}),
        };
      });

      return placeNewOrder(items);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orderHistory,
        isLoading,
        isPolling: !isTerminalState,
        error,
        fetchOrderHistory,
        placeNewOrder,
        reorderLastOrder,
        setCurrentOrder,
      }}
    >
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
