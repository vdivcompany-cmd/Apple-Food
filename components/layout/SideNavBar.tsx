"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/context/SessionContext";

interface SideNavBarProps {
  onSelectItem?: (item: { name: string; price: number; category: string; subcategory?: string; productId?: string }) => void;
  onSelectCategory?: (category: string) => void;
}

export function SideNavBar({ onSelectItem, onSelectCategory }: SideNavBarProps) {
  const { session } = useSession();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "6a869632fc557276f17c41af": true, // Default open first category (Pizzas)
  });
  const [searchQuery, setSearchQuery] = useState("");

  const categories = session.publicMenu?.categories || [];

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
    onSelectCategory?.(catId);
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes("بيتزا")) return "local_pizza";
    if (name.includes("برجر") || name.includes("برجاريزا")) return "lunch_dining";
    if (name.includes("معجنات") || name.includes("مكرونة") || name.includes("أرز")) return "dinner_dining";
    if (name.includes("سلط") || name.includes("صوص")) return "soup_kitchen";
    if (name.includes("صيام") || name.includes("كريب")) return "spa";
    return "restaurant";
  };

  // Filter categories and products if search is active
  const filteredCategories = categories.map((cat) => {
    if (!searchQuery.trim()) return cat;

    const filteredProducts = cat.products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...cat, products: filteredProducts };
  }).filter((cat) => cat.products.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside className="hidden md:flex flex-col h-full p-5 gap-3 bg-surface-container-low dark:bg-inverse-surface shadow-md w-80 fixed left-0 top-16 overflow-y-auto z-40 border-r border-surface-variant/40 custom-scrollbar">
      {/* Restaurant Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg shadow-sm border border-primary/20 flex-shrink-0">
          🍕
        </div>
        <div>
          <h2 className="font-bold text-sm md:text-base text-on-surface leading-tight">
            {session.restaurantName || "بيتزا وكريب توفيق"}
          </h2>
          <p className="text-on-surface-variant text-[11px] font-medium">منيو المطعم المباشر</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في البيتزا، الكريب، الصوصات..."
          className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/60 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none text-xs text-on-surface placeholder:text-on-surface-variant/70 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Categories Accordion List */}
      <nav className="flex flex-col gap-1.5 flex-grow">
        {filteredCategories.map((cat) => {
          const isCatExpanded = !!expandedCategories[cat.id] || searchQuery.length > 0;
          const catIcon = getCategoryIcon(cat.name);

          return (
            <div
              key={cat.id}
              className="rounded-xl overflow-hidden bg-surface-container-lowest/70 border border-surface-variant/30 shadow-sm transition-all"
            >
              {/* Level 1: Category Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 font-bold text-xs transition-colors ${
                  isCatExpanded
                    ? "bg-primary-container text-white"
                    : "text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">{catIcon}</span>
                  <span className="font-bold">{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isCatExpanded ? "bg-white/20 text-white" : "bg-surface-container text-secondary"
                    }`}
                  >
                    {cat.products.length}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-base transition-transform duration-200 ${
                    isCatExpanded ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Level 2: Real Products List */}
              {isCatExpanded && (
                <div className="flex flex-col py-1 pl-2 pr-2 space-y-1 bg-surface/60 divide-y divide-surface-variant/20">
                  {cat.products.map((prod) => (
                    <button
                      key={prod._id}
                      onClick={() =>
                        onSelectItem?.({
                          name: prod.name,
                          price: prod.basePrice,
                          category: cat.name,
                          productId: prod._id,
                        })
                      }
                      title={`اطلب أو اسأل عن ${prod.name}`}
                      className="group w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-primary-fixed/40 transition-all border border-transparent hover:border-primary-container/30 pt-2"
                    >
                      <div className="flex flex-col pr-2 text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-on-surface group-hover:text-primary-container transition-colors">
                            {prod.name}
                          </span>
                          {prod.variants && prod.variants.length > 0 && (
                            <span className="text-[9px] px-1 bg-primary-container/15 text-primary-container rounded font-semibold">
                              +حشو أطراف
                            </span>
                          )}
                        </div>
                        {prod.description && (
                          <span className="text-[10px] text-secondary line-clamp-1 leading-tight mt-0.5">
                            {prod.description}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs font-extrabold text-primary-container">
                          {prod.basePrice} {session.currency}
                        </span>
                        <span className="material-symbols-outlined text-sm text-secondary group-hover:text-primary-container opacity-0 group-hover:opacity-100 transition-opacity">
                          chat
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Cloudinary Menu Document Link / CTA */}
      {session.menuDocuments.length > 0 && (
        <a
          href={session.menuDocuments[0].url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto w-full py-2.5 px-3 bg-surface-container-high rounded-xl text-center text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-colors border border-surface-variant/40 flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base text-primary-container">photo_library</span>
          <span>عرض صورة المنيو (Cloudinary)</span>
        </a>
      )}
    </aside>
  );
}
