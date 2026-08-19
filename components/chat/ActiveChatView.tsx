"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChatMessage } from "@/types";
import { useOrder } from "@/lib/context/OrderContext";
import { useChat } from "@/lib/context/ChatContext";
import { useSession } from "@/lib/context/SessionContext";

interface ActiveChatViewProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

export function ActiveChatView({ messages, isTyping }: ActiveChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { currentOrder } = useOrder();
  const { searchedProducts, placeTableOrder } = useChat();
  const { session } = useSession();
  const [orderingProductId, setOrderingProductId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, searchedProducts]);

  const handleOrderProduct = async (productId: string, name: string) => {
    try {
      setOrderingProductId(productId);
      await placeTableOrder(productId, 1);
    } finally {
      setOrderingProductId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Live Order Context Banner if Order is Active */}
      {currentOrder && (
        <div className="bg-surface-container-lowest border border-primary-container/30 rounded-2xl p-4 shadow-card-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-xl animate-spin">sync</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-on-surface">Order #{currentOrder._id.slice(-4)}</span>
                <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-container rounded-full text-[10px] font-bold uppercase">
                  {currentOrder.status}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {currentOrder.items.length} items · Total: {currentOrder.totalAmount} {session.currency}
              </p>
            </div>
          </div>
          <Link
            href="/tracking"
            className="px-3.5 py-2 bg-primary-container text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1 shadow-sm flex-shrink-0"
          >
            <span>Live Status</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Messages Feed */}
      {messages.map((msg) => {
        const isUser = msg.sender === "user";
        return (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
          >
            {/* AI Avatar */}
            {!isUser && (
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex-shrink-0 flex items-center justify-center text-primary font-bold text-sm shadow-sm border border-primary/20">
                <span className="material-symbols-outlined text-lg text-primary-container">smart_toy</span>
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] md:max-w-lg rounded-2xl p-4 text-sm md:text-base transition-all shadow-card-soft ${
                isUser
                  ? "bg-primary-container text-white rounded-br-none"
                  : "bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-bl-none"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span
                className={`block text-[10px] mt-1.5 font-medium ${
                  isUser ? "text-white/80 text-right" : "text-on-surface-variant text-left"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-9 h-9 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center text-on-surface font-bold text-xs shadow-sm">
                You
              </div>
            )}
          </div>
        );
      })}

      {/* Searched Products Cards (Surfaced from Real Backend Menu Search) */}
      {searchedProducts.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-secondary uppercase tracking-wider pl-12">
            Suggested Items From Menu
          </p>
          <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchedProducts.map((prod) => (
              <div
                key={prod.productId}
                className="p-3.5 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-card-soft flex items-center justify-between gap-3 hover:border-primary-container transition-all"
              >
                <div className="flex items-center gap-3">
                  {prod.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover border border-surface-variant"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-xl">
                      🍽️
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{prod.name}</h4>
                    <p className="text-xs font-extrabold text-primary-container">
                      {prod.price} {session.currency}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOrderProduct(prod.productId, prod.name)}
                  disabled={orderingProductId === prod.productId}
                  className="px-3 py-1.5 bg-primary-fixed text-primary rounded-xl text-xs font-bold hover:bg-primary-container hover:text-white transition-all shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>{orderingProductId === prod.productId ? "Ordering..." : "Order"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-3 justify-start">
          <div className="w-9 h-9 rounded-full bg-primary-fixed flex-shrink-0 flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-lg">smart_toy</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl rounded-bl-none px-4 py-3 shadow-card-soft flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
