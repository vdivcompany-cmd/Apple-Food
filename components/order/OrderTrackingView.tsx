"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrder } from "@/lib/context/OrderContext";
import { useSession } from "@/lib/context/SessionContext";

export function OrderTrackingView() {
  const { currentOrder, orderHistory, isPolling, reorderLastOrder, fetchOrderHistory } = useOrder();
  const { session } = useSession();
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const steps = [
    { id: "placed", label: "Received", icon: "check" },
    { id: "preparing", label: "Preparing", icon: "skillet" },
    { id: "ready", label: "Ready", icon: "room_service" },
    { id: "delivered", label: "Delivered", icon: "done_all" },
  ];

  const currentStatus = currentOrder?.status || "preparing";
  const currentStepIndex = steps.findIndex((s) => s.id === currentStatus);

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

  return (
    <div className="flex-grow px-4 md:px-8 pt-6 pb-20 max-w-3xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Orders at Table {session.tableNumber || "10"}
          </h1>
          <p className="text-xs md:text-sm text-secondary mt-0.5">
            {session.restaurantName} ({session.branchName})
          </p>
        </div>

        {/* Live Auto-Polling Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs text-secondary border border-surface-variant/40">
          <span className={`w-2 h-2 rounded-full ${isPolling ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="text-[11px] font-medium">{isPolling ? "Live polling (~5s)" : "Static view"}</span>
          <button onClick={() => fetchOrderHistory()} title="Manual refresh" className="ml-1 hover:text-primary">
            <span className="material-symbols-outlined text-xs">refresh</span>
          </button>
        </div>
      </div>

      {/* 1. Active Order Section */}
      {currentOrder ? (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card-soft border border-surface-container-highest">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Order #{currentOrder._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-secondary mt-0.5 font-medium">
                Placed at {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary-container/15 px-3 py-1.5 rounded-full border border-primary-container/30">
              <span className="material-symbols-outlined text-primary-container text-base animate-spin">
                sync
              </span>
              <span className="text-xs font-extrabold text-primary-container uppercase tracking-wider">
                {currentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="relative py-6 my-2 px-4">
            <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-surface-container-highest -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-8 h-1.5 bg-primary-container -translate-y-1/2 rounded-full transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
              }}
            />

            <div className="flex justify-between relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCompleted || isCurrent
                          ? "bg-primary-container text-white shadow-sm"
                          : "bg-surface-container-highest text-secondary border-2 border-surface"
                      } ${isCurrent ? "ring-4 ring-primary-container/20 scale-110" : ""}`}
                    >
                      <span className="material-symbols-outlined text-base">
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

          {/* Estimated Prep Time Banner */}
          {currentOrder.estimatedMinutes && (
            <div className="bg-primary-fixed/30 rounded-xl p-3.5 flex items-center gap-3 my-4 border border-primary-container/20">
              <span className="material-symbols-outlined text-primary-container text-2xl">timer</span>
              <div className="text-xs">
                <span className="font-bold text-on-surface">Estimated preparation: </span>
                <span className="text-primary-container font-extrabold text-sm">~{currentOrder.estimatedMinutes} mins</span>
              </div>
            </div>
          )}

          {/* Itemized Breakdown */}
          <div className="border-t border-surface-variant/40 pt-4 mt-4 space-y-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Item Details</h3>
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
              <span className="font-bold text-base text-on-surface">Total Amount</span>
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
          <h3 className="font-bold text-base text-on-surface">No Active Order Right Now</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            You can chat with our AI Waiter to explore the menu, ask for recommendations, and place your first order.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Open Chat to Order</span>
          </Link>
        </div>
      )}

      {/* 2. Order History at this Table */}
      {orderHistory.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
            Previous Orders at Table {session.tableNumber}
          </h3>
          <div className="space-y-3">
            {orderHistory.map((pastOrder) => (
              <div
                key={pastOrder._id}
                className="p-4 bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">Order #{pastOrder._id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container font-semibold uppercase text-secondary">
                      {pastOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5">
                    {pastOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")} · <strong>{pastOrder.totalAmount} {session.currency}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleReorder(pastOrder._id)}
                  disabled={reorderingId === pastOrder._id}
                  className="px-3.5 py-1.5 bg-secondary-container text-on-surface rounded-xl text-xs font-bold hover:bg-primary-fixed hover:text-primary transition-colors flex items-center gap-1 self-end sm:self-auto"
                >
                  <span className="material-symbols-outlined text-sm">replay</span>
                  <span>{reorderingId === pastOrder._id ? "Reordering..." : "Reorder"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/"
          className="flex-1 py-3.5 px-4 rounded-xl bg-surface-container text-on-surface font-bold text-center text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 border border-surface-variant/40"
        >
          <span className="material-symbols-outlined text-lg">chat</span>
          <span>Need Something Else? Chat AI</span>
        </Link>

        <button
          onClick={() => alert(`Bill requested for Table ${session.tableNumber}! Your server has been notified.`)}
          className="flex-1 py-3.5 px-4 rounded-xl bg-primary-container text-white font-bold text-center text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          <span>Request Bill & Pay</span>
        </button>
      </div>
    </div>
  );
}
