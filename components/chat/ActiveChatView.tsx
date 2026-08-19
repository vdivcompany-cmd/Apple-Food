"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ChatMessage } from "@/types";
import { useOrder } from "@/lib/context/OrderContext";

interface ActiveChatViewProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

export function ActiveChatView({ messages, isTyping }: ActiveChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { currentOrder } = useOrder();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Live Order Context Banner if Order Placed */}
      {currentOrder && (
        <div className="bg-surface-container-lowest border border-primary-container/30 rounded-2xl p-4 shadow-card-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-xl animate-spin">sync</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-on-surface">Order {currentOrder.id}</span>
                <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-container rounded-full text-[10px] font-bold uppercase">
                  {currentOrder.status}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {currentOrder.items.length} items · Total: ${currentOrder.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <Link
            href="/tracking"
            className="px-3.5 py-2 bg-primary-container text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1 shadow-sm"
          >
            <span>Track Order</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Messages Stream */}
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

            {/* Bubble */}
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
