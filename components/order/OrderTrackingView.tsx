"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrder } from "@/lib/context/OrderContext";
import { useSession } from "@/lib/context/SessionContext";

export function OrderTrackingView() {
  const { currentOrder, orderHistory, isPolling, reorderLastOrder, fetchOrderHistory } = useOrder();
  const { session } = useSession();
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const channel = currentOrder?.channel || (session.tableNumber ? "DINE_IN" : "TAKEAWAY");

  const getSteps = () => {
    if (channel === "DELIVERY") {
      return [
        { id: "pending", keys: ["pending", "placed", "PENDING"], label: "بانتظار التأكيد", icon: "phone_in_talk" },
        { id: "preparing", keys: ["preparing", "PREPARING"], label: "بالمطبخ", icon: "skillet" },
        { id: "ready", keys: ["ready", "READY"], label: "مع الطيار", icon: "two_wheeler" },
        { id: "delivered", keys: ["delivered", "SERVED", "PAID"], label: "تم التوصيل", icon: "check_circle" },
      ];
    }
    if (channel === "TAKEAWAY") {
      return [
        { id: "pending", keys: ["pending", "placed", "PENDING"], label: "بانتظار التأكيد", icon: "phone_in_talk" },
        { id: "preparing", keys: ["preparing", "PREPARING"], label: "بالمطبخ", icon: "skillet" },
        { id: "ready", keys: ["ready", "READY"], label: "جاهز للاستلام", icon: "shopping_bag" },
        { id: "delivered", keys: ["delivered", "SERVED", "PAID"], label: "تم الاستلام", icon: "check_circle" },
      ];
    }
    return [
      { id: "pending", keys: ["pending", "placed", "PENDING"], label: "تم الاستلام", icon: "check" },
      { id: "preparing", keys: ["preparing", "PREPARING"], label: "جاري التحضير", icon: "skillet" },
      { id: "ready", keys: ["ready", "READY"], label: "جاهز للتقديم", icon: "room_service" },
      { id: "delivered", keys: ["delivered", "SERVED", "PAID"], label: "على الطاولة", icon: "done_all" },
    ];
  };

  const steps = getSteps();
  const rawStatus = currentOrder?.status || "PREPARING";
  const currentStepIndex = steps.findIndex((s) => s.keys.includes(rawStatus));
  const activeStepIdx = currentStepIndex >= 0 ? currentStepIndex : 1;

  const handleReorder = async (orderId: string) => {
    try {
      setReorderingId(orderId);
      await reorderLastOrder(orderId);
      alert("Order placed successfully!");
    } catch (err: any) {
      alert(`Could not reorder: ${err.message}`);
    } finally {
      setReorderingId(null);
    }
  };

  const getPageTitle = () => {
    if (channel === "DELIVERY") return "🛵 متابعة طلب التوصيل";
    if (channel === "TAKEAWAY") return "🛍️ متابعة طلب الاستلام";
    if (session.tableNumber) return `🍽️ طلبات طاولة ${session.tableNumber}`;
    return "🧾 متابعة الطلب";
  };

  return (
    <div className="flex-grow px-4 md:px-8 pt-6 pb-20 max-w-3xl mx-auto w-full space-y-6 font-arabic">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs md:text-sm text-secondary mt-0.5 font-medium">
            {session.restaurantName} ({session.branchName})
          </p>
        </div>

        {/* Live Auto-Polling Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs text-secondary border border-surface-variant/40">
          <span className={`w-2 h-2 rounded-full ${isPolling ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="text-[11px] font-medium">{isPolling ? "مباشر (~5s)" : "ثابت"}</span>
          <button onClick={() => fetchOrderHistory()} title="تحديث يدوي" className="ml-1 hover:text-primary">
            <span className="material-symbols-outlined text-xs">refresh</span>
          </button>
        </div>
      </div>

      {/* 1. Active Order Section */}
      {currentOrder ? (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card-soft border border-surface-container-highest space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                {currentOrder.orderNumber ? `طلب #${currentOrder.orderNumber}` : `طلب #${currentOrder._id.slice(-6).toUpperCase()}`}
              </h2>
              <p className="text-xs text-secondary mt-0.5 font-medium">
                وقت الطلب: {new Date(currentOrder.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary-container/15 px-3.5 py-1.5 rounded-full border border-primary-container/30">
              <span className="material-symbols-outlined text-primary-container text-base animate-spin">
                sync
              </span>
              <span className="text-xs font-extrabold text-primary-container">
                {steps[activeStepIdx]?.label || rawStatus}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="relative py-6 my-2 px-4">
            <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-surface-container-highest -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-8 h-1.5 bg-primary-container -translate-y-1/2 rounded-full transition-all duration-500"
              style={{
                width: `${(Math.max(0, activeStepIdx) / (steps.length - 1)) * 100}%`,
              }}
            />

            <div className="flex justify-between relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted || isCurrent
                          ? "bg-primary-container text-white shadow-md"
                          : "bg-surface-container-highest text-secondary border-2 border-surface"
                      } ${isCurrent ? "ring-4 ring-primary-container/20 scale-110" : ""}`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isCompleted ? "check" : step.icon}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? "text-primary-container font-bold"
                          : isCompleted
                          ? "text-on-surface"
                          : "text-secondary"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Phone Confirmation Banner */}
          {(rawStatus === "PENDING" || rawStatus === "placed") && (channel === "TAKEAWAY" || channel === "DELIVERY") && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-2xl animate-bounce">
                phone_in_talk
              </span>
              <div className="text-xs">
                <span className="font-bold text-on-surface block text-sm">بانتظار التأكيد الهاتفي</span>
                <span className="text-secondary">
                  سيتواصل معك فريق المطعم على رقم {currentOrder.customerPhone || "المسجل"} لتأكيد الطلب قبل بدء التجهيز.
                </span>
              </div>
            </div>
          )}

          {/* Customer & Delivery Details Card */}
          {(currentOrder.customerName || currentOrder.deliveryAddress) && (
            <div className="bg-surface-container/60 rounded-xl p-3.5 space-y-1.5 text-xs border border-surface-variant/40">
              <div className="flex justify-between items-center">
                <span className="text-secondary font-medium">العميل:</span>
                <span className="font-bold text-on-surface">{currentOrder.customerName} ({currentOrder.customerPhone})</span>
              </div>
              {currentOrder.deliveryAddress && (
                <div className="flex justify-between items-start gap-2">
                  <span className="text-secondary font-medium whitespace-nowrap">عنوان التوصيل:</span>
                  <span className="font-bold text-on-surface text-left">{currentOrder.deliveryAddress}</span>
                </div>
              )}
            </div>
          )}

          {/* Itemized Breakdown */}
          <div className="border-t border-surface-variant/40 pt-4 space-y-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">تفاصيل الأصناف</h3>
            <div className="divide-y divide-surface-variant/30">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center font-bold text-xs text-primary-container">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-on-surface">{item.name}</span>
                  </div>
                  <span className="font-semibold text-on-surface">
                    {item.totalPrice ? `${item.totalPrice} ${session.currency}` : `${item.unitPrice * item.quantity} ${session.currency}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t-2 border-dashed border-surface-variant/60 pt-3 flex justify-between items-center">
              <span className="font-bold text-base text-on-surface">إجمالي الحساب</span>
              <span className="text-xl font-extrabold text-primary-container">
                {currentOrder.totalAmount} {session.currency}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-card-soft border border-surface-variant text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto text-2xl">
            🍽️
          </div>
          <h3 className="font-bold text-base text-on-surface">لا يوجد طلب نشط حالياً</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            يمكنك التحدث مع ResBot AI لاستعراض المنيو، طلب التوصيل أو الاستلام، واختيار وجبتك المفضلة!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>ابدأ المحادثة والطلب</span>
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/"
          className="flex-1 py-3.5 px-4 rounded-xl bg-surface-container text-on-surface font-bold text-center text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 border border-surface-variant/40"
        >
          <span className="material-symbols-outlined text-lg">chat</span>
          <span>طلب أصناف إضافية (محادثة AI)</span>
        </Link>
      </div>
    </div>
  );
}
