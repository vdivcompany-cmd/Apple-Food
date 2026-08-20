"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ActiveChatView, ChatInputBar } from "@/components/chat";
import { ChatMessage } from "@/types";

const mobileRealChatMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "ai",
    text: "أهلاً بيك في بيتزا وكريب توفيق (طاولة 10) 👋! أنا ResBot الويتر الذكي، تحب تطلب إيه النهاردة؟",
    timestamp: "12:30 PM",
  },
  {
    id: "m-2",
    sender: "user",
    text: "عايز 1 بيتزا جامايكا و 1 برجاريزا تشيكن سبايسي",
    timestamp: "12:31 PM",
  },
  {
    id: "m-3",
    sender: "ai",
    text: "✅ سجلت طلبك:\n• 1x بيتزا جامايكا (140 EGP)\n• 1x برجاريزا تشيكن سبايسي (100 EGP)\n\nالإجمالي: 240 EGP. تم إرسال الطلب للمطبخ 🍽️",
    timestamp: "12:31 PM",
  },
];

export default function ActiveChatMobileDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mobileRealChatMessages);
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
        text: `تمام يا فندم! أضفت "${text}" لطلبك. تحب تزود أي حاجة تانية؟`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-container-high flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Top Banner */}
      <div className="w-full max-w-sm bg-primary text-white text-xs px-3 py-1.5 flex justify-between items-center rounded-t-xl mb-0 sm:mb-2">
        <span>📱 Screen #4: <strong>Active Chat (Mobile)</strong> — Real Tawfik Menu</span>
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
              <h2 className="font-bold text-xs md:text-sm text-on-surface leading-tight">ResBot (توفيق)</h2>
              <p className="text-[10px] text-primary-container font-semibold">طاولة 10 · مباشر</p>
            </div>
          </div>
          <Link
            href="/demo/order-tracking-mobile"
            className="px-3 py-1.5 bg-surface-container-highest text-on-surface rounded-full text-xs font-bold flex items-center gap-1 hover:bg-primary-fixed hover:text-primary transition-colors"
          >
            <span>طلباتي</span>
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
