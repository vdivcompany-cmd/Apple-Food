"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { useSession } from "@/lib/context/SessionContext";
import { useOrder } from "@/lib/context/OrderContext";
import { apiClient } from "@/lib/api/client";

export default function FeedbackPage() {
  const { session } = useSession();
  const { orderHistory } = useOrder();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeOrder = orderHistory.length > 0 ? orderHistory[0] : null;

  const ratingDescriptions: Record<number, { ar: string; en: string; emoji: string }> = {
    1: { ar: "تجربة غير مرضية 😞", en: "Poor Experience", emoji: "😞" },
    2: { ar: "مقبول يحتاج تحسين 😐", en: "Fair / Needs Work", emoji: "😐" },
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

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال التقييم. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="min-h-screen bg-surface-container-lowest dark:bg-inverse-surface/95 text-on-surface font-arabic flex flex-col">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full">
            {isSubmitted ? (
              <div className="bg-surface-container-low rounded-3xl p-8 sm:p-10 text-center shadow-card-soft border border-primary/20 animate-fade-in space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl shadow-inner">
                  🎉
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                    شكراً جزيلاً لرأيك وتقييمك!
                  </h2>
                  <p className="text-sm sm:text-base text-on-surface-variant font-medium">
                    ملاحظاتك تساعدنا دائماً على تقديم أشهى الأطباق وأفضل خدمة في{" "}
                    <span className="font-bold text-primary">
                      {session.restaurantName || "مطعمنا"}
                    </span>
                    .
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-white rounded-2xl font-extrabold text-sm hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    <span>العودة للمحادثة والطلب</span>
                  </Link>
                  <Link
                    href="/menu"
                    className="px-6 py-3 bg-surface-container-high rounded-2xl font-bold text-sm text-on-surface hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                    <span>تصفح المنيو</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 shadow-card-soft border border-surface-variant/40 space-y-6">
                {/* Header Title */}
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-extrabold mb-1">
                    <span className="material-symbols-outlined text-sm">hotel_class</span>
                    <span>رأيك يهمنا جداً</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                    كيف كانت تجربتك اليوم؟
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                    {session.restaurantName || "بيتزا وكريب توفيق"}
                    {session.tableNumber ? ` · طاولة ${session.tableNumber}` : ""}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-error-container text-on-error-container rounded-2xl text-xs font-bold text-center">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Interactive Star Rating */}
                  <div className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-2xl border border-surface-variant/30 space-y-3">
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
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
                              className={`material-symbols-outlined text-3xl sm:text-4xl transition-colors duration-150 ${
                                isFilled
                                  ? "text-amber-500 fill-current drop-shadow-sm font-variation-fill"
                                  : "text-outline-variant/60"
                              }`}
                              style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              star
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-extrabold text-primary">
                        {ratingDescriptions[displayRating]?.ar}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="space-y-2.5">
                    <label className="text-xs sm:text-sm font-extrabold text-on-surface block">
                      ما أكثر ما نال إعجابك؟ (اختياري)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {feedbackTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.label);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.label)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-sm scale-95"
                                : "bg-surface-container-lowest text-on-surface border-surface-variant/50 hover:border-primary/50"
                            }`}
                          >
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-on-surface block">
                      اكتب ملاحظاتك أو اقتراحاتك
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="شاركنا رأيك في الأصناف، الخدمة، أو أي شيء نقدر نحسنه..."
                      className="w-full p-3.5 bg-surface-container-lowest rounded-2xl border border-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 transition-all resize-none shadow-inner"
                    />
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-on-surface block">
                      اسمك (اختياري)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: أحمد علي"
                      className="w-full p-3 bg-surface-container-lowest rounded-2xl border border-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 transition-all shadow-inner"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-extrabold text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>جاري إرسال التقييم...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">send</span>
                        <span>إرسال التقييم</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
