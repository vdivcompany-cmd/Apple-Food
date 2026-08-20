"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/context/SessionContext";
import { useOrder } from "@/lib/context/OrderContext";

interface WelcomeViewProps {
  onSelectPrompt?: (prompt: string) => void;
  onViewMenu?: () => void;
  onReorder?: () => void;
}

export function WelcomeView({
  onSelectPrompt,
  onViewMenu,
  onReorder,
}: WelcomeViewProps) {
  const { session } = useSession();
  const { orderHistory, reorderLastOrder } = useOrder();
  const [showMenuDocModal, setShowMenuDocModal] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  const menuDoc =
    session.menuDocuments.length > 0 ? session.menuDocuments[0] : null;
  const lastOrder = orderHistory.length > 0 ? orderHistory[0] : null;

  const handleReorderClick = async () => {
    if (lastOrder) {
      try {
        setReorderLoading(true);
        await reorderLastOrder(lastOrder._id);
        alert("Last order placed again successfully! Check the My Order tab.");
      } catch (err: any) {
        alert(`Could not reorder: ${err.message}`);
      } finally {
        setReorderLoading(false);
      }
    } else {
      onSelectPrompt?.("What was the last order at this table?");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 mt-20 md:p-10 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Animated Greeting Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-fixed rounded-full mb-1 shadow-card-soft border border-primary/20 animate-bounce">
          <span className="material-symbols-outlined text-4xl text-primary">
            waving_hand
          </span>
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
            Welcome to{" "}
            <span className="text-primary-container">
              {session.restaurantName || "Versai"}
            </span>
            !
          </h1>
          <p className="text-xs md:text-sm font-bold text-primary-container mt-1 font-arabic">
            {session.branchName}{session.tableNumber ? ` · طاولة ${session.tableNumber}` : ""}
          </p>
        </div>

        <p className="text-on-surface-variant text-sm md:text-base max-w-lg mx-auto font-normal leading-relaxed">
          We&apos;re delighted to serve you. How can I help get your dining
          experience started today?
        </p>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Card 1: View Menu */}
          <button
            onClick={() => {
              if (menuDoc?.url) {
                setShowMenuDocModal(true);
              } else {
                onViewMenu?.();
                onSelectPrompt?.(
                  "Can you show me the full menu and recommend popular dishes?",
                );
              }
            }}
            className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl shadow-card-soft hover:scale-[0.98] transition-all border border-outline-variant/30 hover:border-primary-container group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-2xl">
                restaurant_menu
              </span>
            </div>
            <span className="font-bold text-base text-on-surface">
              View Menu
            </span>
            <span className="text-xs text-on-surface-variant mt-1">
              {menuDoc
                ? "View full restaurant menu document (Cloudinary)"
                : "Browse chef recommendations & items"}
            </span>
          </button>

          {/* Card 2: Reorder Last Order */}
          <button
            onClick={handleReorderClick}
            disabled={reorderLoading}
            className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl shadow-card-soft hover:scale-[0.98] transition-all border border-outline-variant/30 hover:border-primary-container group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-2xl">
                history
              </span>
            </div>
            <span className="font-bold text-base text-on-surface">
              {reorderLoading ? "Placing..." : "Reorder Last Order"}
            </span>
            <span className="text-xs text-on-surface-variant mt-1">
              {lastOrder
                ? `Quick reorder ${lastOrder.items.length} items (${lastOrder.totalAmount} ${session.currency})`
                : "Get your usual favorites again quickly"}
            </span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">
            Or try asking:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "What are today's chef specials? 🌟",
              "Recommend top seafood dishes 🐟",
              "Show drinks & coffee ☕",
              "عايز أطلب أكل مصري أصيل 🇪🇬",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => onSelectPrompt?.(chip)}
                className="px-3.5 py-1.5 bg-surface-container rounded-full text-xs font-medium text-on-surface hover:bg-primary-fixed hover:text-primary transition-all border border-surface-variant/40 shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cloudinary Menu Document Modal */}
      {showMenuDocModal && menuDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-surface-variant">
            <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-surface-container">
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {session.restaurantName} Official Menu
                </h3>
                <p className="text-xs text-secondary">
                  Cloudinary Source Document
                </p>
              </div>
              <button
                onClick={() => setShowMenuDocModal(false)}
                className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-sm font-bold hover:bg-surface-dim"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={menuDoc.url}
                alt="Restaurant Menu Document"
                className="max-w-full h-auto rounded-xl shadow-md"
              />
            </div>
            <div className="p-4 border-t border-surface-variant flex justify-between items-center bg-surface-container">
              <a
                href={menuDoc.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Open in full resolution</span>
                <span className="material-symbols-outlined text-sm">
                  open_in_new
                </span>
              </a>
              <button
                onClick={() => {
                  setShowMenuDocModal(false);
                  onSelectPrompt?.(
                    "Can you recommend something from this menu?",
                  );
                }}
                className="px-4 py-2 bg-primary-container text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Ask AI Waiter about Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
