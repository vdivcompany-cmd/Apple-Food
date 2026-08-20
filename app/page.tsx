"use client";

import React from "react";
import { Header, SideNavBar } from "@/components/layout";
import { WelcomeView, ActiveChatView, ChatInputBar } from "@/components/chat";
import { useChat } from "@/lib/context/ChatContext";
import { useSession } from "@/lib/context/SessionContext";

export default function HomePage() {
  const { messages, sendMessage, isTyping } = useChat();
  const { session } = useSession();

  // If only initial bot message exists and no user message yet, show Welcome Landing
  const hasUserStartedChat = messages.some((m) => m.sender === "user");

  const handleSidebarItemClick = (item: { name: string; price: number; category: string; productId?: string }) => {
    sendMessage(`عايز أسأل عن صنف ${item.name} (${item.price} ${session.currency}) من قسم ${item.category}، وممكن أطلبه للطاولة؟`);
  };

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        {/* Multi-level Live Menu Side Navigator */}
        <SideNavBar
          onSelectItem={handleSidebarItemClick}
          onSelectCategory={(cat) => console.log(`Selected category: ${cat}`)}
        />

        {/* Main Content Area */}
        <main className="flex-1 ml-0 md:ml-80 flex flex-col h-full bg-surface relative overflow-hidden">
          {!hasUserStartedChat ? (
            <WelcomeView
              onSelectPrompt={(prompt) => sendMessage(prompt)}
              onViewMenu={() => sendMessage("ممكن ترشحلي أحسن الأصناف والبيتزا الموجودة في المنيو؟")}
              onReorder={() => sendMessage("إيه كان آخر أوردر تم طلبه على الطاولة دي؟")}
            />
          ) : (
            <ActiveChatView messages={messages} isTyping={isTyping} />
          )}

          {/* Sticky Input Bar */}
          <ChatInputBar onSend={sendMessage} disabled={isTyping} />
        </main>
      </div>
    </div>
  );
}
