"use client";

import React from "react";
import Link from "next/link";
import { OrderTrackingView } from "@/components/order/OrderTrackingView";

export default function OrderTrackingMobileDemoPage() {
  return (
    <div className="min-h-screen bg-surface-container-high flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Top Banner */}
      <div className="w-full max-w-md bg-primary text-white text-xs px-3 py-1.5 flex justify-between items-center rounded-t-xl mb-0 sm:mb-2">
        <span>🧾 Screen #5: <strong>My Order Tracking (Mobile)</strong> [ID: 7c942cd2e07346ed85471e3dcacfdba1]</span>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-full max-w-md h-screen sm:h-[844px] bg-background flex flex-col overflow-hidden shadow-2xl rounded-none sm:rounded-[36px] border-0 sm:border-8 sm:border-brand-charcoal relative">
        {/* Mobile Header Bar */}
        <header className="bg-surface/90 backdrop-blur-md px-4 py-3 border-b border-surface-variant/40 flex items-center justify-between sticky top-0 z-30">
          <Link
            href="/demo/active-chat-mobile"
            className="p-1 rounded-full text-secondary hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Chat</span>
          </Link>
          <span className="font-bold text-sm text-on-surface">Order Tracking</span>
          <span className="text-xs font-bold text-primary-container">Table 10</span>
        </header>

        {/* Order Tracking Body */}
        <div className="flex-1 overflow-y-auto">
          <OrderTrackingView />
        </div>
      </div>
    </div>
  );
}
