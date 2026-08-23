"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useSession } from "@/lib/context/SessionContext";
import { useOrder } from "@/lib/context/OrderContext";
import { apiClient } from "@/lib/api/client";

const FEEDBACK_DRAFT_STORAGE_KEY = "tablechat_feedback_draft";

export default function FeedbackPage() {
  const { session } = useSession();
  const { orderHistory } = useOrder();

  // Initialize form state from draft in sessionStorage if available
  const [rating, setRating] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(FEEDBACK_DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.rating === "number" && parsed.rating >= 1 && parsed.rating <= 5) {
            return parsed.rating;
          }
        }
      } catch {}
    }
    return 5;
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(FEEDBACK_DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.selectedTags)) {
            return parsed.selectedTags;
          }
        }
      } catch {}
    }
    return [];
  });

  const [comment, setComment] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(FEEDBACK_DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.comment === "string") {
            return parsed.comment;
          }
        }
      } catch {}
    }
    return "";
  });

  const [customerName, setCustomerName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(FEEDBACK_DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.customerName === "string") {
            return parsed.customerName;
          }
        }
      } catch {}
    }
    return "";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-save form draft to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !isSubmitted) {
      try {
        sessionStorage.setItem(
          FEEDBACK_DRAFT_STORAGE_KEY,
          JSON.stringify({
            rating,
            selectedTags,
            comment,
            customerName,
          })
        );
      } catch {}
    }
  }, [rating, selectedTags, comment, customerName, isSubmitted]);

  const activeOrder = orderHistory.length > 0 ? orderHistory[0] : null;

  const ratingDescriptions: Record<number, { ar: string; en: string; emoji: string }> = {
    1: { ar: "تجربة غير مرضية 😞", en: "Poor Experience", emoji: "😞" },
    2: { ar: "مقبول ويحتاج تحسين 😐", en: "Fair / Needs Work", emoji: "😐" },
    3: { ar: "جيد جداً 🙂", en: "Good Experience", emoji: "🙂" },
    4: { ar: "ممتاز وممتع للغاية 😃", en: "Very Good Experience", emoji: "😃" },
    5: { ar: "رائع وفوق التوقعات! 🤩🔥", en: "Exceptional / Loved it!", emoji: "🤩" },
  };

  const feedbackTags = [
    { id: "food_taste", label: "طعم الأكل وجودته 🍕" },
    { id: "service_speed", label: "سرعة استلام الطلب ⚡" },
    { id: "staff_friendly", label: "معاملة الطاقم الودودة 🤝" },
    { id: "cleanliness", label: "النظافة والأجواء ✨" },
    { id: "packaging", label: "التغليف والتقديم 📦" },
    { id: "value", label: "القيمة مقابل السعر 💰" },
  ];

  const toggleTag = (tagLabel: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel) ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.tenantId) {
      setErrorMsg("بيانات المطعم غير مكتملة، يرجى إعادة تحميل الصفحة.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const finalComment = [
        comment.trim(),
        selectedTags.length > 0 ? `النقاط المميزة: [${selectedTags.join(", ")}]` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await apiClient.createFeedback({
        tenantId: session.tenantId,
        branchId: session.branchId || undefined,
        rating,
        comment: finalComment || undefined,
        customerName: customerName.trim() || undefined,
        orderId: activeOrder?._id,
      });

      // Clear draft on successful submission
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(FEEDBACK_DRAFT_STORAGE_KEY);
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال التقييم. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="min-h-screen bg-background text-on-surface font-arabic flex flex-col antialiased">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-center">
        {isSubmitted ? (
          <div className="bg-surface-container-lowest rounded-3xl p-8 sm:p-14 text-center shadow-card-elevated border border-primary/20 animate-fade-in space-y-6 max-w-2xl mx-auto w-full">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-5xl shadow-inner">
              🎉
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                شكراً جزيلاً لرأيك وتقييمك!
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed max-w-md mx-auto">
                ملاحظاتك واقتراحاتك تساعدنا دائماً على تقديم أشهى الأطباق وأرقى مستوى خدمة في{" "}
                <span className="font-bold text-primary">
                  {session.restaurantName || "مطعمنا"}
                </span>
                .
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3.5 bg-primary text-white rounded-2xl font-extrabold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>العودة للمحادثة والطلب</span>
              </Link>
              <Link
                href="/menu"
                className="px-8 py-3.5 bg-surface-container text-on-surface rounded-2xl font-bold text-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 border border-surface-variant/40"
              >
                <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                <span>تصفح المنيو</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-card-elevated border border-surface-variant/40 space-y-8">
            {/* Header Banner */}
            <div className="text-center space-y-2 pb-2 border-b border-surface-variant/30">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-extrabold mb-1">
                <span className="material-symbols-outlined text-base">hotel_class</span>
                <span>رأيك يهمنا ويسعدنا دائماً</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-on-surface tracking-tight">
                كيف كانت تجربتك اليوم؟
              </h1>
              <p className="text-xs sm:text-sm text-secondary font-medium">
                {session.restaurantName || "بيتزا وكريب توفيق"}
                {session.tableNumber ? ` · طاولة رقم ${session.tableNumber}` : ""}
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs sm:text-sm font-bold text-center border border-error/20">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Interactive Star Rating Box */}
              <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-surface-container-low rounded-3xl border border-surface-variant/40 shadow-card-soft space-y-4">
                <span className="text-xs sm:text-sm font-extrabold text-secondary tracking-wide uppercase">
                  اختر تقييمك العام
                </span>
                <div className="flex items-center gap-2 sm:gap-4" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= displayRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 sm:p-2 transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                        title={`${star} نجوم`}
                      >
                        <span
                          className={`material-symbols-outlined text-4xl sm:text-5xl md:text-6xl transition-colors duration-150 ${
                            isFilled
                              ? "text-amber-500 drop-shadow-md font-variation-fill"
                              : "text-outline-variant/50 hover:text-amber-400/60"
                          }`}
                          style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-center pt-1">
                  <span className="inline-block px-4 py-1.5 bg-surface-container rounded-xl text-sm sm:text-base font-extrabold text-primary shadow-sm border border-surface-variant/30">
                    {ratingDescriptions[displayRating]?.ar}
                  </span>
                </div>
              </div>

              {/* 2-Column Responsive Layout for Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Highlight Tags */}
                <div className="space-y-3 bg-surface-container-low/60 p-5 sm:p-6 rounded-3xl border border-surface-variant/30">
                  <label className="text-xs sm:text-sm font-extrabold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">thumb_up</span>
                    <span>ما أكثر ما نال إعجابك؟ (اختياري)</span>
                  </label>
                  <p className="text-xs text-secondary">
                    اختر ما يناسب تجربتك لمساعدتنا على تعزيزه:
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {feedbackTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.label);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.label)}
                          className={`p-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer text-right flex items-center justify-between ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-sm scale-[0.98]"
                              : "bg-surface-container-lowest text-on-surface border-surface-variant/50 hover:border-primary/40 hover:bg-surface-container"
                          }`}
                        >
                          <span>{tag.label}</span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-sm">check</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Comment & Name */}
                <div className="space-y-4 bg-surface-container-low/60 p-5 sm:p-6 rounded-3xl border border-surface-variant/30">
                  {/* Comment Area */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">edit_note</span>
                      <span>ملاحظاتك أو اقتراحاتك</span>
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="شاركنا رأيك في الأصناف، الخدمة، التوصيل، أو أي تفاصيل تحب إضافتها..."
                      className="w-full p-4 bg-surface-container-lowest rounded-2xl border border-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 transition-all resize-none shadow-inner"
                    />
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">person</span>
                      <span>اسمك (اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: م. أحمد علي"
                      className="w-full p-3.5 bg-surface-container-lowest rounded-2xl border border-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 sm:py-4.5 bg-primary text-white rounded-2xl font-extrabold text-base sm:text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إرسال التقييم...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl">send</span>
                    <span>إرسال التقييم</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
