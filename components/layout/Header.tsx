"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const { session } = useSession();

  const isChatActive = pathname === "/" || pathname?.includes("chat") || pathname?.includes("welcome");
  const isOrderActive = pathname === "/tracking" || pathname?.includes("order-tracking");
  const isMenuActive = pathname === "/menu";

  return (
    <header className="bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-xl shadow-sm flex justify-between items-center px-3 sm:px-6 md:px-12 w-full h-16 sticky top-0 z-50 border-b border-surface-variant/30">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Sidebar Toggle Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container hover:bg-primary-fixed text-on-surface hover:text-primary transition-all border border-surface-variant/40 active:scale-95 cursor-pointer"
            title={isSidebarOpen ? "إغلاق القائمة" : "فتح قائمة المنيو"}
            aria-label="قائمة المنيو"
          >
            <span className="material-symbols-outlined text-2xl text-primary">
              {isSidebarOpen ? "close" : "menu_book"}
            </span>
          </button>
        )}

        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-primary dark:text-primary-fixed-dim tracking-tight">
            TableChat
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 h-full font-arabic">
        <Link
          href="/"
          className={`h-full flex items-center font-bold text-sm md:text-base transition-colors ${
            isChatActive
              ? "text-primary border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          Chat (المحادثة)
        </Link>
        <Link
          href="/tracking"
          className={`h-full flex items-center text-sm md:text-base transition-colors ${
            isOrderActive
              ? "text-primary font-bold border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          My Order (طلباتي)
        </Link>
        <Link
          href="/menu"
          className={`h-full flex items-center text-sm md:text-base transition-colors ${
            isMenuActive
              ? "text-primary font-bold border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          <span className="flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-lg">menu_book</span>
            <span>Menu (المنيو)</span>
          </span>
        </Link>
      </nav>

      {/* Table & Session Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 font-arabic">
        <span className="font-bold text-primary dark:text-primary-fixed-dim text-xs sm:text-sm md:text-base whitespace-nowrap">
          طاولة {session.tableNumber}
        </span>
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span>مباشر</span>
        </div>
      </div>
    </header>
  );
}
