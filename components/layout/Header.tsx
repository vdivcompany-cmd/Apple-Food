"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";

export function Header() {
  const pathname = usePathname();
  const { session } = useSession();

  const isChatActive = pathname === "/" || pathname?.includes("chat") || pathname?.includes("welcome");
  const isOrderActive = pathname === "/tracking" || pathname?.includes("order-tracking");

  return (
    <header className="bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-4 md:px-12 w-full h-16 sticky top-0 z-50 border-b border-surface-variant/30">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
            TableChat
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 h-full">
        <Link
          href="/"
          className={`h-full flex items-center font-bold transition-colors ${
            isChatActive
              ? "text-primary border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          Chat
        </Link>
        <Link
          href="/tracking"
          className={`h-full flex items-center transition-colors ${
            isOrderActive
              ? "text-primary font-bold border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          My Order
        </Link>
        <Link
          href="/demo/design-system"
          className="text-xs text-secondary/70 hover:text-primary transition-colors px-2 py-1 bg-surface-container rounded-md"
        >
          🎨 Design System
        </Link>
      </nav>

      {/* Table & Session Indicator */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-primary dark:text-primary-fixed-dim text-sm md:text-base">
          Table {session.tableNumber}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span>Live Session</span>
        </div>
      </div>
    </header>
  );
}
