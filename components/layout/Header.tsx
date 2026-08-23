"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import { SideNavBar } from "./SideNavBar";

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const { session } = useSession();
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(false);

  const effectiveSidebarOpen = onToggleSidebar ? Boolean(isSidebarOpen) : internalSidebarOpen;
  const handleToggle = onToggleSidebar || (() => setInternalSidebarOpen((prev) => !prev));
  const handleClose = onToggleSidebar ? undefined : () => setInternalSidebarOpen(false);

  const isChatActive =
    pathname === "/" ||
    pathname?.includes("chat") ||
    pathname?.includes("welcome");
  const isOrderActive =
    pathname === "/tracking" || pathname?.includes("order-tracking");
  const isMenuActive = pathname === "/menu";
  const isFeedbackActive = pathname === "/feedback";

  return (
    <>
      <header className="bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-xl shadow-sm flex justify-between items-center px-3 sm:px-6 md:px-5 w-full h-16 sticky top-0 z-50 border-b border-surface-variant/30 font-arabic">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile & Tablet Sidebar Toggle Button (< 1024px) */}
          <button
            onClick={handleToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container hover:bg-primary-fixed text-on-surface hover:text-primary transition-all border border-surface-variant/40 active:scale-95 cursor-pointer"
            title={effectiveSidebarOpen ? "إغلاق القائمة" : "فتح القائمة الجانبية"}
            aria-label="القائمة الجانبية"
          >
            <span className="material-symbols-outlined text-2xl text-primary">
              {effectiveSidebarOpen ? "close" : "menu"}
            </span>
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-fixed flex items-center justify-center border border-primary/20 shadow-sm p-1 flex-shrink-0 group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons8-hamburger-48.png"
                alt="TableChat Logo"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-primary dark:text-primary-fixed-dim tracking-tight">
              TableChat
            </span>
          </Link>
        </div>

        {/* Desktop Navigation (>= 1024px only) */}
        <nav className="hidden lg:flex items-center gap-7 h-full font-arabic">
          <Link
            href="/"
            className={`h-full flex items-center font-bold text-sm lg:text-base transition-colors ${
              isChatActive
                ? "text-primary border-b-2 border-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            Chat (المحادثة)
          </Link>
          <Link
            href="/tracking"
            className={`h-full flex items-center text-sm lg:text-base transition-colors ${
              isOrderActive
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            My Order (طلباتي)
          </Link>
          <Link
            href="/menu"
            className={`h-full flex items-center text-sm lg:text-base transition-colors ${
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
          <Link
            href="/feedback"
            className={`h-full flex items-center text-sm lg:text-base transition-colors ${
              isFeedbackActive
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            <span className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-lg">hotel_class</span>
              <span>Feedback (التقييم)</span>
            </span>
          </Link>
        </nav>

        {/* Table & Session Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 font-arabic">
          {session.tableNumber ? (
            <>
              <span className="font-bold text-primary dark:text-primary-fixed-dim text-xs sm:text-sm md:text-base whitespace-nowrap">
                طاولة {session.tableNumber}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span>جلسة مباشرة</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-full text-secondary text-xs font-bold border border-surface-variant/40">
              <span className="material-symbols-outlined text-sm text-primary">
                qr_code_scanner
              </span>
              <span className="hidden sm:inline">تصفح المنيو</span>
            </div>
          )}
        </div>
      </header>

      {/* Standalone sidebar drawer when rendered on subpages without own drawer */}
      {!onToggleSidebar && (
        <SideNavBar
          isOpen={internalSidebarOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
}
