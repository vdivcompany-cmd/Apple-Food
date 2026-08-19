"use client";

import React, { useState } from "react";

interface MenuItemLeaf {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPopular?: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  icon?: string;
  items: MenuItemLeaf[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: SubCategory[];
}

const menuHierarchy: Category[] = [
  {
    id: "starters",
    name: "Starters",
    icon: "play_games",
    subcategories: [
      {
        id: "hot-starters",
        name: "Hot Starters",
        icon: "local_fire_department",
        items: [
          { id: "calamari", name: "Crispy Calamari Rings", price: 14.5, description: "With roasted garlic aioli" },
          { id: "prawns", name: "Garlic Butter Prawns", price: 18.0, description: "Sautéed in lemon white wine herb butter", isPopular: true },
          { id: "arancini", name: "Truffle Mushroom Arancini", price: 13.0, description: "Crisp risotto balls with mozzarella" },
        ],
      },
      {
        id: "cold-starters",
        name: "Cold Starters & Salads",
        icon: "eco",
        items: [
          { id: "burrata", name: "Burrata Caprese", price: 16.5, description: "Heirloom tomatoes & aged balsamic glaze", isPopular: true },
          { id: "greek-salad", name: "Mediterranean Greek Salad", price: 12.0, description: "Feta, kalamata olives, cucumber & oregano" },
          { id: "tuna-tartare", name: "Yellowfin Tuna Tartare", price: 19.5, description: "Avocado mousse & sesame ponzu dressing" },
        ],
      },
      {
        id: "soups",
        name: "Soups",
        icon: "soup_kitchen",
        items: [
          { id: "mushroom-soup", name: "Creamy Wild Mushroom Soup", price: 10.5, description: "With herb croutons & truffle oil" },
          { id: "tomato-soup", name: "Roasted Tomato Basil Soup", price: 9.5, description: "Finished with cream and basil oil" },
        ],
      },
    ],
  },
  {
    id: "mains",
    name: "Mains",
    icon: "flatware",
    subcategories: [
      {
        id: "seafood",
        name: "Seafood & Fish",
        icon: "phishing",
        items: [
          { id: "sea-bass", name: "Grilled Mediterranean Sea Bass", price: 28.5, description: "Charred asparagus & lemon beurre blanc", isPopular: true },
          { id: "salmon", name: "Pan-Seared Atlantic Salmon", price: 26.0, description: "Dill potato purée & honey mustard glaze" },
          { id: "lobster", name: "Butter Poached Lobster Tail", price: 38.0, description: "Saffron risotto & garden herbs" },
        ],
      },
      {
        id: "steaks-grill",
        name: "Steaks & Grills",
        icon: "outdoor_grill",
        items: [
          { id: "ribeye", name: "Prime Black Angus Ribeye 300g", price: 36.0, description: "Truffle butter & peppercorn sauce", isPopular: true },
          { id: "lamb-chops", name: "Herb-Crusted Lamb Chops", price: 32.5, description: "Rosemary roasted baby potatoes" },
          { id: "chicken-breast", name: "Sous-Vide Corn-Fed Chicken", price: 22.0, description: "Wild mushroom velouté & broccolini" },
        ],
      },
      {
        id: "pasta-risotto",
        name: "Pasta & Risotto",
        icon: "dinner_dining",
        items: [
          { id: "truffle-tagliatelle", name: "Truffle & Parmesan Tagliatelle", price: 24.0, description: "Fresh black truffle shaving & butter sauce", isPopular: true },
          { id: "mushroom-risotto", name: "Wild Porcini Mushroom Risotto", price: 22.0, description: "Creamy Carnaroli rice & aged parmesan" },
          { id: "seafood-linguine", name: "Spicy Seafood Linguine", price: 27.5, description: "Prawns, mussels, calamari & cherry tomato chili" },
        ],
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    icon: "local_bar",
    subcategories: [
      {
        id: "fresh-juices",
        name: "Fresh Juices & Smoothies",
        icon: "water_drop",
        items: [
          { id: "mango-juice", name: "Fresh Mango Juice", price: 7.5, description: "100% natural sweet Alphonso mango pulp", isPopular: true },
          { id: "citrus-cooler", name: "Citrus Mint Cooler", price: 6.5, description: "Blood orange, fresh mint & crushed ice" },
          { id: "strawberry-basil", name: "Strawberry Basil Lemonade", price: 7.0, description: "Fresh muddled strawberries & lemon soda" },
          { id: "avocado-smoothie", name: "Creamy Avocado Honey Smoothie", price: 8.5, description: "Blended with milk, honey & crushed nuts" },
        ],
      },
      {
        id: "coffee-tea",
        name: "Specialty Coffee & Tea",
        icon: "coffee",
        items: [
          { id: "spanish-latte", name: "Iced Spanish Latte", price: 6.0, description: "Rich espresso with condensed sweet milk", isPopular: true },
          { id: "cappuccino", name: "Artisanal Cappuccino", price: 5.5, description: "Silky steamed milk foam with single-origin beans" },
          { id: "matcha-latte", name: "Ceremonial Japanese Matcha", price: 6.5, description: "Whisked matcha with oat milk" },
          { id: "mint-tea", name: "Moroccan Mint Green Tea", price: 4.5, description: "Fresh mint leaves & organic green tea pot" },
        ],
      },
      {
        id: "mocktails",
        name: "Artisan Mocktails",
        icon: "wine_bar",
        items: [
          { id: "virgin-mojito", name: "Classic Virgin Mojito", price: 7.0, description: "Muddled lime, organic cane sugar & mint" },
          { id: "passion-spritz", name: "Passionfruit Sunset Spritz", price: 8.0, description: "Passionfruit puree, ginger beer & sparkling water", isPopular: true },
        ],
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: "icecream",
    subcategories: [
      {
        id: "cakes",
        name: "Cakes & Pastries",
        icon: "cake",
        items: [
          { id: "lava-cake", name: "Molten Chocolate Lava Cake", price: 11.5, description: "Warm Valrhona chocolate center with vanilla gelato", isPopular: true },
          { id: "tiramisu", name: "Classic Italian Tiramisu", price: 10.0, description: "Espresso-soaked savoiardi & mascarpone cream" },
          { id: "cheesecake", name: "San Sebastian Burnt Cheesecake", price: 11.0, description: "Creamy caramelised crust with berry coulis" },
        ],
      },
      {
        id: "gelato",
        name: "Gelato & Sorbets",
        icon: "icecream",
        items: [
          { id: "vanilla-gelato", name: "Madagascar Vanilla Bean Gelato", price: 6.5, description: "Two scoops with hazelnut crunch" },
          { id: "mango-sorbet", name: "Alphonso Mango Sorbet", price: 6.5, description: "Refreshing dairy-free fruit sorbet" },
        ],
      },
    ],
  },
  {
    id: "sides",
    name: "Sides",
    icon: "lunch_dining",
    subcategories: [
      {
        id: "fries-potatoes",
        name: "Fries & Potatoes",
        icon: "fastfood",
        items: [
          { id: "truffle-fries", name: "Truffle Herb Fries", price: 9.0, description: "Tossed with white truffle oil & parmesan", isPopular: true },
          { id: "sweet-potato", name: "Crispy Sweet Potato Wedges", price: 8.0, description: "With smoked paprika dip" },
          { id: "mash", name: "Robuchon-Style Potato Mash", price: 8.5, description: "Ultra-velvety butter mashed potatoes" },
        ],
      },
      {
        id: "veggies",
        name: "Greens & Vegetables",
        icon: "spa",
        items: [
          { id: "asparagus", name: "Charred Jumbo Asparagus", price: 8.5, description: "With sea salt crystals and lemon zest" },
          { id: "mushrooms", name: "Sautéed Garlic Butter Mushrooms", price: 8.0, description: "With fresh thyme and shallots" },
        ],
      },
    ],
  },
];

interface SideNavBarProps {
  onSelectItem?: (item: { name: string; price: number; category: string; subcategory: string }) => void;
  onSelectCategory?: (category: string) => void;
}

export function SideNavBar({ onSelectItem, onSelectCategory }: SideNavBarProps) {
  // Store expanded category and subcategory IDs
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    drinks: true, // Default drinks open so user sees Juices -> Mango Juice immediately
  });
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({
    "fresh-juices": true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
    onSelectCategory?.(catId);
  };

  const toggleSubcategory = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleItemClick = (item: MenuItemLeaf, catName: string, subName: string) => {
    onSelectItem?.({
      name: item.name,
      price: item.price,
      category: catName,
      subcategory: subName,
    });
  };

  // Filter hierarchy if search is active
  const filteredHierarchy = menuHierarchy.map((cat) => {
    if (!searchQuery.trim()) return cat;

    const filteredSubcategories = cat.subcategories.map((sub) => {
      const filteredItems = sub.items.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...sub, items: filteredItems };
    }).filter((sub) => sub.items.length > 0 || sub.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return { ...cat, subcategories: filteredSubcategories };
  }).filter((cat) => cat.subcategories.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside className="hidden md:flex flex-col h-full p-5 gap-3 bg-surface-container-low dark:bg-inverse-surface shadow-md w-80 fixed left-0 top-16 overflow-y-auto z-40 border-r border-surface-variant/40 custom-scrollbar">
      {/* Restaurant Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg shadow-sm border border-primary/20 flex-shrink-0">
          🍽️
        </div>
        <div>
          <h2 className="font-bold text-base text-on-surface leading-tight">Bistro Sun Menu</h2>
          <p className="text-on-surface-variant text-[11px] font-medium">Click items to chat & order</p>
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
          placeholder="Search dishes or drinks..."
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
        {filteredHierarchy.map((cat) => {
          const isCatExpanded = !!expandedCategories[cat.id] || searchQuery.length > 0;

          return (
            <div key={cat.id} className="rounded-xl overflow-hidden bg-surface-container-lowest/70 border border-surface-variant/30 shadow-sm transition-all">
              {/* Level 1: Category Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 font-bold text-xs transition-colors ${
                  isCatExpanded
                    ? "bg-primary-container text-white"
                    : "text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isCatExpanded ? "bg-white/20 text-white" : "bg-surface-container text-secondary"
                  }`}>
                    {cat.subcategories.reduce((sum, s) => sum + s.items.length, 0)}
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

              {/* Level 2: Subcategories List */}
              {isCatExpanded && (
                <div className="flex flex-col bg-surface-container-lowest divide-y divide-surface-variant/20">
                  {cat.subcategories.map((sub) => {
                    const isSubExpanded = !!expandedSubcategories[sub.id] || searchQuery.length > 0;

                    return (
                      <div key={sub.id} className="flex flex-col">
                        {/* Subcategory Toggle Header */}
                        <button
                          onClick={(e) => toggleSubcategory(sub.id, e)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors bg-surface-container/30"
                        >
                          <div className="flex items-center gap-2">
                            {sub.icon && (
                              <span className="material-symbols-outlined text-sm text-primary-container">
                                {sub.icon}
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-on-surface">{sub.name}</span>
                            <span className="text-[9px] text-secondary">({sub.items.length})</span>
                          </div>
                          <span
                            className={`material-symbols-outlined text-sm text-secondary transition-transform duration-200 ${
                              isSubExpanded ? "rotate-180" : ""
                            }`}
                          >
                            arrow_drop_down
                          </span>
                        </button>

                        {/* Level 3: Food / Drink Items (Click to Chatbot) */}
                        {isSubExpanded && (
                          <div className="flex flex-col py-1 pl-4 pr-2 space-y-1 bg-surface/50">
                            {sub.items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleItemClick(item, cat.name, sub.name)}
                                title={`Ask AI Waiter about ${item.name}`}
                                className="group w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-primary-fixed/40 transition-all border border-transparent hover:border-primary-container/30"
                              >
                                <div className="flex flex-col pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-on-surface group-hover:text-primary-container transition-colors">
                                      {item.name}
                                    </span>
                                    {item.isPopular && (
                                      <span className="text-[9px] px-1 bg-primary-container/15 text-primary-container rounded font-bold">
                                        ★ Popular
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <span className="text-[10px] text-secondary line-clamp-1">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span className="text-xs font-bold text-primary-container">
                                    ${item.price.toFixed(2)}
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
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info CTA */}
      <div className="mt-auto pt-2 border-t border-surface-variant/30 text-center">
        <p className="text-[10px] text-secondary font-medium">
          💡 Click any item (e.g. <em>Fresh Mango Juice</em>) to ask the AI Waiter!
        </p>
      </div>
    </aside>
  );
}
