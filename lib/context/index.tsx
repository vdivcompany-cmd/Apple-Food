"use client";

import React from "react";
import { SessionProvider } from "./SessionContext";
import { ChatProvider } from "./ChatContext";
import { OrderProvider } from "./OrderContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatProvider>
        <OrderProvider>{children}</OrderProvider>
      </ChatProvider>
    </SessionProvider>
  );
}

export * from "./SessionContext";
export * from "./ChatContext";
export * from "./OrderContext";
