"use client";

import React from "react";
import { Header, SideNavBar } from "@/components/layout";
import { WelcomeView, ActiveChatView, ChatInputBar } from "@/components/chat";
import { useChat } from "@/lib/context/ChatContext";

export default function HomePage() {
  const { messages, sendMessage, isTyping } = useChat();

  // If only initial bot message exists and no user message yet, show Welcome Landing
  const hasUserStartedChat = messages.some((m) => m.sender === "user");

  const handleSidebarItemClick = (item: { name: string; price: number; category: string; subcategory: string }) => {
    sendMessage(`I'm interested in the ${item.name} ($${item.price.toFixed(2)}) from ${item.subcategory}. Can you tell me more about it and add it to my order?`);
  };

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        {/* Multi-level Dropdown Side Menu Navigator */}
        <SideNavBar
          onSelectItem={handleSidebarItemClick}
          onSelectCategory={(cat) => console.log(`Selected category: ${cat}`)}
        />

        {/* Main Content Area */}
        <main className="flex-1 ml-0 md:ml-80 flex flex-col h-full bg-surface relative overflow-hidden">
          {!hasUserStartedChat ? (
            <WelcomeView
              onSelectPrompt={(prompt) => sendMessage(prompt)}
              onViewMenu={() => sendMessage("Can you show me the full menu and recommend popular dishes?")}
              onReorder={() => sendMessage("Can I reorder what was ordered at this table previously?")}
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
