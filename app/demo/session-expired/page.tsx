"use client";

import React from "react";
import { SessionExpiredView } from "@/components/session/SessionExpiredView";

export default function SessionExpiredDemoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Banner */}
      <div className="w-full bg-primary text-white text-xs px-4 py-1.5 flex justify-between items-center z-50">
        <span>⏰ Stitch Screen #6: <strong>Session Expired State</strong> [ID: 6885bc35e3e542f69d85bed6e358fd4f]</span>
      </div>

      <main className="flex-1">
        <SessionExpiredView />
      </main>
    </div>
  );
}
