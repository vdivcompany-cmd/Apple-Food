"use client";

import React from "react";
import { Header } from "@/components/layout";
import { OrderTrackingView } from "@/components/order/OrderTrackingView";

export default function TrackingPage() {
  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <OrderTrackingView />
      </main>
    </div>
  );
}
