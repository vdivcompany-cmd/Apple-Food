"use client";

import React from "react";
import Link from "next/link";
import { useOrder } from "@/lib/context/OrderContext";
import { useSession } from "@/lib/context/SessionContext";

export function OrderTrackingView() {
  const { currentOrder, updateOrderStatus } = useOrder();
  const { session } = useSession();

  const steps = [
    { id: "placed", label: "Received", icon: "check" },
    { id: "preparing", label: "Preparing", icon: "skillet" },
    { id: "ready", label: "Ready", icon: "room_service" },
    { id: "delivered", label: "Delivered", icon: "done_all" },
  ];

  const currentStatus = currentOrder?.status || "preparing";
  const currentStepIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="flex-grow px-4 md:px-8 pt-6 pb-20 max-w-3xl mx-auto w-full">
      {/* Top Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Your Orders at Table {session.tableNumber}
        </h1>
        <p className="text-sm text-secondary mt-1">
          Track real-time kitchen preparation and bill details.
        </p>
      </div>

      {/* Orders Container */}
      <div className="flex flex-col gap-6">
        {/* Active Order Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card-soft border border-surface-container-highest">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Order #{currentOrder?.id || "ORD-8492"}</h2>
              <p className="text-xs text-secondary mt-0.5 font-medium">Placed at {currentOrder?.createdAt || "12:15 PM"}</p>
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
            {/* Background Line */}
            <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-surface-container-highest -translate-y-1/2 rounded-full" />
            
            {/* Active Progress Line */}
            <div
              className="absolute top-1/2 left-8 h-1.5 bg-primary-container -translate-y-1/2 rounded-full transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
              }}
            />

            {/* Stepper Nodes */}
            <div className="flex justify-between relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => updateOrderStatus(step.id as any)}
                      title={`Click to test state: ${step.label}`}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCompleted || isCurrent
                          ? "bg-primary-container text-white shadow-sm"
                          : "bg-surface-container-highest text-secondary border-2 border-surface"
                      } ${isCurrent ? "ring-4 ring-primary-container/20 scale-110" : ""}`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isCompleted ? "check" : step.icon}
                      </span>
                    </button>
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
          <div className="bg-primary-fixed/30 rounded-xl p-3.5 flex items-center gap-3 my-4 border border-primary-container/20">
            <span className="material-symbols-outlined text-primary-container text-2xl">timer</span>
            <div className="text-xs">
              <span className="font-bold text-on-surface">Estimated time remaining: </span>
              <span className="text-primary-container font-extrabold text-sm">~{currentOrder?.estimatedMinutes || 15} mins</span>
            </div>
          </div>

          {/* Itemized Breakdown */}
          <div className="border-t border-surface-variant/40 pt-4 mt-4 space-y-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Item Details</h3>
            <div className="divide-y divide-surface-variant/30">
              {(currentOrder?.items || []).map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center font-bold text-xs text-primary-container">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-on-surface">{item.name}</span>
                  </div>
                  <span className="font-semibold text-on-surface">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t-2 border-dashed border-surface-variant/60 pt-3 flex justify-between items-center">
              <span className="font-bold text-base text-on-surface">Total Amount</span>
              <span className="text-xl font-extrabold text-primary-container">
                ${(currentOrder?.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3.5 px-4 rounded-xl bg-surface-container text-on-surface font-bold text-center text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            <span>Need Something Else? Chat AI</span>
          </Link>

          <button
            onClick={() => alert("Bill requested! Your server has been notified.")}
            className="flex-1 py-3.5 px-4 rounded-xl bg-primary-container text-white font-bold text-center text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            <span>Request Bill & Pay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
