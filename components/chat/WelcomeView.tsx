"use client";

import React from "react";
import { useSession } from "@/lib/context/SessionContext";

interface WelcomeViewProps {
  onSelectPrompt?: (prompt: string) => void;
  onViewMenu?: () => void;
  onReorder?: () => void;
}

export function WelcomeView({ onSelectPrompt, onViewMenu, onReorder }: WelcomeViewProps) {
  const { session } = useSession();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Animated Greeting Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-fixed rounded-full mb-2 shadow-card-soft border border-primary/20 animate-bounce">
          <span className="material-symbols-outlined text-4xl text-primary">waving_hand</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
          Welcome to <span className="text-primary-container font-extrabold">{session.restaurantName || "Bistro Sun"}</span>, Table {session.tableNumber}!
        </h1>
        
        <p className="text-on-surface-variant text-base md:text-lg max-w-lg mx-auto font-normal">
          We&apos;re delighted to serve you. How can I help get your dining experience started today?
        </p>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => {
              onViewMenu?.();
              onSelectPrompt?.("Can you show me the full menu and recommend popular dishes?");
            }}
            className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl shadow-card-soft hover:scale-[0.98] transition-all border border-outline-variant/30 hover:border-primary-container group cursor-pointer text-left text-center"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-2xl">
                restaurant_menu
              </span>
            </div>
            <span className="font-bold text-base text-on-surface">View Menu</span>
            <span className="text-xs text-on-surface-variant mt-1">
              Browse chef recommendations and categories.
            </span>
          </button>

          <button
            onClick={() => {
              onReorder?.();
              onSelectPrompt?.("Can I reorder what was ordered at this table previously?");
            }}
            className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl shadow-card-soft hover:scale-[0.98] transition-all border border-outline-variant/30 hover:border-primary-container group cursor-pointer text-left text-center"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-2xl">
                history
              </span>
            </div>
            <span className="font-bold text-base text-on-surface">Reorder Last Order</span>
            <span className="text-xs text-on-surface-variant mt-1">
              Quickly reorder your favorites from this table.
            </span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-4">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Or try asking:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "What are today's chef specials? 🌟",
              "Recommend top seafood dishes 🐟",
              "Show vegetarian & vegan options 🥗",
              "What drinks & cocktails are available? 🍹",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => onSelectPrompt?.(chip)}
                className="px-3.5 py-2 bg-surface-container rounded-full text-xs font-medium text-on-surface hover:bg-primary-fixed hover:text-primary transition-all border border-surface-variant/40 shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
