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

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session, expireSession } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-ai-welcome",
      sender: "ai",
      text: `Hello and welcome to Table ${session.tableNumber}! I'm ResBot, your AI Waiter. Feel free to ask about our menu, today's chef specials, or dietary options.`,
      timestamp: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [searchedProducts, setSearchedProducts] = useState<SearchedProduct[]>([]);

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
    setMessages([]);
    setSearchedProducts([]);
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
