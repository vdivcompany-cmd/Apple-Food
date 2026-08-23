"use client";

import React, { useState } from "react";
import { Header, SideNavBar } from "@/components/layout";
import { WelcomeView, ActiveChatView, ChatInputBar } from "@/components/chat";
import { useChat } from "@/lib/context/ChatContext";
import { useSession } from "@/lib/context/SessionContext";

export default function HomePage() {
  const { messages, sendMessage, isTyping } = useChat();
  const { session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("tablechat_chat_input_text") || "";
      } catch {}
    }
    return "";
  });

  // Sync draft input text to sessionStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (inputText) {
          sessionStorage.setItem("tablechat_chat_input_text", inputText);
        } else {
          sessionStorage.removeItem("tablechat_chat_input_text");
        }
      } catch {}
    }
  }, [inputText]);

  // If only initial bot message exists and no user message yet, show Welcome Landing
  const hasUserStartedChat = messages.some((m) => m.sender === "user");

  const handleSidebarItemClick = (item: {
    name: string;
    price: number;
    category: string;
    productId?: string;
  }) => {
    setInputText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return item.name;
      }
      return `${trimmed} و ${item.name}`;
    });
  };

  const handleSend = (text: string) => {
    sendMessage(text);
    setInputText("");
  };

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Header with Mobile Sidebar Toggle */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 h-[calc(100vh-4rem)] relative">
        {/* Multi-level Live Menu Side Navigator */}
        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectItem={handleSidebarItemClick}
          onSelectCategory={(cat) => console.log(`Selected category: ${cat}`)}
        />

        {/* Main Content Area */}
        <main className="flex-1 ml-0 lg:ml-80 flex flex-col h-full bg-surface relative overflow-hidden">
          {!hasUserStartedChat ? (
            <WelcomeView
              onSelectPrompt={(prompt) => sendMessage(prompt)}
              onViewMenu={() =>
                sendMessage(
                  "ممكن ترشحلي أحسن الأصناف والبيتزا الموجودة في المنيو؟",
                )
              }
              onReorder={() =>
                sendMessage("إيه كان آخر أوردر تم طلبه على الطاولة دي؟")
              }
            />
          ) : (
            <ActiveChatView messages={messages} isTyping={isTyping} />
          )}

          {/* Sticky Input Bar */}
          <ChatInputBar
            value={inputText}
            onChange={setInputText}
            onSend={handleSend}
            disabled={isTyping}
          />
        </main>
      </div>
    </div>
  );
}
