"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "@/lib/context/SessionContext";

interface SideNavBarProps {
  onSelectItem?: (item: { name: string; price: number; category: string; subcategory?: string; productId?: string }) => void;
  onSelectCategory?: (category: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SideNavBar({ onSelectItem, onSelectCategory, isOpen = false, onClose }: SideNavBarProps) {
  const { session } = useSession();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Categories are instantly available from global SessionContext (no redundant refetching on route changes)
  const categories = useMemo(() => session.publicMenu?.categories || [], [session.publicMenu?.categories]);
  const isLoading = session.isLoading && categories.length === 0;
  const error = session.error;

  // Automatically expand the first category once categories are loaded
  useEffect(() => {
    if (categories.length > 0 && Object.keys(expandedCategories).length === 0) {
      setExpandedCategories({ [categories[0].id]: true });
    }
  }, [categories, expandedCategories]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
    onSelectCategory?.(catId);
  };

  const handleProductClick = (item: { name: string; price: number; category: string; productId?: string }) => {
    onSelectItem?.(item);
    // Auto close mobile drawer after selection
    if (onClose) {
      onClose();
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes("بيتزا")) return "local_pizza";
    if (name.includes("برجر") || name.includes("برجاريزا")) return "lunch_dining";
    if (name.includes("معجنات") || name.includes("مكرونة") || name.includes("أرز")) return "dinner_dining";
    if (name.includes("سلط") || name.includes("صوص")) return "soup_kitchen";
    if (name.includes("صيام") || name.includes("كريب")) return "spa";
    return "restaurant";
  };

  // Filter dynamic categories and products based on user search query
  const filteredCategories = categories.map((cat) => {
    if (!searchQuery.trim()) return cat;

    const filteredProducts = cat.products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...cat, products: filteredProducts };
  }).filter((cat) => cat.products.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const menuImageUrl =
    session.menuDocuments.length > 0
      ? session.menuDocuments[0].url
      : "https://res.cloudinary.com/qi9jxr5f/image/upload/v1787161427/SaaS_Restaurants/6a85e588d0b508058fc5008c/menu-docs/menu.jpg";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-fade-in transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Drawer with Full Vertical Scroll */}
      <aside
        className={`fixed left-0 top-0 md:top-16 bottom-0 z-50 md:z-40 w-72 sm:w-80 max-w-[85vw] bg-surface-container-low dark:bg-inverse-surface shadow-2xl md:shadow-md flex flex-col h-full md:h-[calc(100vh-4rem)] p-4 sm:p-5 gap-3.5 border-r border-surface-variant/40 overflow-y-auto overflow-x-hidden custom-scrollbar font-arabic transition-transform duration-300 ease-in-out pb-24 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header with Mobile Close Button */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-xl sm:text-2xl shadow-sm border border-primary/20 flex-shrink-0">
              🍕
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-sm sm:text-base text-on-surface leading-tight truncate">
                {session.restaurantName || "بيتزا وكريب توفيق"}
              </h2>
              <p className="text-on-surface-variant text-[11px] font-semibold mt-0.5 truncate">
                {isLoading ? "جاري تحميل المنيو..." : "قائمة الطعام والأسعار المباشرة"}
              </p>
            </div>
          </div>

          {/* Close Button on Mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:text-primary transition-colors flex-shrink-0"
              title="إغلاق"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-shrink-0 relative mb-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في البيتزا، الكريب، الصوصات..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/60 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none text-xs sm:text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/70 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dynamic Categories List (Never Compressed) */}
        {isLoading ? (
          <div className="flex-shrink-0 space-y-3 py-2 animate-pulse">
            {[1, 2, 3, 4, 5].map((skeletonIdx) => (
              <div key={skeletonIdx} className="h-12 bg-surface-container rounded-2xl border border-surface-variant/30" />
            ))}
          </div>
        ) : error ? (
          <div className="flex-shrink-0 p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-bold text-center space-y-2">
            <p>تعذر تحميل المنيو: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-error text-white rounded-lg text-xs font-bold"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <nav className="flex flex-col gap-3 overflow-visible">
            {filteredCategories.map((cat) => {
              const isCatExpanded = !!expandedCategories[cat.id] || searchQuery.length > 0;
              const catIcon = getCategoryIcon(cat.name);

              return (
                <div
                  key={cat.id}
                  className="flex-shrink-0 rounded-2xl overflow-hidden bg-surface-container-lowest border border-surface-variant/40 shadow-sm transition-all"
                >
                  {/* Category Header Button */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer ${
                      isCatExpanded
                        ? "bg-primary-container text-white shadow-sm"
                        : "text-on-surface hover:bg-surface-container-highest"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-lg sm:text-xl flex-shrink-0">{catIcon}</span>
                      <span className="font-extrabold truncate">{cat.name}</span>
                      <span
                        className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                          isCatExpanded ? "bg-white/25 text-white" : "bg-surface-container text-secondary"
                        }`}
                      >
                        {cat.products.length}
                      </span>
                    </div>
                    <span
                      className={`material-symbols-outlined text-lg sm:text-xl transition-transform duration-200 flex-shrink-0 ${
                        isCatExpanded ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {/* Level 2: Uncompressed Real Products List */}
                  {isCatExpanded && (
                    <div className="flex flex-col p-2 space-y-2 bg-surface divide-y divide-surface-variant/20">
                      {cat.products.map((prod) => (
                        <button
                          key={prod._id}
                          onClick={() =>
                            handleProductClick({
                              name: prod.name,
                              price: prod.basePrice,
                              category: cat.name,
                              productId: prod._id,
                            })
                          }
                          title={`اضغط لطلب أو الاستفسار عن ${prod.name}`}
                          className="flex-shrink-0 w-full flex items-start justify-between p-2.5 sm:p-3 rounded-xl text-left hover:bg-primary-fixed/40 transition-all border border-transparent hover:border-primary-container/30 pt-2.5 cursor-pointer gap-2.5"
                        >
                          {/* Text Block with Proper Line Heights & Auto-Wrap */}
                          <div className="flex flex-col flex-1 min-w-0 pr-1 text-right">
                            <div className="flex items-baseline flex-wrap gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary-container transition-colors leading-snug break-words whitespace-normal">
                                {prod.name}
                              </span>
                              {"variants" in prod && Array.isArray((prod as any).variants) && (prod as any).variants.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-primary-container/15 text-primary-container rounded-md font-bold whitespace-nowrap">
                                  +أطراف
                                </span>
                              )}
                            </div>
                            {prod.description && (
                              <span className="text-[11px] sm:text-xs text-secondary/90 whitespace-normal break-words leading-relaxed mt-1 font-normal">
                                {prod.description}
                              </span>
                            )}
                          </div>

                          {/* Price & Action Block */}
                          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                            <span className="text-xs sm:text-sm font-extrabold text-primary-container whitespace-nowrap">
                              {prod.basePrice} {session.currency}
                            </span>
                            <span className="material-symbols-outlined text-base text-secondary group-hover:text-primary-container opacity-0 group-hover:opacity-100 transition-opacity">
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
        )}

        {/* Cloudinary Menu Document Link / CTA */}
        <div className="flex-shrink-0 pt-2">
          <a
            href={menuImageUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-surface-container-high rounded-2xl text-center text-xs sm:text-sm font-bold text-on-surface hover:bg-primary-container hover:text-white transition-all border border-surface-variant/40 flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg text-primary-container group-hover:text-white">photo_library</span>
            <span className="truncate">عرض صورة المنيو الأصلية (Cloudinary)</span>
          </a>
        </div>
      </aside>
    </>
  );
}
