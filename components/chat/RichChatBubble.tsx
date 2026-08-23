"use client";

import React, { useMemo } from "react";

interface RichChatBubbleProps {
  text: string;
  isUser: boolean;
  onQuickAction?: (actionText: string) => void;
}

interface ParsedMenuItem {
  name: string;
  price?: string;
  quantity?: string;
  icon: string;
}

interface ParsedReceipt {
  header: string;
  orderNumber?: string;
  rows: { label: string; value: string; icon: string; isPrice?: boolean }[];
  footer: string;
}

function getDishIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("بيتزا") || lower.includes("pizza") || lower.includes("بيبيروني") || lower.includes("مارجريتا")) return "🍕";
  if (lower.includes("برجر") || lower.includes("burger") || lower.includes("بيف")) return "🍔";
  if (lower.includes("كريب") || lower.includes("شاورما") || lower.includes("ساندوتش") || lower.includes("سندوتش")) return "🌯";
  if (lower.includes("جمبري") || lower.includes("سي فود") || lower.includes("shrimp") || lower.includes("seafood")) return "🍤";
  if (lower.includes("باستا") || lower.includes("مكرونة") || lower.includes("pasta")) return "🍝";
  if (lower.includes("سلطة") || lower.includes("salad")) return "🥗";
  if (lower.includes("عصير") || lower.includes("بيبسي") || lower.includes("كولا") || lower.includes("مشروب") || lower.includes("juice") || lower.includes("drink")) return "🥤";
  if (lower.includes("حلو") || lower.includes("شوكولاتة") || lower.includes("نوتيلا") || lower.includes("dessert")) return "🍰";
  if (lower.includes("فراخ") || lower.includes("دجاج") || lower.includes("تشيكن") || lower.includes("chicken") || lower.includes("رانش")) return "🍗";
  return "🍽️";
}

/**
 * Format markdown bold text (**text**) into styled React elements without raw asterisks
 */
