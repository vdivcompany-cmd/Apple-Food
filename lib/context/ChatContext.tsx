"use client";

import React, { createContext, useContext, useState } from "react";
import { ChatMessage } from "@/types";
import { useSession } from "./SessionContext";
import { getChatTransport, SearchedProduct } from "@/lib/chat/chatTransport";
import { apiClient, PlacedOrderData } from "@/lib/api/client";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  isTyping: boolean;
  searchedProducts: SearchedProduct[];
  placeTableOrder: (productId: string, quantity?: number, variantId?: string) => Promise<PlacedOrderData | null>;
}

const CHAT_MESSAGES_STORAGE_KEY = "tablechat_chat_messages";
const CHAT_PRODUCTS_STORAGE_KEY = "tablechat_chat_products";
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session, expireSession } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("[ChatProvider] Failed to load cached messages:", e);
      }
    }
    return [
      {
        id: "initial-ai-welcome",
        sender: "ai",
        text: session.tableNumber
          ? `أهلاً بحضرتك في طاولة ${session.tableNumber}! أنا ResBot مساعدك الذكي في ${session.restaurantName}. تحت أمرك لأي طلب أو استفسار عن المنيو ❤️`
          : `أهلاً بحضرتك في ${session.restaurantName}! أنا ResBot مساعدك الذكي. تحت أمرك لاستعراض المنيو وطلب الدليفري أو الاستلام ❤️`,
        timestamp: "الآن",
      },
    ];
  });
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [searchedProducts, setSearchedProducts] = useState<SearchedProduct[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(CHAT_PRODUCTS_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {}
    }
    return [];
  });

  // Sync messages to sessionStorage
  React.useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        sessionStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn("[ChatProvider] Failed to persist messages:", e);
      }
    }
  }, [messages]);

  // Sync searchedProducts to sessionStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(CHAT_PRODUCTS_STORAGE_KEY, JSON.stringify(searchedProducts));
      } catch {}
    }
  }, [searchedProducts]);

  // Listen for real-time order confirmation from restaurant staff / phone call verification
  React.useEffect(() => {
    const handleConfirmed = (e: any) => {
      const order = e.detail;
      const orderShortId = order?._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : "ORD-CONFIRMED";
      const total = order?.totalAmount ? `${order.totalAmount} EGP` : "";

      const confirmMsg: ChatMessage = {
        id: `ai-confirmed-${Date.now()}`,
        sender: "ai",
        text: `🎉 تم تأكيد طلبك بنجاح من المطعم يا فندم!\n**تفاصيل الطلب:**\n- **الطلب رقم:** ${orderShortId}\n- **الحالة:** جاري التجهيز في المطبخ\n${total ? `- **الإجمالي:** ${total}\n` : ""}سيتواصل معك المندوب عند خروج الطلب. شكراً لاختيارك أبل فود! ❤️`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, confirmMsg]);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tablechat:order-confirmed", handleConfirmed);
      return () => window.removeEventListener("tablechat:order-confirmed", handleConfirmed);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const transport = getChatTransport();
      const response = await transport.sendMessage({
        sessionId: session.tableSessionId || session.chatId,
        tenantId: session.tenantId,
        branchId: session.branchId,
        tableId: session.tableId,
        tableSessionId: session.tableSessionId,
        tableNumber: session.tableNumber,
        message: text,
      });

      if (response.products) {
        setSearchedProducts(response.products);
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error("[ChatProvider] Send message error:", err);

      // Detect session expiry from backend
      if (err.statusCode === 401 || err.statusCode === 403 || err.message?.includes("expired")) {
        expireSession();
      }

      const errorReply: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: `Sorry, I couldn't reach the menu right now (${err.message}). You can also browse our menu images or try again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Place an order strictly following backend rules:
   * 1. Only send productId / variantId from Search Menu response.
   * 2. Never send price.
   */
  const placeTableOrder = async (
    productId: string,
    quantity: number = 1,
    variantId?: string
  ): Promise<PlacedOrderData | null> => {
    if (!session.tableId || !session.tenantId || !session.tableSessionId) {
      console.warn("[ChatProvider] Missing table session context to place order");
      return null;
    }

    try {
      setIsTyping(true);
      const res = await apiClient.placeOrder({
        tenantId: session.tenantId,
        branchId: session.branchId,
        tableId: session.tableId,
        tableSessionId: session.tableSessionId,
        tableNumber: session.tableNumber || undefined,
        items: [
          {
            productId,
            quantity,
            ...(variantId ? { variantId } : {}),
          },
        ],
      });

      if (res.success && res.data) {
        const order = res.data;
        const confirmMsg: ChatMessage = {
          id: `order-conf-${Date.now()}`,
          sender: "ai",
          text: `✅ Order confirmed! Total: ${order.totalAmount} ${session.currency}. It's on its way to the kitchen 🍽️ (Order #${order._id.slice(-4)})`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, confirmMsg]);
        return order;
      }
      return null;
    } catch (err: any) {
      console.error("[ChatProvider] Place order error:", err);
      const failMsg: ChatMessage = {
        id: `order-err-${Date.now()}`,
        sender: "ai",
        text: `⚠️ Couldn't place that order: ${err.message}. Please try again or notify your waiter.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, failMsg]);
      return null;
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initialWelcome: ChatMessage = {
      id: "initial-ai-welcome",
      sender: "ai",
      text: session.tableNumber
        ? `أهلاً بحضرتك في طاولة ${session.tableNumber}! أنا ResBot مساعدك الذكي في ${session.restaurantName}. تحت أمرك لأي طلب أو استفسار عن المنيو ❤️`
        : `أهلاً بحضرتك في ${session.restaurantName}! أنا ResBot مساعدك الذكي. تحت أمرك لاستعراض المنيو وطلب الدليفري أو الاستلام ❤️`,
      timestamp: "الآن",
    };
    setMessages([initialWelcome]);
    setSearchedProducts([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
      sessionStorage.removeItem(CHAT_PRODUCTS_STORAGE_KEY);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        clearChat,
        isTyping,
        searchedProducts,
        placeTableOrder,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
