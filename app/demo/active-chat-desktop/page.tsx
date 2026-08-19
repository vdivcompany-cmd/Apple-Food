"use client";

import React, { useState } from "react";
import { Header, SideNavBar } from "@/components/layout";
import { ActiveChatView, ChatInputBar } from "@/components/chat";
import { ChatMessage } from "@/types";

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello! Welcome to Table 10 at Bistro Sun. I'm ResBot, your AI waiter. What can I get started for you today?",
    timestamp: "12:01 PM",
  },
  {
    id: "2",
    sender: "user",
    text: "What do you recommend for mains today? Looking for something with seafood.",
    timestamp: "12:02 PM",
  },
  {
    id: "3",
    sender: "ai",
    text: "I highly recommend our Grilled Mediterranean Sea Bass ($28.50). It's fresh today, grilled with herbs, charred asparagus, and a lemon beurre blanc. If you'd like a lighter starter first, the Pan-Seared Scallops ($18.00) pair wonderfully with it!",
    timestamp: "12:02 PM",
  },
];

export default function ActiveChatDesktopDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
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
      let replyText = `I've noted that! Would you like me to add it to your kitchen ticket?`;
      if (text.toLowerCase().includes("mango juice")) {
        replyText = `Our Fresh Mango Juice ($7.50) is made fresh from sweet Alphonso mangoes with no added sugar. I can add 1 to your order right away! 🥭`;
      } else if (text.toLowerCase().includes("latte") || text.toLowerCase().includes("coffee")) {
        replyText = `Our Iced Spanish Latte ($6.00) is one of our top sellers! Brewed with specialty single-origin beans and creamy condensed milk. ☕`;
      } else if (text.toLowerCase().includes("sea bass") || text.toLowerCase().includes("seafood")) {
        replyText = `Excellent choice! The Grilled Mediterranean Sea Bass ($28.50) is caught fresh and served with charred asparagus and lemon beurre blanc. 🐟`;
      }

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 900);
  };

  const handleSidebarItemSelect = (item: { name: string; price: number; subcategory: string }) => {
    handleSend(`Can you tell me more about the ${item.name} ($${item.price.toFixed(2)}) from ${item.subcategory} and add it to my order?`);
  };

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Banner */}
      <div className="bg-primary text-white text-xs px-4 py-1.5 flex justify-between items-center z-50">
        <span>📌 Stitch Screen #1: <strong>Active AI Conversation (Desktop)</strong> with Interactive Sidebar</span>
        <span className="font-mono text-[11px] opacity-80">Desktop 2560x2048 View</span>
      </div>

      <Header />

      <div className="flex flex-1 h-[calc(100vh-5.5rem)]">
        <SideNavBar onSelectItem={handleSidebarItemSelect} />

        <main className="flex-1 ml-0 md:ml-80 flex flex-col h-full bg-surface relative overflow-hidden">
          <ActiveChatView messages={messages} isTyping={isTyping} />
          <ChatInputBar onSend={handleSend} disabled={isTyping} />
        </main>
      </div>
    </div>
  );
}
