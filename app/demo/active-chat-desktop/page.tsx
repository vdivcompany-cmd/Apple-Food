"use client";

import React, { useState } from "react";
import { Header, SideNavBar } from "@/components/layout";
import { ActiveChatView, ChatInputBar } from "@/components/chat";
import { ChatMessage } from "@/types";

const initialRealChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "ai",
    text: "أهلاً بيك يا فندم في بيتزا وكريب توفيق! 👋 أنا ResBot الويتر الذكي الخاص بطاولة 10. تحب أساعدك في إيه النهاردة؟",
    timestamp: "12:01 PM",
  },
  {
    id: "2",
    sender: "user",
    text: "إيه أحسن أنواع البيتزا عندكم؟",
    timestamp: "12:02 PM",
  },
  {
    id: "3",
    sender: "ai",
    text: "أكتر بيتزات عليها طلب عندنا:\n🍕 جامايكا (140 EGP) - شاورما دجاج وموتزاريلا مع صوص توفيق الخاص.\n🍕 تشيكن رانش (150 EGP) - شاورما دجاج وصوص الرانش.\n🍕 باربيكيو تشيكن رانش (175 EGP).\n\nوممكن تضيف حشو أطراف (ستافد كراست +40 EGP). تحب تطلب واحدة منهم؟",
    timestamp: "12:02 PM",
  },
];

export default function ActiveChatDesktopDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialRealChatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      let replyText = `تمام يا فندم ❤️! سجلت طلبك. تحب تزود أي مشروبات أو صوصات تانية؟`;
      if (text.includes("جامايكا") || text.includes("بيتزا")) {
        replyText = `اختيار رائع! بيتزا جامايكا (140 EGP) معمولة بشاورما دجاج طازة وصوص توفيق الخاص. تحب تضيف حشو أطراف ستافد كراست (+40 EGP)؟ 🍕`;
      } else if (text.includes("برجاريزا")) {
        replyText = `برجاريزا بيف (110 EGP) أو تشيكن سبايسي (100 EGP) بتنزل شطائر بيتزا محشية برجر وصوص توفيق! 🍔🍕`;
      } else if (text.includes("سلطة") || text.includes("صوص")) {
        replyText = `عندنا صوص ثومية (15 EGP)، صوص رانش (20 EGP)، وتوفيق سلاد (60 EGP) بتنزل تركي مدخن وسلامي. 🥗`;
      }

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 800);
  };

  const handleSidebarItemSelect = (item: { name: string; price: number; category: string }) => {
    handleSend(`عايز أسأل عن ${item.name} (${item.price} EGP) من قسم ${item.category} وأطلبه.`);
  };

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Banner */}
      <div className="bg-primary text-white text-xs px-4 py-1.5 flex justify-between items-center z-50">
        <span>📌 Stitch Screen #1: <strong>Active AI Conversation (Desktop)</strong> — Real Tawfik Restaurant Menu</span>
        <span className="font-mono text-[11px] opacity-80">Tenant: 6a85e588d0b508058fc5008c</span>
      </div>

      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 h-[calc(100vh-5.5rem)] relative">
        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectItem={handleSidebarItemSelect}
        />

        <main className="flex-1 ml-0 md:ml-80 flex flex-col h-full bg-surface relative overflow-hidden">
          <ActiveChatView messages={messages} isTyping={isTyping} />
          <ChatInputBar onSend={handleSend} disabled={isTyping} />
        </main>
      </div>
    </div>
  );
}
