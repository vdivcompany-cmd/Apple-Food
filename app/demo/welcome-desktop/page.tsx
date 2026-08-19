"use client";

import React, { useState } from "react";
import { Header, SideNavBar } from "@/components/layout";
import { WelcomeView, ChatInputBar } from "@/components/chat";

export default function WelcomeDesktopDemoPage() {
  const [lastQuery, setLastQuery] = useState("");

  const handleItemSelect = (item: { name: string; price: number; subcategory: string }) => {
    setLastQuery(`Selected ${item.name} ($${item.price.toFixed(2)}) from ${item.subcategory}`);
  };

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Banner indicating isolation mode */}
      <div className="bg-primary text-white text-xs px-4 py-1.5 flex justify-between items-center z-50">
        <span>📌 Stitch Screen #2: <strong>Welcome & Empty Chat with Multi-Level Dropdowns</strong></span>
        <span className="font-mono text-[11px] opacity-80">Desktop 2560x2176 View</span>
      </div>

      <Header />

      <div className="flex flex-1 h-[calc(100vh-5.5rem)]">
        <SideNavBar onSelectItem={handleItemSelect} />

        <main className="flex-1 ml-0 md:ml-80 flex flex-col h-full bg-surface relative overflow-hidden">
          <WelcomeView
            onSelectPrompt={(p) => setLastQuery(p)}
            onViewMenu={() => setLastQuery("Browsing Menu")}
            onReorder={() => setLastQuery("Reordering Last Meal")}
          />

          {lastQuery && (
            <div className="mx-auto my-2 px-4 py-1.5 bg-primary-fixed text-primary text-xs font-bold rounded-full border border-primary/30 animate-fade-in shadow-sm">
              ✨ Sent to Chat: &quot;{lastQuery}&quot;
            </div>
          )}

          <ChatInputBar onSend={(text) => setLastQuery(text)} />
        </main>
      </div>
    </div>
  );
}