function FormattedText({ content, className = "" }: { content: string; className?: string }) {
  if (!content) return null;

  // Split by **bold**
  const parts = content.split(/(\*\*[^*]+?\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const inner = part.slice(2, -2);
          return (
            <strong key={i} className="font-extrabold text-on-surface">
              {inner}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}

export function RichChatBubble({ text, isUser, onQuickAction }: RichChatBubbleProps) {
  // 1. Check if the message is an Order Confirmation / Receipt Summary
  const receiptData: ParsedReceipt | null = useMemo(() => {
    if (isUser) return null;

    const lower = text.toLowerCase();
    const hasOrderKeywords =
      lower.includes("تفاصيل الطلب") ||
      lower.includes("الطلب رقم") ||
      lower.includes("رقم الطلب") ||
      lower.includes("ord-") ||
      (lower.includes("تم طلب") && lower.includes("بنجاح"));

    if (!hasOrderKeywords) return null;

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const rows: { label: string; value: string; icon: string; isPrice?: boolean }[] = [];
    const headerLines: string[] = [];
    const footerLines: string[] = [];
    let orderNumber: string | undefined;
    let inDetails = false;
    let finishedDetails = false;

    // Pattern for detail rows like: - **الطلب رقم:** ORD-150177-450 or - **السعر:** 140 جنيه
    const rowRegex = /^(?:[-•*]\s*)?(?:\*\*)?([^*:\n]+?)(?:\*\*)?\s*:\s*(?:\*\*)?([^*\n]+?)(?:\*\*)?$/;

    for (const line of lines) {
      if (line.includes("تفاصيل الطلب") || line.includes("Order Details")) {
        inDetails = true;
        continue;
      }

      const match = line.match(rowRegex);
      if (match && (inDetails || line.includes("الطلب") || line.includes("السعر") || line.includes("ORD-") || line.includes("العنوان"))) {
        inDetails = true;
        const rawLabel = match[1].trim().replace(/^[-•*\s]+|[:\s]+$/g, "");
        const rawValue = match[2].trim().replace(/^[:\s]+|[:\s]+$/g, "");

        let icon = "info";
        let isPrice = false;

        if (rawLabel.includes("رقم") || rawLabel.includes("ORD-") || rawValue.includes("ORD-")) {
          icon = "tag";
          orderNumber = rawValue.match(/ORD-[A-Za-z0-9-]+/)?.[0] || rawValue;
        } else if (rawLabel.includes("سعر") || rawLabel.includes("إجمالي") || rawLabel.includes("مجموع") || rawLabel.includes("Price") || rawLabel.includes("Total")) {
          icon = "payments";
          isPrice = true;
        } else if (rawLabel.includes("عنوان") || rawLabel.includes("Address")) {
          icon = "location_on";
        } else if (rawLabel.includes("موبايل") || rawLabel.includes("تليفون") || rawLabel.includes("Phone")) {
          icon = "phone";
        } else {
          icon = getDishIcon(rawValue);
        }

        rows.push({
          label: rawLabel,
          value: rawValue,
          icon,
          isPrice,
        });
        continue;
      }

      if (inDetails) {
        finishedDetails = true;
        footerLines.push(line);
      } else {
        headerLines.push(line);
      }
    }

    if (rows.length >= 1 || orderNumber) {
      return {
        header: headerLines.join("\n"),
        orderNumber,
        rows,
        footer: footerLines.join("\n"),
      };
    }

    return null;
  }, [text, isUser]);

  // 2. Detect and parse menu items from numbered or bullet lists
  const { introText, menuItems, outroText } = useMemo(() => {
    if (isUser || receiptData) {
      return { introText: text, menuItems: [], outroText: "" };
    }

    const lines = text.split("\n");
    const parsedItems: ParsedMenuItem[] = [];
    const introLines: string[] = [];
    const outroLines: string[] = [];
    let collectingItems = false;
    let finishedItems = false;

    // Regex to match dishes with prices e.g.:
    // 1. **تشيكن رانش** - 150 جنيه
    // • بيتزا جامايكا ×1 — 140 جنيه
    // 4. جامايكا - 140 جنيه
    const itemRegex = /^(?:(?:\d+\.|\*|\-|\•)\s*)(?:\*\*)?([^*\n\-–—:]+?)(?:\*\*)?(?:\s*(?:×|x)\s*(\d+))?\s*(?:[-–—:]\s*(?:سعرها\s*)?(\d+(?:\.\d+)?\s*(?:جنيه|EGP|LE|\$)?))?$/i;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        if (collectingItems) finishedItems = true;
        continue;
      }

      const match = line.match(itemRegex);
      if (match && (match[3] || /^\d+\./.test(line))) {
        collectingItems = true;
        const name = match[1].trim().replace(/^[:\s]+|[:\s]+$/g, "");
        const quantity = match[2] ? `×${match[2]}` : undefined;
        const price = match[3] ? match[3].trim() : undefined;

        if (name.length >= 2 && name.length <= 40) {
          parsedItems.push({
            name,
            price: price ? (price.includes("جنيه") || price.includes("EGP") || price.includes("$") ? price : `${price} جنيه`) : undefined,
            quantity,
            icon: getDishIcon(name),
          });
          continue;
        }
      }

      if (collectingItems) {
        finishedItems = true;
        outroLines.push(line);
      } else {
        introLines.push(line);
      }
    }

    if (parsedItems.length >= 2 || (parsedItems.length === 1 && parsedItems[0].price)) {
      return {
        introText: introLines.join("\n"),
        menuItems: parsedItems,
        outroText: outroLines.join("\n"),
      };
    }

    return { introText: text, menuItems: [], outroText: "" };
  }, [text, isUser, receiptData]);

  // 3. Detect Action Prompt Buttons
  const actionButtons = useMemo(() => {
    if (isUser) return [];
    const lower = text.toLowerCase();
    const buttons: { label: string; action: string; icon: string; variant?: "primary" | "secondary" | "success" }[] = [];

    // Scenario A: Takeaway vs Delivery Prompt
    if (
      (lower.includes("تيك أواي") && lower.includes("دليفري")) ||
      (lower.includes("استلام من الفرع") && lower.includes("توصيل")) ||
      (lower.includes("takeaway") && lower.includes("delivery")) ||
      (lower.includes("pickup") && lower.includes("delivery"))
    ) {
      buttons.push(
        {
          label: "استلام من الفرع (تيك أواي) 🛍️",
          action: "استلام تيك أواي من الفرع",
          icon: "storefront",
          variant: "primary",
        },
        {
          label: "دليفري وتوصيل للمنزل 🛵",
          action: "دليفري وتوصيل للمنزل",
          icon: "moped",
          variant: "secondary",
        }
      );
    }

    // Scenario B: Confirmation Prompt ("تحب تزود حاجة تانية ولا كده تمام نأكد؟")
    else if (
      lower.includes("نأكد الأوردر") ||
      lower.includes("نأكد الطلب") ||
      lower.includes("تزود حاجة تانية") ||
      lower.includes("كده تمام نأكد") ||
      lower.includes("proceed to checkout") ||
      lower.includes("confirm your order")
    ) {
      buttons.push(
        {
          label: "لا كده تمام أكد الأوردر ✅",
          action: "لا كده تمام أكد الأوردر",
          icon: "check_circle",
          variant: "success",
        },
        {
          label: "رشحلي أصناف تانية 🍕",
          action: "رشحلي أصناف تانية من المنيو",
          icon: "restaurant_menu",
          variant: "secondary",
        }
      );
    }

    // Scenario C: Greeting / Welcome explore menu
    else if (
      lower.includes("أرشحلك") ||
      lower.includes("خيارات لبيتزا") ||
      lower.includes("اقتراحات المنيو") ||
      lower.includes("recommend")
    ) {
      if (menuItems.length === 0 && !receiptData) {
        buttons.push(
          {
            label: "🍕 وريني عروض البيتزا",
            action: "وريني عروض وأصناف البيتزا",
            icon: "local_pizza",
          },
          {
            label: "🍔 وريني البرجر",
            action: "وريني أصناف البرجر",
            icon: "lunch_dining",
          }
        );
      }
    }

    return buttons;
  }, [text, isUser, menuItems.length, receiptData]);

  // ==========================================
  // CASE A: Render Beautiful Order Receipt Card
  // ==========================================
  if (receiptData) {
    return (
      <div className="space-y-3 font-arabic">
        {/* Header greeting */}
        {receiptData.header && (
          <p className="leading-relaxed whitespace-pre-wrap font-bold text-sm md:text-base text-on-surface">
            <FormattedText content={receiptData.header} />
          </p>
        )}

        {/* Visual Receipt Card */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-emerald-500/30 dark:border-emerald-500/20 rounded-3xl p-4 md:p-5 shadow-card-soft space-y-4 my-2 overflow-hidden relative">
          {/* Card Top Banner */}
          <div className="flex items-center justify-between gap-2 border-b border-surface-variant/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">receipt_long</span>
              </div>
              <span className="text-xs md:text-sm font-extrabold text-on-surface">إيصال تأكيد الطلب</span>
            </div>

            {/* Status Badge */}
            <span className="px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 rounded-full text-[11px] font-black flex items-center gap-1 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>تم التسجيل بنجاح</span>
            </span>
          </div>

          {/* Receipt Rows */}
          <div className="space-y-2.5">
            {receiptData.rows.map((row, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs md:text-sm transition-colors ${
                  row.isPrice
                    ? "bg-primary-fixed/40 dark:bg-primary-fixed/20 border border-primary/20 font-black"
                    : "bg-surface-container/50 border border-surface-variant/30 font-semibold text-on-surface"
                }`}
              >
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="text-base">{row.icon.length <= 2 ? row.icon : <span className="material-symbols-outlined text-base align-middle">{row.icon}</span>}</span>
                  <span className="font-bold">{row.label}</span>
                </div>
                <div className={row.isPrice ? "text-primary text-sm font-black" : "font-extrabold text-on-surface"}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note inside Receipt */}
          {receiptData.footer && (
            <div className="pt-2 border-t border-surface-variant/40 text-[11px] md:text-xs text-on-surface-variant leading-relaxed">
              <FormattedText content={receiptData.footer} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE B: Standard / Suggested Items Message
  // ==========================================
  return (
    <div className="space-y-3 font-arabic">
      {/* Intro Text */}
      {introText && (
        <p className="leading-relaxed whitespace-pre-wrap font-medium">
          <FormattedText content={introText} />
        </p>
      )}

      {/* Render Suggested Items as Modern Responsive Cards with 1-Click Order Buttons */}
      {menuItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 pt-1">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-surface-container-lowest/90 rounded-2xl border border-outline-variant/40 shadow-sm flex items-center justify-between gap-2.5 hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Food Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span>{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                    {item.name}
                  </h4>
                  {item.price && (
                    <span className="inline-block text-xs font-black text-primary-container mt-0.5">
                      {item.price}
                    </span>
                  )}
                  {item.quantity && (
                    <span className="text-[10px] font-bold text-secondary mr-1">
                      ({item.quantity})
                    </span>
                  )}
                </div>
              </div>

              {/* 1-Click Order / Add Button */}
              {onQuickAction && (
                <button
                  type="button"
                  onClick={() => onQuickAction(`عايز ${item.name}`)}
                  className="px-2.5 py-1.5 bg-primary-fixed text-primary rounded-xl text-xs font-extrabold hover:bg-primary hover:text-white transition-all shadow-xs flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95"
                  title={`طلب ${item.name}`}
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  <span className="hidden sm:inline">أضف</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Outro Text */}
      {outroText && (
        <p className="leading-relaxed whitespace-pre-wrap font-medium">
          <FormattedText content={outroText} />
        </p>
      )}

      {/* Interactive Quick Action Buttons */}
      {actionButtons.length > 0 && onQuickAction && (
        <div className="pt-2 flex flex-wrap gap-2">
          {actionButtons.map((btn, idx) => {
            const isSuccess = btn.variant === "success";
            const isPrimary = btn.variant === "primary";
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickAction(btn.action)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 border ${
                  isSuccess
                    ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-emerald-600/20"
                    : isPrimary
                    ? "bg-primary text-white border-primary-container hover:bg-primary-container shadow-primary/20"
                    : "bg-surface-container text-on-surface border-surface-variant/60 hover:bg-surface-container-high hover:border-primary/40"
                }`}
              >
                <span className="material-symbols-outlined text-base">{btn.icon}</span>
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

