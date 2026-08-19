"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/context/SessionContext";

export function SessionExpiredView() {
  const { resetSession, resolveQrToken, session } = useSession();
  const [tokenInput, setTokenInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleResolve = async (tokenToUse: string) => {
    if (!tokenToUse.trim()) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const ok = await resolveQrToken(tokenToUse.trim());
      if (ok) {
        window.location.href = "/";
      } else {
        setErrorMsg("Invalid or expired table token. Please rescan.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resolve session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-surface overflow-hidden p-4">
      {/* Warm Ambient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface-container to-background opacity-90 z-0" />
      <div className="absolute inset-0 bg-on-background/20 backdrop-blur-md z-0" />

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-card-elevated flex flex-col items-center text-center border border-outline-variant/30">
          {/* Animated Expired QR Icon Area */}
          <div className="mb-6 relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-error/15 rounded-full animate-pulse" />
            <div className="relative bg-surface rounded-full p-4 shadow-sm z-10 border border-error/20">
              <span className="material-symbols-outlined text-4xl text-error">
                qr_code_scanner
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-error text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white z-20 shadow-sm">
              <span className="material-symbols-outlined text-sm font-bold">warning</span>
            </div>
          </div>

          {/* Headline & Body */}
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Your session expired
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant mb-6 max-w-xs leading-relaxed">
            Your connection to {session.restaurantName} (Table {session.tableNumber || "10"}) has ended. Please rescan the table QR code to start a new dining session.
          </p>

          {errorMsg && (
            <div className="mb-4 px-4 py-2 bg-error-container text-on-error-container rounded-xl text-xs font-bold w-full">
              {errorMsg}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={() => resetSession()}
            className="w-full bg-primary-container text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 hover:scale-[0.98] transition-all shadow-card-soft text-base cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">qr_code_2</span>
            <span>Rescan QR Code</span>
          </button>

          {/* Manual Token / Table Code Input */}
          <div className="mt-6 pt-4 border-t border-surface-variant/40 w-full">
            <p className="text-xs text-secondary mb-2 font-medium">Have a table token or link?</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResolve(tokenInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste QR token"
                className="flex-1 px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/60 text-xs font-mono outline-none focus:border-primary-container"
              />
              <button
                type="submit"
                disabled={isSubmitting || !tokenInput.trim()}
                className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "..." : "Connect"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
