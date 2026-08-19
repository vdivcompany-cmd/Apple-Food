"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ActiveChatView, ChatInputBar } from "@/components/chat";
import { ChatMessage } from "@/types";

const mobileChatMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "ai",
    text: "Welcome to Table 10! 👋 I'm your AI waiter. What would you like to order today?",
    timestamp: "12:30 PM",
  },
  {
    id: "m-2",
    sender: "user",
    text: "Can I get 2 Sea Bass and 1 Sparkling Cooler?",
    timestamp: "12:31 PM",
  },
  {
    id: "m-3",
    sender: "ai",
    text: "✅ Order noted! 2x Grilled Sea Bass ($57.00) and 1x Sparkling Citrus Cooler ($6.50). Total: $63.50. Sent straight to the kitchen 🍽️",
    timestamp: "12:31 PM",
  },
];

export default function ActiveChatMobileDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mobileChatMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: `Understood! Added "${text}" to your request. Let me know if you need anything else!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-container-high flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Top Banner */}
      <div className="w-full max-w-sm bg-primary text-white text-xs px-3 py-1.5 flex justify-between items-center rounded-t-xl mb-0 sm:mb-2">
        <span>📱 Screen #4: <strong>Active Chat (Mobile)</strong> [390x884]</span>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-full max-w-sm h-screen sm:h-[844px] bg-background flex flex-col overflow-hidden shadow-2xl rounded-none sm:rounded-[36px] border-0 sm:border-8 sm:border-brand-charcoal relative">
        {/* Mobile Header Bar */}
        <header className="bg-surface/90 backdrop-blur-md px-4 py-3 border-b border-surface-variant/40 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold shadow-sm">
              🤖
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface leading-tight">ResBot Waiter</h2>
              <p className="text-[10px] text-primary-container font-semibold">Table 10 · Live</p>
            </div>
          </div>
          <Link
            href="/demo/order-tracking-mobile"
            className="px-3 py-1.5 bg-surface-container-highest text-on-surface rounded-full text-xs font-bold flex items-center gap-1 hover:bg-primary-fixed hover:text-primary transition-colors"
          >
            <span>Orders</span>
            <span className="material-symbols-outlined text-sm">receipt</span>
          </Link>
        </header>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <ActiveChatView messages={messages} isTyping={isTyping} />
        </div>

        {/* Sticky Mobile Input */}
        <div className="p-3 bg-surface/95 border-t border-surface-variant/30">
          <ChatInputBar onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
